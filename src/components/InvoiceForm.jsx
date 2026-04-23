import { useState, useEffect, useRef } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { validateInvoice } from '../utils/validateInvoice';
import './InvoiceForm.css';

const EMPTY_ITEM = { name: '', quantity: 1, price: 0 };
const PAYMENT_OPTIONS = [1, 7, 14, 30];

const defaultForm = {
  senderStreet: '',  senderCity: '',  senderPostCode: '',  senderCountry: '',
  clientName: '',    clientEmail: '', clientStreet: '',    clientCity: '',
  clientPostCode: '', clientCountry: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  paymentTerms: '30',
  description: '',
  items: [{ ...EMPTY_ITEM }],
};

export default function InvoiceForm({ isOpen, onClose, editInvoice }) {
  const { createInvoice, updateInvoice } = useInvoices();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const firstFieldRef = useRef(null);

  const isEditing = !!editInvoice;

  /* Populate form when editing */
  useEffect(() => {
    if (isOpen) {
      if (editInvoice) {
        setForm({
          senderStreet:  editInvoice.senderStreet  || '',
          senderCity:    editInvoice.senderCity    || '',
          senderPostCode:editInvoice.senderPostCode|| '',
          senderCountry: editInvoice.senderCountry || '',
          clientName:    editInvoice.clientName    || '',
          clientEmail:   editInvoice.clientEmail   || '',
          clientStreet:  editInvoice.clientStreet  || '',
          clientCity:    editInvoice.clientCity    || '',
          clientPostCode:editInvoice.clientPostCode|| '',
          clientCountry: editInvoice.clientCountry || '',
          invoiceDate:   editInvoice.invoiceDate   || defaultForm.invoiceDate,
          paymentTerms:  String(editInvoice.paymentTerms || '30'),
          description:   editInvoice.description   || '',
          items:         editInvoice.items?.length ? editInvoice.items : [{ ...EMPTY_ITEM }],
        });
      } else {
        setForm(defaultForm);
      }
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 100);
    }
  }, [isOpen, editInvoice]);

  /* Close on ESC */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setItem = (index, field) => (e) => {
    const value = field === 'name' ? e.target.value : parseFloat(e.target.value) || 0;
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () =>
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] }));

  const removeItem = (i) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const handleSubmit = (status) => {
    if (status === 'draft') {
      if (isEditing) {
        updateInvoice(editInvoice.id, { ...form, status: 'draft' });
      } else {
        createInvoice(form, 'draft');
      }
      onClose();
      return;
    }

    const errs = validateInvoice(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isEditing) {
      updateInvoice(editInvoice.id, { ...form, status: editInvoice.status });
    } else {
      createInvoice(form, 'pending');
    }
    onClose();
  };

  const itemErrors = errors.itemDetails || [];
  const total = form.items.reduce((sum, it) => sum + (it.quantity * it.price || 0), 0);

  return (
    <>
      {isOpen && (
        <div className="form-overlay" aria-hidden="true" onClick={onClose} />
      )}
      <div
        className={`invoice-form-drawer ${isOpen ? 'invoice-form-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? `Edit Invoice #${editInvoice?.id}` : 'New Invoice'}
      >
        <div className="invoice-form-drawer__inner">
          <h2 className="form-title">
            {isEditing ? <><span className="form-title__hash">#</span>{editInvoice?.id}</> : 'New Invoice'}
            {isEditing && <span className="form-title__prefix">Edit </span>}
          </h2>

          <div className="form-scroll">
            {/* Bill From */}
            <fieldset className="form-section">
              <legend className="form-section__label">Bill From</legend>
              <div className="form-group">
                <label htmlFor="senderStreet">Street Address</label>
                <input id="senderStreet" ref={firstFieldRef} type="text" value={form.senderStreet}
                  onChange={set('senderStreet')} className={errors.senderStreet ? 'input--error' : ''} />
                {errors.senderStreet && <span className="error-msg" role="alert">{errors.senderStreet}</span>}
              </div>
              <div className="form-row form-row--3">
                <div className="form-group">
                  <label htmlFor="senderCity">City</label>
                  <input id="senderCity" type="text" value={form.senderCity}
                    onChange={set('senderCity')} className={errors.senderCity ? 'input--error' : ''} />
                  {errors.senderCity && <span className="error-msg" role="alert">{errors.senderCity}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="senderPostCode">Post Code</label>
                  <input id="senderPostCode" type="text" value={form.senderPostCode}
                    onChange={set('senderPostCode')} className={errors.senderPostCode ? 'input--error' : ''} />
                  {errors.senderPostCode && <span className="error-msg" role="alert">{errors.senderPostCode}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="senderCountry">Country</label>
                  <input id="senderCountry" type="text" value={form.senderCountry}
                    onChange={set('senderCountry')} className={errors.senderCountry ? 'input--error' : ''} />
                  {errors.senderCountry && <span className="error-msg" role="alert">{errors.senderCountry}</span>}
                </div>
              </div>
            </fieldset>

            {/* Bill To */}
            <fieldset className="form-section">
              <legend className="form-section__label">Bill To</legend>
              <div className="form-group">
                <label htmlFor="clientName">Client's Name</label>
                <input id="clientName" type="text" value={form.clientName}
                  onChange={set('clientName')} className={errors.clientName ? 'input--error' : ''} />
                {errors.clientName && <span className="error-msg" role="alert">{errors.clientName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="clientEmail">Client's Email</label>
                <input id="clientEmail" type="email" value={form.clientEmail}
                  onChange={set('clientEmail')} placeholder="e.g. email@example.com"
                  className={errors.clientEmail ? 'input--error' : ''} />
                {errors.clientEmail && <span className="error-msg" role="alert">{errors.clientEmail}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="clientStreet">Street Address</label>
                <input id="clientStreet" type="text" value={form.clientStreet}
                  onChange={set('clientStreet')} className={errors.clientStreet ? 'input--error' : ''} />
                {errors.clientStreet && <span className="error-msg" role="alert">{errors.clientStreet}</span>}
              </div>
              <div className="form-row form-row--3">
                <div className="form-group">
                  <label htmlFor="clientCity">City</label>
                  <input id="clientCity" type="text" value={form.clientCity}
                    onChange={set('clientCity')} className={errors.clientCity ? 'input--error' : ''} />
                  {errors.clientCity && <span className="error-msg" role="alert">{errors.clientCity}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="clientPostCode">Post Code</label>
                  <input id="clientPostCode" type="text" value={form.clientPostCode}
                    onChange={set('clientPostCode')} className={errors.clientPostCode ? 'input--error' : ''} />
                  {errors.clientPostCode && <span className="error-msg" role="alert">{errors.clientPostCode}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="clientCountry">Country</label>
                  <input id="clientCountry" type="text" value={form.clientCountry}
                    onChange={set('clientCountry')} className={errors.clientCountry ? 'input--error' : ''} />
                  {errors.clientCountry && <span className="error-msg" role="alert">{errors.clientCountry}</span>}
                </div>
              </div>
            </fieldset>

            {/* Date & Terms */}
            <div className="form-row form-row--2">
              <div className="form-group">
                <label htmlFor="invoiceDate">Invoice Date</label>
                <input id="invoiceDate" type="date" value={form.invoiceDate}
                  onChange={set('invoiceDate')} disabled={isEditing}
                  className={errors.invoiceDate ? 'input--error' : ''} />
                {errors.invoiceDate && <span className="error-msg" role="alert">{errors.invoiceDate}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="paymentTerms">Payment Terms</label>
                <select id="paymentTerms" value={form.paymentTerms} onChange={set('paymentTerms')}
                  className={errors.paymentTerms ? 'input--error' : ''}>
                  {PAYMENT_OPTIONS.map((d) => (
                    <option key={d} value={String(d)}>Net {d} {d === 1 ? 'Day' : 'Days'}</option>
                  ))}
                </select>
                {errors.paymentTerms && <span className="error-msg" role="alert">{errors.paymentTerms}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Project Description</label>
              <input id="description" type="text" value={form.description}
                onChange={set('description')} placeholder="e.g. Graphic Design"
                className={errors.description ? 'input--error' : ''} />
              {errors.description && <span className="error-msg" role="alert">{errors.description}</span>}
            </div>

            {/* Item List */}
            <div className="form-section">
              <h3 className="item-list-title">Item List</h3>
              {errors.items && (
                <p className="error-msg" role="alert">{errors.items}</p>
              )}
              <div className="item-list-header" aria-hidden="true">
                <span>Item Name</span>
                <span>Qty.</span>
                <span>Price</span>
                <span>Total</span>
                <span></span>
              </div>
              {form.items.map((item, i) => (
                <div key={i} className="item-row">
                  <div className="form-group item-row__name">
                    <label htmlFor={`item-name-${i}`} className="sr-only">Item {i + 1} name</label>
                    <input id={`item-name-${i}`} type="text" value={item.name}
                      onChange={setItem(i, 'name')} placeholder="Item name"
                      className={itemErrors[i]?.name ? 'input--error' : ''} />
                    {itemErrors[i]?.name && <span className="error-msg" role="alert">{itemErrors[i].name}</span>}
                  </div>
                  <div className="form-group item-row__qty">
                    <label htmlFor={`item-qty-${i}`} className="sr-only">Quantity</label>
                    <input id={`item-qty-${i}`} type="number" min="1" value={item.quantity}
                      onChange={setItem(i, 'quantity')}
                      className={itemErrors[i]?.quantity ? 'input--error' : ''} />
                  </div>
                  <div className="form-group item-row__price">
                    <label htmlFor={`item-price-${i}`} className="sr-only">Price</label>
                    <input id={`item-price-${i}`} type="number" min="0" step="0.01" value={item.price}
                      onChange={setItem(i, 'price')}
                      className={itemErrors[i]?.price ? 'input--error' : ''} />
                  </div>
                  <div className="item-row__total" aria-label={`Total for item ${i + 1}`}>
                    {(item.quantity * item.price || 0).toFixed(2)}
                  </div>
                  <button
                    type="button"
                    className="item-row__delete"
                    onClick={() => removeItem(i)}
                    aria-label={`Remove item ${i + 1}`}
                  >
                    <svg width="13" height="16" viewBox="0 0 13 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.194A1.778 1.778 0 01.417 14.222V3.556h11.166zM8.473 0l.888.889H13v1.778H0V.889h3.640L4.527 0h3.946z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn--ghost btn--full" onClick={addItem} id="add-item-btn">
                + Add New Item
              </button>
            </div>

            {/* Grand Total */}
            <div className="form-grand-total">
              <span>Amount Due</span>
              <span className="form-grand-total__amount">£ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="form-footer">
            {isEditing ? (
              <>
                <button type="button" className="btn btn--secondary" onClick={onClose} id="form-cancel-btn">
                  Cancel
                </button>
                <button type="button" className="btn btn--primary" onClick={() => handleSubmit('pending')} id="form-save-changes-btn">
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn--secondary" onClick={onClose} id="form-discard-btn">
                  Discard
                </button>
                <div className="form-footer__right">
                  <button type="button" className="btn btn--dark" onClick={() => handleSubmit('draft')} id="form-draft-btn">
                    Save as Draft
                  </button>
                  <button type="button" className="btn btn--primary" onClick={() => handleSubmit('pending')} id="form-send-btn">
                    Save &amp; Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
