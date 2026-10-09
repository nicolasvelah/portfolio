import React from 'react'

export default function DayNightToggle({
  isDay,
  onChange,
}: { isDay: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{
      position: 'absolute', top: 12, right: 12, zIndex: 10,
      background: 'rgba(0,0,0,0.35)', borderRadius: 12, padding: '8px 12px',
      color: '#fff', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', gap: 8
    }}>
      <span>🌙</span>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={isDay}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
        />
        <span style={{
          width: 48, height: 24, background: isDay ? '#38bdf8' : '#334155',
          borderRadius: 999, position: 'relative', transition: 'all .2s ease'
        }}>
          <span style={{
            position: 'absolute', top: 3, left: isDay ? 26 : 3,
            width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left .2s ease'
          }} />
        </span>
      </label>
      <span>☀️</span>
    </div>
  )
}
