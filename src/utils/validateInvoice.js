/**
 * Validates invoice form data.
 * Returns an object of { fieldKey: errorMessage }
 */
export function validateInvoice(data) {
  const errors = {};

  if (!data.senderStreet?.trim()) errors.senderStreet = 'Street address is required.';
  if (!data.senderCity?.trim()) errors.senderCity = 'City is required.';
  if (!data.senderPostCode?.trim()) errors.senderPostCode = 'Post code is required.';
  if (!data.senderCountry?.trim()) errors.senderCountry = 'Country is required.';

  if (!data.clientName?.trim()) errors.clientName = "Client's name is required.";
  if (!data.clientEmail?.trim()) {
    errors.clientEmail = "Client's email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
    errors.clientEmail = 'Please enter a valid email address.';
  }
  if (!data.clientStreet?.trim()) errors.clientStreet = "Client's street address is required.";
  if (!data.clientCity?.trim()) errors.clientCity = "Client's city is required.";
  if (!data.clientPostCode?.trim()) errors.clientPostCode = "Client's post code is required.";
  if (!data.clientCountry?.trim()) errors.clientCountry = "Client's country is required.";

  if (!data.invoiceDate) errors.invoiceDate = 'Invoice date is required.';
  if (!data.paymentTerms) errors.paymentTerms = 'Payment terms are required.';
  if (!data.description?.trim()) errors.description = 'Project description is required.';

  if (!data.items || data.items.length === 0) {
    errors.items = 'An invoice must have at least one item.';
  } else {
    const itemErrors = data.items.map((item, i) => {
      const e = {};
      if (!item.name?.trim()) e.name = `Item ${i + 1}: name is required.`;
      if (!item.quantity || item.quantity <= 0) e.quantity = `Item ${i + 1}: quantity must be > 0.`;
      if (!item.price || item.price <= 0) e.price = `Item ${i + 1}: price must be > 0.`;
      return e;
    });
    if (itemErrors.some((e) => Object.keys(e).length > 0)) {
      errors.itemDetails = itemErrors;
    }
  }

  return errors;
}
