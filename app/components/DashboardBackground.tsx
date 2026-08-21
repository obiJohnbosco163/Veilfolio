'use client';

export function DashboardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Gradient orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.04]"
        style={{ top: '-10%', left: '-5%', background: 'var(--accent)' }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.03]"
        style={{ top: '20%', right: '-8%', background: 'var(--accent-secondary)' }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.03]"
        style={{ bottom: '5%', left: '30%', background: 'var(--accent-blue)' }}
      />

      {/* SVG network + shield pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Flowing curves — like nestor.name.ng */}
        <path
          d="M-100 600 Q200 500 400 550 T800 480 T1200 520 T1600 450"
          stroke="url(#grad1)"
          strokeWidth="1"
          opacity="0.12"
          fill="none"
        />
        <path
          d="M-100 650 Q300 560 500 600 T900 530 T1300 570 T1600 500"
          stroke="url(#grad1)"
          strokeWidth="0.5"
          opacity="0.08"
          fill="none"
        />
        <path
          d="M-50 300 Q250 250 450 280 T850 220 T1250 260 T1500 200"
          stroke="url(#grad2)"
          strokeWidth="0.8"
          opacity="0.1"
          fill="none"
        />

        {/* Network nodes */}
        {[
          { cx: 180, cy: 200, r: 3, o: 0.15 },
          { cx: 350, cy: 320, r: 2.5, o: 0.1 },
          { cx: 520, cy: 180, r: 2, o: 0.12 },
          { cx: 700, cy: 350, r: 3.5, o: 0.08 },
          { cx: 880, cy: 220, r: 2, o: 0.14 },
          { cx: 1050, cy: 300, r: 2.5, o: 0.1 },
          { cx: 1200, cy: 180, r: 3, o: 0.12 },
          { cx: 260, cy: 500, r: 2, o: 0.08 },
          { cx: 600, cy: 550, r: 2.5, o: 0.1 },
          { cx: 950, cy: 480, r: 2, o: 0.12 },
          { cx: 1150, cy: 520, r: 3, o: 0.09 },
          { cx: 400, cy: 680, r: 2, o: 0.07 },
          { cx: 780, cy: 620, r: 2.5, o: 0.1 },
          { cx: 1100, cy: 700, r: 2, o: 0.08 },
        ].map((n, i) => (
          <circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill="var(--accent)"
            opacity={n.o}
          />
        ))}

        {/* Network connections — thin lines between nearby nodes */}
        <g stroke="var(--accent)" strokeWidth="0.5" opacity="0.06">
          <line x1="180" y1="200" x2="350" y2="320" />
          <line x1="350" y1="320" x2="520" y2="180" />
          <line x1="520" y1="180" x2="700" y2="350" />
          <line x1="700" y1="350" x2="880" y2="220" />
          <line x1="880" y1="220" x2="1050" y2="300" />
          <line x1="1050" y1="300" x2="1200" y2="180" />
          <line x1="260" y1="500" x2="600" y2="550" />
          <line x1="600" y1="550" x2="950" y2="480" />
          <line x1="950" y1="480" x2="1150" y2="520" />
          <line x1="350" y1="320" x2="260" y2="500" />
          <line x1="700" y1="350" x2="600" y2="550" />
          <line x1="880" y1="220" x2="950" y2="480" />
          <line x1="400" y1="680" x2="780" y2="620" />
          <line x1="780" y1="620" x2="1100" y2="700" />
          <line x1="600" y1="550" x2="780" y2="620" />
        </g>

        {/* Shield outlines — privacy motif */}
        <g stroke="var(--accent-secondary)" strokeWidth="0.6" opacity="0.06" fill="none">
          <path d="M720 100 L720 140 Q720 170 700 185 Q680 200 720 210 Q760 200 740 185 Q720 170 720 140 Z" />
          <path d="M200 650 L200 680 Q200 700 188 710 Q176 720 200 726 Q224 720 212 710 Q200 700 200 680 Z" />
          <path d="M1250 400 L1250 425 Q1250 440 1240 448 Q1230 456 1250 460 Q1270 456 1260 448 Q1250 440 1250 425 Z" />
        </g>

        {/* Gradient defs */}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="50%" stopColor="var(--accent-secondary)" />
            <stop offset="100%" stopColor="var(--accent-blue)" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-secondary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
