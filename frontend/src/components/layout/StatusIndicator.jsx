import { useState, useEffect } from 'react';
import { checkServerHealth } from '../../api/healthApi';

const StatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkServerHealth();
      setIsOnline(status);
      setIsChecking(false);
    };

    checkStatus();
    // Pings every 30 seconds to keep Render awake
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`w-3 h-3 rounded-full ${
          isChecking ? 'bg-yellow-500 animate-pulse' : 
          isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'
        }`}
      />
      <span className="text-sm text-gray-600 font-medium">
        {isChecking ? 'Waking up server...' : isOnline ? 'Connected to Backend' : 'Server Offline'}
      </span>
    </div>
  );
};

export default StatusIndicator;