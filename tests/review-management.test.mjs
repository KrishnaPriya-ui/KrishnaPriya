import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';

const projectRoot = new URL('..', import.meta.url);
const dataText = fs.readFileSync(new URL('js/data.js', projectRoot), 'utf8');
const adminText = fs.readFileSync(new URL('js/admin.js', projectRoot), 'utf8');
const sharedText = fs.readFileSync(new URL('js/shared.js', projectRoot), 'utf8');
const adminHtmlText = fs.readFileSync(new URL('admin.html', projectRoot), 'utf8');
const homeText = fs.readFileSync(new URL('index.html', projectRoot), 'utf8');
const contactText = fs.readFileSync(new URL('contact.html', projectRoot), 'utf8');
const aboutText = fs.readFileSync(new URL('about.html', projectRoot), 'utf8');
const homeScriptText = fs.readFileSync(new URL('js/home.js', projectRoot), 'utf8');
const catalogScriptText = fs.readFileSync(new URL('js/catalog.js', projectRoot), 'utf8');
const viteConfigText = fs.readFileSync(new URL('vite.config.js', projectRoot), 'utf8');
const sitemapText = fs.readFileSync(new URL('sitemap.xml', projectRoot), 'utf8');
const robotsText = fs.readFileSync(new URL('robots.txt', projectRoot), 'utf8');

test('review data and admin management exist for persisted homepage reviews', () => {
  assert.match(dataText, /DEFAULT_REVIEWS|loadReviews|saveReviews/);
  assert.match(adminText, /renderAdminReviews|openReviewModal|saveReview|deleteReview/);
  assert.match(homeText, /id="reviewsGrid"|renderReviews/);
});

test('site includes Firebase-backed dynamic data sync for products and reviews', () => {
  assert.match(dataText, /initializeFirebase|firebase|getFirestore|collection|onSnapshot|sync/);
  assert.match(adminText, /saveProduct\(|saveReview\(|deleteProduct\(|deleteReview\(|setOrdStatus/);
});

test('phone and WhatsApp contact details use the same number', () => {
  for (const page of [homeText, contactText, aboutText]) {
    assert.doesNotMatch(page, /70626|917062601601/);
    assert.match(page, /92512 00453|919251200453/);
  }
  assert.equal((dataText.match(/919251200453/g) || []).length, 3);
  assert.match(dataText, /const PHONE_DISPLAY = '\+91 92512 00453'/);
  assert.match(sharedText, /href="tel:\$\{PHONE\}".*\$\{PHONE_DISPLAY\}/);
  assert.match(sharedText, /https:\/\/wa\.me\/\$\{WHATSAPP_CHAT\}.*\$\{PHONE_DISPLAY\}/);
  for (const page of ['index.html', 'catalog.html', 'about.html', 'contact.html', 'admin.html', 'ethnic-wear.html', 'western-wear.html', 'nightwear.html', 'cosmetics-jewelry.html']) {
    const html = fs.readFileSync(new URL(page, projectRoot), 'utf8');
    assert.match(html, /js\/data\.js\?v=4/);
    assert.match(html, /js\/shared\.js\?v=4/);
  }
});

test('admin passcode is shared through Firebase instead of localStorage', () => {
  assert.match(dataText, /hashAdminPasscode|saveAdminPasscode|settings.*admin/s);
  assert.match(adminText, /await hashAdminPasscode\(val\)|await getAdminPasscode\(\)/);
  assert.doesNotMatch(dataText, /kp_admin_pass|admin123/);
  assert.doesNotMatch(adminText, /kp_admin_pass|getAdminPass\(/);
});

test('admin products support Firebase Storage uploads without duplicate featured cards', () => {
  assert.match(dataText, /uploadProductImage|firebase\.storage/);
  assert.match(adminText, /imageFile|image2File|await uploadProductImage/);
  assert.match(adminText, /await saveProducts\(\)/);
  assert.match(adminHtmlText, /type="submit"[^>]*>Save Product/);
  assert.match(sharedText, /products\.filter\(p => p\.featured && p\.available\)/);
  assert.doesNotMatch(sharedText, /\.concat\(products\.filter/);
});

test('public navigation hides admin and category pages are crawlable', () => {
  assert.doesNotMatch(sharedText, /label: 'Admin'/);
  for (const page of ['ethnic-wear.html', 'western-wear.html', 'nightwear.html', 'cosmetics-jewelry.html']) {
    assert.match(homeText, new RegExp(`href="${page}"`));
    const categoryPage = fs.readFileSync(new URL(page, projectRoot), 'utf8');
    assert.match(categoryPage, /<link rel="canonical"/);
    assert.match(categoryPage, /data-category=/);
    assert.match(sitemapText, new RegExp(page));
  }
  assert.match(catalogScriptText, /params\.get\('category'\) \|\| document\.body\.dataset\.category/);
  assert.doesNotMatch(catalogScriptText, /window\.open/);
  assert.match(robotsText, /Sitemap: https:\/\/krishnapriyafashion\.in\/sitemap\.xml/);
  assert.equal(fs.readFileSync(new URL('public/sitemap.xml', projectRoot), 'utf8'), sitemapText);
  assert.equal(fs.readFileSync(new URL('public/robots.txt', projectRoot), 'utf8'), robotsText);
  assert.match(viteConfigText, /req\.url === '\/admin'|req\.url === '\/admin\/'/);
});

test('category selection filters products in the current page', () => {
  const grid = { innerHTML: '', classList: { toggle() {} } };
  const count = { textContent: '' };
  const empty = { classList: { toggle() {} } };
  const buttons = ['All', 'Ethnic Wear', 'Western Wear', 'Nightwear'].map(category => ({
    dataset: { cat: category },
    classList: { toggle() {} },
  }));
  const listeners = {};
  const context = {
    document: {
      body: { dataset: { category: 'Nightwear' } },
      getElementById(id) {
        return { catalogGrid: grid, catalogCount: count, catalogEmpty: empty }[id] || null;
      },
      querySelectorAll() { return buttons; },
    },
    window: {
      addEventListener(event, listener) { listeners[event] = listener; },
      location: { search: '' },
      open() { throw new Error('Category selection should not open a new tab.'); },
    },
    products: [
      { name: 'Kurti', brand: '', category: 'Ethnic Wear' },
      { name: 'Dress', brand: '', category: 'Western Wear' },
      { name: 'Pajamas', brand: '', category: 'Nightwear' },
    ],
    productCard: product => product.name,
    refreshIcons() {},
    initShared() {},
    URLSearchParams,
  };

  runInNewContext(catalogScriptText, context);
  listeners.DOMContentLoaded();
  assert.equal(grid.innerHTML, 'Pajamas');
  assert.equal(count.textContent, '1 piece');

  context.setCategory('Ethnic Wear');
  assert.equal(grid.innerHTML, 'Kurti');
  assert.equal(count.textContent, '1 piece');
});

test('homepage new arrivals support the requested price thresholds', () => {
  const grid = { innerHTML: '' };
  const empty = { classList: { toggle() {} } };
  const buttons = ['all', 'under-999', 'under-1999', '1999-plus'].map(priceFilter => ({
    dataset: { priceFilter },
    setAttribute() {},
  }));
  const context = {
    document: {
      getElementById(id) { return { newArrivalsGrid: grid, newArrivalsEmpty: empty }[id] || null; },
      querySelectorAll() { return buttons; },
    },
    window: { addEventListener() {} },
    products: [
      { name: 'Budget', price: 998, createdAt: 1, available: true },
      { name: 'Lower Boundary', price: 999, createdAt: 2, available: true },
      { name: 'Upper Boundary', price: 1999, createdAt: 3, available: true },
      { name: 'Premium', price: 2000, createdAt: 4, available: true },
      { name: 'Unavailable', price: 500, createdAt: 5, available: false },
    ],
    productCard: product => product.name,
    finalPrice: product => product.price,
    refreshIcons() {},
  };

  runInNewContext(homeScriptText, context);
  context.window.filterNewArrivals('under-999');
  assert.equal(grid.innerHTML, 'Budget');

  context.window.filterNewArrivals('under-1999');
  assert.equal(grid.innerHTML, 'Lower BoundaryBudget');

  context.window.filterNewArrivals('1999-plus');
  assert.equal(grid.innerHTML, 'PremiumUpper Boundary');
  assert.match(homeText, /Exchange &amp; Returns/);
  assert.match(homeText, /₹149 reverse-shipping charge/);
  assert.match(homeText, /contact\.html/);
});

test('product image uploads report Firebase failures instead of hanging forever', () => {
  assert.match(dataText, /uploadTask\.on\('state_changed'/);
  assert.match(dataText, /Image upload timed out/);
  assert.match(dataText, /storage\/unauthorized/);
  assert.match(dataText, /saving this small image in Firestore instead/);
});
