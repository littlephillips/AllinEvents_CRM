import React, { useState, useEffect, useCallback } from 'react';
import { C, fmtDate, fmtCurrency, statusColor } from '../utils/helpers';
import { getAll, addRecord, updateRecord, deleteRecord, Col } from '../utils/firestore';
import { Badge, Btn, Card, Input, Modal, Table, SectionHeader, SearchBar, ConfirmDialog, Spinner, EmptyState } from '../components/UI';

// ─── EVENTS ────────────────────────────────────────────────────────────────────
export function Events() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm]       = useState({
    eventname: '', description: '', services: '',
    image_url: '', category: '', price: '',
    capacity: '', location: '', status: 'Active', featured: 'No',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setData(await getAll(Col.events));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm({ eventname:'', description:'', services:'', image_url:'', category:'', price:'', capacity:'', location:'', status:'Active', featured:'No' });
    setModal(true);
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({
      eventname: row.eventname||'', description: row.description||'',
      services: row.services||'', image_url: row.image_url||'',
      category: row.category||'', price: row.price||'',
      capacity: row.capacity||'', location: row.location||'',
      status: row.status||'Active', featured: row.featured||'No',
    });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await updateRecord(Col.events, editing, form);
    else await addRecord(Col.events, form);
    setModal(false);
    load();
  };

  return (
    <div>
      <SectionHeader
        title="Events & Services"
        subtitle="Manage the service packages shown on your website"
        action={<Btn onClick={openAdd} color="primary">+ Add Event</Btn>}
      />

      {loading ? <Spinner /> : data.length === 0 ? (
        <EmptyState icon="🎉" title="No events yet"
          subtitle="Add your first event or service package."
          action={<Btn onClick={openAdd} color="primary">+ Add Event</Btn>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {data.map(ev => (
            <Card key={ev.id} style={{ overflow: 'hidden' }}>
              {ev.image_url ? (
                <div style={{ height: 150, overflow: 'hidden', background: C.bg }}>
                  <img src={ev.image_url} alt={ev.eventname}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.parentElement.style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div style={{ height: 80, background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🎉</div>
              )}
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>{ev.eventname}</h4>
                  <Badge label={ev.status||'Active'} color={ev.status==='Active'?'green':'gray'} />
                </div>
                {ev.featured === 'Yes' && (
                  <span style={{ fontSize: 11, background: C.yellow, color: C.navy, padding: '2px 8px', borderRadius: 4, fontWeight: 700, marginBottom: 6, display: 'inline-block' }}>
                    ★ Featured
                  </span>
                )}
                <p style={{ margin: '6px 0 8px', fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                  {ev.description?.slice(0, 90)}{ev.description?.length > 90 ? '...' : ''}
                </p>
                <div style={{ fontSize: 12, color: C.muted, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {ev.category  && <span>📁 {ev.category}</span>}
                  {ev.price     && <span style={{ color: C.green, fontWeight: 600 }}>💰 {fmtCurrency(ev.price)}</span>}
                  {ev.capacity  && <span>👥 Up to {ev.capacity} guests</span>}
                  {ev.location  && <span>📍 {ev.location}</span>}
                  {ev.services  && <span>🛠 {ev.services.split(',').slice(0,2).join(', ')}{ev.services.split(',').length > 2 ? '...' : ''}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <Btn size="sm" color="ghost" onClick={() => openEdit(ev)}>Edit</Btn>
                  <Btn size="sm" color="danger" onClick={() => setDeleteId(ev.id)}>Delete</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={editing ? 'Edit Event' : 'Add New Event'} onClose={() => setModal(false)} wide>
          <form onSubmit={save}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Input label="Event Name"   value={form.eventname}   onChange={f('eventname')}   required />
              <Input label="Category"     value={form.category}    onChange={f('category')}    options={['Wedding','Corporate','Birthday','Conference','Private Party','Other']} />
              <Input label="Price (KES)"  value={form.price}       onChange={f('price')}       type="number" placeholder="Starting price" />
              <Input label="Max Capacity" value={form.capacity}    onChange={f('capacity')}    type="number" placeholder="Max number of guests" />
              <Input label="Location"     value={form.location}    onChange={f('location')}    placeholder="City or venue" />
              <Input label="Status"       value={form.status}      onChange={f('status')}      options={['Active','Inactive']} />
              <Input label="Featured"     value={form.featured}    onChange={f('featured')}    options={['No','Yes']} hint="Show this event prominently on the site" />
            </div>
            <Input label="Image URL" value={form.image_url} onChange={f('image_url')} type="url" placeholder="https://..." />
            <Input label="Description" value={form.description} onChange={f('description')} textarea required placeholder="Describe this event package..." />
            <Input label="Services Included (comma-separated)" value={form.services} onChange={f('services')} placeholder="e.g. Catering, Photography, Décor, DJ, Flowers" />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Btn color="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn type="submit" color="primary">{editing ? 'Save Changes' : 'Add Event'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this event? It will no longer appear on your website."
          onConfirm={async () => { await deleteRecord(Col.events, deleteId); setDeleteId(null); load(); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

// ─── ENGAGEMENTS ───────────────────────────────────────────────────────────────
export function Engagements() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [form, setForm]         = useState({
    fullname: '', email: '', phone: '', comment: '',
    source: '', status: 'New', followUpDate: '', assignedTo: '',
    priority: 'Normal',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setData(await getAll(Col.engagements));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm({ fullname:'', email:'', phone:'', comment:'', source:'', status:'New', followUpDate:'', assignedTo:'', priority:'Normal' });
    setModal(true);
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({
      fullname: row.fullname||'', email: row.email||'', phone: row.phone||'',
      comment: row.comment||'', source: row.source||'', status: row.status||'New',
      followUpDate: row.followUpDate||'', assignedTo: row.assignedTo||'',
      priority: row.priority||'Normal',
    });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await updateRecord(Col.engagements, editing, form);
    else await addRecord(Col.engagements, form);
    setModal(false);
    load();
  };

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Closed'];

  const filtered = data
    .filter(d => statusFilter === 'All' || d.status === statusFilter)
    .filter(d =>
      d.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.comment?.toLowerCase().includes(search.toLowerCase())
    );

  const newCount = data.filter(d => d.status === 'New').length;

  return (
    <div>
      <SectionHeader
        title="Engagements"
        subtitle={`${data.length} total — ${newCount} new awaiting response`}
        action={<Btn onClick={openAdd} color="primary">+ Add Engagement</Btn>}
      />

      {newCount > 0 && (
        <div style={{ marginBottom: 16, padding: '12px 16px', background: C.blue + '15', borderRadius: 8, border: `1px solid ${C.blue}30` }}>
          <p style={{ margin: 0, fontSize: 13, color: C.blue, fontWeight: 600 }}>
            💬 You have {newCount} new engagement{newCount !== 1 ? 's' : ''} awaiting follow-up.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: statusFilter === s ? C.blue : '#fff',
            color: statusFilter === s ? '#fff' : C.muted,
            border: `1px solid ${statusFilter === s ? C.blue : C.border}`,
          }}>
            {s} ({s === 'All' ? data.length : data.filter(d => d.status === s).length})
          </button>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or message..." />

      <Card>
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon="💬" title="No engagements found"
            subtitle="Contact form submissions will appear here."
          />
        ) : (
          <Table
            columns={[
              { key: 'fullname',     label: 'Name' },
              { key: 'email',        label: 'Email' },
              { key: 'phone',        label: 'Phone' },
              { key: 'comment',      label: 'Message', render: v => v?.slice(0,60)+(v?.length>60?'...':'') },
              { key: 'source',       label: 'Source' },
              { key: 'priority',     label: 'Priority',
                render: v => <Badge label={v||'Normal'} color={{High:'red',Normal:'blue',Low:'gray'}[v]||'gray'} /> },
              { key: 'assignedTo',   label: 'Assigned To' },
              { key: 'followUpDate', label: 'Follow-up' },
              { key: 'status',       label: 'Status',
                render: v => <Badge label={v||'New'} color={statusColor(v||'New')} /> },
              { key: 'createdAt',    label: 'Received', render: v => fmtDate(v) },
            ]}
            data={filtered}
            onEdit={openEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </Card>

      {modal && (
        <Modal title={editing ? 'Edit Engagement' : 'Add Engagement'} onClose={() => setModal(false)} wide>
          <form onSubmit={save}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Input label="Full Name"      value={form.fullname}     onChange={f('fullname')}     required />
              <Input label="Email"          value={form.email}        onChange={f('email')}        required type="email" />
              <Input label="Phone"          value={form.phone}        onChange={f('phone')}        type="tel" />
              <Input label="Source"         value={form.source}       onChange={f('source')}       options={['Website','Social Media','Referral','Phone Call','Walk-in','Other']} />
              <Input label="Priority"       value={form.priority}     onChange={f('priority')}     options={['High','Normal','Low']} />
              <Input label="Assigned To"    value={form.assignedTo}   onChange={f('assignedTo')}   placeholder="Team member" />
              <Input label="Follow-up Date" value={form.followUpDate} onChange={f('followUpDate')} type="date" />
              <Input label="Status"         value={form.status}       onChange={f('status')}       options={['New','Contacted','Qualified','Converted','Closed']} />
            </div>
            <Input label="Message / Comment" value={form.comment} onChange={f('comment')} textarea required placeholder="What did the client say or ask?" />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Btn color="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn type="submit" color="primary">{editing ? 'Save Changes' : 'Add Engagement'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this engagement record?"
          onConfirm={async () => { await deleteRecord(Col.engagements, deleteId); setDeleteId(null); load(); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

// ─── REVIEWS ───────────────────────────────────────────────────────────────────
export function Reviews() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm]         = useState({
    fullname: '', email: '', review: '',
    rating: '5', eventType: '', status: 'Published',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setData(await getAll(Col.reviews));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm({ fullname:'', email:'', review:'', rating:'5', eventType:'', status:'Published' });
    setModal(true);
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({
      fullname: row.fullname||'', email: row.email||'',
      review: row.review||'', rating: row.rating||'5',
      eventType: row.eventType||'', status: row.status||'Published',
    });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await updateRecord(Col.reviews, editing, form);
    else await addRecord(Col.reviews, form);
    setModal(false);
    load();
  };

  const avgRating = data.length
    ? (data.reduce((s, r) => s + Number(r.rating||0), 0) / data.length).toFixed(1)
    : 0;

  const stars = (n) => '⭐'.repeat(Math.min(5, Math.max(1, Number(n))));

  return (
    <div>
      <SectionHeader
        title="Reviews"
        subtitle={`${data.length} review${data.length !== 1 ? 's' : ''} · Average: ${avgRating} ⭐`}
        action={<Btn onClick={openAdd} color="primary">+ Add Review</Btn>}
      />

      <Card>
        {loading ? <Spinner /> : data.length === 0 ? (
          <EmptyState icon="⭐" title="No reviews yet"
            subtitle="Customer reviews submitted through the website will appear here."
          />
        ) : (
          <Table
            columns={[
              { key: 'fullname',  label: 'Client' },
              { key: 'email',     label: 'Email' },
              { key: 'rating',    label: 'Rating',   render: v => stars(v) },
              { key: 'review',    label: 'Review',   render: v => v?.slice(0,80)+(v?.length>80?'...':'') },
              { key: 'eventType', label: 'Event Type' },
              { key: 'status',    label: 'Status',
                render: v => <Badge label={v||'Published'} color={v==='Published'?'green':v==='Pending'?'yellow':'gray'} /> },
              { key: 'createdAt', label: 'Date', render: v => fmtDate(v) },
            ]}
            data={data}
            onEdit={openEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </Card>

      {modal && (
        <Modal title={editing ? 'Edit Review' : 'Add Review'} onClose={() => setModal(false)}>
          <form onSubmit={save}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Input label="Full Name"  value={form.fullname}  onChange={f('fullname')}  required />
              <Input label="Email"      value={form.email}     onChange={f('email')}     type="email" />
              <Input label="Rating"     value={form.rating}    onChange={f('rating')}    options={['5','4','3','2','1']} />
              <Input label="Event Type" value={form.eventType} onChange={f('eventType')} options={['Wedding','Corporate','Birthday','Anniversary','Conference','Other']} />
              <Input label="Status"     value={form.status}    onChange={f('status')}    options={['Published','Pending','Hidden']} />
            </div>
            <Input label="Review Text" value={form.review} onChange={f('review')} textarea required placeholder="What did the client say?" />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Btn color="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn type="submit" color="primary">{editing ? 'Save Changes' : 'Add Review'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this review?"
          onConfirm={async () => { await deleteRecord(Col.reviews, deleteId); setDeleteId(null); load(); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

// ─── NOTES ─────────────────────────────────────────────────────────────────────
export function Notes() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm]         = useState({
    title: '', content: '', priority: 'Normal', category: '', dueDate: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setData(await getAll(Col.notes));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const openAdd = () => {
    setEditing(null);
    setForm({ title:'', content:'', priority:'Normal', category:'', dueDate:'' });
    setModal(true);
  };

  const openEdit = (row) => {
    setEditing(row.id);
    setForm({
      title: row.title||'', content: row.content||'',
      priority: row.priority||'Normal', category: row.category||'',
      dueDate: row.dueDate||'',
    });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (editing) await updateRecord(Col.notes, editing, form);
    else await addRecord(Col.notes, form);
    setModal(false);
    load();
  };

  const priorityBorder = { High: C.red, Normal: C.blue, Low: C.border };
  const priorityColor  = { High: 'red', Normal: 'blue', Low: 'gray' };

  const highCount = data.filter(n => n.priority === 'High').length;

  return (
    <div>
      <SectionHeader
        title="Notes & Reminders"
        subtitle={highCount > 0 ? `⚠️ ${highCount} high priority note${highCount > 1 ? 's' : ''}` : `${data.length} note${data.length !== 1 ? 's' : ''}`}
        action={<Btn onClick={openAdd} color="primary">+ Add Note</Btn>}
      />

      {loading ? <Spinner /> : data.length === 0 ? (
        <EmptyState icon="📝" title="No notes yet"
          subtitle="Use notes to track tasks, reminders and ideas."
          action={<Btn onClick={openAdd} color="primary">+ Add Note</Btn>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
          {data.map(note => (
            <Card key={note.id} style={{ padding: 20, borderLeft: `4px solid ${priorityBorder[note.priority] || C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text, flex: 1 }}>{note.title}</h4>
                <Badge label={note.priority||'Normal'} color={priorityColor[note.priority]||'gray'} />
              </div>
              {note.category && (
                <span style={{ fontSize: 11, background: C.bg, color: C.blue, padding: '2px 8px',
                  borderRadius: 4, fontWeight: 600, marginBottom: 8, display: 'inline-block' }}>
                  #{note.category}
                </span>
              )}
              <p style={{ margin: '6px 0 12px', fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                {note.content}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: C.muted }}>
                  {note.dueDate && <span>📅 Due: {note.dueDate}</span>}
                  {!note.dueDate && <span>{fmtDate(note.createdAt)}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn size="sm" color="ghost"  onClick={() => openEdit(note)}>Edit</Btn>
                  <Btn size="sm" color="danger" onClick={() => setDeleteId(note.id)}>Delete</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={editing ? 'Edit Note' : 'New Note'} onClose={() => setModal(false)}>
          <form onSubmit={save}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Input label="Title"     value={form.title}    onChange={f('title')}    required placeholder="Note title" />
              <Input label="Category"  value={form.category} onChange={f('category')} placeholder="e.g. Client, Task, Idea" />
              <Input label="Priority"  value={form.priority} onChange={f('priority')} options={['High','Normal','Low']} />
              <Input label="Due Date"  value={form.dueDate}  onChange={f('dueDate')}  type="date" />
            </div>
            <Input label="Content" value={form.content} onChange={f('content')} textarea required placeholder="Write your note here..." />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <Btn color="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn type="submit" color="primary">{editing ? 'Save Changes' : 'Add Note'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this note?"
          onConfirm={async () => { await deleteRecord(Col.notes, deleteId); setDeleteId(null); load(); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
