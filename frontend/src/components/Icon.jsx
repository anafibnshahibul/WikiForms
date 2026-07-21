import React from 'react';

// Stroke-based icons (outline style)
const strokePaths = {
  link:       <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
  check:      <polyline points="20 6 9 17 4 12"/>,
  x:          <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  eye:        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  edit:       <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  copy:       <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
  publish:    <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  translate:  <><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></>,
  logout:     <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  user:       <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  external:   <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
};

// Filled colorful icons (SVG with fill)
const filledIcons = {
  forms: (color) => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" fill={color || '#3366cc'}/>
      <line x1="7" y1="8" x2="17" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="7" y1="12" x2="17" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="7" y1="16" x2="13" y2="16" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  globe: (color) => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={color || '#00af89'}/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="white" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  inbox: (color) => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <path d="M22 12h-6l-2 3H10l-2-3H2" stroke={color || '#94a3b8'} strokeWidth="2" strokeLinecap="round"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" fill={color || '#e2e8f0'} stroke={color || '#94a3b8'} strokeWidth="1.5"/>
    </svg>
  ),
  medal: (color) => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="6" fill={color || '#f59e0b'}/>
      <path d="M12 2a6 6 0 1 0 0 12A6 6 0 0 0 12 2z" fill={color || '#fbbf24'}/>
      <text x="12" y="11" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">★</text>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" fill={color || '#f59e0b'} stroke={color || '#d97706'} strokeWidth="1"/>
    </svg>
  ),
};

function Icon({ name, size = 16, color, strokeWidth = 2, style = {}, filled = false }) {
  // Use filled colorful version if available and filled=true or no stroke path
  if (filledIcons[name]) {
    return (
      <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:size, height:size, flexShrink:0, ...style }}>
        {filledIcons[name](color)}
      </span>
    );
  }

  // Stroke-based icon
  if (strokePaths[name]) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color || 'currentColor'} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round"
        style={{ display:'inline-block', flexShrink:0, ...style }}>
        {strokePaths[name]}
      </svg>
    );
  }

  return null;
}

export default Icon;
