import React, { useState } from 'react';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { useStore } from '@/store/useStore';
import './TransactionForm.css';

const CATEGORIES = [
  'Food & Dining','Shopping','Transport','Entertainment','Health',
  'Housing','Utilities','Travel','Investment','Salary','Freelance','Other',
];

export const TransactionForm = ({ isOpen, onClose, editTxn }) => {
  const { addTransaction, updateTransaction } = useStore();
  const isEdit = !!editTxn;

  const [form, setForm] = useState({
    title: editTxn?.title || '',
    amount: editTxn?.amount?.toString() || '',
    type: editTxn?.type || 'expense',
    category: editTxn?.category || 'Food & Dining',
    date: editTxn?.date ? editTxn.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    note: editTxn?.note || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: new Date(form.date).toISOString(),
      note: form.note.trim(),
    };
    if (isEdit && editTxn) {
      updateTransaction(editTxn.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Transaction' : 'Add Transaction'}>
      <div className="txn-form">
        <div className="txn-form__type-toggle">
          <button
            className={`type-btn ${form.type === 'expense' ? 'type-btn--expense active' : ''}`}
            onClick={() => setField('type', 'expense')}
          >↓ Expense</button>
          <button
            className={`type-btn ${form.type === 'income' ? 'type-btn--income active' : ''}`}
            onClick={() => setField('type', 'income')}
          >↑ Income</button>
        </div>

        <div className="txn-form__grid">
          <div className="txn-form__field">
            <label className="txn-form__label">Title *</label>
            <input
              className={`txn-form__input ${errors.title ? 'txn-form__input--error' : ''}`}
              placeholder="e.g. Grocery, Salary..."
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />
            {errors.title && <span className="txn-form__error">{errors.title}</span>}
          </div>
          <div className="txn-form__field">
            <label className="txn-form__label">Amount (₹) *</label>
            <input
              className={`txn-form__input ${errors.amount ? 'txn-form__input--error' : ''}`}
              type="number" placeholder="0.00" value={form.amount}
              onChange={(e) => setField('amount', e.target.value)} min="0" step="0.01"
            />
            {errors.amount && <span className="txn-form__error">{errors.amount}</span>}
          </div>
          <div className="txn-form__field">
            <label className="txn-form__label">Category</label>
            <select className="txn-form__input txn-form__select" value={form.category} onChange={(e) => setField('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="txn-form__field">
            <label className="txn-form__label">Date *</label>
            <input
              className={`txn-form__input ${errors.date ? 'txn-form__input--error' : ''}`}
              type="date" value={form.date} onChange={(e) => setField('date', e.target.value)}
            />
            {errors.date && <span className="txn-form__error">{errors.date}</span>}
          </div>
        </div>

        <div className="txn-form__field">
          <label className="txn-form__label">Note (optional)</label>
          <input
            className="txn-form__input" placeholder="Add a note..."
            value={form.note} onChange={(e) => setField('note', e.target.value)}
          />
        </div>

        <div className="txn-form__actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{isEdit ? 'Update' : 'Add Transaction'}</Button>
        </div>
      </div>
    </Modal>
  );
};
