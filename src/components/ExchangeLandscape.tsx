/** Original vector illustration for the Exchange cover. Kept editable and crisp at all sizes. */
const contours = Array.from({ length: 17 }, (_, i) => i);
const boughs = [
  { x: 146, y: 336, s: 1.1, r: -16 },
  { x: 621, y: 350, s: 0.91, r: 26 },
  { x: 310, y: 610, s: 0.68, r: -22 },
];

function Pine({ x, y, s, r }: { x: number; y: number; s: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 172 Q-18 84 12 3 Q25 -29 40 -48 M12 56 Q-35 20 -63 -34 M11 108 Q64 77 105 24 M0 132 Q-57 105 -95 82" fill="none" stroke="#a77c76" strokeWidth="19" strokeLinecap="round" />
      <path d="M0 172 Q-18 84 12 3 Q25 -29 40 -48 M12 56 Q-35 20 -63 -34 M11 108 Q64 77 105 24 M0 132 Q-57 105 -95 82" fill="none" stroke="#e1b09f" strokeWidth="5" strokeLinecap="round" opacity=".8" />
      {[
        [-67,-36,49,28],[-41,-74,56,26],[13,-74,69,30],[63,-58,56,24],
        [98,15,62,26],[48,44,67,30],[-94,68,56,29],[-48,86,69,27],
      ].map(([cx,cy,rx,ry],i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={i%3===0?"#668ba4":"#8e8cab"} transform={`rotate(${i%2===0?-11:15} ${cx} ${cy})`}/>
          <path d={`M${cx-rx*.7} ${cy} Q${cx} ${cy-ry*.58} ${cx+rx*.72} ${cy+2}`} fill="none" stroke="#c6bed0" strokeWidth="2" opacity=".6" />
        </g>
      ))}
    </g>
  );
}

export function ExchangeLandscape() {
  return (
    <svg viewBox="0 0 780 870" role="img" aria-label="Original illustrated landscape of flowing topographic bands, a winding river and windswept pine trees" className="block h-full w-full">
      <defs>
        <clipPath id="exchange-art-clip"><rect width="780" height="870"/></clipPath>
        <pattern id="exchange-grain" width="38" height="38" patternUnits="userSpaceOnUse">
          <path d="M3 7h1M17 29h1M35 13h1M9 34h1" stroke="#221a17" strokeWidth=".7" opacity=".35" />
        </pattern>
      </defs>
      <g clipPath="url(#exchange-art-clip)">
        <rect width="780" height="870" fill="#485875"/>
        <path d="M-100 -90 C220 -30 180 230 470 182 S880 64 930 350 S520 560 710 940" fill="none" stroke="#7385a6" strokeWidth="340"/>
        <path d="M-120 -80 C200 -10 175 212 440 162 S875 60 922 340 S515 555 690 950" fill="none" stroke="#a7a5bd" strokeWidth="230"/>
        <path d="M-90 -110 C235 30 120 262 442 180 S915 76 895 367 S510 615 735 985" fill="none" stroke="#eee0da" strokeWidth="166"/>
        <path d="M-90 -110 C235 30 120 262 442 180 S915 76 895 367 S510 615 735 985" fill="none" stroke="#d7b7b4" strokeWidth="2"/>
        {contours.map(i => (
          <path key={i} d={`M${-225+i*9} -85 C${160+i*8} ${38+i*6} ${85+i*9} ${258+i*6} ${432+i*3} ${177+i*7} S${900-i*2} ${77+i*12} ${909-i*8} ${380+i*8} S${478+i*6} ${602+i*7} ${690+i*9} 950`}
            stroke={i%3===0?"#bc9caa":"#d1b9c4"} strokeWidth={i%4===0?2.4:1.25} fill="none" opacity=".85"/>
        ))}
        <path d="M-200 790 C130 605 225 830 398 660 S470 270 900 -50" fill="none" stroke="#344e78" strokeWidth="170"/>
        <path d="M-200 790 C130 605 225 830 398 660 S470 270 900 -50" fill="none" stroke="#668eb3" strokeWidth="125"/>
        <path d="M-200 790 C130 605 225 830 398 660 S470 270 900 -50" fill="none" stroke="#a8c4d7" strokeWidth="3"/>
        {Array.from({length:7},(_,i)=> (
          <path key={i} d={`M${-200+i*10} ${785+i*8} C${125+i*8} ${603+i*9} ${210+i*6} ${818+i*9} ${395+i*8} ${656+i*5} S${470+i*7} ${255+i*6} ${900+i*6} ${-50+i*11}`}
            fill="none" stroke="#cfdaeb" strokeWidth="1.35" opacity=".52"/>
        ))}
        {boughs.map((b,i)=><Pine key={i} {...b}/>)}
        <g fill="none" stroke="#c4bfd7" strokeWidth="1.6" opacity=".8">
          {Array.from({length:9},(_,i)=><path key={i} d={`M${-100+i*11} 856 Q${120+i*11} ${690+i*8} ${265+i*13} 860 T870 ${792+i*8}`}/>)}
        </g>
        <rect width="780" height="870" fill="url(#exchange-grain)" opacity=".55"/>
        <path d="M4 4H776V866H4Z" fill="none" stroke="#ead7d7" strokeWidth="5"/>
      </g>
    </svg>
  );
}
