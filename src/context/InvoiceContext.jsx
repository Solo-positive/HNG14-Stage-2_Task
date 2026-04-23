import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/generateId';
import { calcDueDate } from '../utils/formatDate';

const InvoiceContext = createContext(null);

const STORAGE_KEY = 'invoice-app-data';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

function saveToStorage(invoices) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch (_) {}
}

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(loadFromStorage);

  useEffect(() => {
    saveToStorage(invoices);
  }, [invoices]);

  const createInvoice = useCallback((data, status = 'pending') => {
    const invoice = {
      id: generateId(),
      status,
      createdAt: new Date().toISOString(),
      ...data,
      paymentDue: calcDueDate(data.invoiceDate, data.paymentTerms),
      total: data.items?.reduce((sum, it) => sum + it.quantity * it.price, 0) || 0,
    };
    setInvoices((prev) => [invoice, ...prev]);
    return invoice;
  }, []);

  const updateInvoice = useCallback((id, data) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              ...data,
              paymentDue: calcDueDate(data.invoiceDate ?? inv.invoiceDate, data.paymentTerms ?? inv.paymentTerms),
              total: (data.items ?? inv.items)?.reduce((sum, it) => sum + it.quantity * it.price, 0) || 0,
            }
          : inv
      )
    );
  }, []);

  const deleteInvoice = useCallback((id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  const markAsPaid = useCallback((id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    );
  }, []);

  const getInvoice = useCallback(
    (id) => invoices.find((inv) => inv.id === id),
    [invoices]
  );

  return (
    <InvoiceContext.Provider
      value={{ invoices, createInvoice, updateInvoice, deleteInvoice, markAsPaid, getInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  return useContext(InvoiceContext);
}
