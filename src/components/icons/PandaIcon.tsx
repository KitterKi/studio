
import type { SVGProps } from 'react';

// A very simple panda icon
export function PandaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="40" fill="hsl(var(--foreground))" opacity="0.1" />
      <circle cx="50" cy="50" r="38" fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth="2"/>
      {/* Ears */}
      <circle cx="25" cy="25" r="12" fill="hsl(var(--foreground))"/>
      <circle cx="75" cy="25" r="12" fill="hsl(var(--foreground))"/>
      {/* Eye Patches */}
      <ellipse cx="38" cy="48" rx="14" ry="18" fill="hsl(var(--foreground))" transform="rotate(-15 38 48)"/>
      <ellipse cx="62" cy="48" rx="14" ry="18" fill="hsl(var(--foreground))" transform="rotate(15 62 48)"/>
      {/* Eyes */}
      <circle cx="38" cy="48" r="5" fill="hsl(var(--background))"/>
      <circle cx="62" cy="48" r="5" fill="hsl(var(--background))"/>
      {/* Nose */}
      <ellipse cx="50" cy="62" rx="6" ry="4" fill="hsl(var(--foreground))"/>
      {/* Mouth */}
      <path d="M 45 70 Q 50 75 55 70" stroke="hsl(var(--foreground))" strokeWidth="2" fill="transparent"/>
    </svg>
  );
}
