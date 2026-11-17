/* ============================================================
   Contact Page — Enquiry form submission
   ============================================================ */

function submitEnquiry(e) {
  e.preventDefault();
  const f = e.target;
  const enq = {
    id: 'enq_' + Date.now(),
    date: new Date().toISOString(),
    name: f.name.value,
    phone: f.phone.value,
    category: f.category.value,
    message: f.message.value,
    status: 'Pending',
    notes: ''
  };
  const enqs = getEnquiries();
  enqs.unshift(enq);
  setEnquiries(enqs);
  pushToSheets({ type: 'enquiry', enquiry: enq });
  f.reset();
  toast('Enquiry submitted \u2014 we\'ll be in touch!');
}

window.addEventListener('DOMContentLoaded', () => {
  initShared();
  refreshIcons();
});
