import React, { useEffect, useState } from 'react';

const ClickSpark = () => {
    const [sparks, setSparks] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            const newSpark = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            };
            setSparks(prev => [...prev, newSpark]);
            setTimeout(() => {
                setSparks(prev => prev.filter(s => s.id !== newSpark.id));
            }, 1000);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
            {sparks.map(spark => (
                <div key={spark.id} style={{
                    position: 'absolute',
                    left: spark.x,
                    top: spark.y,
                    transform: 'translate(-50%, -50%)'
                }}>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="spark-particle" style={{
                            position: 'absolute',
                            width: '10px',
                            height: '10px',
                            backgroundColor: spark.color,
                            borderRadius: '50%',
                            transform: `rotate(${i * 45}deg) translate(20px)`,
                            animation: 'spark-burst 0.5s ease-out forwards'
                        }}></div>
                    ))}
                </div>
            ))}
            <style>{`
                @keyframes spark-burst {
                    0% { transform: rotate(var(--rotation)) translate(0); opacity: 1; }
                    100% { transform: rotate(var(--rotation)) translate(50px); opacity: 0; }
                }
                .spark-particle {
                    --rotation: 0deg;
                }
                .spark-particle:nth-child(1) { --rotation: 0deg; }
                .spark-particle:nth-child(2) { --rotation: 45deg; }
                .spark-particle:nth-child(3) { --rotation: 90deg; }
                .spark-particle:nth-child(4) { --rotation: 135deg; }
                .spark-particle:nth-child(5) { --rotation: 180deg; }
                .spark-particle:nth-child(6) { --rotation: 225deg; }
                .spark-particle:nth-child(7) { --rotation: 270deg; }
                .spark-particle:nth-child(8) { --rotation: 315deg; }
            `}</style>
        </div>
    );
};

export default ClickSpark;
