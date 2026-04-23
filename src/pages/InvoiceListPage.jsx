import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import InvoiceForm from '../components/InvoiceForm';
import { formatDate, formatCurrency } from '../utils/index';
import './InvoiceListPage.css';

const STATUS_FILTERS = ['all', 'draft', 'pending', 'paid'];

export default function InvoiceListPage() {
  const { invoices } = useInvoices();
  const [filter, setFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const filterRef = useRef(null);

  /* Close filter dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered =
    filter === 'all' ? invoices : invoices.filter((inv) => inv.status === filter);

  const countText =
    filtered.length === 0
      ? 'No invoices'
      : `There are ${filtered.length} total invoice${filtered.length !== 1 ? 's' : ''}`;

  return (
    <>
      <main className="page-container" id="main-content">
        {/* Header */}
        <header className="list-header">
          <div className="list-header__left">
            <h1 className="list-header__title">Invoices</h1>
            <p className="list-header__count" aria-live="polite">{countText}</p>
          </div>

          <div className="list-header__controls">
            {/* Filter */}
            <div className="filter-dropdown" ref={filterRef}>
              <button
                className="filter-dropdown__trigger"
                onClick={() => setFilterOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={filterOpen}
                id="filter-trigger-btn"
              >
                <span>Filter{window.innerWidth > 600 ? ' by status' : ''}</span>
                <svg
                  className={`filter-dropdown__chevron ${filterOpen ? 'filter-dropdown__chevron--open' : ''}`}
                  width="11" height="7" viewBox="0 0 11 7" fill="none"
                >
                  <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {filterOpen && (
                <ul className="filter-dropdown__menu" role="listbox" aria-label="Filter by status">
                  {STATUS_FILTERS.map((s) => (
                    <li key={s} role="option" aria-selected={filter === s}>
                      <label className="filter-option" htmlFor={`filter-${s}`}>
                        <input
                          type="checkbox"
                          id={`filter-${s}`}
                          checked={filter === s}
                          onChange={() => { setFilter(s); setFilterOpen(false); }}
                          className="filter-option__checkbox"
                        />
                        <span className="filter-option__check" aria-hidden="true" />
                        <span className="filter-option__label">
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* New Invoice Button */}
            <button
              className="btn btn--new-invoice"
              onClick={() => setFormOpen(true)}
              id="new-invoice-btn"
            >
              <span className="btn--new-invoice__icon" aria-hidden="true">
                <svg width="11" height="11" viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.313 10.023v-4.71h4.71V3.78h-4.71V.047H4.78V3.78H.047v1.534H4.78v4.709z" fill="currentColor"/>
                </svg>
              </span>
              <span>New Invoice</span>
            </button>
          </div>
        </header>

        {/* Invoice List */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="invoice-list" aria-label="Invoice list">
            {filtered.map((inv) => (
              <li key={inv.id} className="invoice-list__item" style={{ animationDelay: `${filtered.indexOf(inv) * 0.04}s` }}>
                <Link to={`/invoice/${inv.id}`} className="invoice-card" id={`invoice-card-${inv.id}`}>
                  <span className="invoice-card__id">
                    <span className="invoice-card__hash" aria-hidden="true">#</span>
                    {inv.id}
                  </span>
                  <span className="invoice-card__due">
                    Due {formatDate(inv.paymentDue)}
                  </span>
                  <span className="invoice-card__client">{inv.clientName}</span>
                  <span className="invoice-card__amount">{formatCurrency(inv.total)}</span>
                  <StatusBadge status={inv.status} />
                  <span className="invoice-card__arrow" aria-hidden="true">
                    <svg width="7" height="10" viewBox="0 0 7 10" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <InvoiceForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}

function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <svg className="empty-state__img" viewBox="0 0 241 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="120.5" cy="176" rx="120.5" ry="24" fill="#7c5dfa" fillOpacity="0.07"/>
        <path d="M86.333 19h68.334C163.4 19 170 25.6 170 33.667v132.666C170 174.4 163.4 181 155.333 181H85.667C77.6 181 71 174.4 71 166.333V33.667C71 25.6 77.6 19 85.667 19h.666z" fill="#9277ff" fillOpacity="0.15"/>
        <rect x="85" y="55" width="71" height="6" rx="3" fill="#7c5dfa" fillOpacity="0.4"/>
        <rect x="85" y="72" width="55" height="6" rx="3" fill="#7c5dfa" fillOpacity="0.25"/>
        <rect x="85" y="99" width="71" height="6" rx="3" fill="#7c5dfa" fillOpacity="0.4"/>
        <rect x="85" y="116" width="55" height="6" rx="3" fill="#7c5dfa" fillOpacity="0.25"/>
        <rect x="85" y="143" width="71" height="6" rx="3" fill="#7c5dfa" fillOpacity="0.4"/>
        <rect x="85" y="160" width="38" height="6" rx="3" fill="#7c5dfa" fillOpacity="0.25"/>
        <circle cx="121" cy="33" r="14" fill="#7c5dfa"/>
        <path d="M115 33h12M121 27v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      <h2 className="empty-state__title">There is nothing here</h2>
      <p className="empty-state__body">
        Create an invoice by clicking the{' '}
        <strong>New Invoice</strong> button and get started
      </p>
    </div>
  );
}
