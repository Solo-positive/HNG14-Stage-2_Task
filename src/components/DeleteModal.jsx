import { useEffect, useRef } from 'react';
import './DeleteModal.css';

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const modalRef = useRef(null);

  /* Trap focus inside modal */
  useEffect(() => {
    cancelRef.current?.focus();
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onCancel(); return; }
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal" ref={modalRef}>
        <h2 className="modal__title" id="modal-title">Confirm Deletion</h2>
        <p className="modal__body">
          Are you sure you want to delete invoice{' '}
          <strong>#{invoiceId}</strong>? This action cannot be undone.
        </p>
        <div className="modal__actions">
          <button
            ref={cancelRef}
            className="btn btn--secondary"
            onClick={onCancel}
            id="modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={onConfirm}
            id="modal-delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
