import React from 'react';
import { C } from '../utils/helpers';

// ─── INPUT STYLE ─────────────────────────────────────────────────────────────
export const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: `1px solid ${C.border}`, fontSize: 14, color: C.text,
  background: '#fafafa', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, color = 'gray' }) => {
  const colors = {
    green:  { background: '#d1fae5', color: '#065f46' },
    red:    { background: '#fee2e2', color: '#991b1b' },
    yellow: { background: '#fef3c7', color: '#92400e' },
    blue:   { background: '#dbeafe', color: '#1e40af' },
    gray:   { background: '#f3f4f6', color: '#374151' },
    purple: { background: '#ede9fe', color: '#5b21b6' },
  };
  return (
    <span style={{
      ...colors[color] || colors.gray,
      padding: '2px 10px', borderRadius: 999,
      fontSize: 12, fontWeight: 600, display: 'inline-block',
    }}>{label}</span>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.card, borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    border: `1px solid ${C.border}`,
    ...style,
  }}>{children}</div>
);

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, color = 'primary', size = 'md', type = 'button', disabled = false }) => {
  const colors = {
    primary: { background: C.blue,   color: '#fff', border: 'none' },
    danger:  { background: C.red,    color: '#fff', border: 'none' },
    success: { background: C.green,  color: '#fff', border: 'none' },
    ghost:   { background: 'transparent', color: C.blue, border: `1px solid ${C.blue}` },
    yellow:  { background: C.yellow, color: C.navy, border: 'none' },
    dark:    { background: C.navy,   color: '#fff', border: 'none' },
  };
  const sizes = {
    sm: { padding: '4px 12px', fontSize: 13 },
    md: { padding: '8px 18px', fontSize: 14 },
    lg: { padding: '12px 28px', fontSize: 16 },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...colors[color] || colors.primary,
        ...sizes[size] || sizes.md,
        borderRadius: 8, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'opacity 0.2s, transform 0.1s',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}
    >{children}</button>
  );
};

// ─── INPUT ────────────────────────────────────────────────────────────────────
export const Input = ({ label, value, onChange, type = 'text', placeholder = '', required = false, options, textarea, hint }) => (
  <div style={{ marginBottom: 16 }}>
    {label && (
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>
        {label}{required && <span style={{ color: C.red }}> *</span>}
      </label>
    )}
    {options ? (
      <select value={value} onChange={onChange} required={required} style={inputStyle}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : textarea ? (
      <textarea
        value={value} onChange={onChange} placeholder={placeholder}
        required={required} rows={3}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
    ) : (
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        style={inputStyle}
      />
    )}
    {hint && <p style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{hint}</p>}
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, children, wide = false }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  }}>
    <div style={{
      background: '#fff', borderRadius: 14,
      width: '100%', maxWidth: wide ? 700 : 540,
      maxHeight: '90vh', overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 24px', borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: 0, background: '#fff', zIndex: 1,
      }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>{title}</h3>
        <button onClick={onClose} style={{
          background: '#f3f4f6', border: 'none', borderRadius: '50%',
          width: 32, height: 32, fontSize: 18, cursor: 'pointer', color: C.muted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const Stat = ({ label, value, icon, color = C.blue, sub, trend }) => (
  <Card style={{ padding: '20px 24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: C.muted, fontWeight: 500 }}>{label}</p>
        <p style={{ margin: '6px 0 2px', fontSize: 30, fontWeight: 800, color: C.text }}>{value}</p>
        {sub && <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{sub}</p>}
        {trend && (
          <p style={{ margin: '4px 0 0', fontSize: 12, color: trend > 0 ? C.green : C.red, fontWeight: 600 }}>
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% this month
          </p>
        )}
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
      }}>{icon}</div>
    </div>
  </Card>
);

// ─── TABLE ────────────────────────────────────────────────────────────────────
export const Table = ({ columns, data, onEdit, onDelete, emptyMsg = 'No records found.' }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ background: C.bg }}>
          {columns.map(c => (
            <th key={c.key} style={{
              padding: '10px 14px', textAlign: 'left',
              fontSize: 11, fontWeight: 700, color: C.muted,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap',
            }}>{c.label}</th>
          ))}
          {(onEdit || onDelete) && (
            <th style={{ padding: '10px 14px', borderBottom: `2px solid ${C.border}`, width: 100 }} />
          )}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} style={{
              padding: '48px', textAlign: 'center', color: C.muted, fontSize: 14,
            }}>{emptyMsg}</td>
          </tr>
        ) : data.map((row, i) => (
          <tr
            key={row.id || i}
            style={{ borderBottom: `1px solid ${C.border}` }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            {columns.map(c => (
              <td key={c.key} style={{ padding: '12px 14px', color: C.text, verticalAlign: 'middle' }}>
                {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
              </td>
            ))}
            {(onEdit || onDelete) && (
              <td style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {onEdit   && <Btn size="sm" color="ghost"  onClick={() => onEdit(row)}>Edit</Btn>}
                  {onDelete && <Btn size="sm" color="danger" onClick={() => onDelete(row.id)}>Delete</Btn>}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
export const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text }}>{title}</h2>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: 14, color: C.muted }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, subtitle, action }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: C.text }}>{title}</h3>
    {subtitle && <p style={{ margin: '0 0 20px', fontSize: 14, color: C.muted }}>{subtitle}</p>}
    {action}
  </div>
);

// ─── LOADING SPINNER ─────────────────────────────────────────────────────────
export const Spinner = ({ size = 40 }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `3px solid ${C.border}`,
      borderTop: `3px solid ${C.blue}`,
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ─── SEARCH BAR ──────────────────────────────────────────────────────────────
export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <Card style={{ marginBottom: 16, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ fontSize: 16, color: C.muted }}>🔍</span>
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        border: 'none', outline: 'none', width: '100%',
        fontSize: 14, color: C.text, background: 'transparent',
      }}
    />
    {value && (
      <button onClick={() => onChange('')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: C.muted, fontSize: 16,
      }}>×</button>
    )}
  </Card>
);

// ─── CONFIRM DIALOG ──────────────────────────────────────────────────────────
export const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <Card style={{ padding: 28, maxWidth: 360, width: '90%', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <p style={{ margin: '0 0 20px', fontSize: 15, color: C.text, lineHeight: 1.5 }}>{message}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Btn color="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn color="danger" onClick={onConfirm}>Delete</Btn>
      </div>
    </Card>
  </div>
);
