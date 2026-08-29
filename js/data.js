/* ============================================================
   Krishna Priya Fashion — Data & State Management
   Loaded on every page. Handles localStorage persistence,
   product catalog, cart, wishlist, enquiries, orders, settings.
   ============================================================ */

const WHATSAPP_ORDER = '917062601601';
const WHATSAPP_CHAT = '917062601601';
const PHONE = '+919251200453';

const firebaseConfig = {
  apiKey: 'AIzaSyChS_IqLnv4xT-ecChHgIuQD5Lc5Z4fSuw',
  authDomain: 'krishnapriya-d4f85.firebaseapp.com',
  projectId: 'krishnapriya-d4f85',
  storageBucket: 'krishnapriya-d4f85.firebasestorage.app',
  messagingSenderId: '256102119906',
  appId: '1:256102119906:web:daa66cc034d89973c3e1bb',
  measurementId: 'G-XD9YBFQYVS'
};

const DEFAULT_PRODUCTS = [
  { id:'p1', name:'Ajrakh Printed Cotton Kurti', brand:'NUON', category:'Ethnic Wear', price:1299, discount:10, image:'https://images.pexels.com/photos/28213774/pexels-photo-28213774.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/13178920/pexels-photo-13178920.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Hand-block Ajrakh print on breathable cotton.', featured:true, available:true },
  { id:'p2', name:'Pistachio Chikankari Kurti', brand:'Bombay Paisley', category:'Ethnic Wear', price:1899, discount:15, image:'https://images.pexels.com/photos/28512787/pexels-photo-28512787.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/8770996/pexels-photo-8770996.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Lucknowi chikankari in soft pistachio green.', featured:true, available:true },
  { id:'p3', name:'Oversized Suit Set', brand:'Zuba', category:'Ethnic Wear', price:2499, discount:0, image:'https://images.pexels.com/photos/19221256/pexels-photo-19221256.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/35485402/pexels-photo-35485402.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Three-piece oversized suit with dupatta.', featured:false, available:true },
  { id:'p4', name:'Floral Cotton Kurta', brand:'LUNA BLISS', category:'Ethnic Wear', price:999, discount:5, image:'https://images.pexels.com/photos/30809730/pexels-photo-30809730.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/37523792/pexels-photo-37523792.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Breezy floral cotton for everyday comfort.', featured:false, available:true },

  { id:'p5', name:'City Chic Black Dress', brand:'NUON', category:'Western Wear', price:1799, discount:20, image:'https://images.pexels.com/photos/19895958/pexels-photo-19895958.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/6138908/pexels-photo-6138908.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Minimal little black dress with clean lines.', featured:true, available:true },
  { id:'p6', name:'Embroidered Monochrome Set', brand:'Zuba', category:'Western Wear', price:2199, discount:10, image:'https://images.pexels.com/photos/32347615/pexels-photo-32347615.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/32498608/pexels-photo-32498608.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Black & white embroidered co-ord set.', featured:true, available:true },
  { id:'p7', name:'Summer Street Look', brand:'LUNA BLISS', category:'Western Wear', price:1499, discount:0, image:'https://images.pexels.com/photos/6181981/pexels-photo-6181981.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/37417167/pexels-photo-37417167.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Light summer outfit for everyday city wear.', featured:false, available:true },
  { id:'p8', name:'Velvet Evening Dress', brand:'Bombay Paisley', category:'Western Wear', price:2899, discount:25, image:'https://images.pexels.com/photos/35485402/pexels-photo-35485402.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/32347615/pexels-photo-32347615.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Rich black velvet dress for evening occasions.', featured:false, available:true },

  { id:'p9', name:'Cozy Knit Loungewear', brand:'LUNA BLISS', category:'Nightwear', price:899, discount:10, image:'https://images.pexels.com/photos/6968321/pexels-photo-6968321.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/35962942/pexels-photo-35962942.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Soft knit loungewear for relaxed mornings.', featured:true, available:true },
  { id:'p10', name:'Morning Coffee Set', brand:'NUON', category:'Nightwear', price:799, discount:0, image:'https://images.pexels.com/photos/6598666/pexels-photo-6598666.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/37220880/pexels-photo-37220880.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Comfortable cotton nightwear set.', featured:false, available:true },
  { id:'p11', name:'Blue Lounge Co-ord', brand:'Zuba', category:'Nightwear', price:1099, discount:15, image:'https://images.pexels.com/photos/37220941/pexels-photo-37220941.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/37220883/pexels-photo-37220883.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Relaxed blue loungewear co-ord set.', featured:false, available:true },

  { id:'p12', name:'Gold Bridal Jewelry Set', brand:'Bombay Paisley', category:'Cosmetics & Jewelry', price:3499, discount:10, image:'https://images.pexels.com/photos/28347073/pexels-photo-28347073.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/29038003/pexels-photo-29038003.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Intricate gold-tone bridal jewelry set.', featured:true, available:true },
  { id:'p13', name:'Traditional Earrings & Necklace', brand:'Zuba', category:'Cosmetics & Jewelry', price:1299, discount:5, image:'https://images.pexels.com/photos/8751528/pexels-photo-8751528.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/13786772/pexels-photo-13786772.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Statement earrings with matching necklace.', featured:false, available:true },
  { id:'p14', name:'Festive Floral Jewelry', brand:'LUNA BLISS', category:'Cosmetics & Jewelry', price:999, discount:0, image:'https://images.pexels.com/photos/29038003/pexels-photo-29038003.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/36519701/pexels-photo-36519701.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Floral-accent jewelry for festive occasions.', featured:false, available:true },
  { id:'p15', name:'Partywear Statement Suit', brand:'NUON', category:'Ethnic Wear', price:3299, discount:20, image:'https://images.pexels.com/photos/19221256/pexels-photo-19221256.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/8751528/pexels-photo-8751528.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Embellished partywear suit with rich detailing.', featured:true, available:true },
  { id:'p16', name:'Red Festive Kurti', brand:'Bombay Paisley', category:'Ethnic Wear', price:1599, discount:10, image:'https://images.pexels.com/photos/35521738/pexels-photo-35521738.jpeg?auto=compress&cs=tinysrgb&w=700', image2:'https://images.pexels.com/photos/37523793/pexels-photo-37523793.jpeg?auto=compress&cs=tinysrgb&w=700', desc:'Vibrant red kurti for festive celebrations.', featured:false, available:true },
];

const DEFAULT_REVIEWS = [
  { id:'r1', name:'Priya S.', rating:5, text:'Good service and friendly behaviour 😇👍🏻', source:'Google Review' },
  { id:'r2', name:'Nisha K.', rating:5, text:'Nice stuff and so many many variety, go and check out…', source:'Google Review' },
  { id:'r3', name:'Aditi M.', rating:5, text:'Good quality clothes.', source:'Google Review' },
];

let firebaseDb = null;
let firebaseSyncInProgress = false;

function initializeFirebase() {
  if (!window.firebase || !window.firebase.firestore) return null;
  if (!firebaseDb) {
    const existingApp = window.firebase.apps && window.firebase.apps.length ? window.firebase.apps[0] : window.firebase.initializeApp(firebaseConfig);
    firebaseDb = existingApp.firestore();
  }
  return firebaseDb;
}

function getFirebaseCollection(name) {
  const db = initializeFirebase();
  if (!db || typeof db.collection !== 'function') return null;
  return db.collection(name);
}

function persistCollectionToFirebase(name, items) {
  const collectionRef = getFirebaseCollection(name);
  if (!collectionRef || firebaseSyncInProgress) return;

  firebaseSyncInProgress = true;
  collectionRef.get().then(snapshot => {
    const batch = firebaseDb.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    (items || []).forEach(item => {
      const raw = { ...item };
      const docId = String(raw.id || `doc_${Date.now()}_${Math.random().toString(16).slice(2)}`);
      raw.id = docId;
      batch.set(collectionRef.doc(docId), raw);
    });
    return batch.commit();
  }).catch((error) => {
    console.warn('Firebase sync failed for ' + name, error);
  }).finally(() => {
    firebaseSyncInProgress = false;
  });
}

function applyRemoteCollection(name, list) {
  if (!Array.isArray(list)) return;
  if (name === 'products') {
    products = list;
    localStorage.setItem('kp_products', JSON.stringify(products));
    if (typeof window.renderFeatured === 'function') window.renderFeatured();
    if (typeof window.renderCatalog === 'function') window.renderCatalog();
    if (typeof window.renderAdminProducts === 'function') window.renderAdminProducts();
  }
  if (name === 'reviews') {
    reviews = list;
    localStorage.setItem('kp_reviews', JSON.stringify(reviews));
    if (typeof window.renderReviews === 'function') window.renderReviews();
    if (typeof window.renderAdminReviews === 'function') window.renderAdminReviews();
  }
}

function syncFirebaseCollections() {
  const collectionRefs = [
    { name: 'products', handler: value => applyRemoteCollection('products', value) },
    { name: 'reviews', handler: value => applyRemoteCollection('reviews', value) },
    { name: 'orders', handler: value => { const list = Array.isArray(value) ? value : []; localStorage.setItem('kp_orders', JSON.stringify(list)); if (typeof window.renderAdminOrders === 'function') window.renderAdminOrders(); } },
    { name: 'enquiries', handler: value => { const list = Array.isArray(value) ? value : []; localStorage.setItem('kp_enquiries', JSON.stringify(list)); if (typeof window.renderAdminEnquiries === 'function') window.renderAdminEnquiries(); } }
  ];

  collectionRefs.forEach(({ name, handler }) => {
    const collectionRef = getFirebaseCollection(name);
    if (!collectionRef) return;
    collectionRef.onSnapshot(snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      handler(list);
    }, error => console.warn('Firestore listener failed for ' + name, error));
  });
}

/* ---- State (initialized from localStorage) ---- */
let products = loadProducts();
let reviews = loadReviews();
let cart = JSON.parse(localStorage.getItem('kp_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('kp_wishlist') || '[]');
let currentOrderProduct = null;
let currentDiscount = 0;

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
    syncFirebaseCollections();
  }, { once: true });
}

/* ---- Persistence ---- */
function loadProducts() {
  const stored = localStorage.getItem('kp_products');
  if (stored) { try { return JSON.parse(stored); } catch(e) {} }
  localStorage.setItem('kp_products', JSON.stringify(DEFAULT_PRODUCTS));
  return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}
function saveProducts() {
  localStorage.setItem('kp_products', JSON.stringify(products));
  persistCollectionToFirebase('products', products);
}
function loadReviews() {
  const stored = localStorage.getItem('kp_reviews');
  if (stored) { try { return JSON.parse(stored); } catch(e) {} }
  localStorage.setItem('kp_reviews', JSON.stringify(DEFAULT_REVIEWS));
  return JSON.parse(JSON.stringify(DEFAULT_REVIEWS));
}
function saveReviews() {
  localStorage.setItem('kp_reviews', JSON.stringify(reviews));
  persistCollectionToFirebase('reviews', reviews);
}
function getEnquiries() { return JSON.parse(localStorage.getItem('kp_enquiries') || '[]'); }
function setEnquiries(e) {
  localStorage.setItem('kp_enquiries', JSON.stringify(e));
  persistCollectionToFirebase('enquiries', e);
}
function getOrders() { return JSON.parse(localStorage.getItem('kp_orders') || '[]'); }
function setOrders(o) {
  localStorage.setItem('kp_orders', JSON.stringify(o));
  persistCollectionToFirebase('orders', o);
}
function getGasUrl() { return localStorage.getItem('kp_gas_url') || ''; }
function getAdminPass() { return localStorage.getItem('kp_admin_pass') || 'admin123'; }

/* ---- Helpers ---- */
function finalPrice(p) { return Math.round(p.price * (1 - (p.discount || 0) / 100)); }
function formatINR(n) { return '\u20B9' + n.toLocaleString('en-IN'); }
function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
function refreshIcons() { if (window.lucide) lucide.createIcons(); }

/* ---- Google Apps Script push ---- */
function pushToSheets(payload) {
  const url = getGasUrl();
  if (!url) return;
  fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }).catch(() => {});
}

/* ---- Toast ---- */
function toast(msg) {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast bg-charcoal text-cream text-sm px-5 py-3 rounded-full shadow-lg';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2900);
}
