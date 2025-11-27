import React from 'react';

const CartoonCharacter = () => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none'
        }}>
            <div style={{
                background: 'white',
                padding: '10px 20px',
                borderRadius: '20px',
                marginBottom: '10px',
                position: 'relative',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                animation: 'float 3s ease-in-out infinite'
            }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>Hiii! 👋</span>
                <div style={{
                    position: 'absolute',
                    bottom: '-10px',
                    right: '20px',
                    width: '0',
                    height: '0',
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: '10px solid white'
                }}></div>
            </div>

            {/* Cartoon Character */}
            <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Brian&clothing=graphicShirt&clothingColor=blue01") no-repeat center center',
                    backgroundSize: 'contain',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
                    animation: 'bounce 2s infinite ease-in-out'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '60%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    pointerEvents: 'none'
                }}>
                    HARI
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    );
};

export default CartoonCharacter;
