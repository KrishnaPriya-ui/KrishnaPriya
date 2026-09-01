/* ============================================================
   Catalog Page — Filtering, sorting, search, rendering
   ============================================================ */

let currentCategory = 'All';
window.searchTerm = '';

function renderCatalog() {
  const  grid = document.getElementById('catalogGrid');
  const empty = document.getElementById('catalogEmpty');
  if (!grid) return;
  let list = products.filter(p => (currentCategory === 'All' || p.category === currentCategory));
  if (window.searchTerm) {
    const q = window.searchTerm.toLowerCase();
    list = list.filter(p => (p.name + p.brand + p.category).toLowerCase().includes(q));
  }
  const sort = document.getElementById('sortSelect') ? document.getElementById('sortSelect').value : 'featured';
  if (sort === 'low') list.sort((a, b) => finalPrice(a) - finalPrice(b));
  else if (sort === 'high') list.sort((a, b) => finalPrice(b) - finalPrice(a));
  else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = list.map(productCard).join('');
  const countEl = document.getElementById('catalogCount');
  if (countEl) countEl.textContent = `${list.length} piece${list.length !== 1 ? 's' : ''}`;
  if (empty) empty.classList.toggle('hidden', list.length > 0);
  grid.classList.toggle('hidden', list.length === 0);
  refreshIcons();
}

function setCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  renderCatalog();
}

window.renderCatalog = renderCatalog;

window.addEventListener('DOMContentLoaded', () => {
  initShared();

  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  const search = params.get('search');
  if (cat) currentCategory = cat;
  if (search) {
    window.searchTerm = search;
    const si = document.getElementById('searchInput');
    if (si) si.value = search;
  }

  setCategory(currentCategory);
  refreshIcons();
});
