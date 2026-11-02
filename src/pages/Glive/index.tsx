import React, { useEffect, useState } from 'react';

const Glive = () => {
  const [visible, setVisible] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    const dotTimer = setInterval(() => setDotCount((d) => (d + 1) % 4), 600);
    return () => {
      clearTimeout(timer);
      clearInterval(dotTimer);
    };
  }, []);

  const dots = '.'.repeat(dotCount);
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #043C11 0%, #067A1A 40%, #089A20 70%, #04B31C 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Animated grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
          linear-gradient(rgba(8,226,38,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(8,226,38,0.07) 1px, transparent 1px)
        `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 8s linear infinite',
        }}
      />

      {/* Radial glow center */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(8,226,38,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />

      {/* Floating orbs */}
      {[
        { w: 180, h: 180, top: '8%', left: '5%', delay: '0s' },
        { w: 120, h: 120, top: '70%', left: '80%', delay: '1s' },
        { w: 90, h: 90, top: '80%', left: '10%', delay: '2s' },
        { w: 60, h: 60, top: '15%', left: '85%', delay: '1.5s' },
      ].map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: orb.w,
            height: orb.h,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(8,226,38,0.15), transparent)',
            border: '1px solid rgba(8,226,38,0.2)',
            top: orb.top,
            left: orb.left,
            animation: `float 6s ease-in-out infinite`,
            animationDelay: orb.delay,
          }}
        />
      ))}

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Live badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(8,226,38,0.4)',
            borderRadius: '999px',
            padding: '6px 18px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#08E226',
              boxShadow: '0 0 10px #08E226, 0 0 20px #08E226',
              animation: 'blink 1.2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              color: '#08E226',
              fontSize: '13px',
              letterSpacing: '4px',
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
            }}
          >
            LIVE NOW
          </span>
        </div>

        {/* G with glow ring */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #04B31C, #08E226, #00A417, #04B31C)',
              animation: 'spin 4s linear infinite',
              opacity: 0.6,
              filter: 'blur(4px)',
            }}
          />
          <div
            style={{
              fontSize: 'clamp(120px, 22vw, 200px)',
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontWeight: 900,
              color: 'transparent',
              WebkitTextStroke: '3px #08E226',
              textShadow: '0 0 40px rgba(8,226,38,0.6), 0 0 80px rgba(8,226,38,0.3)',
              lineHeight: 1,
              position: 'relative',
              zIndex: 1,
              letterSpacing: '-4px',
            }}
          >
            G
          </div>
        </div>

        {/* Hello G Live text */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 'clamp(14px, 2vw, 18px)',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '6px',
              fontFamily: "'Courier New', monospace",
              marginBottom: '8px',
            }}
          >
            WELCOME TO
          </div>
          <h1
            style={{
              fontSize: 'clamp(42px, 8vw, 88px)',
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '6px',
              lineHeight: 1,
              margin: 0,
              textShadow: '0 4px 30px rgba(0,0,0,0.5)',
            }}
          >
            Hello G Live
            {/* <span
              style={{
                background: 'linear-gradient(90deg, #04B31C, #08E226, #00A417)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: '#fff',
                filter: 'drop-shadow(0 0 20px rgba(8,226,38,0.5))',
              }}
            >
              G Live
            </span> */}
          </h1>
        </div>

        {/* Scanning bar */}
        <div
          style={{
            width: '320px',
            height: '2px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '99px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '40%',
              background: 'linear-gradient(90deg, transparent, #08E226, transparent)',
              animation: 'scan 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Status line */}
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '13px',
            color: 'rgba(8,226,38,0.7)',
            letterSpacing: '2px',
          }}
        >
          STREAM INITIALIZING{dots}
        </div>
      </div>

      {/* Corner decorations */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            width: 40,
            height: 40,
            borderTop: i < 2 ? '2px solid rgba(8,226,38,0.4)' : 'none',
            borderBottom: i >= 2 ? '2px solid rgba(8,226,38,0.4)' : 'none',
            borderLeft: i % 2 === 0 ? '2px solid rgba(8,226,38,0.4)' : 'none',
            borderRight: i % 2 === 1 ? '2px solid rgba(8,226,38,0.4)' : 'none',
          }}
        />
      ))}
      {/* 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @keyframes pulse { 0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.1)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes scan { 0%{left:-40%} 100%{left:140%} }
        @keyframes gridMove { from{backgroundPosition:0 0} to{backgroundPosition:60px 60px} }
      `}</style> */}
    </div>
  );
};

export default Glive;
