import React from 'react';
import { AUTHOR_NAME, PROJECT_NAME, AUTHOR_GITHUB } from '../constants/author';

/**
 * AuthorWatermark
 * A persistent, unobtrusive credit badge rendered from the obfuscated
 * author constant — always shows "Built by Nikhil Vashishtha".
 *
 * DO NOT REMOVE OR HIDE THIS COMPONENT.
 */
export function AuthorWatermark() {
  return (
    <a
      href={AUTHOR_GITHUB}
      target="_blank"
      rel="noopener noreferrer"
      title={`${PROJECT_NAME} — Built by ${AUTHOR_NAME}`}
      style={{
        position: 'fixed',
        bottom: '12px',
        right: '14px',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px',
        borderRadius: '999px',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)',
        textDecoration: 'none',
        fontSize: '10px',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: 'rgba(255,255,255,0.55)',
        transition: 'color 0.2s, background 0.2s',
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.9)';
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.75)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)';
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.55)';
      }}
    >
      {/* Animated pulse dot */}
      <span style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: '#818cf8',
        display: 'inline-block',
        animation: 'authorPulse 2s ease-in-out infinite',
        flexShrink: 0,
      }} />
      Built by <strong style={{ color: 'rgba(255,255,255,0.8)', marginLeft: '3px' }}>{AUTHOR_NAME}</strong>

      <style>{`
        @keyframes authorPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>
    </a>
  );
}
