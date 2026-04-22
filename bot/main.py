import discord
from discord import app_commands
from discord.ext import commands
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
TOKEN = os.getenv('DISCORD_TOKEN')
DB_URL = os.getenv('DATABASE_URL')
ADMIN_ID = int(os.getenv('ADMIN_USER_ID'))
ROLE_MANAGE_ID = int(os.getenv('ROLE_MANAGE_ID'))
ROLE_APPROVE_ID = int(os.getenv('ROLE_APPROVE_ID'))

class ExamBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.members = True # Needed to check roles
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        await self.tree.sync()
        print("✅ Slash commands synced to Discord.")

bot = ExamBot()

def get_db():
    return psycopg2.connect(DB_URL, cursor_factory=RealDictCursor)

# --- UI COMPONENTS: MODALS ---

class QuestionEditModal(discord.ui.Modal, title='Propose Question Update'):
    q_text = discord.ui.TextInput(label='Question Text', style=discord.TextStyle.paragraph, required=False)
    s_text = discord.ui.TextInput(label='Solution Text', style=discord.TextStyle.paragraph, required=False)
    correct = discord.ui.TextInput(label='Correct Option (a, b, c, d)', max_length=1, required=False)

    def __init__(self, q_id):
        super().__init__()
        self.q_id = q_id

    async def on_submit(self, interaction: discord.Interaction):
        changes = {}
        if self.q_text.value: changes['question_text'] = self.q_text.value
        if self.s_text.value: changes['solution_text'] = self.s_text.value
        if self.correct.value: changes['correct_option'] = self.correct.value.lower()

        if not changes:
            return await interaction.response.send_message("❌ No changes entered.", ephemeral=True)

        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO pending_changes (question_id, proposed_data, requested_by_id) VALUES (%s, %s, %s)",
                    (self.q_id, json.dumps(changes), str(interaction.user.id))
                )
                conn.commit()
        await interaction.response.send_message(f"✅ Edit request for `{self.q_id}` logged for approval.", ephemeral=True)

# --- UI COMPONENTS: BUTTONS ---

class ApprovalView(discord.ui.View):
    def __init__(self, req_id, q_id, data):
        super().__init__(timeout=None)
        self.req_id = req_id
        self.q_id = q_id
        self.data = data

    @discord.ui.button(label="Approve & Push", style=discord.ButtonStyle.green)
    async def approve(self, interaction: discord.Interaction, button: discord.ui.Button):
        if not any(role.id == ROLE_APPROVE_ID for role in interaction.user.roles):
            return await interaction.response.send_message("❌ You lack `@db_approve`.", ephemeral=True)

        with get_db() as conn:
            with conn.cursor() as cur:
                # Dynamic Update SQL
                set_clauses = [f"{col} = %s" for col in self.data.keys()]
                values = list(self.data.values())
                values.append(self.q_id)
                
                cur.execute(f"UPDATE questions SET {', '.join(set_clauses)} WHERE question_id = %s", tuple(values))
                cur.execute("UPDATE pending_changes SET status = 'approved' WHERE id = %s", (self.req_id,))
                conn.commit()
        
        await interaction.response.edit_message(content=f"✅ **Approved by {interaction.user.name}**. DB Updated.", view=None)

    @discord.ui.button(label="Reject", style=discord.ButtonStyle.red)
    async def reject(self, interaction: discord.Interaction, button: discord.ui.Button):
        if not any(role.id == ROLE_APPROVE_ID for role in interaction.user.roles):
            return await interaction.response.send_message("❌ You lack `@db_approve`.", ephemeral=True)

        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE pending_changes SET status = 'rejected' WHERE id = %s", (self.req_id,))
                conn.commit()
        await interaction.response.edit_message(content=f"❌ **Rejected by {interaction.user.name}**.", view=None)

# --- SLASH COMMANDS ---

@bot.tree.command(name="db_stats", description="Database health check")
async def stats(interaction: discord.Interaction):
    await interaction.response.defer()
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT (SELECT COUNT(*) FROM questions) as q, (SELECT COUNT(*) FROM feedback) as f")
            res = cur.fetchone()
    await interaction.followup.send(f"📊 **Questions:** {res['q']} | **Feedback Items:** {res['f']}")

@bot.tree.command(name="propose_edit", description="[Role: Manage] Edit a question's data")
async def propose(interaction: discord.Interaction, question_id: str):
    if not any(role.id == ROLE_MANAGE_ID for role in interaction.user.roles):
        return await interaction.response.send_message("❌ Access denied: Requires `@manage_question`.", ephemeral=True)
    await interaction.response.send_modal(QuestionEditModal(question_id))

@bot.tree.command(name="review_requests", description="[Role: Approve] Review pending changes")
async def review(interaction: discord.Interaction):
    if not any(role.id == ROLE_APPROVE_ID for role in interaction.user.roles):
        return await interaction.response.send_message("❌ Access denied: Requires `@db_approve`.", ephemeral=True)
    
    await interaction.response.defer()
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM pending_changes WHERE status = 'pending' LIMIT 1")
            req = cur.fetchone()

    if not req:
        return await interaction.followup.send("☕ No pending requests to review.")

    data = req['proposed_data']
    embed = discord.Embed(title=f"Request #{req['id']} for {req['question_id']}", color=discord.Color.blue())
    for col, val in data.items():
        embed.add_field(name=f"New {col}", value=val, inline=False)
    
    await interaction.followup.send(embed=embed, view=ApprovalView(req['id'], req['question_id'], data))

@bot.event
async def on_ready():
    print(f'🚀 Bot Online: {bot.user}')

bot.run(TOKEN)