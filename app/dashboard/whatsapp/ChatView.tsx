'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  type: string;
  body: string;
  status: string;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  company?: string;
  stage?: string;
}

interface ChatViewProps {
  conversations: any[];
  contacts: Contact[];
  selectedContactId?: string;
  selectedContact: Contact | null;
  selectedMessages: Message[];
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'read') return <span style={{ color: '#6366f1', fontSize: 11 }}>✓✓</span>;
  if (status === 'delivered') return <span style={{ color: '#25D366', fontSize: 11 }}>✓✓</span>;
  if (status === 'sent') return <span style={{ color: '#94a3b8', fontSize: 11 }}>✓</span>;
  if (status === 'failed') return <span style={{ color: '#f43f5e', fontSize: 11 }}>✕</span>;
  return <span style={{ color: '#64748b', fontSize: 11 }}>…</span>;
}

export default function ChatView({
  conversations,
  contacts,
  selectedContactId,
  selectedContact,
  selectedMessages,
}: ChatViewProps) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>(selectedMessages);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newText, setNewText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMessages(selectedMessages);
  }, [selectedMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  async function sendMessage() {
    if (!text.trim() || !selectedContact) return;
    setSending(true);
    const res = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: selectedContact.phone, message: text, contactId: selectedContact.id }),
    });
    const data = await res.json();
    if (data.success) {
      setLocalMessages((prev) => [...prev, {
        id: data.wamid ?? Date.now().toString(),
        direction: 'outbound',
        type: 'text',
        body: text,
        status: 'sent',
        created_at: new Date().toISOString(),
      }]);
      setText('');
    } else {
      alert('Failed to send: ' + (data.error ?? 'unknown error'));
    }
    setSending(false);
  }

  async function sendNewMessage() {
    if (!newPhone.trim() || !newText.trim()) return;
    setSending(true);
    const res = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: newPhone, message: newText }),
    });
    const data = await res.json();
    if (data.success) {
      setShowNewChat(false);
      setNewPhone('');
      setNewText('');
      router.refresh();
    } else {
      alert('Failed to send: ' + (data.error ?? 'unknown error'));
    }
    setSending(false);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left: Conversation list */}
      <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', margin: 0 }}>Chats</h2>
          <button
            onClick={() => setShowNewChat(true)}
            style={{
              background: '#6366f1', border: 'none', borderRadius: 6, padding: '6px 10px',
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            + New
          </button>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              No conversations yet.<br/>
              <button onClick={() => setShowNewChat(true)} style={{ color: '#a5b4fc', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>
                Start a new chat →
              </button>
            </div>
          ) : (
            conversations.map((conv) => {
              const contact = conv.contacts as any;
              const isSelected = selectedContactId === conv.contact_id;
              return (
                <div
                  key={conv.id}
                  onClick={() => router.push(`/dashboard/whatsapp?contact=${conv.contact_id}`)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #0a0f1f',
                    background: isSelected ? 'rgba(99,102,241,0.08)' : 'transparent',
                    borderLeft: isSelected ? '2px solid #6366f1' : '2px solid transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 18, background: '#1e293b',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, color: '#94a3b8', fontWeight: 700, flexShrink: 0,
                    }}>
                      {contact?.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contact?.name ?? conv.phone_from ?? conv.phone_to ?? 'Unknown'}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                        {conv.body?.slice(0, 40) ?? '(media)'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Center: Conversation */}
      {selectedContact ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
          {/* Chat header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 19, background: '#1e293b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, color: '#94a3b8', fontWeight: 700,
            }}>
              {selectedContact.name[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>{selectedContact.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{selectedContact.phone}</div>
            </div>
            <a
              href={`/dashboard/whatsapp/send?contact=${selectedContact.id}`}
              style={{
                marginLeft: 'auto', fontSize: 12, color: '#a5b4fc', textDecoration: 'none',
                background: 'rgba(99,102,241,0.1)', padding: '6px 12px', borderRadius: 6,
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              Send template
            </a>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {localMessages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13, marginTop: 40 }}>
                No messages yet. Send the first one below.
              </div>
            ) : (
              localMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.direction === 'outbound' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: msg.direction === 'outbound' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.direction === 'outbound' ? '#6366f1' : '#1e293b',
                    color: '#f8fafc',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}>
                    <p style={{ margin: 0 }}>{msg.body}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 10, color: msg.direction === 'outbound' ? 'rgba(255,255,255,0.6)' : '#64748b' }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.direction === 'outbound' && <StatusIcon status={msg.status} />}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              style={{
                flex: 1, background: '#0f172a', border: '1px solid #1e293b',
                borderRadius: 10, padding: '10px 14px', color: '#f8fafc',
                fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit',
                maxHeight: 120, overflowY: 'auto',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
              onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !text.trim()}
              style={{
                background: '#25D366', border: 'none', borderRadius: 10,
                padding: '10px 16px', color: '#fff', fontSize: 13, fontWeight: 600,
                cursor: sending || !text.trim() ? 'not-allowed' : 'pointer',
                opacity: sending || !text.trim() ? 0.5 : 1, flexShrink: 0,
              }}
            >
              {sending ? '…' : 'Send'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <p style={{ fontSize: 14, margin: 0 }}>Select a conversation or start a new one</p>
          <button
            onClick={() => setShowNewChat(true)}
            style={{
              marginTop: 16, background: '#6366f1', border: 'none', borderRadius: 8,
              padding: '10px 20px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            + New conversation
          </button>
        </div>
      )}

      {/* Right: Contact panel */}
      {selectedContact && (
        <div style={{ width: 240, flexShrink: 0, borderLeft: '1px solid #1e293b', padding: '20px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28, background: '#1e293b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: '#94a3b8', fontWeight: 700, margin: '0 auto 12px',
            }}>
              {selectedContact.name[0]?.toUpperCase()}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>{selectedContact.name}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{selectedContact.phone}</div>
          </div>

          {[
            { label: 'Company', value: selectedContact.company },
            { label: 'Stage', value: selectedContact.stage },
          ].filter((f) => f.value).map((field) => (
            <div key={field.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{field.label}</div>
              <div style={{ fontSize: 13, color: '#f8fafc' }}>{field.value}</div>
            </div>
          ))}

          <div style={{ height: 1, background: '#1e293b', margin: '20px 0' }}/>

          <a
            href={`/dashboard/whatsapp/send?contact=${selectedContact.id}`}
            style={{
              display: 'block', textAlign: 'center', padding: '9px 16px',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 8, color: '#a5b4fc', textDecoration: 'none', fontSize: 13, fontWeight: 600,
            }}
          >
            Send template
          </a>

          <a
            href={`/dashboard/contacts/${selectedContact.id}`}
            style={{
              display: 'block', textAlign: 'center', padding: '9px 16px', marginTop: 8,
              background: 'transparent', border: '1px solid #1e293b',
              borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 13,
            }}
          >
            View contact
          </a>
        </div>
      )}

      {/* New chat modal */}
      {showNewChat && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setShowNewChat(false); }}
        >
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '28px', width: 380 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: '0 0 20px' }}>New conversation</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                Phone number (with country code)
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. 14155552671"
                style={{ width: '100%', background: '#020617', border: '1px solid #1e293b', borderRadius: 8, padding: '10px 12px', color: '#f8fafc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
                onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}
              />
              <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>No +, no spaces. Example: 14155552671</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                Message
              </label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Type your message…"
                rows={3}
                style={{ width: '100%', background: '#020617', border: '1px solid #1e293b', borderRadius: 8, padding: '10px 12px', color: '#f8fafc', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
                onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNewChat(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'transparent', border: '1px solid #1e293b', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={sendNewMessage}
                disabled={sending || !newPhone.trim() || !newText.trim()}
                style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#25D366', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: sending ? 0.6 : 1 }}
              >
                {sending ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
