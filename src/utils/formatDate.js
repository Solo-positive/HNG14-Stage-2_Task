import { format, addDays } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return format(date, 'dd MMM yyyy');
}

export function calcDueDate(invoiceDate, paymentTerms) {
  if (!invoiceDate) return '';
  const days = parseInt(paymentTerms) || 0;
  const due = addDays(new Date(invoiceDate), days);
  return due.toISOString().split('T')[0];
}
