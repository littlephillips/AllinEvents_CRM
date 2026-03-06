import React, { useState, useEffect, useCallback } from 'react';
import { C, fmtDate, statusColor } from '../utils/helpers';
import { getAll, addRecord, updateRecord, deleteRecord, Col } from '../utils/firestore';
import { Badge, Btn, Card, Input, Modal, Table, SectionHeader, SearchBar, ConfirmDialog, Spinner, EmptyState } from '../components/UI';

const INITIAL = {
  fullname: '', email: '', phone: '', county: '',
  eventType: '', source: '', status: 'New', notes: '',
  company: '', address: '',
};

export default function Clients() {
  const [data,       setData]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [search,     setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [form,       setForm]       = useState(INITIAL);

  const load = useCallback(async () => {
    setLoading(true);
    setData(await getAll(Col.clients));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm(INITIAL);
    setModal(true);
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({
      fullname: row.fullname||'', email: row.email||'', phone: row.phone||'',
      county: row.county||'', eventType: row.eventType||'', source: row.source||'',
      status: row.status||'New', notes: row.notes||'',
      company: row.company||'', address: row.address||'',
    });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await updateRecord(Col.clients, editing, form);
    else await addRecord(Col.clients, form);
    setModal(false);
    load();
  };

  const confirmDelete = async () => {
    await deleteRecord(Col.clients, deleteId);
    setDeleteId(null);
    load();
  };

  const statuses = ['All', 'New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];

  const filtered = data
    .filter(d => statusFilter === 'All' || d.status === statusFilter)
    .filter(d =>
      d.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.phone?.includes(search) ||
      d.eventType?.toLowerCase().includes(search.toLowerCase()) ||
      d.company?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      <SectionHeader
        title="Clients"
        subtitle={`${data.length} total client${data.length !== 1 ? 's' : ''}`}
        action={<Btn onClick={openAdd} color="primary">+ Add Client</Btn>}
      />

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
            background: statusFilter === s ? C.blue : '#fff',
            color: statusFilter === s ? '#fff' : C.muted,
            border: `1px solid ${statusFilter === s ? C.blue : C.border}`,
          }}>
            {s} ({s === 'All' ? data.length : data.filter(d => d.status === s).length})
          </button>
        ))}
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email, phone, company or event type..."
      />

      <Card>
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No clients found"
            subtitle={search ? 'Try a different search term.' : 'Add your first client to get started.'}
            action={!search && <Btn onClick={openAdd} color="primary">+ Add Client</Btn>}
          />
        ) : (
          <Table
            columns={[
              { key: 'fullname',  label: 'Full Name' },
              { key: 'company',   label: 'Company' },
              { key: 'email',     label: 'Email' },
              { key: 'phone',     label: 'Phone' },
              { key: 'county',    label: 'County' },
              { key: 'eventType', label: 'Event Type' },
              { key: 'source',    label: 'Source' },
              { key: 'status',    label: 'Status',
                render: v => <Badge label={v||'New'} color={statusColor(v||'New')} /> },
              { key: 'createdAt', label: 'Added', render: v => fmtDate(v) },
            ]}
            data={filtered}
            onEdit={openEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </Card>

      {modal && (
        <Modal title={editing ? 'Edit Client' : 'Add New Client'} onClose={() => setModal(false)} wide>
          <form onSubmit={save}>
            <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Personal Information
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Input label="Full Name"   value={form.fullname}  onChange={f('fullname')}  required placeholder="Jane Doe" />
              <Input label="Company"     value={form.company}   onChange={f('company')}   placeholder="Company name (optional)" />
              <Input label="Email"       value={form.email}     onChange={f('email')}     required type="email" placeholder="jane@email.com" />
              <Input label="Phone"       value={form.phone}     onChange={f('phone')}     type="tel" placeholder="+254 7XX XXX XXX" />
              <Input label="County"      value={form.county}    onChange={f('county')}    placeholder="e.g. Nairobi" />
              <Input label="Address"     value={form.address}   onChange={f('address')}   placeholder="Street address (optional)" />
            </div>
            <p style={{ margin: '8px 0 14px', fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CRM Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
              <Input label="Event Type"  value={form.eventType} onChange={f('eventType')}
                options={['Wedding','Corporate','Birthday','Anniversary','Conference','Private Party','Other']} />
              <Input label="Source"      value={form.source}    onChange={f('source')}
                options={['Website','Referral','Social Media','Walk-in','Phone Call','Email','Other']} />
              <Input label="Status"      value={form.status}    onChange={f('status')}
                options={['New','Contacted','Confirmed','Completed','Cancelled']} />
            </div>
            <Input label="Notes" value={form.notes} onChange={f('notes')} textarea
              placeholder="Any additional notes about this client..." />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Btn color="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn type="submit" color="primary">{editing ? 'Save Changes' : 'Add Client'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this client? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
