import React from 'react';
import { C } from '../utils/helpers';

const navItems = [
  { id: 'dashboard',   label: 'Dashboard',    icon: '📊' },
  { id: 'clients',     label: 'Clients',       icon: '👥' },
  { id: 'bookings',    label: 'Bookings',      icon: '📅' },
  { id: 'events',      label: 'Events',        icon: '🎉' },
  { id: 'engagements', label: 'Engagements',   icon: '💬' },
  { id: 'reviews',     label: 'Reviews',       icon: '⭐' },
  { id: 'notes',       label: 'Notes',         icon: '📝' },
];

export default function Sidebar({ active, onNav, user, onLogout, collapsed, onToggle }) {
  return (
    <aside style={{
      width: collapsed ? 64 : 230,
      minHeight: '100vh',
      background: C.navy,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: 72,
      }}>
        {!collapsed && (
          <div>
            <p style={{ margin: 0, color: C.yellow, fontWeight: 800, fontSize: 15, letterSpacing: '0.02em' }}>
              All-in Events
            </p>
            <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
              CRM Portal
            </p>
          </div>
        )}
        <button onClick={onToggle} style={{
          background: 'rgba(255,255,255,0.07)',
          border: 'none', borderRadius: 8,
          cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
          fontSize: 14, padding: '6px 8px',
          transition: 'background 0.15s',
        }}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '10px 0' }}>
        {navItems.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              title={collapsed ? item.label : ''}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '13px 0' : '12px 18px',
                background: isActive ? 'rgba(255,210,63,0.12)' : 'none',
                border: 'none',
                borderLeft: isActive ? `3px solid ${C.yellow}` : '3px solid transparent',
                cursor: 'pointer',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? C.yellow : 'rgba(255,255,255,0.7)',
                  transition: 'color 0.15s',
                }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{
        padding: collapsed ? '14px 0' : '14px 18px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: C.yellow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: C.navy, fontSize: 15, flexShrink: 0,
        }}>
          {user?.email?.[0]?.toUpperCase() || 'A'}
        </div>
        {!collapsed && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{
              margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.email}
            </p>
            <button onClick={onLogout} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', fontSize: 11, padding: 0, marginTop: 2,
              transition: 'color 0.15s',
            }}>
              Sign out →
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
