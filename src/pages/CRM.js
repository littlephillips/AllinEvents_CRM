import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getAll, Col } from '../utils/firestore';
import { C } from '../utils/helpers';
import { Spinner } from '../components/UI';
import Sidebar from '../components/Sidebar';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Clients from './Clients';
import Bookings from './Bookings';
import { Events, Engagements, Reviews, Notes } from './Sections';

export default function CRM() {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page,        setPage]        = useState('dashboard');
  const [collapsed,   setCollapsed]   = useState(false);
  const [counts,      setCounts]      = useState({ clients:0, bookings:0, events:0, engagements:0, reviews:0 });
  const [recent,      setRecent]      = useState({ bookings:[], reviews:[], clients:[], engagements:[] });

  // ── Auth listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // ── Load dashboard data whenever user or page changes ─────────────────────
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [clients, bookings, events, engagements, reviews] = await Promise.all([
        getAll(Col.clients),
        getAll(Col.bookings),
        getAll(Col.events),
        getAll(Col.engagements),
        getAll(Col.reviews),
      ]);
      setCounts({
        clients:     clients.length,
        bookings:    bookings.length,
        events:      events.length,
        engagements: engagements.length,
        reviews:     reviews.length,
      });
      setRecent({ bookings, reviews, clients, engagements });
    };
    load();
  }, [user, page]);

  // ── Loading screen ────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: C.navy,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 14, background: C.yellow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 900, color: C.navy, marginBottom: 20,
        }}>A</div>
        <Spinner size={32} />
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontSize: 13 }}>
          Loading CRM...
        </p>
      </div>
    );
  }

  // ── Not logged in → show login ────────────────────────────────────────────
  if (!user) return <LoginPage />;

  // ── Page map ──────────────────────────────────────────────────────────────
  const pages = {
    dashboard:   <Dashboard counts={counts} recent={recent} />,
    clients:     <Clients />,
    bookings:    <Bookings />,
    events:      <Events />,
    engagements: <Engagements />,
    reviews:     <Reviews />,
    notes:       <Notes />,
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <Sidebar
        active={page}
        onNav={(p) => setPage(p)}
        user={user}
        onLogout={() => signOut(auth)}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
      />

      <main style={{
        flex: 1,
        padding: '32px 28px',
        overflowY: 'auto',
        minWidth: 0,
        maxWidth: '100%',
      }}>
        {/* Top bar with breadcrumb */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 28, paddingBottom: 20,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: C.muted }}>All-in Events CRM</span>
            <span style={{ color: C.muted }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textTransform: 'capitalize' }}>
              {page}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              fontSize: 12, color: C.muted, background: C.green + '18',
              border: `1px solid ${C.green}30`, borderRadius: 20,
              padding: '4px 12px', fontWeight: 600, color: C.green,
            }}>
              ● Live
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: C.yellow, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, color: C.navy, fontSize: 14,
            }}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>

        {/* Active page */}
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}
