import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const projectRoot = new URL('..', import.meta.url);
const dataText = fs.readFileSync(new URL('js/data.js', projectRoot), 'utf8');
const adminText = fs.readFileSync(new URL('js/admin.js', projectRoot), 'utf8');
const sharedText = fs.readFileSync(new URL('js/shared.js', projectRoot), 'utf8');
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

test('admin passcode is shared through Firebase instead of localStorage', () => {
  assert.match(dataText, /hashAdminPasscode|saveAdminPasscode|settings.*admin/s);
  assert.match(adminText, /await hashAdminPasscode\(val\)|await getAdminPasscode\(\)/);
  assert.doesNotMatch(dataText, /kp_admin_pass|admin123/);
  assert.doesNotMatch(adminText, /kp_admin_pass|getAdminPass\(/);
});

test('admin products support Firebase Storage uploads without duplicate featured cards', () => {
  assert.match(dataText, /uploadProductImage|firebase\.storage/);
  assert.match(adminText, /imageFile|image2File|await uploadProductImage/);
  assert.match(sharedText, /products\.filter\(p => p\.featured && p\.available\)/);
  assert.doesNotMatch(sharedText, /\.concat\(products\.filter/);
});
