/* ============================================================
   Admin Page — Product manager, enquiries/orders dashboards, settings
   ============================================================ */

let adminAuthed = false;

function initAdmin() {
  if (adminAuthed) {
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    setAdminTab('products');
  } else {
    document.getElementById('adminLogin').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
  }
}

function adminLogin(e) {
  e.preventDefault();
  const val = document.getElementById('adminPass').value;
  const err = document.getElementById('adminLoginError');
  if (val === getAdminPass()) {
    adminAuthed = true;
    err.classList.add('hidden');
    initAdmin();
  } else {
    err.textContent = 'Incorrect passcode.';
    err.classList.remove('hidden');
  }
}

function adminLogout() {
  adminAuthed = false;
  initAdmin();
}

function setAdminTab(tab) {
  document.querySelectorAll('.admin-tabpanel').forEach(p => p.classList.add('hidden'));
  document.getElementById('adminTab-' + tab).classList.remove('hidden');
  document.querySelectorAll('.admin-tab').forEach(t => { t.classList.remove('border-terracotta', 'text-terracotta'); t.classList.add('border-transparent'); });
  const btn = document.getElementById('atab-' + tab);
  if (btn) { btn.classList.add('border-terracotta', 'text-terracotta'); btn.classList.remove('border-transparent'); }
  if (tab === 'products') renderAdminProducts();
  if (tab === 'reviews') renderAdminReviews();
  if (tab === 'enquiries') renderAdminEnquiries();
  if (tab === 'orders') renderAdminOrders();
  if (tab === 'settings') initSettings();
}

/* ---- Products ---- */
function renderAdminProducts() {
  const tb = document.getElementById('adminProductRows');
  if (!tb) return;
  tb.innerHTML = products.map(p => `<tr class="border-t border-sand">
    <td class="p-4"><div class="flex items-center gap-3"><img src="${p.image}" class="w-10 h-12 object-cover rounded" /><div><p class="font-medium">${escapeHtml(p.name)}</p><p class="text-xs text-muted">${escapeHtml(p.brand || '')}</p></div></div></td>
    <td class="p-4">${p.category}</td>
    <td class="p-4">${formatINR(p.price)}</td>
    <td class="p-4">${p.discount || 0}%</td>
    <td class="p-4"><button onclick="toggleAvail('${p.id}')" class="text-xs px-2.5 py-1 rounded-full ${p.available ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}">${p.available ? 'Available' : 'Sold Out'}</button></td>
    <td class="p-4 text-right"><button onclick="openProductModal('${p.id}')" class="text-sm hover:text-terracotta mr-3">Edit</button><button onclick="deleteProduct('${p.id}')" class="text-sm hover:text-rose-deep">Delete</button></td>
  </tr>`).join('');
}

function toggleAvail(id) {
  const p = products.find(x => x.id === id);
  if (p) { p.available = !p.available; saveProducts(); renderAdminProducts(); renderFeatured(); }
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  products = products.filter(p => p.id !== id);
  saveProducts(); renderAdminProducts(); renderFeatured();
  toast('Product deleted');
}

function openProductModal(id) {
  const m = document.getElementById('productModal');
  const f = document.getElementById('productForm');
  f.reset();
  if (id) {
    const p = products.find(x => x.id === id);
    f.id.value = p.id; f.name.value = p.name; f.category.value = p.category; f.brand.value = p.brand || '';
    f.price.value = p.price; f.discount.value = p.discount || 0; f.image.value = p.image; f.image2.value = p.image2 || ''; f.desc.value = p.desc || '';
    f.featured.checked = !!p.featured;
    document.getElementById('productModalTitle').textContent = 'Edit Product';
  } else {
    f.id.value = '';
    document.getElementById('productModalTitle').textContent = 'Add Product';
  }
  m.classList.remove('hidden');
}

function closeProductModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('productModal').classList.add('hidden');
}

function saveProduct(e) {
  e.preventDefault();
  const f = e.target;
  const data = {
    id: f.id.value || 'p' + Date.now(),
    name: f.name.value, category: f.category.value, brand: f.brand.value,
    price: parseInt(f.price.value) || 0, discount: parseInt(f.discount.value) || 0,
    image: f.image.value, image2: f.image2.value, desc: f.desc.value,
    featured: f.featured.checked, available: true
  };
  const i = products.findIndex(p => p.id === data.id);
  if (i > -1) products[i] = data; else products.push(data);
  saveProducts(); renderAdminProducts(); renderFeatured();
  closeProductModal(); toast('Product saved');
}

/* ---- Reviews ---- */
function renderAdminReviews() {
  const tb = document.getElementById('adminReviewRows');
  if (!tb) return;
  tb.innerHTML = reviews.map(r => `
    <tr class="border-t border-sand">
      <td class="p-4 font-medium">${escapeHtml(r.name)}</td>
      <td class="p-4"><span class="inline-flex gap-1 text-gold-soft">${Array.from({ length: 5 }, (_, i) => `<i data-lucide="star" class="w-3.5 h-3.5 fill-current ${i < (r.rating || 5) ? 'text-gold-soft' : 'text-cream/20'}"></i>`).join('')}</span></td>
      <td class="p-4 max-w-md text-xs text-charcoal-soft">${escapeHtml(r.text)}</td>
      <td class="p-4 text-xs text-muted">${escapeHtml(r.source || 'Google Review')}</td>
      <td class="p-4 text-right"><button onclick="openReviewModal('${r.id}')" class="text-sm hover:text-terracotta mr-3">Edit</button><button onclick="deleteReview('${r.id}')" class="text-sm hover:text-rose-deep">Delete</button></td>
    </tr>
  `).join('');
  refreshIcons();
}

function openReviewModal(id) {
  const m = document.getElementById('reviewModal');
  const f = document.getElementById('reviewForm');
  f.reset();
  if (id) {
    const r = reviews.find(x => x.id === id);
    if (!r) return;
    f.id.value = r.id; f.name.value = r.name; f.rating.value = r.rating || 5; f.source.value = r.source || 'Google Review'; f.text.value = r.text;
    document.getElementById('reviewModalTitle').textContent = 'Edit Review';
  } else {
    f.id.value = ''; document.getElementById('reviewModalTitle').textContent = 'Add Review';
  }
  m.classList.remove('hidden');
}

function closeReviewModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('reviewModal').classList.add('hidden');
}

function saveReview(e) {
  e.preventDefault();
  const f = e.target;
  const data = {
    id: f.id.value || 'r' + Date.now(),
    name: f.name.value.trim(),
    rating: parseInt(f.rating.value) || 5,
    source: f.source.value.trim() || 'Google Review',
    text: f.text.value.trim()
  };
  if (!data.name || !data.text) return;
  const i = reviews.findIndex(r => r.id === data.id);
  if (i > -1) reviews[i] = data; else reviews.unshift(data);
  saveReviews(); renderAdminReviews(); renderReviews(); closeReviewModal(); toast('Review saved');
}

function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  reviews = reviews.filter(r => r.id !== id);
  saveReviews(); renderAdminReviews(); renderReviews(); toast('Review deleted');
}

/* ---- Enquiries ---- */
function renderAdminEnquiries() {
  const tb = document.getElementById('adminEnquiryRows');
  if (!tb) return;
  const enqs = getEnquiries();
  const enqCount = document.getElementById('enqCount');
  if (enqCount) enqCount.textContent = enqs.length ? `(${enqs.length})` : '';
  document.getElementById('enquiriesEmpty').classList.toggle('hidden', enqs.length > 0);
  tb.innerHTML = enqs.map(e => `<tr class="border-t border-sand">
    <td class="p-4 text-xs text-muted">${new Date(e.date).toLocaleDateString('en-IN')}</td>
    <td class="p-4 font-medium">${escapeHtml(e.name)}</td>
    <td class="p-4">${escapeHtml(e.phone)}</td>
    <td class="p-4">${escapeHtml(e.category)}</td>
    <td class="p-4 max-w-xs text-xs text-charcoal-soft">${escapeHtml(e.message)}</td>
    <td class="p-4"><select onchange="setEnqStatus('${e.id}', this.value)" class="text-xs border border-sand rounded-full px-2 py-1 bg-cream">
      <option ${e.status === 'Pending' ? 'selected' : ''}>Pending</option><option ${e.status === 'Contacted' ? 'selected' : ''}>Contacted</option><option ${e.status === 'Closed' ? 'selected' : ''}>Closed</option>
    </select></td>
    <td class="p-4"><input value="${escapeHtml(e.notes || '')}" onkeyup="setEnqNotes('${e.id}', this.value)" placeholder="Add note" class="text-xs border border-sand rounded-lg px-2 py-1 bg-cream w-28" /></td>
  </tr>`).join('');
}

function setEnqStatus(id, status) {
  const enqs = getEnquiries(); const e = enqs.find(x => x.id === id);
  if (e) { e.status = status; setEnquiries(enqs); }
}

function setEnqNotes(id, notes) {
  const enqs = getEnquiries(); const e = enqs.find(x => x.id === id);
  if (e) { e.notes = notes; setEnquiries(enqs); }
}

/* ---- Orders ---- */
function renderAdminOrders() {
  const tb = document.getElementById('adminOrderRows');
  if (!tb) return;
  const orders = getOrders();
  const ordCount = document.getElementById('ordCount');
  if (ordCount) ordCount.textContent = orders.length ? `(${orders.length})` : '';
  document.getElementById('ordersEmpty').classList.toggle('hidden', orders.length > 0);
  tb.innerHTML = orders.map(o => {
    const items = o.items ? o.items.map(i => `${i.name} x${i.qty}`).join(', ') : `${o.product || ''} x${o.qty || 1}`;
    return `<tr class="border-t border-sand">
      <td class="p-4 text-xs text-muted">${new Date(o.date).toLocaleDateString('en-IN')}</td>
      <td class="p-4 font-medium">${escapeHtml(o.name)}<p class="text-xs text-muted font-normal">${escapeHtml(o.address || '')}</p></td>
      <td class="p-4">${escapeHtml(o.phone)}</td>
      <td class="p-4 max-w-xs text-xs text-charcoal-soft">${escapeHtml(items)}</td>
      <td class="p-4 font-display">${formatINR(o.total)}</td>
      <td class="p-4"><select onchange="setOrdStatus('${o.id}', this.value)" class="text-xs border border-sand rounded-full px-2 py-1 bg-cream">
        <option ${o.status === 'New' ? 'selected' : ''}>New</option><option ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option><option ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option><option ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option><option ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
      </select></td>
    </tr>`;
  }).join('');
}

function setOrdStatus(id, status) {
  const orders = getOrders(); const o = orders.find(x => x.id === id);
  if (o) { o.status = status; setOrders(orders); }
}

/* ---- Settings ---- */
function initSettings() {
  const input = document.getElementById('gasUrlInput');
  const status = document.getElementById('gasStatus');
  if (input) input.value = getGasUrl();
  if (status) status.textContent = getGasUrl() ? 'Current URL is saved.' : 'Not configured yet.';
}

function saveGasUrl() {
  const url = document.getElementById('gasUrlInput').value.trim();
  localStorage.setItem('kp_gas_url', url);
  document.getElementById('gasStatus').textContent = url ? 'Saved! Forms will now sync to Google Sheets.' : 'URL cleared.';
  toast('Google Sheets URL saved');
}

function changePass() {
  const v = document.getElementById('newPassInput').value.trim();
  if (v.length < 4) { document.getElementById('passStatus').textContent = 'Passcode must be at least 4 characters.'; return; }
  localStorage.setItem('kp_admin_pass', v);
  document.getElementById('passStatus').textContent = 'Passcode updated.';
  document.getElementById('newPassInput').value = '';
  toast('Passcode changed');
}

function exportData() {
  const data = { products, enquiries: getEnquiries(), orders: getOrders() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'kp-fashion-data.json'; a.click();
  toast('Data exported');
}

function clearData() {
  if (!confirm('Clear all enquiries and orders? This cannot be undone.')) return;
  localStorage.removeItem('kp_enquiries'); localStorage.removeItem('kp_orders');
  renderAdminEnquiries(); renderAdminOrders(); toast('Enquiries & orders cleared');
}

window.addEventListener('DOMContentLoaded', () => {
  initShared();
  initAdmin();
  refreshIcons();
});
