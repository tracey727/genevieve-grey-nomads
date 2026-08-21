import React from 'react';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

export default function TreeEmblem({ width = 180, height = 208 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 260 300" accessibilityLabel="GENEVIEVE tree, infinity and roots emblem">
      <Defs>
        <LinearGradient id="metalGold" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fff1bd" />
          <Stop offset="0.18" stopColor="#d9a34f" />
          <Stop offset="0.42" stopColor="#8c5a20" />
          <Stop offset="0.64" stopColor="#f0c879" />
          <Stop offset="0.82" stopColor="#b8782c" />
          <Stop offset="1" stopColor="#f8dfa3" />
        </LinearGradient>
        <RadialGradient id="goldGlow" cx="50%" cy="44%" r="62%">
          <Stop offset="0" stopColor="#f2c973" stopOpacity={0.18} />
          <Stop offset="1" stopColor="#f2c973" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Ellipse cx="130" cy="145" rx="105" ry="120" fill="url(#goldGlow)" />
      <G fill="none" stroke="url(#metalGold)" strokeLinecap="round" strokeLinejoin="round">
        <Path strokeWidth="5" d="M130 106c-15-17-37-25-55-18-24 9-27 37-7 51 19 14 43 5 62-17 19 22 43 31 62 17 20-14 17-42-7-51-18-7-40 1-55 18Z" />
        <Path strokeWidth="5" d="M130 122c-18 21-28 42-17 60 8 13 26 13 34 0 11-18 1-39-17-60Z" />
        <Path strokeWidth="4.5" d="M130 88c-16-18-25-37-15-52 7-11 23-11 30 0 10 15 1 34-15 52Z" />
        <Path strokeWidth="4.5" d="M130 182c-15 18-23 38-13 52 7 10 20 10 27 0 10-14 2-34-14-52Z" />
        <Path strokeWidth="3.8" d="M130 36V16M130 23l-14-12M130 22l15-11M130 34l-22-7M130 32l23-7" />
        <Path strokeWidth="3.1" d="M116 17 106 7M144 17l10-9M107 27 93 22M153 25l15-5M118 10l-5-8M143 10l5-8" />
        <Path strokeWidth="3.4" d="M130 58c-15-10-31-12-45-5M130 58c15-10 31-12 45-5M116 49c-10-8-23-10-34-6M144 49c10-8 23-10 34-6" />
        <Path strokeWidth="2.8" d="M88 52 76 43M91 58 74 57M172 51l12-9M169 58l18-1M105 39 96 30M155 39l9-10" />
        <Path strokeWidth="4.2" d="M130 234v18M130 250c-7 12-17 21-31 31M130 250c7 12 18 21 32 31M130 253c0 13 0 25-1 38" />
        <Path strokeWidth="3" d="M116 264 105 291M144 264l11 27M104 276l-21 16M156 277l21 16M124 276l-6 20M137 277l7 20" />
        <Path strokeWidth="2.1" d="M99 282 91 298M161 282l8 16M83 292l-12 6M177 293l12 5M118 296l-7 3M144 296l8 3" />
      </G>
      <G fill="#e994ad" opacity={0.96}>
        <Circle cx="159" cy="36" r="4.4" />
        <Circle cx="166" cy="32" r="3.4" />
        <Circle cx="169" cy="40" r="3.2" />
        <Circle cx="154" cy="30" r="3.1" />
        <Circle cx="160" cy="27" r="2.6" />
      </G>
    </Svg>
  );
}
