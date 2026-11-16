import {
  OrderFieldType,
  ProductItem,
  ProductOffer,
  ProfileOption,
  ProfileScenarioMode,
  PROFILE_12_FULL,
  PROFILE_1_SINGLE,
  PROFILE_5_DEFAULT,
} from '../data/fixtures';

export interface CardPricingSummary {
  hasSellable: boolean;
  isSingleOffer: boolean;
  minPriceVnd: number | null;
  formattedPrice: string;
  ctaLabel: 'Đặt' | 'Chọn gói' | '⏸ Tạm hết';
  ctaDisabled: boolean;
}

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} ₫`;
}

export function getCardPricingSummary(product: ProductItem): CardPricingSummary {
  const sellable = product.offers.filter((o) => o.available);
  if (sellable.length === 0) {
    return {
      hasSellable: false,
      isSingleOffer: false,
      minPriceVnd: null,
      formattedPrice: 'Tạm hết',
      ctaLabel: '⏸ Tạm hết',
      ctaDisabled: true,
    };
  }
  const minPrice = Math.min(...sellable.map((o) => o.priceVnd));
  if (sellable.length === 1) {
    return {
      hasSellable: true,
      isSingleOffer: true,
      minPriceVnd: minPrice,
      formattedPrice: formatVnd(minPrice),
      ctaLabel: 'Đặt',
      ctaDisabled: false,
    };
  }
  return {
    hasSellable: true,
    isSingleOffer: false,
    minPriceVnd: minPrice,
    formattedPrice: `Từ ${formatVnd(minPrice)}`,
    ctaLabel: 'Chọn gói',
    ctaDisabled: false,
  };
}

export function filterProducts(
  products: ProductItem[],
  searchQuery: string,
  providerId: string | 'all'
): ProductItem[] {
  const q = searchQuery.trim().toLowerCase();
  return products.filter((p) => {
    if (providerId !== 'all' && p.providerId !== providerId) return false;
    if (!q) return true;
    const matchName = p.name.toLowerCase().includes(q);
    const matchDesc = p.shortBenefit.toLowerCase().includes(q);
    const matchCode = p.offers.some((o) => o.code.toLowerCase().includes(q));
    return matchName || matchDesc || matchCode;
  });
}

export interface OptionTierChoices {
  durations: { value: string; hasAvailable: boolean }[];
  accountTypes: { value: string; enabled: boolean; soldOut: boolean }[];
  warranties: string[]; // Chỉ hiện hàng chọn nếu > 1 giá trị khác null
  resolvedOffer: ProductOffer | null;
  requiresOptionStep: boolean;
}

export function resolveOptionTiers(
  product: ProductItem,
  selectedDuration: string | null,
  selectedAccountType: string | null,
  selectedWarranty: string | null
): OptionTierChoices {
  const sellableOffers = product.offers.filter((o) => o.available);
  const requiresOptionStep = sellableOffers.length > 1;

  if (!requiresOptionStep) {
    const single = sellableOffers[0] ?? null;
    return {
      durations: single ? [{ value: single.duration, hasAvailable: true }] : [],
      accountTypes: single
        ? [{ value: single.accountType, enabled: true, soldOut: false }]
        : [],
      warranties: [],
      resolvedOffer: single,
      requiresOptionStep: false,
    };
  }

  // Unique durations preserving order
  const durationList: string[] = [];
  for (const o of product.offers) {
    if (!durationList.includes(o.duration)) durationList.push(o.duration);
  }
  const durations = durationList.map((d) => ({
    value: d,
    hasAvailable: product.offers.some((o) => o.duration === d && o.available),
  }));

  // Unique account types across product
  const accountTypeList: string[] = [];
  for (const o of product.offers) {
    if (!accountTypeList.includes(o.accountType)) accountTypeList.push(o.accountType);
  }

  const accountTypes = accountTypeList.map((at) => {
    if (!selectedDuration) {
      return { value: at, enabled: false, soldOut: false };
    }
    const matching = product.offers.filter(
      (o) => o.duration === selectedDuration && o.accountType === at
    );
    if (matching.length === 0) {
      return { value: at, enabled: false, soldOut: true };
    }
    const anyAvailable = matching.some((o) => o.available);
    return { value: at, enabled: anyAvailable, soldOut: !anyAvailable };
  });

  // Warranties for selectedDuration + selectedAccountType
  let warranties: string[] = [];
  let resolvedOffer: ProductOffer | null = null;

  if (selectedDuration && selectedAccountType) {
    const matching = product.offers.filter(
      (o) =>
        o.duration === selectedDuration &&
        o.accountType === selectedAccountType &&
        o.available
    );
    const knownWarranties = Array.from(
      new Set(matching.map((m) => m.warranty).filter((w): w is string => Boolean(w)))
    );

    if (knownWarranties.length > 1) {
      warranties = knownWarranties;
      if (selectedWarranty && knownWarranties.includes(selectedWarranty)) {
        resolvedOffer =
          matching.find((m) => m.warranty === selectedWarranty) ?? null;
      }
    } else {
      // <= 1 warranty value -> không hiện hàng chọn bảo hành (S03-AC3)
      warranties = [];
      resolvedOffer = matching[0] ?? null;
    }
  }

  return {
    durations,
    accountTypes,
    warranties,
    resolvedOffer,
    requiresOptionStep: true,
  };
}

export interface ProfileStateResolution {
  uiKind: 'options' | 'hidden-empty' | 'manual-legacy' | 'error';
  options: ProfileOption[];
  resolvedValue: string;
  staleCleared: boolean;
  autoSelectedSingle: boolean;
}

export function getProfileOptionsForMode(mode: ProfileScenarioMode): {
  status: 'ok' | 'error' | 'legacy-undefined';
  options: ProfileOption[];
} {
  switch (mode) {
    case 'default-5':
      return { status: 'ok', options: PROFILE_5_DEFAULT };
    case 'full-12':
      return { status: 'ok', options: PROFILE_12_FULL };
    case 'empty-0':
      return { status: 'ok', options: [] };
    case 'single-1':
      return { status: 'ok', options: PROFILE_1_SINGLE };
    case 'stale-selected':
      return { status: 'ok', options: PROFILE_5_DEFAULT };
    case 'error-load':
      return { status: 'error', options: [] };
    case 'legacy-missing':
      return { status: 'legacy-undefined', options: [] };
  }
}

export function resolveProfileState(
  mode: ProfileScenarioMode,
  previousValue: string
): ProfileStateResolution {
  const source = getProfileOptionsForMode(mode);
  if (source.status === 'error') {
    return {
      uiKind: 'error',
      options: [],
      resolvedValue: '',
      staleCleared: false,
      autoSelectedSingle: false,
    };
  }
  if (source.status === 'legacy-undefined') {
    return {
      uiKind: 'manual-legacy',
      options: [],
      resolvedValue: previousValue,
      staleCleared: false,
      autoSelectedSingle: false,
    };
  }
  if (source.options.length === 0) {
    return {
      uiKind: 'hidden-empty',
      options: [],
      resolvedValue: '',
      staleCleared: false,
      autoSelectedSingle: false,
    };
  }
  if (source.options.length === 1) {
    return {
      uiKind: 'options',
      options: source.options,
      resolvedValue: source.options[0].value,
      staleCleared: false,
      autoSelectedSingle: true,
    };
  }
  // Check stale value
  if (previousValue && !source.options.some((o) => o.value === previousValue)) {
    return {
      uiKind: 'options',
      options: source.options,
      resolvedValue: '',
      staleCleared: true,
      autoSelectedSingle: false,
    };
  }
  return {
    uiKind: 'options',
    options: source.options,
    resolvedValue: previousValue,
    staleCleared: false,
    autoSelectedSingle: false,
  };
}

export interface OrderFormInput {
  profileValue: string; // option value or manual text
  pin: string;
  email: string;
  note: string;
}

export interface OrderValidationResult {
  isValid: boolean;
  errors: Partial<Record<OrderFieldType, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateOrderForm(
  offer: ProductOffer | null,
  profileResolution: ProfileStateResolution,
  input: OrderFormInput
): OrderValidationResult {
  if (!offer) {
    return { isValid: false, errors: {} };
  }
  const errors: Partial<Record<OrderFieldType, string>> = {};
  const fields = offer.orderFields;

  if (fields.includes('profile')) {
    if (profileResolution.uiKind === 'error') {
      errors.profile = 'Chưa tải được danh sách hồ sơ. Vui lòng thử lại.';
    } else if (profileResolution.uiKind === 'manual-legacy') {
      if (!input.profileValue.trim()) {
        errors.profile = 'Vui lòng nhập tên hồ sơ của bạn.';
      }
    } else if (profileResolution.uiKind === 'options') {
      if (!input.profileValue) {
        errors.profile = profileResolution.staleCleared
          ? 'Giá trị hồ sơ cũ không còn hợp lệ. Vui lòng chọn hồ sơ.'
          : 'Vui lòng chọn hồ sơ của bạn.';
      }
    }
    // hidden-empty (0 profiles) -> not required, hidden!
  }

  if (fields.includes('pin')) {
    if (!/^\d{4}$/.test(input.pin)) {
      errors.pin = 'Vui lòng nhập đủ 4 chữ số PIN.';
    }
  }

  if (fields.includes('email')) {
    const trimmed = input.email.trim();
    if (!trimmed) {
      errors.email = 'Vui lòng nhập Email nhận gói.';
    } else if (!EMAIL_REGEX.test(trimmed)) {
      errors.email = 'Email chưa đúng định dạng (ví dụ: minh@example.test).';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface BuildOrderMessageParams {
  productName: string;
  offer: ProductOffer;
  profileResolution: ProfileStateResolution;
  input: OrderFormInput;
  includePinInMessage: boolean;
}

export function buildOrderMessage({
  productName,
  offer,
  profileResolution,
  input,
  includePinInMessage,
}: BuildOrderMessageParams): string {
  const lines: string[] = [];
  lines.push(`Mình muốn đặt: ${productName}`);
  lines.push(`Thời hạn: ${offer.duration}`);

  // S06-AC2: Không lặp loại tài khoản nếu đã nằm nguyên trong tên gói (case-insensitive)
  const nameLower = productName.toLowerCase();
  const typeLower = offer.accountType.toLowerCase();
  if (!nameLower.includes(typeLower)) {
    lines.push(`Loại tài khoản: ${offer.accountType}`);
  }

  lines.push(`Giá: ${formatVnd(offer.priceVnd)}`);
  lines.push(`Mã gói: ${offer.code}`);

  // Hồ sơ (hiển thị nhãn label, không in raw value; ẩn nếu 0 options hoặc unresolved)
  if (offer.orderFields.includes('profile')) {
    if (profileResolution.uiKind === 'options' && input.profileValue) {
      const matched = profileResolution.options.find(
        (o) => o.value === input.profileValue
      );
      if (matched) {
        lines.push(`Hồ sơ của bạn: ${matched.label}`);
      }
    } else if (
      profileResolution.uiKind === 'manual-legacy' &&
      input.profileValue.trim()
    ) {
      lines.push(`Hồ sơ của bạn: ${input.profileValue.trim()}`);
    }
  }

  // Email nếu gói yêu cầu
  if (offer.orderFields.includes('email') && input.email.trim()) {
    lines.push(`Email nhận gói: ${input.email.trim()}`);
  }

  // Bảo hành chỉ in khi đã biết (ẩn khi null / chưa soát)
  if (offer.warranty) {
    lines.push(`Bảo hành: ${offer.warranty}`);
  }

  // PIN chỉ theo cấu hình demo được ghi rõ
  if (
    offer.orderFields.includes('pin') &&
    includePinInMessage &&
    /^\d{4}$/.test(input.pin)
  ) {
    lines.push(`PIN: ${input.pin}`);
  }

  // Ghi chú nếu có
  if (offer.orderFields.includes('note') && input.note.trim()) {
    lines.push(`Ghi chú: ${input.note.trim()}`);
  }

  return lines.join('\n');
}
