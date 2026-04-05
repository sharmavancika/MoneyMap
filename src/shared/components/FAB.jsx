import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TransactionForm } from '@/features/transactions/TransactionForm';
import './FAB.css';

export const FAB = () => {
  const { currentUser, activeNav } = useStore();
  const isAdmin = currentUser.role === 'admin';
  const [formOpen, setFormOpen] = useState(false);

  if (!isAdmin || activeNav === 'transactions') return null;

  return (
    <>
      <button
        className="fab animate-bounceIn tap-feedback"
        onClick={() => setFormOpen(true)}
        aria-label="Add transaction"
      >
        <Plus size={22} />
      </button>
      <TransactionForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
};
