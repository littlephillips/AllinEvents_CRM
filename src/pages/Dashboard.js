import React, { useMemo } from 'react';
import { C, fmtDate, fmtCurrency, statusColor } from '../utils/helpers';
import { Card, Stat, Badge } from '../components/UI';

export default function Dashboard({ counts, recent }) {
  const bookings  = recent.bookings  || [];
  const reviews   = recent.reviews   || [];
  const clients   = recent.clients   || [];
  const engagements = recent.engagements || [];

  // ── Analytics calculations ───────────────────────────────────────────────
  const statusBreakdown = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const s = b.status || 'New';
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [bookings]);

  const eventTypeBreakdown = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const t = b.eventtype || 'Other';
      map[t] = (map[t] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [bookings]);

  const totalBudget = useMemo(() =>
    bookings.reduce((sum, b) => sum + (Number(b.budget) || 0), 0),
    [bookings]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const conversionRate = bookings.length
    ? Math.round((confirmedCount / bookings.length) * 100)
    : 0;

  const sourceBreakdown = useMemo(() => {
    const map = {};
    clients.forEach(c => {
      const s = c.source || 'Unknown';
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [clients]);

  const barColor = (i) => [C.blue, C.green, C.orange, C.purple, C.red][i % 5];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>Dashboard</h2>
        <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 14 }}>
          Welcome back — here's your All-in Events overview.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        <Stat label="Total Clients"     value={counts.clients}     icon="👥" color={C.blue}   sub="Registered clients" />
        <Stat label="Total Bookings"    value={counts.bookings}    icon="📅" color={C.green}  sub="All-time bookings" />
        <Stat label="Active Events"     value={counts.events}      icon="🎉" color={C.orange} sub="On the roster" />
        <Stat label="Engagements"       value={counts.engagements} icon="💬" color={C.purple} sub="Contact messages" />
        <Stat label="Reviews"           value={counts.reviews}     icon="⭐" color={C.yellow} sub="Customer reviews" />
      </div>

      {/* Secondary metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        <Card style={{ padding: '16px 20px', borderLeft: `4px solid ${C.green}` }}>
          <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 500 }}>Total Pipeline Budget</p>
          <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: C.green }}>
            {fmtCurrency(totalBudget)}
          </p>
        </Card>
        <Card style={{ padding: '16px 20px', borderLeft: `4px solid ${C.blue}` }}>
          <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 500 }}>Conversion Rate</p>
          <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: C.blue }}>
            {conversionRate}%
          </p>
          <p style={{ margin: 0, fontSize: 11, color: C.muted }}>Bookings → Confirmed</p>
        </Card>
        <Card style={{ padding: '16px 20px', borderLeft: `4px solid ${C.yellow}` }}>
          <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 500 }}>Avg Review Rating</p>
          <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: C.navy }}>
            {'⭐'.repeat(Math.round(avgRating))} {avgRating}
          </p>
        </Card>
        <Card style={{ padding: '16px 20px', borderLeft: `4px solid ${C.orange}` }}>
          <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 500 }}>Open Engagements</p>
          <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: C.orange }}>
            {engagements.filter(e => e.status === 'New').length}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: C.muted }}>Awaiting follow-up</p>
        </Card>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Booking Status Breakdown */}
        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: C.text }}>
            📊 Booking Status Breakdown
          </h3>
          {statusBreakdown.length === 0
            ? <p style={{ color: C.muted, fontSize: 13 }}>No bookings yet.</p>
            : statusBreakdown.map(([status, count], i) => (
              <div key={status} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge label={status} color={statusColor(status)} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                    {count} ({bookings.length ? Math.round((count / bookings.length) * 100) : 0}%)
                  </span>
                </div>
                <div style={{ background: C.border, borderRadius: 6, height: 8, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 6,
                    background: barColor(i),
                    width: `${bookings.length ? (count / bookings.length) * 100 : 0}%`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))
          }
        </Card>

        {/* Event Type Breakdown */}
        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: C.text }}>
            🎉 Bookings by Event Type
          </h3>
          {eventTypeBreakdown.length === 0
            ? <p style={{ color: C.muted, fontSize: 13 }}>No bookings yet.</p>
            : eventTypeBreakdown.map(([type, count], i) => (
              <div key={type} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{type}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{count}</span>
                </div>
                <div style={{ background: C.border, borderRadius: 6, height: 8, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 6,
                    background: barColor(i),
                    width: `${bookings.length ? (count / bookings.length) * 100 : 0}%`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))
          }
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

        {/* Recent Bookings */}
        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: C.text }}>
            📅 Recent Bookings
          </h3>
          {bookings.slice(0, 5).length === 0
            ? <p style={{ color: C.muted, fontSize: 13 }}>No bookings yet.</p>
            : bookings.slice(0, 5).map(b => (
              <div key={b.id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '9px 0',
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text }}>
                    {b.fullname}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{b.eventname}</p>
                </div>
                <Badge label={b.status || 'New'} color={statusColor(b.status || 'New')} />
              </div>
            ))
          }
        </Card>

        {/* Client Sources */}
        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: C.text }}>
            👥 Client Sources
          </h3>
          {sourceBreakdown.length === 0
            ? <p style={{ color: C.muted, fontSize: 13 }}>No clients yet.</p>
            : sourceBreakdown.map(([source, count], i) => (
              <div key={source} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '8px 0',
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: barColor(i),
                  }} />
                  <span style={{ fontSize: 13, color: C.text }}>{source}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{count}</span>
              </div>
            ))
          }
        </Card>

        {/* Latest Reviews */}
        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: C.text }}>
            ⭐ Latest Reviews
          </h3>
          {reviews.slice(0, 3).length === 0
            ? <p style={{ color: C.muted, fontSize: 13 }}>No reviews yet.</p>
            : reviews.slice(0, 3).map(r => (
              <div key={r.id} style={{ padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{r.fullname}</span>
                  <span style={{ fontSize: 12 }}>{'⭐'.repeat(Number(r.rating) || 5)}</span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
                  {r.review?.slice(0, 60)}{r.review?.length > 60 ? '...' : ''}
                </p>
              </div>
            ))
          }
        </Card>
      </div>
    </div>
  );
}
