import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface DocumentChatPanelProps {
  documentId: number;
  documentTitle: string;
}

export const DocumentChatPanel: React.FC<DocumentChatPanelProps> = ({ documentId, documentTitle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I am your AI Legal Assistant. Ask me any question about "${documentTitle}" (e.g., termination clause, payment terms, or simple summary).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'What is the termination clause?',
    'Summarize this contract in simple English.',
    'What are my obligations under this contract?',
    'What is the notice period for cancellation?',
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setQuestion('');
    setLoading(true);

    try {
      const response = await aiService.chatWithDocument(documentId, { question: q.trim() });
      if (response.success && response.data) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: response.data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an issue processing your question. Please ensure the backend server is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '550px', overflow: 'hidden', padding: 0 }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--panel-border)', background: 'rgba(13, 17, 23, 0.6)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <Bot size={22} style={{ color: 'var(--accent-gold)' }} />
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Interactive Document AI Chat</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ask questions grounded in document text</p>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--panel-border)', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        <Sparkles size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '2px' }} />
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            style={{
              whiteSpace: 'nowrap',
              background: 'rgba(229, 185, 100, 0.1)',
              border: '1px solid rgba(229, 185, 100, 0.25)',
              color: 'var(--accent-gold)',
              fontSize: '0.75rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              cursor: 'pointer',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '0.65rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            {msg.sender === 'ai' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(229, 185, 100, 0.2)', border: '1px solid rgba(229, 185, 100, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                <Bot size={18} />
              </div>
            )}

            <div
              style={{
                background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--accent-gold) 0%, #c89b41 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: msg.sender === 'user' ? 'var(--text-inverse)' : 'var(--text-main)',
                border: msg.sender === 'ai' ? '1px solid var(--panel-border)' : 'none',
                padding: '0.75rem 1rem',
                borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
            >
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              <span style={{ display: 'block', fontSize: '0.65rem', marginTop: '0.35rem', opacity: 0.7, textAlign: 'right' }}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', flexShrink: 0 }}>
                <UserIcon size={18} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Loader2 size={16} className="spinner" />
            <span>AI Legal Assistant is thinking...</span>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--panel-border)', background: 'rgba(13, 17, 23, 0.6)', display: 'flex', gap: '0.5rem' }}
      >
        <input
          type="text"
          placeholder="Ask any question about this document..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.65rem 0.85rem',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
          }}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn-primary"
          style={{ padding: '0.65rem 1rem' }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
