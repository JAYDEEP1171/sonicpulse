import React, { useEffect, useState, useRef } from 'react';

const Timer = ({ duration = 10, onTimeUp, onTick, active, children }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const requestRef = useRef();
    const startTimeRef = useRef();

    useEffect(() => {
        if (active) {
            startTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [active]);

    const animate = (time) => {
        const elapsed = (time - startTimeRef.current) / 1000;
        const remaining = Math.max(0, duration - elapsed);

        setTimeLeft(remaining);
        if (onTick) onTick(remaining);

        if (remaining > 0) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (onTimeUp) onTimeUp();
        }
    };

    // Calculate stroke dasharray for a square
    // A square has perimeter = 4 * side. We will use an SVG viewbox of 100x100.
    // Perimeter of 100x100 square is 400.
    const viewBoxSize = 100;
    const strokeWidth = 2;
    // To fit stroke fully inside viewBox, act like it's a 98x98 square. Perimeter = 4 * 98 = 392
    const sqSize = viewBoxSize - strokeWidth;
    const perimeter = 4 * sqSize;
    // Calculate how much should be visible
    const dashOffset = perimeter - (perimeter * (timeLeft / duration));

    return (
        <div className="relative w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(114,254,143,0.15)] group">
            {/* The Album Art or Content inside */}
            <div className="absolute inset-0 m-1 rounded-[14px] md:rounded-[22px] overflow-hidden bg-surface-container">
                {children}
            </div>
            
            {/* SVG Perimeter Tracker */}
            <svg 
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} 
                className={`absolute inset-0 w-full h-full pointer-events-none ${active && timeLeft < 3 ? 'animate-pulse' : ''}`}
                style={{ zIndex: 10 }}
            >
                {/* Background Track */}
                <rect 
                    x={strokeWidth / 2} 
                    y={strokeWidth / 2} 
                    width={sqSize} 
                    height={sqSize} 
                    fill="none" 
                    stroke="#262626" 
                    strokeWidth={strokeWidth} 
                    rx="16"
                />
                
                {/* Progress Track */}
                <rect 
                    x={strokeWidth / 2} 
                    y={strokeWidth / 2} 
                    width={sqSize} 
                    height={sqSize} 
                    fill="none" 
                    stroke="#72FE8F" 
                    strokeWidth={strokeWidth} 
                    rx="16"
                    strokeDasharray={perimeter}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-75 ease-linear drop-shadow-[0_0_8px_rgba(114,254,143,0.8)]"
                    style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                />
            </svg>

            {/* Digital Display floating inside top-right */}
            <div className="absolute top-4 right-4 bg-surface-container-highest/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 shadow-xl z-20 flex items-center justify-center">
                <span className="font-display font-black text-2xl tracking-tighter text-primary drop-shadow-[0_0_10px_rgba(114,254,143,0.3)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {Math.ceil(timeLeft)}<span className="text-sm ml-0.5">s</span>
                </span>
            </div>
        </div>
    );
};

export default Timer;
