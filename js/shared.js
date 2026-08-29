/* ============================================================
   Krishna Priya Fashion — Shared UI Logic
   Injects header, footer, drawers, modals, and toast container
   into every page. Handles cart, wishlist, navigation, search.
   ============================================================ */

const NAV_LINKS = [
  { label: 'Home', page: 'index.html', view: 'home' },
  { label: 'Catalog', page: 'catalog.html', view: 'catalog' },
  { label: 'About Us', page: 'about.html', view: 'about' },
  { label: 'Enquiry & Contact', page: 'contact.html', view: 'contact' },
  { label: 'Admin', page: 'admin.html', view: 'admin' },
];

/* ---- Determine current page from filename ---- */
function currentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === '' || path === 'index.html') return 'index.html';
  return path;
}
function activeView() {
  const p = currentPage();
  for (const l of NAV_LINKS) if (l.page === p) return l.view;
  return 'home';
}

/* ---- Build announcement bar ---- */
function buildAnnouncement() {
  return `<div class="bg-charcoal text-cream text-xs sm:text-sm py-2.5 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 text-center announce-rotate" id="announceBar">
      <span class="active tracking-wide">Free Delivery Across Jaipur</span>
      <span class="tracking-wide">Exclusive Designer Kurties &amp; Western Wear</span>
      <span class="tracking-wide">Visit Us at VivaCity Mall, Jagatpura</span>
    </div>
  </div>`;
}

/* ---- Build header ---- */
function buildHeader() {
  const view = activeView();
  const navItems = NAV_LINKS.map(l =>
    `<a href="${l.page}" class="nav-link ${l.view === view ? 'active' : ''}">${l.label}</a>`
  ).join('');
  const mobileNavItems = NAV_LINKS.map(l =>
    `<a href="${l.page}" class="py-1">${l.label}</a>`
  ).join('');

  return `<header id="siteHeader" class="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-sand transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-20 gap-4">
        <a href="index.html" class="flex items-center gap-2 shrink-0">
          <div class="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-cream font-display text-xl">K</div>
          <div class="leading-tight">
            <div class="font-display text-lg sm:text-xl text-charcoal">Krishna Priya</div>
            <div class="text-[10px] tracking-[0.25em] uppercase text-muted -mt-0.5">Fashion \u00B7 Jaipur</div>
          </div>
        </a>
        <nav class="hidden lg:flex items-center gap-8 text-sm font-medium text-charcoal-soft">${navItems}</nav>
        <div class="flex items-center gap-3 sm:gap-5">
          <div class="hidden md:flex items-center bg-beige rounded-full px-4 py-2 w-56">
            <i data-lucide="search" class="w-4 h-4 text-muted"></i>
            <input id="searchInput" type="text" placeholder="Search the edit\u2026" oninput="handleSearch(this.value)" class="bg-transparent text-sm ml-2 w-full placeholder:text-muted" />
          </div>
          <button onclick="openWishlist()" class="relative hover:text-terracotta transition" aria-label="Wishlist">
            <i data-lucide="heart" class="w-5 h-5"></i>
            <span id="wishlistBadge" class="hidden absolute -top-1.5 -right-1.5 bg-rose-deep text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button onclick="openCart()" class="relative hover:text-terracotta transition" aria-label="Shopping bag">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            <span id="cartBadge" class="hidden absolute -top-1.5 -right-1.5 bg-terracotta text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button onclick="toggleMobileMenu()" class="lg:hidden" aria-label="Menu">
            <i data-lucide="menu" class="w-6 h-6"></i>
          </button>
        </div>
      </div>
    </div>
    <div id="mobileMenu" class="hidden lg:hidden border-t border-sand bg-cream px-4 py-4">
      <div class="flex items-center bg-beige rounded-full px-4 py-2 mb-4">
        <i data-lucide="search" class="w-4 h-4 text-muted"></i>
        <input type="text" placeholder="Search the edit\u2026" oninput="handleSearch(this.value)" class="bg-transparent text-sm ml-2 w-full placeholder:text-muted" />
      </div>
      <nav class="flex flex-col gap-3 text-sm font-medium">${mobileNavItems}</nav>
    </div>
  </header>`;
}

/* ---- Build footer ---- */
function buildFooter() {
  return `<footer class="bg-charcoal text-cream/80 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-cream font-display text-xl">K</div>
          <div class="leading-tight">
            <div class="font-display text-xl text-cream">Krishna Priya Fashion</div>
            <div class="text-[10px] tracking-[0.25em] uppercase text-cream/40">Designer Boutique for Women</div>
          </div>
        </div>
        <p class="text-sm leading-relaxed max-w-md text-cream/60">Traditional &amp; contemporary fashion curated in Jaipur. Cotton Kurtis, Oversized Suits, Nightwear, Partywear &amp; more \u2014 visit us at VivaCity Mall, Jagatpura.</p>
      </div>
      <div>
        <h4 class="text-cream font-medium mb-4 text-sm tracking-wide uppercase">Explore</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="index.html" class="hover:text-gold-soft transition">Home</a></li>
          <li><a href="catalog.html" class="hover:text-gold-soft transition">Catalog</a></li>
          <li><a href="about.html" class="hover:text-gold-soft transition">About Us</a></li>
          <li><a href="contact.html" class="hover:text-gold-soft transition">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-cream font-medium mb-4 text-sm tracking-wide uppercase">Contact</h4>
        <ul class="space-y-2 text-sm text-cream/60">
          <li class="flex gap-2"><i data-lucide="map-pin" class="w-4 h-4 shrink-0 mt-0.5"></i> VivaCity Mall, Jagatpura, Jaipur</li>
          <li class="flex gap-2"><i data-lucide="phone" class="w-4 h-4 shrink-0 mt-0.5"></i> <a href="tel:+919251200453" class="hover:text-gold-soft">+91 92512 00453</a></li>
          <li class="flex gap-2"><i data-lucide="message-circle" class="w-4 h-4 shrink-0 mt-0.5"></i> <a href="https://wa.me/917062601601" target="_blank" class="hover:text-gold-soft">+91 70626 01601</a></li>
          <li class="flex gap-2"><i data-lucide="clock" class="w-4 h-4 shrink-0 mt-0.5"></i> 10:30 AM \u2013 9:00 PM Daily</li>
        </ul>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-cream/10 text-xs text-cream/40 flex flex-col sm:flex-row justify-between gap-2">
      <p>\u00A9 2026 Krishna Priya Fashion. All rights reserved.</p>
      <p>Women-Owned \u00B7 Wheelchair Accessible \u00B7 In-store Pickup \u00B7 Delivery Available</p>
    </div>
  </footer>`;
}

/* ---- Build cart drawer ---- */
function buildCartDrawer() {
  return `<div id="cartOverlay" class="fixed inset-0 bg-charcoal/50 z-50 hidden" onclick="closeCart()"></div>
  <aside id="cartDrawer" class="drawer fixed top-0 right-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col" style="transform:translateX(100%)">
    <div class="flex items-center justify-between p-5 border-b border-sand">
      <h3 class="font-display text-xl">Shopping Bag</h3>
      <button onclick="closeCart()" aria-label="Close"><i data-lucide="x" class="w-5 h-5"></i></button>
    </div>
    <div id="cartItems" class="flex-1 overflow-y-auto p-5 space-y-4"></div>
    <div id="cartFooter" class="border-t border-sand p-5 space-y-4 hidden">
      <div class="flex items-center gap-2">
        <input id="discountInput" type="text" placeholder="Discount code" class="flex-1 bg-beige border border-sand rounded-xl px-4 py-2.5 text-sm" />
        <button onclick="applyDiscount()" class="bg-charcoal text-cream px-4 py-2.5 rounded-xl text-sm">Apply</button>
      </div>
      <div class="flex justify-between text-sm text-charcoal-soft"><span>Subtotal</span><span id="cartSubtotal">\u20B90</span></div>
      <div id="discountRow" class="hidden flex justify-between text-sm text-terracotta"><span>Discount</span><span id="discountAmount">\u2212\u20B90</span></div>
      <div class="flex justify-between font-display text-xl"><span>Total</span><span id="cartTotal">\u20B90</span></div>
      <button onclick="checkout()" class="w-full bg-terracotta hover:bg-terracotta-deep text-cream py-3.5 rounded-full text-sm font-medium transition flex items-center justify-center gap-2"><i data-lucide="message-circle" class="w-4 h-4"></i> Checkout via WhatsApp</button>
      <button onclick="clearCart()" class="w-full text-sm text-muted hover:text-charcoal transition">Clear bag</button>
    </div>
  </aside>`;
}

/* ---- Build wishlist drawer ---- */
function buildWishlistDrawer() {
  return `<div id="wishOverlay" class="fixed inset-0 bg-charcoal/50 z-50 hidden" onclick="closeWishlist()"></div>
  <aside id="wishDrawer" class="drawer fixed top-0 right-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col" style="transform:translateX(100%)">
    <div class="flex items-center justify-between p-5 border-b border-sand">
      <h3 class="font-display text-xl">Wishlist</h3>
      <button onclick="closeWishlist()" aria-label="Close"><i data-lucide="x" class="w-5 h-5"></i></button>
    </div>
    <div id="wishItems" class="flex-1 overflow-y-auto p-5 space-y-4"></div>
  </aside>`;
}

/* ---- Build order modal ---- */
function buildOrderModal() {
  return `<div id="orderModal" class="hidden fixed inset-0 z-50 bg-charcoal/50 modal-bg flex items-center justify-center p-4" onclick="closeOrderModal(event)">
    <div class="bg-cream rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto modal-card" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between p-5 border-b border-sand">
        <h3 class="font-display text-xl">Place Order</h3>
        <button onclick="closeOrderModal()"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div class="p-5">
        <div id="orderProductPreview" class="flex gap-3 items-center bg-beige rounded-xl p-3 mb-5"></div>
        <form id="orderForm" onsubmit="submitOrder(event)" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <input required type="text" name="name" placeholder="Full Name" class="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm" />
            <input required type="tel" name="phone" placeholder="Phone Number" class="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm" />
          </div>
          <input required type="text" name="address" placeholder="Delivery Address" class="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm" />
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1.5 text-charcoal-soft">Quantity</label>
              <input required type="number" name="qty" min="1" value="1" onchange="updateOrderTotal()" class="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label class="block text-sm mb-1.5 text-charcoal-soft">Size (optional)</label>
              <select name="size" class="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm">
                <option>Free Size</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
              </select>
            </div>
          </div>
          <textarea name="notes" rows="3" placeholder="Custom notes (optional)" class="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm"></textarea>
          <div class="flex justify-between items-center bg-beige rounded-xl px-4 py-3">
            <span class="text-sm text-charcoal-soft">Order Total</span>
            <span id="orderTotalDisplay" class="font-display text-xl">\u20B90</span>
          </div>
          <button type="submit" class="w-full bg-terracotta hover:bg-terracotta-deep text-cream py-3.5 rounded-full text-sm font-medium transition flex items-center justify-center gap-2">
            <i data-lucide="check" class="w-4 h-4"></i> Confirm Order
          </button>
        </form>
      </div>
    </div>
  </div>`;
}

/* ---- Build confirmation modal ---- */
function buildConfirmModal() {
  return `<div id="confirmModal" class="hidden fixed inset-0 z-50 bg-charcoal/50 modal-bg flex items-center justify-center p-4">
    <div class="bg-cream rounded-2xl w-full max-w-md modal-card text-center p-8">
      <div class="w-16 h-16 rounded-full bg-terracotta/15 flex items-center justify-center mx-auto mb-5"><i data-lucide="check-circle-2" class="w-8 h-8 text-terracotta"></i></div>
      <h3 class="font-display text-2xl mb-2">Order Received!</h3>
      <p class="text-charcoal-soft text-sm mb-6" id="confirmText"></p>
      <a id="confirmWhatsapp" href="#" target="_blank" class="block bg-terracotta hover:bg-terracotta-deep text-cream py-3.5 rounded-full text-sm font-medium transition mb-3">Send Order on WhatsApp</a>
      <button onclick="closeConfirm()" class="text-sm text-muted hover:text-charcoal transition">Continue Shopping</button>
    </div>
  </div>`;
}

/* ---- Inject shared UI into page ---- */
function injectSharedUI() {
  const headerSlot = document.getElementById('header-slot');
  const footerSlot = document.getElementById('footer-slot');
  const overlaySlot = document.getElementById('overlay-slot');
  if (headerSlot) headerSlot.innerHTML = buildAnnouncement() + buildHeader();
  if (footerSlot) footerSlot.innerHTML = buildFooter();
  if (overlaySlot) overlaySlot.innerHTML = buildCartDrawer() + buildWishlistDrawer() + buildOrderModal() + buildConfirmModal() + '<div id="toastContainer" class="fixed bottom-6 right-6 z-[60] space-y-2"></div>';
  refreshIcons();
  updateBadges();
}

/* ---- Mobile menu ---- */
function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('hidden'); }

/* ---- Announcement rotation ---- */
let announceIdx = 0, announceTimer;
function startAnnounce() {
  const spans = document.querySelectorAll('#announceBar span');
  if (!spans.length) return;
  clearInterval(announceTimer);
  announceTimer = setInterval(() => {
    spans.forEach(s => s.classList.remove('active'));
    announceIdx = (announceIdx + 1) % spans.length;
    spans[announceIdx].classList.add('active');
  }, 3500);
}

/* ---- Search ---- */
function handleSearch(val) {
  const q = val.trim();
  if (q && currentPage() !== 'catalog.html') {
    window.location.href = 'catalog.html?search=' + encodeURIComponent(q);
    return;
  }
  if (typeof window.renderCatalog === 'function') {
    window.searchTerm = q;
    window.renderCatalog();
  }
}

/* ---- Product card renderer (shared by home & catalog) ---- */
function productCard(p) {
  const out = !p.available;
  const inWish = wishlist.includes(p.id);
  return `<div class="product-card group">
    <div class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-sand">
      <img src="${p.image}" alt="${escapeHtml(p.name)}" class="product-card-img w-full h-full object-cover" ${p.image2 ? `onmouseover="this.src='${p.image2}'" onmouseout="this.src='${p.image}'"` : ''} />
      ${p.discount > 0 ? `<span class="absolute top-3 left-3 bg-terracotta text-cream text-xs px-2.5 py-1 rounded-full">-${p.discount}%</span>` : ''}
      ${out ? `<span class="absolute top-3 right-3 bg-charcoal/70 text-cream text-xs px-2.5 py-1 rounded-full">Sold Out</span>` : ''}
      <button onclick="toggleWishlist('${p.id}')" class="absolute top-3 right-3 w-9 h-9 rounded-full bg-cream/90 flex items-center justify-center hover:bg-cream transition ${inWish ? 'text-rose-deep' : ''}" aria-label="Wishlist">
        <i data-lucide="heart" class="w-4 h-4 ${inWish ? 'fill-current' : ''}"></i>
      </button>
      <div class="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300 ${out ? 'pointer-events-none' : ''}">
        <button onclick="addToCart('${p.id}')" ${out ? 'disabled' : ''} class="flex-1 bg-cream/95 hover:bg-cream text-charcoal text-xs font-medium py-2.5 rounded-full transition flex items-center justify-center gap-1.5 ${out ? 'opacity-40' : ''}"><i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i> Add</button>
        <button onclick="openOrderModal('${p.id}')" ${out ? 'disabled' : ''} class="flex-1 bg-terracotta hover:bg-terracotta-deep text-cream text-xs font-medium py-2.5 rounded-full transition ${out ? 'opacity-40' : ''}">Buy Now</button>
      </div>
    </div>
    <div class="mt-3 px-1">
      <p class="text-[10px] tracking-[0.2em] uppercase text-muted">${escapeHtml(p.brand || '')}</p>
      <h3 class="text-sm font-medium leading-snug mt-1 line-clamp-2">${escapeHtml(p.name)}</h3>
      <div class="flex items-center gap-2 mt-1.5">
        <span class="font-display text-base text-charcoal">${formatINR(finalPrice(p))}</span>
        ${p.discount > 0 ? `<span class="text-xs text-muted line-through">${formatINR(p.price)}</span>` : ''}
      </div>
    </div>
  </div>`;
}

/* ---- Featured grid (used by home page) ---- */
function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const items = products.filter(p => p.featured && p.available).slice(0, 8)
    .concat(products.filter(p => p.available).slice(0, 8)).slice(0, 8);
  grid.innerHTML = items.map(productCard).join('');
  refreshIcons();
}

/* ---- Wishlist ---- */
function toggleWishlist(id) {
  const i = wishlist.indexOf(id);
  if (i > -1) { wishlist.splice(i, 1); toast('Removed from wishlist'); }
  else { wishlist.push(id); toast('Added to wishlist'); }
  localStorage.setItem('kp_wishlist', JSON.stringify(wishlist));
  updateBadges();
  renderFeatured();
  if (typeof window.renderCatalog === 'function') window.renderCatalog();
  renderWishlist();
}
function openWishlist() {
  document.getElementById('wishOverlay').classList.remove('hidden');
  document.getElementById('wishDrawer').style.transform = 'translateX(0)';
  renderWishlist();
}
function closeWishlist() {
  document.getElementById('wishOverlay').classList.add('hidden');
  document.getElementById('wishDrawer').style.transform = 'translateX(100%)';
}
function renderWishlist() {
  const c = document.getElementById('wishItems');
  if (!c) return;
  if (!wishlist.length) {
    c.innerHTML = '<div class="text-center text-muted py-20"><i data-lucide="heart" class="w-10 h-10 mx-auto mb-3"></i><p>Your wishlist is empty.</p></div>';
    refreshIcons(); return;
  }
  c.innerHTML = wishlist.map(id => {
    const p = products.find(x => x.id === id); if (!p) return '';
    return `<div class="flex gap-3 items-center">
      <img src="${p.image}" class="w-16 h-20 object-cover rounded-lg" />
      <div class="flex-1">
        <p class="text-[10px] uppercase tracking-wide text-muted">${escapeHtml(p.brand || '')}</p>
        <p class="text-sm font-medium leading-snug">${escapeHtml(p.name)}</p>
        <p class="font-display text-sm mt-0.5">${formatINR(finalPrice(p))}</p>
      </div>
      <div class="flex flex-col gap-2">
        <button onclick="addToCart('${p.id}');toggleWishlist('${p.id}')" class="text-xs bg-charcoal text-cream px-3 py-1.5 rounded-full">Move to bag</button>
        <button onclick="toggleWishlist('${p.id}')" class="text-xs text-muted">Remove</button>
      </div>
    </div>`;
  }).join('');
  refreshIcons();
}

/* ---- Cart ---- */
function addToCart(id) {
  const p = products.find(x => x.id === id); if (!p || !p.available) return;
  const ex = cart.find(c => c.id === id);
  if (ex) ex.qty++; else cart.push({ id, qty: 1 });
  localStorage.setItem('kp_cart', JSON.stringify(cart));
  updateBadges(); renderCart();
  toast('Added to bag');
}
function changeQty(id, delta) {
  const it = cart.find(c => c.id === id); if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) cart = cart.filter(c => c.id !== id);
  localStorage.setItem('kp_cart', JSON.stringify(cart));
  updateBadges(); renderCart();
}
function clearCart() { cart = []; localStorage.removeItem('kp_cart'); updateBadges(); renderCart(); }
function cartSubtotal() { return cart.reduce((s, c) => { const p = products.find(x => x.id === c.id); return s + (p ? finalPrice(p) * c.qty : 0); }, 0); }
function renderCart() {
  const c = document.getElementById('cartItems');
  const f = document.getElementById('cartFooter');
  if (!c) return;
  if (!cart.length) {
    c.innerHTML = '<div class="text-center text-muted py-20"><i data-lucide="shopping-bag" class="w-10 h-10 mx-auto mb-3"></i><p>Your bag is empty.</p><a href="catalog.html" class="mt-4 inline-block text-sm text-terracotta">Browse catalog</a></div>';
    f.classList.add('hidden');
    refreshIcons(); return;
  }
  f.classList.remove('hidden');
  c.innerHTML = cart.map(it => {
    const p = products.find(x => x.id === it.id); if (!p) return '';
    return `<div class="flex gap-3 items-center">
      <img src="${p.image}" class="w-16 h-20 object-cover rounded-lg" />
      <div class="flex-1">
        <p class="text-[10px] uppercase tracking-wide text-muted">${escapeHtml(p.brand || '')}</p>
        <p class="text-sm font-medium leading-snug">${escapeHtml(p.name)}</p>
        <p class="font-display text-sm mt-0.5">${formatINR(finalPrice(p))}</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="changeQty('${p.id}',-1)" class="w-7 h-7 rounded-full bg-beige flex items-center justify-center">\u2212</button>
          <span class="text-sm w-6 text-center">${it.qty}</span>
          <button onclick="changeQty('${p.id}',1)" class="w-7 h-7 rounded-full bg-beige flex items-center justify-center">+</button>
        </div>
      </div>
      <button onclick="changeQty('${p.id}',-99)" class="text-muted hover:text-rose-deep"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
    </div>`;
  }).join('');
  const sub = cartSubtotal();
  const disc = Math.round(sub * currentDiscount / 100);
  document.getElementById('cartSubtotal').textContent = formatINR(sub);
  document.getElementById('cartTotal').textContent = formatINR(sub - disc);
  if (disc > 0) {
    document.getElementById('discountRow').classList.remove('hidden');
    document.getElementById('discountRow').classList.add('flex');
    document.getElementById('discountAmount').textContent = '\u2212' + formatINR(disc);
  } else {
    document.getElementById('discountRow').classList.add('hidden');
  }
  refreshIcons();
}
function openCart() { document.getElementById('cartOverlay').classList.remove('hidden'); document.getElementById('cartDrawer').style.transform = 'translateX(0)'; renderCart(); }
function closeCart() { document.getElementById('cartOverlay').classList.add('hidden'); document.getElementById('cartDrawer').style.transform = 'translateX(100%)'; }
function applyDiscount() {
  const code = document.getElementById('discountInput').value.trim().toUpperCase();
  const codes = { 'KRISHNA10': 10, 'JAIPUR15': 15, 'FESTIVE20': 20 };
  if (codes[code]) { currentDiscount = codes[code]; toast('Discount applied: ' + currentDiscount + '%'); renderCart(); }
  else { currentDiscount = 0; toast('Invalid discount code'); renderCart(); }
}
function checkout() {
  if (!cart.length) return;
  let msg = 'Hello Krishna Priya Fashion! I would like to place an order:%0A%0A';
  cart.forEach(it => { const p = products.find(x => x.id === it.id); if (p) msg += `\u2022 ${p.name} (${p.brand || '-'}) x${it.qty} = ${formatINR(finalPrice(p) * it.qty)}%0A`; });
  const sub = cartSubtotal(); const disc = Math.round(sub * currentDiscount / 100);
  msg += `%0ASubtotal: ${formatINR(sub)}%0A`;
  if (disc > 0) msg += `Discount (${currentDiscount}%): \u2212${formatINR(disc)}%0A`;
  msg += `Total: ${formatINR(sub - disc)}%0A%0APlease confirm availability. Thank you!`;
  saveOrderFromCart(sub - disc);
  window.open(`https://wa.me/${WHATSAPP_ORDER}?text=${msg}`, '_blank');
}
function saveOrderFromCart(total) {
  const orders = getOrders();
  orders.unshift({
    id: 'ord_' + Date.now(), date: new Date().toISOString(),
    name: 'WhatsApp Checkout', phone: '\u2014', address: '\u2014',
    items: cart.map(it => { const p = products.find(x => x.id === it.id); return { name: p ? p.name : '', qty: it.qty, price: finalPrice(p) }; }),
    total, status: 'New'
  });
  setOrders(orders);
  pushToSheets({ type: 'order', order: orders[0] });
  cart = []; localStorage.removeItem('kp_cart'); currentDiscount = 0; updateBadges(); renderCart();
}

/* ---- Badges ---- */
function updateBadges() {
  const cb = document.getElementById('cartBadge');
  const wb = document.getElementById('wishlistBadge');
  if (!cb || !wb) return;
  const cCount = cart.reduce((s, c) => s + c.qty, 0);
  cb.textContent = cCount; cb.classList.toggle('hidden', cCount === 0);
  wb.textContent = wishlist.length; wb.classList.toggle('hidden', wishlist.length === 0);
}

/* ---- Order modal ---- */
function openOrderModal(id) {
  const p = products.find(x => x.id === id); if (!p) return;
  currentOrderProduct = p;
  document.getElementById('orderProductPreview').innerHTML = `<img src="${p.image}" class="w-16 h-20 object-cover rounded-lg" /><div><p class="text-[10px] uppercase tracking-wide text-muted">${escapeHtml(p.brand || '')}</p><p class="text-sm font-medium">${escapeHtml(p.name)}</p><p class="font-display text-base mt-0.5">${formatINR(finalPrice(p))}</p></div>`;
  document.getElementById('orderForm').reset();
  document.querySelector('#orderForm [name=qty]').value = 1;
  updateOrderTotal();
  document.getElementById('orderModal').classList.remove('hidden');
  refreshIcons();
}
function closeOrderModal(e) { if (e && e.target !== e.currentTarget) return; document.getElementById('orderModal').classList.add('hidden'); }
function updateOrderTotal() {
  if (!currentOrderProduct) return;
  const qty = parseInt(document.querySelector('#orderForm [name=qty]').value) || 1;
  document.getElementById('orderTotalDisplay').textContent = formatINR(finalPrice(currentOrderProduct) * qty);
}
function submitOrder(e) {
  e.preventDefault();
  const f = e.target;
  const qty = parseInt(f.qty.value) || 1;
  const total = finalPrice(currentOrderProduct) * qty;
  const order = {
    id: 'ord_' + Date.now(), date: new Date().toISOString(),
    name: f.name.value, phone: f.phone.value, address: f.address.value,
    size: f.size.value, qty, notes: f.notes.value,
    product: currentOrderProduct.name, brand: currentOrderProduct.brand || '',
    price: finalPrice(currentOrderProduct), total, status: 'New'
  };
  const orders = getOrders(); orders.unshift(order); setOrders(orders);
  pushToSheets({ type: 'order', order });
  closeOrderModal();
  let msg = `Hello Krishna Priya Fashion! I'd like to confirm my order:%0A%0A\u2022 ${order.product} (${order.brand}) x${qty} = ${formatINR(total)}%0ASize: ${order.size}%0A%0AName: ${order.name}%0APhone: ${order.phone}%0AAddress: ${order.address}`;
  if (order.notes) msg += `%0ANotes: ${order.notes}`;
  msg += `%0A%0ATotal: ${formatINR(total)}`;
  document.getElementById('confirmText').textContent = `Your order for ${order.product} (x${qty}) totalling ${formatINR(total)} has been received. Send it on WhatsApp to confirm.`;
  document.getElementById('confirmWhatsapp').href = `https://wa.me/${WHATSAPP_ORDER}?text=${msg}`;
  document.getElementById('confirmModal').classList.remove('hidden');
  refreshIcons();
}
function closeConfirm() { document.getElementById('confirmModal').classList.add('hidden'); }

/* ---- Scroll reveal ---- */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ---- Header shadow on scroll ---- */
function initScrollShadow() {
  window.addEventListener('scroll', () => {
    const h = document.getElementById('siteHeader');
    if (!h) return;
    if (window.scrollY > 20) h.classList.add('shadow-sm'); else h.classList.remove('shadow-sm');
  });
}

/* ---- Global init (call on every page) ---- */
function initShared() {
  injectSharedUI();
  startAnnounce();
  initReveal();
  initScrollShadow();
}
