/* ============================================================
   Home Page — Hero carousel & page init
   ============================================================ */

const heroData = [
  { kicker: 'The Jaipur Edit', title: 'Effortless<br>Elegance', sub: 'Curated designer pieces blending Rajasthani craft with contemporary silhouettes \u2014 made for the modern woman.' },
  { kicker: 'New Arrivals', title: 'Bold &amp;<br>Beautiful', sub: 'Handpicked ethnic wear and western styles that celebrate every silhouette.' },
  { kicker: 'Festive Edit', title: 'Timeless<br>Tradition', sub: 'Chikankari, Ajrakh and statement pieces \u2014 crafted for celebrations and everyday luxury.' },
];

let heroIndex = 0, heroTimer;

function setHero(i) {
  heroIndex = i;
  document.querySelectorAll('.hero-slide').forEach((s, idx) => s.classList.toggle('active', idx === i));
  document.querySelectorAll('.hero-dot').forEach((d, idx) => {
    d.classList.toggle('bg-cream', idx === i);
    d.classList.toggle('bg-cream/40', idx !== i);
    d.classList.toggle('active', idx === i);
  });
  const d = heroData[i];
  const k = document.getElementById('heroKicker');
  const t = document.getElementById('heroTitle');
  const sb = document.getElementById('heroSub');
  if (k) { k.textContent = d.kicker; t.innerHTML = d.title; sb.textContent = d.sub; }
}

function startHero() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => setHero((heroIndex + 1) % heroData.length), 5500);
}

function filterAndGo(cat) {
  window.location.href = 'catalog.html?category=' + encodeURIComponent(cat);
}

function renderReviews() {
  const container = document.getElementById('reviewsGrid');
  const stats = document.getElementById('reviewStats');
  if (!container) return;

  const reviewList = Array.isArray(reviews) && reviews.length ? reviews : DEFAULT_REVIEWS;
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewList.forEach(r => {
    const rating = Math.min(5, Math.max(1, Number(r.rating) || 5));
    counts[rating] = (counts[rating] || 0) + 1;
  });
  const maxCount = Math.max(...Object.values(counts), 1);

  if (stats) {
    stats.innerHTML = [5, 4, 3, 2, 1].map(star => {
      const count = counts[star] || 0;
      const width = (count / maxCount) * 100;
      return `
        <div class="review-stat-row">
          <span class="review-stat-label">${star} star</span>
          <div class="review-stat-bar">
            <span class="review-stat-fill" style="width:${width}%"></span>
          </div>
          <span class="review-stat-value">${count}</span>
        </div>
      `;
    }).join('');
  }

  const cards = reviewList.map(r => `
    <div class="review-card">
      <div class="flex gap-1 text-gold-soft mb-4">
        ${Array.from({ length: 5 }, (_, i) => `<i data-lucide="star" class="w-4 h-4 fill-current ${i < (Number(r.rating) || 5) ? 'text-gold-soft' : 'text-cream/20'}"></i>`).join('')}
      </div>
      <p class="text-cream/90 leading-relaxed mb-6">"${escapeHtml(r.text)}"</p>
      <p class="text-sm text-cream/60">— ${escapeHtml(r.name || r.source || 'Customer')}</p>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="review-marquee-track">
      <div class="review-marquee-group">${cards}${cards}</div>
    </div>
  `;
  refreshIcons();
}

window.addEventListener('DOMContentLoaded', () => {
  initShared();
  setHero(0);
  startHero();
  renderFeatured();
  renderReviews();
  refreshIcons();
});
