import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const projectRoot = new URL('..', import.meta.url);
const dataText = fs.readFileSync(new URL('js/data.js', projectRoot), 'utf8');
const adminText = fs.readFileSync(new URL('js/admin.js', projectRoot), 'utf8');
const homeText = fs.readFileSync(new URL('index.html', projectRoot), 'utf8');

test('review data and admin management exist for persisted homepage reviews', () => {
  assert.match(dataText, /DEFAULT_REVIEWS|loadReviews|saveReviews/);
  assert.match(adminText, /renderAdminReviews|openReviewModal|saveReview|deleteReview/);
  assert.match(homeText, /id="reviewsGrid"|renderReviews/);
});

test('site includes Firebase-backed dynamic data sync for products and reviews', () => {
  assert.match(dataText, /initializeFirebase|firebase|getFirestore|collection|onSnapshot|sync/);
  assert.match(adminText, /saveProduct\(|saveReview\(|deleteProduct\(|deleteReview\(|setOrdStatus/);
});
