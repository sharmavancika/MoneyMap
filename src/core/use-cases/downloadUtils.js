import { formatINR } from './calculations';

// ── CSV ──────────────────────────────────────────────────────────────────────
const toCSV = (transactions) => {
  const headers = ['Date', 'Title', 'Category', 'Type', 'Amount (₹)', 'Note'];
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('en-IN'),
    `"${t.title.replace(/"/g, '""')}"`,
    t.category,
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.type === 'expense' ? `-${t.amount}` : t.amount,
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

// ── JSON ─────────────────────────────────────────────────────────────────────
const toJSON = (transactions) => {
  const data = transactions.map((t) => ({
    id: t.id,
    date: new Date(t.date).toLocaleDateString('en-IN'),
    title: t.title,
    category: t.category,
    type: t.type,
    amount: t.amount,
    note: t.note || '',
  }));
  return JSON.stringify({ exported_at: new Date().toISOString(), count: data.length, transactions: data }, null, 2);
};

// ── PDF (HTML→print window) ──────────────────────────────────────────────────
const toPDF = (transactions) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const rows = transactions.map((t) => `
    <tr>
      <td>${new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
      <td>${t.title}</td>
      <td>${t.category}</td>
      <td><span class="badge badge--${t.type}">${t.type}</span></td>
      <td class="amount amount--${t.type}">${t.type === 'income' ? '+' : '-'}${formatINR(t.amount)}</td>
      <td class="note">${t.note || '—'}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>MoneyMap — Transaction Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #111; background: #fff; padding: 32px; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; border-bottom: 2px solid #00C896; padding-bottom: 16px; }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-box { width: 36px; height: 36px; background: #00C896; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .logo-box svg { display: block; }
    .logo-name { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; }
    .meta { text-align: right; font-size: 12px; color: #666; }
    .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
    .summary-card { border: 1px solid #eee; border-radius: 12px; padding: 14px 18px; }
    .summary-card__label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #888; margin-bottom: 6px; }
    .summary-card__value { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
    .summary-card__value--income { color: #00C896; }
    .summary-card__value--expense { color: #FF4757; }
    .summary-card__value--balance { color: ${balance >= 0 ? '#00C896' : '#FF4757'}; }
    h2 { font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #111; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #f8f8f6; }
    th { padding: 10px 12px; text-align: left; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; border-bottom: 1px solid #eee; }
    td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
    .badge--income { background: #00C89618; color: #00C896; }
    .badge--expense { background: #FF475718; color: #FF4757; }
    .amount { font-weight: 700; }
    .amount--income { color: #00C896; }
    .amount--expense { color: #FF4757; }
    .note { color: #888; font-size: 12px; }
    .footer { margin-top: 24px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #eee; padding-top: 16px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <div class="logo-box">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
          <path d="M4 20L14 4L24 20H4Z" fill="#0D0D0D" opacity="0.9"/>
          <circle cx="14" cy="20" r="4" fill="#0D0D0D"/>
        </svg>
      </div>
      <span class="logo-name">MoneyMap</span>
    </div>
    <div class="meta">
      <div><strong>Transaction Report</strong></div>
      <div>Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      <div>${transactions.length} transactions</div>
    </div>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="summary-card__label">Total Income</div>
      <div class="summary-card__value summary-card__value--income">${formatINR(totalIncome)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card__label">Total Expenses</div>
      <div class="summary-card__value summary-card__value--expense">${formatINR(totalExpenses)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card__label">Net Balance</div>
      <div class="summary-card__value summary-card__value--balance">${formatINR(balance)}</div>
    </div>
  </div>

  <h2>Transactions (${transactions.length})</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th><th>Title</th><th>Category</th><th>Type</th><th>Amount</th><th>Note</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="footer">MoneyMap Finance Dashboard &nbsp;·&nbsp; Export generated on ${new Date().toLocaleString('en-IN')}</div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
};

// ── Trigger download ─────────────────────────────────────────────────────────
const triggerDownload = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const getFilename = (ext) => {
  const date = new Date().toISOString().slice(0, 10);
  return `moneymap-transactions-${date}.${ext}`;
};

export const downloadTransactions = (transactions, format) => {
  if (transactions.length === 0) {
    alert('No transactions to export.');
    return;
  }
  if (format === 'csv') {
    triggerDownload(toCSV(transactions), getFilename('csv'), 'text/csv;charset=utf-8;');
  } else if (format === 'json') {
    triggerDownload(toJSON(transactions), getFilename('json'), 'application/json');
  } else if (format === 'pdf') {
    toPDF(transactions);
  }
};
