import React from 'react';

interface ProgressBarProps {
    progress: number;
    isDelayed?: boolean;
}

export const ProgressBar = React.memo(function ProgressBar({
                                                               progress,
                                                               isDelayed
                                                           }: ProgressBarProps) {
    const steps = Array.from({length: 11}, (_, i) => i * 10);

    return (
        <div className="relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                <div
                    style={{width: `${progress}%`}}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                        isDelayed ? 'bg-red-500' : 'bg-[#00529C]'
                    }`}
                />
            </div>
            <div className="flex justify-between absolute w-full top-0">
                {steps.map((step, idx) => (
                    <div
                        key={step}
                        className={`h-2 w-0.5 bg-white`}
                        style={idx === 0 || idx === steps.length - 1 ? {visibility: 'hidden'} : {}}
                    />
                ))}
            </div>
        </div>
    );
});