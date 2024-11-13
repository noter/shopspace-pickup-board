import React from 'react';

const STAGES = [
  { value: 0, label: 'Received' },
  { value: 25, label: 'Preparing' },
  { value: 50, label: 'Cooking' },
  { value: 75, label: 'Quality Check' },
  { value: 100, label: 'Ready' },
] as const;

interface ProgressBarProps {
  progress: number;
  isDelayed?: boolean;
}

export const ProgressBar = React.memo(function ProgressBar({ 
  progress, 
  isDelayed 
}: ProgressBarProps) {
  return (
    <div className="relative pt-2">
      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
        <div
          style={{ width: `${progress}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
            isDelayed ? 'bg-red-500' : 'bg-[#00529C]'
          }`}
        />
      </div>
      
      <div className="relative h-14">
        {/* Track line */}
        <div className="absolute top-2.5 left-0 right-0 h-px bg-gray-200" />
        
        {/* Stage dots and labels */}
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          {STAGES.map(({ value, label }) => {
            const isActive = progress >= value;
            const isCurrent = 
              progress >= value && 
              progress < (STAGES[STAGES.findIndex(s => s.value === value) + 1]?.value ?? 101);
            
            return (
              <div 
                key={value} 
                className="flex flex-col items-center"
                style={{ width: '20%' }}
              >
                <div 
                  className={`
                    relative w-5 h-5 rounded-full border-2 transition-all duration-300
                    ${isActive 
                      ? isDelayed
                        ? 'border-red-500 bg-red-50'
                        : 'border-[#00529C] bg-[#00529C]/10'
                      : 'border-gray-300 bg-white'
                    }
                    ${isCurrent 
                      ? isDelayed
                        ? 'ring-4 ring-red-200'
                        : 'ring-4 ring-[#00529C]/20'
                      : ''
                    }
                  `}
                >
                  {isActive && (
                    <div 
                      className={`
                        absolute inset-1 rounded-full
                        ${isDelayed ? 'bg-red-500' : 'bg-[#00529C]'}
                      `}
                    />
                  )}
                </div>
                <span 
                  className={`
                    mt-2 text-xs font-medium transition-colors
                    ${isActive
                      ? isDelayed
                        ? 'text-red-600'
                        : 'text-[#00529C]'
                      : 'text-gray-500'
                    }
                  `}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});