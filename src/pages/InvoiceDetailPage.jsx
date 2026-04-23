import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';
import InvoiceForm from '../components/InvoiceForm';
import { formatDate, formatCurrency } from '../utils/index';
import './InvoiceDetailPage.css';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, deleteInvoice, markAsPaid } = useInvoices();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const invoice = getInvoice(id);

  if (!invoice) {
    return (
      <main className="page-container detail-not-found">
        <button className="btn-back" onClick={() => navigate('/')} id="back-btn-notfound">
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/></svg>
          Go back
        </button>
        <p className="detail-not-found__msg">Invoice not found.</p>
      </main>
    );
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    navigate('/');
  };

  return (
    <>
      <main className="page-container" id="main-content">
        {/* Back */}
        <button className="btn-back" onClick={() => navigate('/')} id="detail-back-btn">
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
            <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Go back
        </button>

        {/* Status Bar */}
        <section className="detail-status-bar" aria-label="Invoice actions">
          <div className="detail-status-bar__left">
            <span className="detail-status-bar__label">Status</span>
            <StatusBadge status={invoice.status} />
          </div>
          <div className="detail-status-bar__actions">
            {invoice.status !== 'paid' && (
              <button
                className="btn btn--secondary"
                onClick={() => setEditOpen(true)}
                id="edit-invoice-btn"
              >
                Edit
              </button>
            )}
            <button
              className="btn btn--danger"
              onClick={() => setShowDeleteModal(true)}
              id="delete-invoice-btn"
            >
              Delete
            </button>
            {invoice.status === 'pending' && (
              <button
                className="btn btn--primary"
                onClick={() => markAsPaid(invoice.id)}
                id="mark-paid-btn"
              >
                Mark as Paid
              </button>
            )}
            {invoice.status === 'draft' && (
              <button
                className="btn btn--primary"
                onClick={() => markAsPaid(invoice.id)}
                id="mark-paid-btn-draft"
              >
                Mark as Paid
              </button>
            )}
          </div>
        </section>

        {/* Invoice Card */}
        <article className="detail-card" aria-label={`Invoice #${invoice.id}`}>
          {/* Meta */}
          <div className="detail-meta">
            <div className="detail-meta__left">
              <p className="detail-id">
                <span className="detail-id__hash" aria-hidden="true">#</span>
                {invoice.id}
              </p>
              <p className="detail-description">{invoice.description}</p>
            </div>
            <address className="detail-sender-address">
              <span>{invoice.senderStreet}</span>
              <span>{invoice.senderCity}</span>
              <span>{invoice.senderPostCode}</span>
              <span>{invoice.senderCountry}</span>
            </address>
          </div>

          {/* Date / Client info grid */}
          <div className="detail-info-grid">
            <div className="detail-info-cell">
              <p className="detail-info-label">Invoice Date</p>
              <p className="detail-info-value">{formatDate(invoice.invoiceDate)}</p>
            </div>
            <div className="detail-info-cell">
              <p className="detail-info-label">Bill To</p>
              <p className="detail-info-value">{invoice.clientName}</p>
              <address className="detail-client-address">
                <span>{invoice.clientStreet}</span>
                <span>{invoice.clientCity}</span>
                <span>{invoice.clientPostCode}</span>
                <span>{invoice.clientCountry}</span>
              </address>
            </div>
            <div className="detail-info-cell">
              <p className="detail-info-label">Payment Due</p>
              <p className="detail-info-value">{formatDate(invoice.paymentDue)}</p>
            </div>
            <div className="detail-info-cell detail-info-cell--email">
              <p className="detail-info-label">Sent to</p>
              <p className="detail-info-value">{invoice.clientEmail}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="detail-items">
            <div className="detail-items__header" aria-hidden="true">
              <span>Item Name</span>
              <span>QTY.</span>
              <span>Price</span>
              <span>Total</span>
            </div>
            <ul className="detail-items__list" aria-label="Invoice items">
              {invoice.items?.map((item, i) => (
                <li key={i} className="detail-item">
                  <span className="detail-item__name">{item.name}</span>
                  <span className="detail-item__qty">
                    {item.quantity} <span className="detail-item__x" aria-hidden="true">×</span>{' '}
                    <span className="detail-item__unit-price">{formatCurrency(item.price)}</span>
                  </span>
                  <span className="detail-item__price">{formatCurrency(item.price)}</span>
                  <span className="detail-item__total">{formatCurrency(item.quantity * item.price)}</span>
                </li>
              ))}
            </ul>

            {/* Amount Due */}
            <div className="detail-total">
              <span>Amount Due</span>
              <span className="detail-total__amount">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </article>

        {/* Mobile action bar */}
        <div className="detail-mobile-actions" role="group" aria-label="Invoice actions">
          {invoice.status !== 'paid' && (
            <button className="btn btn--secondary" onClick={() => setEditOpen(true)} id="edit-invoice-mobile-btn">
              Edit
            </button>
          )}
          <button className="btn btn--danger" onClick={() => setShowDeleteModal(true)} id="delete-invoice-mobile-btn">
            Delete
          </button>
          {(invoice.status === 'pending' || invoice.status === 'draft') && (
            <button className="btn btn--primary" onClick={() => markAsPaid(invoice.id)} id="mark-paid-mobile-btn">
              Mark as Paid
            </button>
          )}
        </div>
      </main>

      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <InvoiceForm
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        editInvoice={invoice}
      />
    </>
  );
}
