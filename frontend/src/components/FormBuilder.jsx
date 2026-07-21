import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import RichTextEditor from './RichTextEditor';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const FIELD_TYPES = [
  { value: 'text',       label: 'Short Text' },
  { value: 'textarea',   label: 'Paragraph' },
  { value: 'email',      label: 'Email' },
  { value: 'number',     label: 'Number' },
  { value: 'select',     label: 'Dropdown' },
  { value: 'radio',      label: 'Single Choice' },
  { value: 'checkbox',   label: 'Multi Choice' },
  { value: 'true_false', label: 'True / False' },
  { value: 'star',       label: 'Star Rating' },
  { value: 'section',    label: 'Section Break' },
];

const Toggle = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} style={{ width: '40px', height: '22px', borderRadius: '2px', background: checked ? '#3366cc' : '#d0d5dd', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: checked ? '20px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
  </div>
);

function SortableField({ field, idx, selectedId, setSelectedId, updateField, deleteField, duplicateField, contentType, accent, c, labelStyle, inputStyle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  if (field.type === 'section') {
    return (
      <div ref={setNodeRef} style={{ ...style, background: 'var(--bg)', border: '2px dashed var(--border)', borderRadius: '2px', padding: '16px 20px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--text-muted)', touchAction: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="17" r="1.5"/><circle cx="15" cy="7" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="17" r="1.5"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#00af89', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Section Break</div>
            <input type="text" placeholder="Section title..." value={field.text} onChange={e => updateField(field.id, 'text', e.target.value)} style={{ ...inputStyle, fontWeight: '700', fontSize: '16px' }} />
            <input type="text" placeholder="Description (optional)..." value={field.description || ''} onChange={e => updateField(field.id, 'description', e.target.value)} style={{ ...inputStyle, fontSize: '13px', marginTop: '6px' }} />
          </div>
          <button onClick={() => deleteField(field.id)} style={{ border: '1px solid #fecdca', background: 'var(--surface)', cursor: 'pointer', padding: '5px 8px', borderRadius: '2px', color: '#d92d20' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>
    );
  }

  const isSelected = selectedId === field.id;

  return (
    <div ref={setNodeRef} style={{ ...style, background: 'var(--surface)', border: `1px solid ${isSelected ? accent : 'var(--border-light)'}`, borderLeft: `3px solid ${isSelected ? accent : 'transparent'}`, borderRadius: '2px', padding: '16px 18px', marginBottom: '10px', transition: 'border-color 0.15s', boxShadow: isSelected ? 'var(--shadow-md)' : 'none' }}
      {...attributes} {...listeners}
      style={{ ...style, background: 'var(--surface)', border: `1px solid ${isSelected ? accent : 'var(--border-light)'}`, borderLeft: `3px solid ${isSelected ? accent : 'transparent'}`, borderRadius: '2px', padding: '16px 18px', marginBottom: '10px', transition: 'border-color 0.15s', boxShadow: isSelected ? 'var(--shadow-md)' : 'none', cursor: 'grab', touchAction: 'none' }}
      onClick={() => setSelectedId(isSelected ? null : field.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>
            {FIELD_TYPES.find(f => f.value === field.type)?.label || 'Field'} #{idx + 1}
          </div>
          <div onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
            <RichTextEditor
              value={field.text}
              onChange={val => updateField(field.id, 'text', val)}
              placeholder={contentType === 'quiz' ? 'Enter question...' : 'Enter field label...'}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }} onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
          <button onClick={e => { e.stopPropagation(); duplicateField(field); }}
            style={{ border: '1px solid var(--border-light)', background: 'var(--surface)', cursor: 'pointer', padding: '5px 7px', borderRadius: '2px', color: 'var(--text-secondary)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button onClick={e => { e.stopPropagation(); deleteField(field.id); }}
            style={{ border: '1px solid #fecdca', background: 'var(--surface)', cursor: 'pointer', padding: '5px 7px', borderRadius: '2px', color: '#d92d20' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>

      {isSelected && (
        <div onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}
          style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed var(--border-light)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Question Type</label>
            <select aria-label="Question type" value={field.type}
              onChange={e => { e.stopPropagation(); updateField(field.id, 'type', e.target.value); }}
              onClick={e => e.stopPropagation()}
              onPointerDown={e => e.stopPropagation()}
              style={inputStyle}>
              {FIELD_TYPES.filter(f => f.value !== 'section').map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '18px' }}>
            <Toggle checked={field.required} onChange={val => updateField(field.id, 'required', val)} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => updateField(field.id, 'required', !field.required)}>{c.required}</span>
          </div>
          {field.type === 'star' && (
            <div onPointerDown={e => e.stopPropagation()}>
              <label style={labelStyle}>Max Stars</label>
              <select aria-label="Maximum stars" value={field.starMax || 5} onChange={e => updateField(field.id, 'starMax', parseInt(e.target.value))} style={inputStyle} onPointerDown={e => e.stopPropagation()}>
                {[3,4,5,6,7,10].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
          )}
          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
            <div style={{ gridColumn: '1 / span 2' }} onPointerDown={e => e.stopPropagation()}>
              <label style={labelStyle}>{c.options}</label>
              <input type="text" value={field.options?.join(', ')} onChange={e => updateField(field.id, 'options', e.target.value.split(',').map(s => s.trim()))} style={inputStyle} onPointerDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()} />
            </div>
          )}
          {contentType === 'quiz' && (
            <>
              <div onPointerDown={e => e.stopPropagation()}>
                <label style={labelStyle}>{c.points}</label>
                <input type="number" value={field.points} onChange={e => updateField(field.id, 'points', parseInt(e.target.value) || 0)} style={inputStyle} onPointerDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()} />
              </div>
              <div onPointerDown={e => e.stopPropagation()}>
                <label style={labelStyle}>{c.correctAns}</label>
                <input type="text" value={field.correctAnswer} onChange={e => updateField(field.id, 'correctAnswer', e.target.value)} style={inputStyle} onPointerDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MobileFAB({ addField, addSection }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fb-mobile-add">
      {open && (
        <div className="fb-mobile-fab-menu">
          {FIELD_TYPES.map(t => (
            <button key={t.value} className="fb-mobile-fab-item"
              onClick={() => { t.value === 'section' ? addSection() : addField(t.value); setOpen(false); }}>
              {t.label}
            </button>
          ))}
        </div>
      )}
      <button className="fb-mobile-fab" onClick={() => setOpen(o => !o)}>{open ? '✕' : '+'}</button>
    </div>
  );
}

function FormBuilder({ lang, contentType, editSlug, formTitle, setFormTitle, description, setDescription,
  coverImage, setCoverImage, customSlug, setCustomSlug, questions, setQuestions,
  statusMessage, generatedUrl, submitConfiguration, onCancel, wikiUser, onLogin }) {

  const [activeTab, setActiveTab] = useState('editor');
  const [selectedId, setSelectedId] = useState(null);
  const [newCollab, setNewCollab] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [collabStatus, setCollabStatus] = useState('');
  const [timerType, setTimerType] = useState('none');
  const [timerDuration, setTimerDuration] = useState(30);
  const [timerStart, setTimerStart] = useState('');
  const [timerEnd, setTimerEnd] = useState('');
  const [timerBeforeMsg, setTimerBeforeMsg] = useState({ en: 'This quiz has not started yet.', bn: 'এই কুইজ এখনো শুরু হয়নি।' });
  const [timerAfterMsg, setTimerAfterMsg] = useState({ en: 'This quiz has ended.', bn: 'এই কুইজ শেষ হয়ে গেছে।' });
  const [resultTiming, setResultTiming] = useState('instant');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  const accent = '#3366cc';

  const t = {
    en: { tabEditor: 'Editor', tabPreview: 'Preview', tabSettings: 'Settings', titlePH: contentType === 'quiz' ? 'Untitled Quiz' : 'Untitled Form', descPH: 'Description (optional)', addField: 'Add Question', addSection: 'Add Section', publish: editSlug ? 'Update' : 'Publish', cancel: 'Cancel', loginMsg: 'Log in with Wikipedia to create forms.', loginBtn: 'Log In with Wikipedia', required: 'Required', points: 'Points', options: 'Options (comma separated)', correctAns: 'Correct Answer', shareTitle: 'Collaborators', collabPH: 'Wikipedia username', addCollab: 'Add', noCollab: 'No collaborators yet.', published: 'Published! Share this link:', openLink: 'Open', slugLabel: 'URL Slug', imageLabel: 'Cover Image URL', timerTitle: 'Timer Settings' },
    bn: { tabEditor: 'এডিটর', tabPreview: 'প্রিভিউ', tabSettings: 'সেটিংস', titlePH: contentType === 'quiz' ? 'শিরোনামহীন কুইজ' : 'শিরোনামহীন ফর্ম', descPH: 'বিবরণ (ঐচ্ছিক)', addField: 'প্রশ্ন যোগ করুন', addSection: 'সেকশন যোগ করুন', publish: editSlug ? 'আপডেট করুন' : 'প্রকাশ করুন', cancel: 'বাতিল', loginMsg: 'ফর্ম তৈরি করতে উইকিপিডিয়া দিয়ে লগইন করুন।', loginBtn: 'উইকিপিডিয়া দিয়ে লগইন করুন', required: 'আবশ্যিক', points: 'পয়েন্ট', options: 'অপশন (কমা দিয়ে)', correctAns: 'সঠিক উত্তর', shareTitle: 'সহযোগী', collabPH: 'উইকিপিডিয়া ব্যবহারকারী', addCollab: 'যোগ করুন', noCollab: 'কোনো সহযোগী নেই।', published: 'প্রকাশিত! লিংক শেয়ার করুন:', openLink: 'খুলুন', slugLabel: 'URL স্লাগ', imageLabel: 'কভার ইমেজ URL', timerTitle: 'টাইমার সেটিংস' },
  };
  const c = t[lang] || t.en;
  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: 'var(--surface)', color: 'var(--text-primary)' };
  const labelStyle = { fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' };

  const addField = (type = 'text') => {
    const f = { id: 'f_' + Date.now(), type, text: '', required: false, points: 5, options: ['Option 1', 'Option 2'], correctAnswer: '', starMax: 5 };
    setQuestions(prev => [...prev, f]);
    setSelectedId(f.id);
  };

  const addSection = () => {
    const f = { id: 'f_' + Date.now(), type: 'section', text: '', description: '' };
    setQuestions(prev => [...prev, f]);
  };

  const deleteField = id => { setQuestions(prev => prev.filter(q => q.id !== id)); if (selectedId === id) setSelectedId(null); };

  const duplicateField = field => {
    const d = { ...field, id: 'f_' + Date.now(), text: field.text + ' (Copy)' };
    const idx = questions.findIndex(q => q.id === field.id);
    const arr = [...questions]; arr.splice(idx + 1, 0, d); setQuestions(arr);
  };

  const updateField = (id, prop, val) => setQuestions(prev => prev.map(q => q.id === id ? { ...q, [prop]: val } : q));

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIdx = questions.findIndex(q => q.id === active.id);
      const newIdx = questions.findIndex(q => q.id === over.id);
      setQuestions(arrayMove(questions, oldIdx, newIdx));
    }
  };

  const handlePublish = () => {
    if (!formTitle.trim()) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে একটি শিরোনাম দিন!' : 'Please provide a title!');
      return;
    }
    submitConfiguration({ timerType, timerDuration, timerStart, timerEnd, timerBeforeMsg, timerAfterMsg, resultTiming });
  };

  const addCollaborator = async () => {
    if (!newCollab.trim()) return;
    if (!customSlug) {
      setCollabStatus(lang === 'bn' ? 'আগে ফর্মটি প্রকাশ করুন।' : 'Please publish the form first.');
      return;
    }
    try {
      const res = await fetch('/api/add-collaborator', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: customSlug, new_collaborator: newCollab.trim() }) });
      const data = await res.json();
      if (data.status === 'success') { setCollaborators(data.collaborators); setNewCollab(''); setCollabStatus('Added!'); setTimeout(() => setCollabStatus(''), 2000); }
      else setCollabStatus(data.message);
    } catch { setCollabStatus('Error.'); }
  };

  const getSections = () => {
    const sections = [];
    let current = { title: '', description: '', fields: [] };
    questions.forEach(q => {
      if (q.type === 'section') { if (current.fields.length > 0 || sections.length > 0) sections.push(current); current = { title: q.text, description: q.description || '', fields: [] }; }
      else current.fields.push(q);
    });
    sections.push(current);
    return sections;
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '20px 16px' }}>
      {statusMessage && (
        <div style={{ background: statusMessage.includes('⚠️') || statusMessage.includes('Please') || statusMessage.includes('দিন') ? '#fffaeb' : accent, color: statusMessage.includes('⚠️') || statusMessage.includes('Please') || statusMessage.includes('দিন') ? '#b54708' : '#fff', border: statusMessage.includes('⚠️') ? '1px solid #f79009' : 'none', padding: '12px 16px', borderRadius: '2px', marginBottom: '14px', fontWeight: '600', fontSize: '14px', animation: 'fadeIn 0.3s ease' }}>
          {statusMessage}
        </div>
      )}

      {generatedUrl && (
        <div style={{ background: 'var(--surface)', borderLeft: `4px solid ${accent}`, padding: '18px 20px', borderRadius: '2px', marginBottom: '18px' }}>
          <p style={{ margin: '0 0 10px', fontWeight: '700', color: accent, fontSize: '14px' }}>{c.published}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input readOnly value={generatedUrl} onClick={e => e.target.select()} style={{ ...inputStyle, flex: 1, color: accent, fontWeight: '600', minWidth: '200px' }} />
            <a href={generatedUrl} target="_blank" rel="noreferrer" className="wiki-btn" style={{ backgroundColor: accent, borderColor: accent, textDecoration: 'none' }}>{c.openLink}</a>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '2px', borderBottom: '2px solid var(--border-light)', marginBottom: '20px', overflowX: 'auto' }}>
        {['editor','preview','settings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '9px 18px', border: 'none', background: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', color: activeTab === tab ? accent : 'var(--text-secondary)', borderBottom: activeTab === tab ? `2px solid ${accent}` : '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap' }}>
            {tab === 'editor' ? c.tabEditor : tab === 'preview' ? c.tabPreview : c.tabSettings}
          </button>
        ))}
      </div>

      {activeTab === 'editor' && (
        <div className="fb-grid">
          <div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderTop: `4px solid ${accent}`, borderRadius: '2px', padding: '22px', marginBottom: '14px' }}>
              <input type="text" placeholder={c.titlePH} value={formTitle} onChange={e => setFormTitle(e.target.value)}
                style={{ width: '100%', fontSize: '22px', fontWeight: '800', border: 'none', borderBottom: '2px solid var(--border-light)', paddingBottom: '10px', marginBottom: '14px', outline: 'none', color: 'var(--text-primary)', background: 'transparent', boxSizing: 'border-box' }} />
              <textarea placeholder={c.descPH} value={description} onChange={e => setDescription(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {!wikiUser ? (
              <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '2px', padding: '40px 24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{c.loginMsg}</p>
                <button onClick={onLogin} className="wiki-btn">{c.loginBtn}</button>
              </div>
            ) : (
              <>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                    {questions.map((q, idx) => (
                      <SortableField key={q.id} field={q} idx={idx}
                        selectedId={selectedId} setSelectedId={setSelectedId}
                        updateField={updateField} deleteField={deleteField} duplicateField={duplicateField}
                        contentType={contentType} accent={accent} c={c} labelStyle={labelStyle} inputStyle={inputStyle} />
                    ))}
                  </SortableContext>
                </DndContext>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div onClick={() => addField('text')} style={{ flex: 1, background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '2px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', color: accent, fontWeight: '600', fontSize: '14px', minWidth: '140px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    {c.addField}
                  </div>
                  <div onClick={addSection} style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '2px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#00af89', fontWeight: '600', fontSize: '14px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    {c.addSection}
                  </div>
                </div>

                <div className="fb-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingBottom: '80px' }}>
                  <button onClick={handlePublish} className="wiki-btn" style={{ backgroundColor: accent, borderColor: accent, padding: '12px 28px', fontWeight: '700', flex: 1 }}>{c.publish}</button>
                  <button onClick={onCancel} className="wiki-btn-secondary" style={{ padding: '12px 20px' }}>{c.cancel}</button>
                </div>
              </>
            )}
          </div>

          <div className="fb-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '2px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Add</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {FIELD_TYPES.map(f => (
                  <button key={f.value} onClick={() => f.value === 'section' ? addSection() : addField(f.value)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: '2px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500', textAlign: 'left' }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '2px', padding: '16px', fontSize: '13px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stats</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Questions</span><b>{questions.filter(q => q.type !== 'section').length}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sections</span><b>{questions.filter(q => q.type === 'section').length}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Required</span><b>{questions.filter(q => q.required).length}</b></div>
                {contentType === 'quiz' && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Points</span><b>{questions.reduce((s, q) => s + (q.points || 0), 0)}</b></div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <PreviewMode questions={questions} formTitle={formTitle} description={description} coverImage={coverImage} contentType={contentType} accent={accent} lang={lang} getSections={getSections} />
      )}

      {activeTab === 'settings' && !wikiUser && (
        <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '2px', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '18px' }}>{lang === 'bn' ? 'সেটিংস দেখতে লগইন করুন।' : 'Log in to view and edit settings.'}</p>
          <button onClick={onLogin} className="wiki-btn">{c.loginBtn}</button>
        </div>
      )}

      {activeTab === 'settings' && wikiUser && (
        <div className="fb-settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '2px', padding: '22px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{lang === 'bn' ? 'সাধারণ' : 'General'}</h3>
            <label style={labelStyle}>{c.slugLabel}</label>
            <input type="text" placeholder="my-form" value={customSlug} onChange={e => setCustomSlug(e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }} />
            <label style={labelStyle}>{c.imageLabel}</label>
            <input type="text" placeholder="https://upload.wikimedia.org/..." value={coverImage} onChange={e => setCoverImage(e.target.value)} style={inputStyle} />
            {coverImage && <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '2px', marginTop: '10px' }} onError={e => e.target.style.display = 'none'} />}
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '2px', padding: '22px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{c.shareTitle}</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input type="text" placeholder={c.collabPH} value={newCollab} onChange={e => setNewCollab(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <button onClick={addCollaborator} className="wiki-btn" style={{ padding: '9px 14px', backgroundColor: accent, borderColor: accent }}>{c.addCollab}</button>
            </div>
            {collabStatus && <p style={{ fontSize: '13px', color: accent, margin: '0 0 8px' }}>{collabStatus}</p>}
            {collaborators.length === 0 ? <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{c.noCollab}</p>
              : collaborators.map((col, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--bg)', borderRadius: '2px', marginBottom: '6px', fontSize: '13px' }}>
                  <span>{col}</span>
                </div>
              ))}
          </div>
          {contentType === 'quiz' && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '2px', padding: '22px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{c.timerTitle}</h3>
              <label style={labelStyle}>Timer Mode</label>
              <select aria-label="Timer mode" value={timerType} onChange={e => setTimerType(e.target.value)} style={{ ...inputStyle, marginBottom: '14px' }}>
                <option value="none">No Timer</option>
                <option value="static">Fixed Duration</option>
                <option value="scheduled">Scheduled Window</option>
              </select>
              {timerType === 'static' && (<div><label style={labelStyle}>Duration (minutes)</label><input type="number" min="1" value={timerDuration} onChange={e => setTimerDuration(parseInt(e.target.value)||30)} style={inputStyle} /></div>)}
              {timerType === 'scheduled' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div><label style={labelStyle}>Start (UTC)</label><input type="datetime-local" value={timerStart} onChange={e => setTimerStart(e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>End (UTC)</label><input type="datetime-local" value={timerEnd} onChange={e => setTimerEnd(e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Before start message (EN)</label><input type="text" value={timerBeforeMsg.en} onChange={e => setTimerBeforeMsg(m => ({...m, en: e.target.value}))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Before start message (BN)</label><input type="text" value={timerBeforeMsg.bn} onChange={e => setTimerBeforeMsg(m => ({...m, bn: e.target.value}))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>After end message (EN)</label><input type="text" value={timerAfterMsg.en} onChange={e => setTimerAfterMsg(m => ({...m, en: e.target.value}))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>After end message (BN)</label><input type="text" value={timerAfterMsg.bn} onChange={e => setTimerAfterMsg(m => ({...m, bn: e.target.value}))} style={inputStyle} /></div>
                </div>
              )}

              <h3 style={{ margin: '20px 0 12px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                {lang === 'bn' ? 'ফলাফল প্রদর্শন' : 'Result Display'}
              </h3>
              <label style={labelStyle}>{lang === 'bn' ? 'ফলাফল কখন দেখাবে?' : 'When should results be shown?'}</label>
              <select value={resultTiming} onChange={e => setResultTiming(e.target.value)} style={inputStyle}>
                <option value="instant">{lang === 'bn' ? 'তৎক্ষণাৎ (জমা দেওয়ার পরপরই)' : 'Instant (right after submission)'}</option>
                <option value="delayed">{lang === 'bn' ? 'পরবর্তীতে (মালিক ঘোষণা করবেন)' : 'Delayed (owner shares results later)'}</option>
              </select>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                {lang === 'bn' ? 'প্রতিটি প্রশ্নের জন্য আলাদা সঠিক/ভুল বার্তা সেট করতে, প্রশ্নটি এডিটরে নির্বাচন করুন।' : 'To set a per-question correct/incorrect message, select that question in the Editor tab.'}
              </p>
            </div>
          )}
        </div>
      )}

      <MobileFAB addField={addField} addSection={addSection} />
    </div>
  );
}

function PreviewMode({ questions, formTitle, description, coverImage, contentType, accent, lang, getSections }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [starValues, setStarValues] = useState({});
  const [starHover, setStarHover] = useState({});
  const sections = getSections();
  const section = sections[currentSection] || { title: '', fields: [] };
  const isLast = currentSection === sections.length - 1;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '2px', padding: '28px 24px', maxWidth: '680px', margin: '0 auto', boxSizing: 'border-box' }}>
      {coverImage && currentSection === 0 && <img src={coverImage} alt="Cover" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '2px', marginBottom: '20px' }} onError={e => e.target.style.display='none'} />}
      {currentSection === 0 && (
        <>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>{formTitle || (lang === 'bn' ? 'শিরোনামহীন' : 'Untitled')}</h1>
          {description && <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>{description}</p>}
        </>
      )}
      {section.title && <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>{section.title}</h2>}
      {section.description && <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>{section.description}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {section.fields.map((q, i) => (
          <div key={q.id}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {q.text || `Question ${i + 1}`}{q.required && <span style={{ color: '#d92d20', marginLeft: '4px' }}>*</span>}
            </label>
            {q.type === 'text' && <input type="text" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '2px', boxSizing: 'border-box', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '14px' }} />}
            {q.type === 'textarea' && <textarea rows={3} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '2px', boxSizing: 'border-box', fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '14px' }} />}
            {q.type === 'email' && <input type="email" placeholder="email@example.com" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '2px', boxSizing: 'border-box', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '14px' }} />}
            {q.type === 'number' && <input type="number" style={{ width: '140px', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '2px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '14px' }} />}
            {q.type === 'select' && <select style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '2px', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '14px', minWidth: '200px' }}>{q.options?.map((o,j) => <option key={j}>{o}</option>)}</select>}
            {(q.type === 'radio' || q.type === 'checkbox') && q.options?.map((o,j) => (
              <label key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '14px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <input type={q.type === 'radio' ? 'radio' : 'checkbox'} name={`q_${q.id}`} style={{ width: '16px', height: '16px' }} /> {o}
              </label>
            ))}
            {q.type === 'true_false' && ['True','False'].map(v => (
              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '14px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <input type="radio" name={`tf_${q.id}`} style={{ width: '16px', height: '16px' }} /> {v}
              </label>
            ))}
            {q.type === 'star' && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: q.starMax || 5 }).map((_, si) => (
                  <svg key={si} width="32" height="32" viewBox="0 0 24 24"
                    fill={(starHover[q.id] || starValues[q.id] || 0) > si ? '#f59e0b' : '#d0d5dd'}
                    stroke={(starHover[q.id] || starValues[q.id] || 0) > si ? '#f59e0b' : '#d0d5dd'}
                    strokeWidth="1" style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setStarHover(h => ({...h, [q.id]: si+1}))}
                    onMouseLeave={() => setStarHover(h => ({...h, [q.id]: 0}))}
                    onClick={() => setStarValues(v => ({...v, [q.id]: si+1}))}>
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
                {starValues[q.id] && <span style={{ marginLeft: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>{starValues[q.id]}/{q.starMax||5}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '8px' }}>
        {currentSection > 0 && <button onClick={() => setCurrentSection(s => s-1)} className="wiki-btn-secondary" style={{ padding: '10px 20px' }}>{lang === 'bn' ? 'পূর্ববর্তী' : 'Back'}</button>}
        <div style={{ marginLeft: 'auto' }}>
          {!isLast
            ? <button onClick={() => setCurrentSection(s => s+1)} className="wiki-btn" style={{ padding: '10px 24px', backgroundColor: accent, borderColor: accent }}>{lang === 'bn' ? 'পরবর্তী' : 'Next'}</button>
            : <button className="wiki-btn" style={{ padding: '10px 24px', backgroundColor: accent, borderColor: accent }}>{lang === 'bn' ? 'জমা দিন' : 'Submit'}</button>
          }
        </div>
      </div>
      {sections.length > 1 && (
        <div style={{ marginTop: '14px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {sections.map((_, i) => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === currentSection ? accent : 'var(--border)', transition: 'background 0.2s' }} />)}
        </div>
      )}
    </div>
  );
}

export default FormBuilder;