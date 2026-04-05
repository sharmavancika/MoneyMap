import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Sparkles, Lightbulb, RefreshCw, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  calcTotalBalance, calcTotalIncome, calcTotalExpenses,
  calcCategoryBreakdown, calcMonthlyComparison, calcMonthlyData,
  formatINR,
} from '@/core/use-cases/calculations';
import './Munim.css';

/* ── Gemini config ── */
const GEMINI_API_KEY = 'AIzaSyB2ZMJqDyKmK-UMuyEXr-gd4Pffo3pVIZw';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/* ── Quick prompt chips ── */
const QUICK_CHIPS = [
  { icon: '📊', label: 'Spending summary',    prompt: 'Give me a summary of my spending this month.' },
  { icon: '💡', label: 'How to save more',    prompt: 'How can I save more money based on my transactions?' },
  { icon: '🔥', label: 'Top expense',         prompt: 'What is my highest spending category and how can I reduce it?' },
  { icon: '❤️', label: 'Financial health',    prompt: 'How is my overall financial health looking?' },
];

/* ── Build system prompt with live data ── */
function buildContext(transactions, budgets, fixedPayments) {
  const balance   = calcTotalBalance(transactions);
  const income    = calcTotalIncome(transactions);
  const expenses  = calcTotalExpenses(transactions);
  const savings   = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  const breakdown = calcCategoryBreakdown(transactions);
  const compare   = calcMonthlyComparison(transactions);
  const monthly   = calcMonthlyData(transactions, 3);
  const fixed     = fixedPayments.reduce((s, f) => s + f.amount, 0);

  return `You are Munim, a warm and expert AI financial advisor inside MoneyMap, a personal finance app for Indian users. All amounts are in Indian Rupees (₹).

LIVE FINANCIAL DATA:
- Balance: ${formatINR(balance)}
- Income: ${formatINR(income)}  |  Expenses: ${formatINR(expenses)}
- Savings Rate: ${savings}%
- Fixed Monthly Commitments: ${formatINR(fixed)} (Rent, EMI, Insurance, SIP)

TOP SPENDING CATEGORIES:
${breakdown.slice(0, 5).map(b => `  • ${b.category}: ${formatINR(b.amount)} (${b.percentage}%)`).join('\n')}

MONTH-ON-MONTH:
  • This month: ${formatINR(compare.thisMonth)}  |  Last month: ${formatINR(compare.lastMonth)}
  • Change: ${compare.percentChange > 0 ? '+' : ''}${compare.percentChange}%

LAST 3 MONTHS:
${monthly.map(m => `  • ${m.month}: Income ${formatINR(m.income)}, Expenses ${formatINR(m.expenses)}, Net ${formatINR(m.balance)}`).join('\n')}

BUDGETS: ${budgets.length ? budgets.map(b => `${b.category} (₹${b.limit})`).join(', ') : 'None set'}

RULES:
- Speak like a knowledgeable Indian friend — warm, direct, practical.
- Always use ₹ for amounts. Reference Indian products: SIP, PPF, NPS, FD, ELSS.
- Give specific advice using the actual numbers above. Never invent data.
- Keep replies under 180 words unless a detailed breakdown is requested.
- Use emojis sparingly — only when they add meaning.`;
}

/* ── Gemini API call ── */
async function askGemini(context, history, message) {
  const contents = [
    ...history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: context }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Gemini API error');
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
}

/* ── Sub-components ── */
function TypingIndicator() {
  return (
    <div className="munim-typing">
      <div className="munim-typing__ava">म</div>
      <div className="munim-typing__bubble">
        <span /><span /><span />
      </div>
    </div>
  );
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`munim-msg munim-msg--${isUser ? 'user' : 'assistant'}`}>
      {!isUser && <div className="munim-msg__ava">म</div>}
      <div className="munim-msg__body">
        <div className="munim-msg__bubble">
          <p className="munim-msg__text">{msg.content}</p>
        </div>
        <span className="munim-msg__time">{msg.time}</span>
      </div>
    </div>
  );
}

function SnapCard({ icon, label, value, sub, color }) {
  return (
    <div className="munim-snap-card" style={{ '--snap-color': color }}>
      <span className="munim-snap-card__icon">{icon}</span>
      <div className="munim-snap-card__val">{value}</div>
      <div className="munim-snap-card__label">{label}</div>
      {sub && <div className="munim-snap-card__sub">{sub}</div>}
    </div>
  );
}

/* ── FAB button ── */
export function MunimButton({ onClick }) {
  return (
    <button className="munim-fab" onClick={onClick} aria-label="Open Munim AI">
      <div className="munim-fab__ring" />
      <div className="munim-fab__inner">
        <span className="munim-fab__letter">म</span>
      </div>
      <div className="munim-fab__label-wrap">
        <span className="munim-fab__name">Munim AI</span>
        <span className="munim-fab__tagline">Your finance advisor</span>
      </div>
    </button>
  );
}

/* ── Main chat panel ── */
export function MunimChat({ onClose }) {
  const { transactions, budgets, fixedPayments } = useStore();
  const [tab, setTab]       = useState('chat');
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [messages, setMessages] = useState([{
    id: 1,
    role: 'assistant',
    content: 'Namaste! 🙏 I\'m Munim, your personal finance advisor. I\'ve already analysed your MoneyMap data — ask me anything about your spending, savings, or investments!',
    time: now(),
  }]);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  /* Computed insights */
  const balance    = calcTotalBalance(transactions);
  const income     = calcTotalIncome(transactions);
  const expenses   = calcTotalExpenses(transactions);
  const savings    = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  const breakdown  = calcCategoryBreakdown(transactions);
  const compare    = calcMonthlyComparison(transactions);
  const topCat     = breakdown[0];

  function now() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (tab === 'chat') textareaRef.current?.focus();
  }, [tab]);

  /* Auto-resize textarea */
  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px';
  };

  const send = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput('');
    setError('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg = { id: Date.now(), role: 'user', content: msg, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const context = buildContext(transactions, budgets, fixedPayments);
    const history = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const reply = await askGemini(context, history, msg);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply, time: now() }]);
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, transactions, budgets, fixedPayments]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: 'Chat cleared! Still here with your latest financial data. What would you like to know?',
      time: now(),
    }]);
    setError('');
  };

  const tipText = savings < 10
    ? 'Your savings rate is low. Try cutting discretionary expenses and aim for at least 20%.'
    : savings < 20
    ? 'Good start! Aim for 20%+ savings. Review your top spending category first.'
    : 'Excellent savings rate! Consider putting the surplus into SIPs or PPF for long-term growth.';

  return (
    <div className="munim-panel">
      {/* Header */}
      <div className="munim-panel__header">
        <div className="munim-panel__header-left">
          <div className="munim-panel__avatar">
            म
            <span className="munim-panel__status-dot" />
          </div>
          <div>
            <div className="munim-panel__title">Munim AI</div>
            <div className="munim-panel__subtitle">Your personal finance advisor</div>
          </div>
        </div>
        <div className="munim-panel__actions">
          <button className="munim-panel__btn" onClick={clearChat} title="Clear chat">
            <RefreshCw size={15} />
          </button>
          <button className="munim-panel__btn munim-panel__btn--close" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="munim-tabs">
        <button className={`munim-tab ${tab === 'chat' ? 'munim-tab--active' : ''}`} onClick={() => setTab('chat')}>
          <Sparkles size={13} /> Chat
        </button>
        <button className={`munim-tab ${tab === 'insights' ? 'munim-tab--active' : ''}`} onClick={() => setTab('insights')}>
          <Lightbulb size={13} /> Insights
        </button>
      </div>

      {/* ── CHAT TAB ── */}
      {tab === 'chat' && (
        <div className="munim-chat-area">
          <div className="munim-messages">
            {messages.map(m => <ChatMessage key={m.id} msg={m} />)}
            {loading && <TypingIndicator />}
            {error && <div className="munim-error">⚠️ {error}</div>}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="munim-quick">
              {QUICK_CHIPS.map(c => (
                <button key={c.label} className="munim-quick__chip" onClick={() => send(c.prompt)}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          )}

          <div className="munim-input-row">
            <textarea
              ref={textareaRef}
              className="munim-textarea"
              placeholder="Ask about your finances…"
              value={input}
              onInput={handleInput}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
            />
            <button
              className={`munim-send-btn ${input.trim() && !loading ? 'munim-send-btn--ready' : ''}`}
              onClick={() => send()}
              disabled={!input.trim() || loading}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="munim-footer-note">Powered by Gemini 2.0 Flash · Your data stays private</p>
        </div>
      )}

      {/* ── INSIGHTS TAB ── */}
      {tab === 'insights' && (
        <div className="munim-insights">
          <p className="munim-section-label">Your snapshot</p>

          <div className="munim-snapshot">
            <SnapCard icon="💰" label="Balance"      value={formatINR(balance)}  color="var(--accent-green)" />
            <SnapCard icon="💸" label="Expenses"     value={formatINR(expenses)}
              sub={`${compare.percentChange > 0 ? '+' : ''}${compare.percentChange}% vs last month`}
              color="var(--accent-red)" />
            <SnapCard icon="📈" label="Savings Rate" value={`${savings}%`}
              sub={savings >= 20 ? '✅ Healthy' : '⚠️ Needs work'}
              color="var(--accent-blue)" />
            <SnapCard icon="🔥" label="Top Spend"
              value={topCat ? topCat.category : '—'}
              sub={topCat ? `${formatINR(topCat.amount)} · ${topCat.percentage}%` : ''}
              color="var(--accent-amber)" />
          </div>

          <p className="munim-section-label">Category breakdown</p>

          <div className="munim-breakdown">
            {breakdown.slice(0, 5).map(b => (
              <div key={b.category} className="munim-brow">
                <div className="munim-brow__meta">
                  <span className="munim-brow__cat">{b.category}</span>
                  <div className="munim-brow__right">
                    <span className="munim-brow__pct">{b.percentage}%</span>
                    <span className="munim-brow__amt">{formatINR(b.amount)}</span>
                  </div>
                </div>
                <div className="munim-brow__track">
                  <div className="munim-brow__fill" style={{ width: `${b.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="munim-tip">
            <span className="munim-tip__icon">💡</span>
            <p className="munim-tip__text">{tipText}</p>
          </div>

          <button className="munim-ask-btn" onClick={() => setTab('chat')}>
            Ask Munim about this <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
