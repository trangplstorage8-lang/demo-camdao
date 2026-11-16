import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LONG_40_CHAR_PROFILE_LABEL,
  MAIN_PRODUCTS,
  MAIN_PROVIDERS,
  STRESS_20_PROVIDERS,
  STRESS_EXTRA_PRODUCTS,
} from '../data/fixtures';
import {
  buildOrderMessage,
  filterProducts,
  getCardPricingSummary,
  resolveOptionTiers,
  resolveProfileState,
  validateOrderForm,
} from './catalogLogic';

test('S01: Fixture has 4 providers and 8 products with correct card CTA/pricing', () => {
  assert.equal(MAIN_PROVIDERS.length, 4);
  assert.equal(MAIN_PRODUCTS.length, 8);
  assert.equal(STRESS_20_PROVIDERS.length, 20);
  assert.equal(LONG_40_CHAR_PROFILE_LABEL.length, 40);

  const nfPrem = MAIN_PRODUCTS.find((p) => p.id === 'nf-prem')!;
  const nfPremSummary = getCardPricingSummary(nfPrem);
  assert.equal(nfPremSummary.formattedPrice, 'Từ 79.000 ₫');
  assert.equal(nfPremSummary.ctaLabel, 'Chọn gói');
  assert.equal(nfPremSummary.ctaDisabled, false);

  const nfStd = MAIN_PRODUCTS.find((p) => p.id === 'nf-std')!;
  const nfStdSummary = getCardPricingSummary(nfStd);
  assert.equal(nfStdSummary.formattedPrice, '239.000 ₫');
  assert.equal(nfStdSummary.ctaLabel, 'Đặt');

  const spFam = MAIN_PRODUCTS.find((p) => p.id === 'sp-fam')!;
  const spFamSummary = getCardPricingSummary(spFam);
  assert.equal(spFamSummary.ctaLabel, '⏸ Tạm hết');
  assert.equal(spFamSummary.ctaDisabled, true);
});

test('S02: Filtering by Netflix and non-matching query', () => {
  const netflixList = filterProducts(MAIN_PRODUCTS, 'Netflix', 'netflix');
  assert.equal(netflixList.length, 2);

  const emptyList = filterProducts(MAIN_PRODUCTS, 'khong-ton-tai', 'all');
  assert.equal(emptyList.length, 0);

  const resetList = filterProducts(MAIN_PRODUCTS, '', 'all');
  assert.equal(resetList.length, 8);
});

test('S03: Option tier dependencies, sold-out 12-month shared combo, and warranty row hiding', () => {
  const nfPrem = MAIN_PRODUCTS.find((p) => p.id === 'nf-prem')!;

  // Chưa chọn thời hạn -> loại TK bị khoá
  const initial = resolveOptionTiers(nfPrem, null, null, null);
  assert.equal(initial.requiresOptionStep, true);
  assert.equal(initial.accountTypes.every((a) => !a.enabled), true);

  // Chọn 1 tháng + Dùng chung -> NF-1S 79.000 ₫, bảo hành 1 giá trị nên 0 hàng chọn bảo hành
  const step2 = resolveOptionTiers(nfPrem, '1 tháng', 'Dùng chung', null);
  assert.equal(step2.warranties.length, 0);
  assert.equal(step2.resolvedOffer?.code, 'NF-1S');
  assert.equal(step2.resolvedOffer?.priceVnd, 79000);

  // Chọn 12 tháng -> Dùng chung sold out & disabled
  const step12 = resolveOptionTiers(nfPrem, '12 tháng', null, null);
  const shared12 = step12.accountTypes.find((a) => a.value === 'Dùng chung')!;
  assert.equal(shared12.enabled, false);
  assert.equal(shared12.soldOut, true);

  // Gói 1 offer (Netflix Standard) bỏ qua bước chọn tầng
  const nfStd = MAIN_PRODUCTS.find((p) => p.id === 'nf-std')!;
  const stdTier = resolveOptionTiers(nfStd, null, null, null);
  assert.equal(stdTier.requiresOptionStep, false);
  assert.equal(stdTier.resolvedOffer?.code, 'NF-STD-1P');

  // Stress 3x3x2 hiện hàng bảo hành khi có >1 giá trị bảo hành
  const stressMatrix = STRESS_EXTRA_PRODUCTS.find((p) => p.id === 'stress-matrix-332')!;
  const stressWarranties = resolveOptionTiers(stressMatrix, '1 tháng', 'Dùng chung', '30 ngày');
  assert.deepEqual(stressWarranties.warranties, ['7 ngày', '30 ngày']);
  assert.equal(stressWarranties.resolvedOffer?.code, 'CL-1S-30D');
});

test('S04: All profile resolution modes (5 default, 12 full, 0 empty, 1 auto, stale, error, legacy)', () => {
  const emptyRes = resolveProfileState('empty-0', '2');
  assert.equal(emptyRes.uiKind, 'hidden-empty');

  const singleRes = resolveProfileState('single-1', '');
  assert.equal(singleRes.uiKind, 'options');
  assert.equal(singleRes.resolvedValue, '1');
  assert.equal(singleRes.autoSelectedSingle, true);

  const staleRes = resolveProfileState('stale-selected', '99');
  assert.equal(staleRes.uiKind, 'options');
  assert.equal(staleRes.resolvedValue, '');
  assert.equal(staleRes.staleCleared, true);

  const errRes = resolveProfileState('error-load', '');
  assert.equal(errRes.uiKind, 'error');

  const legacyRes = resolveProfileState('legacy-missing', 'Hồ sơ tự nhập');
  assert.equal(legacyRes.uiKind, 'manual-legacy');
  assert.equal(legacyRes.resolvedValue, 'Hồ sơ tự nhập');
});

test('S05 & S06: Form validation and Zalo message generation without duplicate accountType or raw value leak', () => {
  const nfPrem = MAIN_PRODUCTS.find((p) => p.id === 'nf-prem')!;
  const nf1s = nfPrem.offers.find((o) => o.code === 'NF-1S')!;
  const prof5 = resolveProfileState('default-5', '2');

  // Invalid PIN (2 digits)
  const invalidRes = validateOrderForm(nf1s, prof5, {
    profileValue: '2',
    pin: '12',
    email: '',
    note: '',
  });
  assert.equal(invalidRes.isValid, false);
  assert.ok(invalidRes.errors.pin);

  // Valid NF-1S order
  const validRes = validateOrderForm(nf1s, prof5, {
    profileValue: '2',
    pin: '1234',
    email: '',
    note: 'Nhắn mình sớm nhé',
  });
  assert.equal(validRes.isValid, true);

  const msg = buildOrderMessage({
    productName: nfPrem.name,
    offer: nf1s,
    profileResolution: prof5,
    input: { profileValue: '2', pin: '1234', email: '', note: 'Nhắn mình sớm nhé' },
    includePinInMessage: true,
  });

  assert.match(msg, /^Mình muốn đặt: Netflix Premium/);
  assert.match(msg, /Mã gói: NF-1S/);
  assert.match(msg, /Hồ sơ của bạn: Hồ sơ 2/);
  assert.doesNotMatch(msg, /Hồ sơ của bạn: 2$/m);
  assert.match(msg, /PIN: 1234/);
  assert.match(msg, /Bảo hành: 30 ngày/);

  // Toggle PIN off in demo config -> PIN omitted
  const msgNoPin = buildOrderMessage({
    productName: nfPrem.name,
    offer: nf1s,
    profileResolution: prof5,
    input: { profileValue: '2', pin: '1234', email: '', note: '' },
    includePinInMessage: false,
  });
  assert.doesNotMatch(msgNoPin, /PIN:/);

  // Netflix Standard: bảo hành null -> 0 dòng bảo hành; email validation
  const nfStd = MAIN_PRODUCTS.find((p) => p.id === 'nf-std')!;
  const nfStdOffer = nfStd.offers[0];
  const emptyProf = resolveProfileState('empty-0', '');
  const badEmail = validateOrderForm(nfStdOffer, emptyProf, {
    profileValue: '',
    pin: '',
    email: 'sai-dinh-dang',
    note: '',
  });
  assert.equal(badEmail.isValid, false);
  assert.ok(badEmail.errors.email);

  const goodEmail = validateOrderForm(nfStdOffer, emptyProf, {
    profileValue: '',
    pin: '',
    email: 'minh@example.test',
    note: '',
  });
  assert.equal(goodEmail.isValid, true);

  const stdMsg = buildOrderMessage({
    productName: nfStd.name,
    offer: nfStdOffer,
    profileResolution: emptyProf,
    input: { profileValue: '', pin: '', email: 'minh@example.test', note: '' },
    includePinInMessage: true,
  });
  assert.doesNotMatch(stdMsg, /Bảo hành:/);

  // S06-AC2: Product name containing accountType ("Dùng chung") omits duplicate line
  const stressProduct = STRESS_EXTRA_PRODUCTS[0];
  const stressOffer = stressProduct.offers[0];
  const stressMsg = buildOrderMessage({
    productName: stressProduct.name,
    offer: stressOffer,
    profileResolution: resolveProfileState('empty-0', ''),
    input: { profileValue: '', pin: '', email: '', note: '' },
    includePinInMessage: false,
  });
  const matches = stressMsg.match(/Dùng chung/gi) ?? [];
  assert.equal(matches.length, 1);
});
