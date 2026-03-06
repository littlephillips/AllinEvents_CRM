
import React, { useState, useEffect, useCallback } from 'react';
import { C, fmtDate, fmtCurrency, statusColor } from '../utils/helpers';
import { getAll, addRecord, updateRecord, deleteRecord, Col } from '../utils/firestore';
import { Badge, Btn, Card, Input, Modal, Table, SectionHeader, SearchBar, ConfirmDialog, Spinner, EmptyState } from '../components/UI';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const INITIAL = {
  fullname: '', email: '', phone: '', county: '',
  eventname: '', eventdate: '', eventtype: '',
  venue: '', guestcount: '', budget: '',
  status: 'New', assignedTo: '', notes: '',
  depositPaid: 'No', depositAmount: '',
};

// ─── Auto client upsert ───────────────────────────────────────────────────────
// Called only when a booking is saved with status = 'Confirmed'.
// Checks by email — creates a new client if none exists, updates if they do.
async function upsertClientFromBooking(booking) {
  const email = (booking.email || '').trim().toLowerCase();
  if (!email) return;

  const snap = await getDocs(
    query(collection(db, 'clients'), where('email', '==', email))
  );

  if (!snap.empty) {
    // Client already exists — update their latest booking reference only
    await updateDoc(doc(db, 'clients', snap.docs[0].id), {
      lastBookingId:   booking.id   || '',
      lastBookingDate: booking.eventdate  || '',
      lastEventType:   booking.eventtype  || '',
      updatedAt:       serverTimestamp(),
    });
  } else {
    // Brand new client — create from booking details
    await addDoc(collection(db, 'clients'), {
      fullname:        booking.fullname   || '',
      email:           email,
      phone:           booking.phone      || '',
      county:          booking.county     || '',
      source:          booking.source     || 'Website',
      status:          'Active',
      lastBookingId:   booking.id         || '',
      lastBookingDate: booking.eventdate  || '',
      lastEventType:   booking.eventtype  || '',
      notes:           '',
      createdAt:       serverTimestamp(),
      updatedAt:       serverTimestamp(),
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Bookings() {
  const [data,       setData]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [filter,     setFilter]     = useState('All');
  const [search,     setSearch]     = useState('');
  const [form,       setForm]       = useState(INITIAL);
  const [saving,     setSaving]     = useState(false);
  const [saveError,  setSaveError]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setData(await getAll(Col.bookings));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const openAdd = () => { setEditing(null); setForm(INITIAL); setModal(true); };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({
      fullname:      row.fullname      || '',
      email:         row.email         || '',
      phone:         row.phone         || '',
      county:        row.county        || '',
      eventname:     row.eventname     || '',
      eventdate:     row.eventdate     || '',
      eventtype:     row.eventtype     || '',
      venue:         row.venue         || '',
      guestcount:    row.guestcount    || '',
      budget:        row.budget        || '',
      status:        row.status        || 'New',
      assignedTo:    row.assignedTo    || '',
      notes:         row.notes         || '',
      depositPaid:   row.depositPaid   || 'No',
      depositAmount: row.depositAmount || '',
    });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      if (editing) {
        await updateRecord(Col.bookings, editing, form);

        // If admin just confirmed this booking → auto-create/update client
        if (form.status === 'Confirmed') {
          await upsertClientFromBooking({ id: editing, ...form });
        }
      } else {
        const newId = await addRecord(Col.bookings, form);

        // New booking created as Confirmed directly → create client too
        if (form.status === 'Confirmed') {
          await upsertClientFromBooking({ id: newId, ...form });
        }
      }

      setModal(false);
      load();
    } catch (err) {
      console.error('Save error:', err);
      setSaveError('Could not save booking. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    await deleteRecord(Col.bookings, deleteId);
    setDeleteId(null);
    load();
  };

  const statuses = ['All', 'New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];

  const filtered = data
    .filter(d => filter === 'All' || d.status === filter)
    .filter(d =>
      d.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      d.eventname?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase())
    );

  const totalBudget = filtered.reduce((s, b) => s + (Number(b.budget) || 0), 0);

  return (
    <div>
      <SectionHeader
        title="Bookings"
        subtitle={`${data.length} total booking${data.length !== 1 ? 's' : ''}`}
        action={<Btn onClick={openAdd} color="primary">+ New Booking</Btn>}
      />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {statuses.slice(1).map((s, i) => {
          const count = data.filter(d => d.status === s).length;
          const colors = [C.blue, C.orange, C.green, C.purple, C.red];
          return (
            <Card key={s} style={{ padding: '14px 16px', borderTop: `3px solid ${colors[i]}`, cursor: 'pointer' }}
              onClick={() => setFilter(s)}>
              <p style={{ margin: 0, fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase' }}>{s}</p>
              <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800, color: colors[i] }}>{count}</p>
            </Card>
          );
        })}
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            background: filter === s ? C.blue : '#fff',
            color:      filter === s ? '#fff' : C.muted,
            border:     `1px solid ${filter === s ? C.blue : C.border}`,
          }}>
            {s} ({s === 'All' ? data.length : data.filter(d => d.status === s).length})
          </button>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by client name, email or event name..." />

      {filtered.length > 0 && (
        <div style={{ marginBottom: 12, padding: '10px 16px', background: C.green + '18', borderRadius: 8, fontSize: 13, color: C.green, fontWeight: 600 }}>
          💰 Total pipeline value for current filter: {fmtCurrency(totalBudget)}
        </div>
      )}

      <Card>
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon="📅" title="No bookings found"
            subtitle={search ? 'Try a different search term.' : 'Add your first booking to get started.'}
            action={!search && <Btn onClick={openAdd} color="primary">+ New Booking</Btn>}
          />
        ) : (
          <Table
            columns={[
              { key: 'fullname',    label: 'Client' },
              { key: 'email',       label: 'Email' },
              { key: 'phone',       label: 'Phone' },
              { key: 'eventname',   label: 'Event' },
              { key: 'eventtype',   label: 'Type' },
              { key: 'eventdate',   label: 'Date' },
              { key: 'venue',       label: 'Venue' },
              { key: 'guestcount',  label: 'Guests' },
              { key: 'budget',      label: 'Budget',  render: v => fmtCurrency(v) },
              { key: 'depositPaid', label: 'Deposit',
                render: v => <Badge label={v || 'No'} color={v === 'Yes' ? 'green' : 'gray'} /> },
              { key: 'assignedTo',  label: 'Assigned To' },
              { key: 'status',      label: 'Status',
                render: v => <Badge label={v || 'New'} color={statusColor(v || 'New')} /> },
              { key: 'createdAt',   label: 'Created', render: v => fmtDate(v) },
            ]}
            data={filtered}
            onEdit={openEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </Card>

      {/* Add / Edit modal */}
      {modal && (
        <Modal title={editing ? 'Edit Booking' : 'New Booking'} onClose={() => setModal(false)} wide>
          <form onSubmit={save}>

            <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Client Information
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Input label="Full Name" value={form.fullname} onChange={f('fullname')} required placeholder="Jane Doe" />
              <Input label="Email"     value={form.email}    onChange={f('email')}    required type="email" />
              <Input label="Phone"     value={form.phone}    onChange={f('phone')}    type="tel" placeholder="+254..." />
              <Input label="County"    value={form.county}   onChange={f('county')}   placeholder="e.g. Nairobi" />
            </div>

            <p style={{ margin: '8px 0 14px', fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Event Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Input label="Event Name"   value={form.eventname}  onChange={f('eventname')}  required placeholder="e.g. Jane & John's Wedding" />
              <Input label="Event Type"   value={form.eventtype}  onChange={f('eventtype')}  options={['Wedding','Corporate','Birthday','Anniversary','Conference','Private Party','Other']} />
              <Input label="Event Date"   value={form.eventdate}  onChange={f('eventdate')}  type="date" />
              <Input label="Venue"        value={form.venue}      onChange={f('venue')}       placeholder="e.g. Nairobi Serena Hotel" />
              <Input label="Guest Count"  value={form.guestcount} onChange={f('guestcount')}  type="number" placeholder="e.g. 150" />
              <Input label="Budget (KES)" value={form.budget}     onChange={f('budget')}      type="number" placeholder="e.g. 500000" />
            </div>

            <p style={{ margin: '8px 0 14px', fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CRM Details
            </p>

            {/* Status hint when Confirmed is selected */}
            {form.status === 'Confirmed' && (
              <div style={{ marginBottom: 14, padding: '10px 14px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 8, fontSize: 13, color: '#065f46' }}>
                ✅ Setting status to <strong>Confirmed</strong> will automatically create or update a client record for <strong>{form.email || 'this booking'}</strong>.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
              <Input label="Status"       value={form.status}      onChange={f('status')}      options={['New','Contacted','Confirmed','Completed','Cancelled']} />
              <Input label="Assigned To"  value={form.assignedTo}  onChange={f('assignedTo')}  placeholder="Team member name" />
              <Input label="Deposit Paid" value={form.depositPaid} onChange={f('depositPaid')} options={['No','Yes']} />
            </div>

            {form.depositPaid === 'Yes' && (
              <Input label="Deposit Amount (KES)" value={form.depositAmount} onChange={f('depositAmount')} type="number" placeholder="e.g. 50000" />
            )}

            <Input label="Notes" value={form.notes} onChange={f('notes')} textarea placeholder="Special requirements, dietary needs, access notes..." />

            {saveError && (
              <div style={{ marginTop: 10, padding: '10px 14px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, fontSize: 13, color: '#991b1b' }}>
                ⚠️ {saveError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Btn color="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn type="submit" color="primary" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Booking'}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this booking? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
