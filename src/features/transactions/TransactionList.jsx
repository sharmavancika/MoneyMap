import React, { useMemo, useState } from 'react';
import { Search, SortAsc, SortDesc, Pencil, Trash2, Plus, Download, ChevronDown, Filter } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { applyFilters, formatINR } from '@/core/use-cases/calculations';
import { CATEGORY_COLORS } from '@/core/domain/mockData';
import { TransactionForm } from './TransactionForm';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { downloadTransactions } from '@/core/use-cases/downloadUtils';
import './TransactionList.css';

const CATEGORY_EMOJI = {
  'Food & Dining': '🍽️', 'Shopping': '🛍️', 'Transport': '🚗',
  'Entertainment': '🎬', 'Health': '💊', 'Housing': '🏠',
  'Utilities': '💡', 'Travel': '✈️', 'Investment': '📈',
  'Salary': '💰', 'Freelance': '💼', 'Other': '📦',
};

const CATEGORIES = [
  'All','Food & Dining','Shopping','Transport','Entertainment',
  'Health','Housing','Utilities','Travel','Investment','Salary','Freelance','Other',
];

export const TransactionList = () => {
  const { transactions, filters, setFilter, resetFilters, currentUser, deleteTransaction } = useStore();
  const isAdmin = currentUser.role === 'admin';

  const [formOpen, setFormOpen] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('csv');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const filtered = useMemo(() => applyFilters(transactions, filters), [transactions, filters]);

  const handleEdit = (txn) => { setEditTxn(txn); setFormOpen(true); };
  const handleDelete = (id) => { if (window.confirm('Delete this transaction?')) deleteTransaction(id); };
  const handleFormClose = () => { setFormOpen(false); setEditTxn(null); };
  const handleDownload = (format) => { downloadTransactions(filtered, format); setShowDownloadMenu(false); };
  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const hasActiveFilters = filters.search || filters.type !== 'All' || filters.category !== 'All' || filters.dateRange !== 'all';

  return (
    <div className="txn-page">
      <div className="txn-page__header">
        <div>
          <h2 className="txn-page__title">Transactions</h2>
          <p className="txn-page__count">{filtered.length} records</p>
        </div>
        <div className="txn-page__actions">
          {/* Filter toggle on mobile */}
          <button
            className={`filter-toggle-btn ${showFilterPanel ? 'filter-toggle-btn--active' : ''} ${hasActiveFilters ? 'filter-toggle-btn--has-filters' : ''}`}
            onClick={() => setShowFilterPanel(v => !v)}
            title="Filters"
          >
            <Filter size={15} />
            {hasActiveFilters && <span className="filter-badge" />}
          </button>

          <div className="download-wrap">
            <button className="download-btn" onClick={() => setShowDownloadMenu((v) => !v)} title="Download transactions">
              <Download size={16} />
              <span>Export</span>
            </button>
            {showDownloadMenu && (
              <div className="download-menu animate-fadeInDown">
                <p className="download-menu__title">Download as</p>
                <button className="download-menu__item" onClick={() => handleDownload('csv')}>
                  <span className="download-menu__icon">📄</span> CSV File
                  <span className="download-menu__badge">Spreadsheet</span>
                </button>
                <button className="download-menu__item" onClick={() => handleDownload('json')}>
                  <span className="download-menu__icon">📦</span> JSON File
                  <span className="download-menu__badge">Raw Data</span>
                </button>
                <button className="download-menu__item" onClick={() => handleDownload('pdf')}>
                  <span className="download-menu__icon">📋</span> PDF Report
                  <span className="download-menu__badge">Print-ready</span>
                </button>
              </div>
            )}
          </div>

          {isAdmin && (
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => { setEditTxn(null); setFormOpen(true); }}>
              Add
            </Button>
          )}
        </div>
      </div>

      {/* Filters — collapsible on mobile */}
      <Card padding="sm" className={`txn-filters animate-fadeInDown ${showFilterPanel ? 'txn-filters--open' : ''}`}>
        <div className="txn-filters__row">
          <div className="txn-filters__search">
            <Search size={15} className="txn-filters__search-icon" />
            <input
              className="txn-filters__search-input"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
            />
          </div>
          <div className="txn-filters__controls">
            <select className="txn-filter-select" value={filters.type} onChange={(e) => setFilter('type', e.target.value)}>
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select className="txn-filter-select" value={filters.dateRange} onChange={(e) => setFilter('dateRange', e.target.value)}>
              <option value="all">All Time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last Year</option>
            </select>
            <select className="txn-filter-select" value={filters.sortBy} onChange={(e) => setFilter('sortBy', e.target.value)}>
              <option value="date">Sort: Date</option>
              <option value="amount">Sort: Amount</option>
              <option value="category">Sort: Category</option>
            </select>
            <button className="txn-sort-btn" onClick={() => setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')} aria-label="Toggle sort order">
              {filters.sortOrder === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
            </button>
            {hasActiveFilters && (
              <button className="txn-reset-btn" onClick={resetFilters}>Clear</button>
            )}
          </div>
        </div>
        <div className="txn-category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${filters.category === cat ? 'cat-pill--active' : ''}`}
              onClick={() => setFilter('category', cat)}
              style={filters.category === cat && cat !== 'All' ? {
                background: `${CATEGORY_COLORS[cat]}22`,
                color: CATEGORY_COLORS[cat],
                borderColor: CATEGORY_COLORS[cat],
              } : {}}
            >
              {cat !== 'All' && <span className="cat-pill__emoji">{CATEGORY_EMOJI[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Transaction List */}
      <Card padding="sm" className="txn-list-card">
        {filtered.length === 0 ? (
          <div className="txn-empty animate-fadeIn">
            <div className="txn-empty__icon">🔍</div>
            <h4 className="txn-empty__title">No transactions found</h4>
            <p className="txn-empty__sub">Try adjusting your filters or add a new transaction.</p>
            {isAdmin && (
              <Button variant="primary" icon={<Plus size={15} />} onClick={() => setFormOpen(true)} size="sm">
                Add Transaction
              </Button>
            )}
          </div>
        ) : (
          <div className="txn-list">
            {/* Desktop header */}
            <div className="txn-list__header">
              <span>Title</span>
              <span className="hide-mobile">Category</span>
              <span className="hide-mobile">Date</span>
              <span>Amount</span>
              {isAdmin && <span>Actions</span>}
            </div>

            {filtered.map((txn, i) => {
              const isExpanded = expandedId === txn.id;
              const color = CATEGORY_COLORS[txn.category] || '#6B7280';
              const emoji = CATEGORY_EMOJI[txn.category] || '📦';

              return (
                <div key={txn.id} className={`txn-row-wrap ${isExpanded ? 'txn-row-wrap--expanded' : ''}`} style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                  {/* Main row — clickable on mobile to expand */}
                  <div
                    className="txn-row animate-fadeInUp"
                    onClick={() => toggleExpand(txn.id)}
                  >
                    <div className="txn-row__main">
                      <div className="txn-row__icon" style={{ background: `${color}20`, color }}>
                        <span className="txn-row__icon-emoji">{emoji}</span>
                        <span className="txn-row__icon-letter">{txn.category.charAt(0)}</span>
                      </div>
                      <div className="txn-row__info">
                        <span className="txn-row__title">{txn.title}</span>
                        <span className="txn-row__note show-mobile">{txn.category} · {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        {txn.note && <span className="txn-row__note hide-mobile">{txn.note}</span>}
                      </div>
                    </div>
                    <span className="txn-row__cat hide-mobile">{txn.category}</span>
                    <span className="txn-row__date hide-mobile">
                      {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                    <span className={`txn-row__amount txn-row__amount--${txn.type}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatINR(txn.amount)}
                    </span>
                    {/* Desktop actions */}
                    {isAdmin && (
                      <div className="txn-row__actions hide-mobile" onClick={e => e.stopPropagation()}>
                        <button className="txn-action-btn txn-action-btn--edit" onClick={() => handleEdit(txn)}><Pencil size={14} /></button>
                        <button className="txn-action-btn txn-action-btn--delete" onClick={() => handleDelete(txn.id)}><Trash2 size={14} /></button>
                      </div>
                    )}
                    {/* Mobile expand arrow */}
                    <ChevronDown size={16} className={`txn-row__chevron show-mobile ${isExpanded ? 'txn-row__chevron--open' : ''}`} />
                  </div>

                  {/* Expanded detail panel — mobile only */}
                  {isExpanded && (
                    <div className="txn-row__expand show-mobile animate-fadeInUp">
                      <div className="txn-expand__detail">
                        <span className="txn-expand__label">Date</span>
                        <span className="txn-expand__value">{new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="txn-expand__detail">
                        <span className="txn-expand__label">Category</span>
                        <span className="txn-expand__value" style={{ color }}>{emoji} {txn.category}</span>
                      </div>
                      <div className="txn-expand__detail">
                        <span className="txn-expand__label">Type</span>
                        <span className={`txn-expand__value txn-expand__type txn-expand__type--${txn.type}`}>{txn.type}</span>
                      </div>
                      {txn.note && (
                        <div className="txn-expand__detail">
                          <span className="txn-expand__label">Note</span>
                          <span className="txn-expand__value">{txn.note}</span>
                        </div>
                      )}
                      {isAdmin && (
                        <div className="txn-expand__actions">
                          <button className="txn-expand-btn txn-expand-btn--edit" onClick={(e) => { e.stopPropagation(); handleEdit(txn); }}>
                            <Pencil size={14} /> Edit
                          </button>
                          <button className="txn-expand-btn txn-expand-btn--delete" onClick={(e) => { e.stopPropagation(); handleDelete(txn.id); }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <TransactionForm isOpen={formOpen} onClose={handleFormClose} editTxn={editTxn} />
      {showDownloadMenu && <div className="download-overlay" onClick={() => setShowDownloadMenu(false)} />}
    </div>
  );
};
