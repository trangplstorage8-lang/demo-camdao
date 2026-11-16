export type OrderFieldType = 'profile' | 'pin' | 'email' | 'note';

export type ProfileScenarioMode =
  | 'default-5'
  | 'full-12'
  | 'empty-0'
  | 'single-1'
  | 'stale-selected'
  | 'error-load'
  | 'legacy-missing';

export interface ProfileOption {
  value: string;
  label: string;
}

export interface ProductOffer {
  id: string;
  duration: string;
  accountType: string;
  warranty: string | null; // null = chưa soát (ẩn trên UI & tin)
  priceVnd: number;
  code: string;
  available: boolean;
  orderFields: OrderFieldType[];
  defaultProfileMode?: ProfileScenarioMode;
}

export interface ProviderItem {
  id: string;
  name: string;
  accentHex: string;
  surfaceTintHex: string;
  logoSlotLabel: string;
}

export interface ProductItem {
  id: string;
  providerId: string;
  name: string;
  shortBenefit: string;
  thumbnailState: 'slot' | 'missing' | 'broken';
  offers: ProductOffer[];
}

export const MAIN_PROVIDERS: ProviderItem[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    accentHex: '#B91C1C',
    surfaceTintHex: '#FEE2E2',
    logoSlotLabel: 'Slot: netflix-logo.svg',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    accentHex: '#0F766E',
    surfaceTintHex: '#CCFBF1',
    logoSlotLabel: 'Slot: chatgpt-openai.svg',
  },
  {
    id: 'canva',
    name: 'Canva',
    accentHex: '#0284C7',
    surfaceTintHex: '#E0F2FE',
    logoSlotLabel: 'Slot: canva-logo.svg',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    accentHex: '#15803D',
    surfaceTintHex: '#DCFCE7',
    logoSlotLabel: 'Slot: spotify-logo.svg',
  },
];

export const MAIN_PRODUCTS: ProductItem[] = [
  {
    id: 'nf-prem',
    providerId: 'netflix',
    name: 'Netflix Premium',
    shortBenefit: 'Xem 4K HDR trên TV, điện thoại; chọn dùng chung hồ sơ hoặc tài khoản riêng.',
    thumbnailState: 'slot',
    offers: [
      {
        id: 'nf-prem-1s',
        duration: '1 tháng',
        accountType: 'Dùng chung',
        warranty: '30 ngày',
        priceVnd: 79000,
        code: 'NF-1S',
        available: true,
        orderFields: ['profile', 'pin', 'note'],
        defaultProfileMode: 'default-5',
      },
      {
        id: 'nf-prem-1p',
        duration: '1 tháng',
        accountType: 'Tài khoản riêng',
        warranty: '30 ngày',
        priceVnd: 219000,
        code: 'NF-1P',
        available: true,
        orderFields: ['email', 'note'],
      },
      {
        id: 'nf-prem-6s',
        duration: '6 tháng',
        accountType: 'Dùng chung',
        warranty: '180 ngày',
        priceVnd: 429000,
        code: 'NF-6S',
        available: true,
        orderFields: ['profile', 'pin', 'note'],
        defaultProfileMode: 'default-5',
      },
      {
        id: 'nf-prem-6p',
        duration: '6 tháng',
        accountType: 'Tài khoản riêng',
        warranty: '180 ngày',
        priceVnd: 1190000,
        code: 'NF-6P',
        available: true,
        orderFields: ['email', 'note'],
      },
      {
        id: 'nf-prem-12s',
        duration: '12 tháng',
        accountType: 'Dùng chung',
        warranty: '365 ngày',
        priceVnd: 790000,
        code: 'NF-12S',
        available: false, // Tổ hợp không bán theo fixture
        orderFields: ['profile', 'pin', 'note'],
      },
      {
        id: 'nf-prem-12p',
        duration: '12 tháng',
        accountType: 'Tài khoản riêng',
        warranty: '365 ngày',
        priceVnd: 2190000,
        code: 'NF-12P',
        available: true,
        orderFields: ['email', 'note'],
      },
    ],
  },
  {
    id: 'nf-std',
    providerId: 'netflix',
    name: 'Netflix Standard',
    shortBenefit: 'Chất lượng Full HD 1080p ổn định, cấp tài khoản riêng trọn tháng.',
    thumbnailState: 'slot',
    offers: [
      {
        id: 'nf-std-1p',
        duration: '1 tháng',
        accountType: 'Tài khoản riêng',
        warranty: null, // Chưa soát bảo hành -> ẩn trên card & tin
        priceVnd: 239000,
        code: 'NF-STD-1P',
        available: true,
        orderFields: ['email', 'note'],
      },
    ],
  },
  {
    id: 'cgpt-plus',
    providerId: 'chatgpt',
    name: 'ChatGPT Plus',
    shortBenefit: 'Nâng cấp trực tiếp trên email cá nhân hoặc nhận tài khoản cấp riêng.',
    thumbnailState: 'slot',
    offers: [
      {
        id: 'cgpt-plus-1o',
        duration: '1 tháng',
        accountType: 'Nâng cấp chính chủ',
        warranty: '30 ngày',
        priceVnd: 199000,
        code: 'GPT-PLUS-1O',
        available: true,
        orderFields: ['email', 'note'],
      },
      {
        id: 'cgpt-plus-1a',
        duration: '1 tháng',
        accountType: 'Cấp tài khoản riêng',
        warranty: '30 ngày',
        priceVnd: 229000,
        code: 'GPT-PLUS-1A',
        available: true,
        orderFields: ['note'],
      },
      {
        id: 'cgpt-plus-3o',
        duration: '3 tháng',
        accountType: 'Nâng cấp chính chủ',
        warranty: '90 ngày',
        priceVnd: 569000,
        code: 'GPT-PLUS-3O',
        available: true,
        orderFields: ['email', 'note'],
      },
    ],
  },
  {
    id: 'cgpt-pro',
    providerId: 'chatgpt',
    name: 'ChatGPT Pro',
    shortBenefit: 'Gói hiệu năng cao cho nghiên cứu & lập trình, nâng cấp qua email cá nhân.',
    thumbnailState: 'slot',
    offers: [
      {
        id: 'cgpt-pro-1o',
        duration: '1 tháng',
        accountType: 'Nâng cấp chính chủ',
        warranty: '30 ngày',
        priceVnd: 4890000,
        code: 'GPT-PRO-1O',
        available: true,
        orderFields: ['email', 'note'],
      },
    ],
  },
  {
    id: 'canva-pro',
    providerId: 'canva',
    name: 'Canva Pro',
    shortBenefit: 'Mở khoá kho mẫu, xoá nền và bộ nhận diện; mời qua email vào team hoặc riêng.',
    thumbnailState: 'slot',
    offers: [
      {
        id: 'cv-pro-1t',
        duration: '1 tháng',
        accountType: 'Tham gia Team',
        warranty: '30 ngày',
        priceVnd: 35000,
        code: 'CV-PRO-1T',
        available: true,
        orderFields: ['email', 'note'],
      },
      {
        id: 'cv-pro-12t',
        duration: '12 tháng',
        accountType: 'Tham gia Team',
        warranty: '365 ngày',
        priceVnd: 199000,
        code: 'CV-PRO-12T',
        available: true,
        orderFields: ['email', 'note'],
      },
      {
        id: 'cv-pro-12p',
        duration: '12 tháng',
        accountType: 'Tài khoản riêng',
        warranty: null, // Chưa soát -> ẩn
        priceVnd: 349000,
        code: 'CV-PRO-12P',
        available: true,
        orderFields: ['note'],
      },
    ],
  },
  {
    id: 'canva-biz',
    providerId: 'canva',
    name: 'Canva Business',
    shortBenefit: 'Phù hợp nhóm thiết kế cần quản lý thương hiệu và phân quyền thành viên.',
    thumbnailState: 'slot',
    offers: [
      {
        id: 'cv-biz-12p',
        duration: '12 tháng',
        accountType: 'Tài khoản riêng',
        warranty: '365 ngày',
        priceVnd: 690000,
        code: 'CV-BIZ-12P',
        available: true,
        orderFields: ['email', 'note'],
      },
    ],
  },
  {
    id: 'sp-prem',
    providerId: 'spotify',
    name: 'Spotify Premium',
    shortBenefit: 'Nghe nhạc không quảng cáo, tải ngoại tuyến trên chính tài khoản của bạn.',
    thumbnailState: 'slot',
    offers: [
      {
        id: 'sp-prem-1o',
        duration: '1 tháng',
        accountType: 'Nâng cấp chính chủ',
        warranty: '30 ngày',
        priceVnd: 29000,
        code: 'SP-1O',
        available: true,
        orderFields: ['email', 'note'],
      },
    ],
  },
  {
    id: 'sp-fam',
    providerId: 'spotify',
    name: 'Spotify Family',
    shortBenefit: 'Tham gia nhóm gia đình tiết kiệm theo tháng; tạm hết suất mở mới.',
    thumbnailState: 'slot',
    offers: [
      {
        id: 'sp-fam-1s',
        duration: '1 tháng',
        accountType: 'Slot Family',
        warranty: '30 ngày',
        priceVnd: 59000,
        code: 'SP-FAM-1S',
        available: false, // Tạm hết -> nút disable ⏸ Tạm hết
        orderFields: ['email', 'note'],
      },
    ],
  },
];

// Fixture hồ sơ (5 mặc định & 12 stress với nhãn cuối 40 ký tự)
export const PROFILE_5_DEFAULT: ProfileOption[] = [
  { value: '1', label: 'Hồ sơ 1' },
  { value: '2', label: 'Hồ sơ 2' },
  { value: '3', label: 'Hồ sơ 3' },
  { value: '4', label: 'Hồ sơ 4' },
  { value: '5', label: 'Hồ sơ 5' },
];

export const LONG_40_CHAR_PROFILE_LABEL = 'Hồ sơ 12 - Phòng khách gia đình 4K Ultra'; // 40 chars

export const PROFILE_12_FULL: ProfileOption[] = [
  { value: '1', label: 'Hồ sơ 1 - Phòng khách' },
  { value: '2', label: 'Hồ sơ 2' },
  { value: '3', label: 'Hồ sơ 3 - Cá nhân Minh' },
  { value: '4', label: 'Hồ sơ 4 - Thiết bị iPad' },
  { value: '5', label: 'Hồ sơ 5 - TV phòng ngủ' },
  { value: '6', label: 'Hồ sơ 6 - Máy tính bảng' },
  { value: '7', label: 'Hồ sơ 7 - Gói phụ cuối tuần' },
  { value: '8', label: 'Hồ sơ 8 - Laptop làm việc' },
  { value: '9', label: 'Hồ sơ 9 - Khách gia đình' },
  { value: '10', label: 'Hồ sơ 10 - Dự phòng 1' },
  { value: '11', label: 'Hồ sơ 11 - Dự phòng 2' },
  { value: '12', label: LONG_40_CHAR_PROFILE_LABEL },
];

export const PROFILE_1_SINGLE: ProfileOption[] = [
  { value: '1', label: 'Hồ sơ duy nhất' },
];

// Stress fixture: 20 providers cho chip hàng ngang
export const STRESS_20_PROVIDERS: ProviderItem[] = [
  ...MAIN_PROVIDERS,
  { id: 'claude', name: 'Claude', accentHex: '#C2410C', surfaceTintHex: '#FFEDD5', logoSlotLabel: 'Slot: claude-logo.svg' },
  { id: 'capcut', name: 'CapCut', accentHex: '#18181B', surfaceTintHex: '#F4F4F5', logoSlotLabel: 'Slot: capcut-logo.svg' },
  { id: 'youtube', name: 'YouTube', accentHex: '#DC2626', surfaceTintHex: '#FEE2E2', logoSlotLabel: 'Slot: youtube-logo.svg' },
  { id: 'adobe', name: 'Adobe CC', accentHex: '#991B1B', surfaceTintHex: '#FEE2E2', logoSlotLabel: 'Slot: adobe-logo.svg' },
  { id: 'notion', name: 'Notion', accentHex: '#27272A', surfaceTintHex: '#F4F4F5', logoSlotLabel: 'Slot: notion-logo.svg' },
  { id: 'figma', name: 'Figma', accentHex: '#7C3AED', surfaceTintHex: '#EDE9FE', logoSlotLabel: 'Slot: figma-logo.svg' },
  { id: 'grammarly', name: 'Grammarly', accentHex: '#047857', surfaceTintHex: '#D1FAE5', logoSlotLabel: 'Slot: grammarly-logo.svg' },
  { id: 'quillbot', name: 'QuillBot', accentHex: '#166534', surfaceTintHex: '#DCFCE7', logoSlotLabel: 'Slot: quillbot-logo.svg' },
  { id: 'duolingo', name: 'Duolingo', accentHex: '#15803D', surfaceTintHex: '#DCFCE7', logoSlotLabel: 'Slot: duolingo-logo.svg' },
  { id: 'microsoft', name: 'Microsoft 365', accentHex: '#1D4ED8', surfaceTintHex: '#DBEAFE', logoSlotLabel: 'Slot: m365-logo.svg' },
  { id: 'google-one', name: 'Google One', accentHex: '#2563EB', surfaceTintHex: '#DBEAFE', logoSlotLabel: 'Slot: googleone-logo.svg' },
  { id: 'icloud', name: 'iCloud+', accentHex: '#0369A1', surfaceTintHex: '#E0F2FE', logoSlotLabel: 'Slot: icloud-logo.svg' },
  { id: 'midjourney', name: 'Midjourney', accentHex: '#334155', surfaceTintHex: '#E2E8F0', logoSlotLabel: 'Slot: mj-logo.svg' },
  { id: 'cursor', name: 'Cursor', accentHex: '#0F172A', surfaceTintHex: '#E2E8F0', logoSlotLabel: 'Slot: cursor-logo.svg' },
  { id: 'perplexity', name: 'Perplexity', accentHex: '#0E7490', surfaceTintHex: '#CFFAFE', logoSlotLabel: 'Slot: pplx-logo.svg' },
  { id: 'elsa', name: 'ELSA Speak', accentHex: '#4338CA', surfaceTintHex: '#E0E7FF', logoSlotLabel: 'Slot: elsa-logo.svg' },
];

// Stress products: 12 thời hạn, ma trận 3x3x2 có tổ hợp thiếu, tên dài, không ảnh, ảnh hỏng
export const STRESS_EXTRA_PRODUCTS: ProductItem[] = [
  {
    id: 'stress-matrix-332',
    providerId: 'claude',
    name: 'Claude Pro Gói Dùng Chung Kiểm Thử Tên Sản Phẩm Rất Dài Để Soát Cắt Dòng Ở Mobile Và Desktop',
    shortBenefit:
      'Fixture stress ma trận 3 thời hạn × 3 loại tài khoản × 2 bảo hành (có tổ hợp thiếu) và tên chứa nhãn Dùng chung để test không lặp dòng.',
    thumbnailState: 'missing',
    offers: [
      // 1 tháng
      { id: 'st-1-s-7', duration: '1 tháng', accountType: 'Dùng chung', warranty: '7 ngày', priceVnd: 129000, code: 'CL-1S-7D', available: true, orderFields: ['profile', 'pin', 'note'], defaultProfileMode: 'full-12' },
      { id: 'st-1-s-30', duration: '1 tháng', accountType: 'Dùng chung', warranty: '30 ngày', priceVnd: 159000, code: 'CL-1S-30D', available: true, orderFields: ['profile', 'pin', 'note'], defaultProfileMode: 'full-12' },
      { id: 'st-1-p-30', duration: '1 tháng', accountType: 'Tài khoản riêng', warranty: '30 ngày', priceVnd: 499000, code: 'CL-1P-30D', available: true, orderFields: ['email', 'note'] },
      // 3 tháng (thiếu Tài khoản riêng)
      { id: 'st-3-s-7', duration: '3 tháng', accountType: 'Dùng chung', warranty: '7 ngày', priceVnd: 359000, code: 'CL-3S-7D', available: true, orderFields: ['profile', 'pin', 'note'] },
      { id: 'st-3-o-30', duration: '3 tháng', accountType: 'Nâng cấp chính chủ', warranty: '30 ngày', priceVnd: 1390000, code: 'CL-3O-30D', available: true, orderFields: ['email', 'note'] },
      // 6 tháng (thiếu Dùng chung available)
      { id: 'st-6-s-7', duration: '6 tháng', accountType: 'Dùng chung', warranty: '7 ngày', priceVnd: 699000, code: 'CL-6S-7D', available: false, orderFields: ['profile', 'pin', 'note'] },
      { id: 'st-6-p-30', duration: '6 tháng', accountType: 'Tài khoản riêng', warranty: '30 ngày', priceVnd: 2690000, code: 'CL-6P-30D', available: true, orderFields: ['email', 'note'] },
    ],
  },
  {
    id: 'stress-12-durations',
    providerId: 'capcut',
    name: 'CapCut Pro 12 Thời Hạn (Cuộn Ngang)',
    shortBenefit: 'Kiểm tra hàng chip 12 thời hạn cuộn ngang nội bộ và slot ảnh hỏng fallback.',
    thumbnailState: 'broken',
    offers: Array.from({ length: 12 }, (_, idx) => {
      const m = idx + 1;
      return {
        id: `cc-${m}m`,
        duration: `${m} tháng`,
        accountType: 'Nâng cấp chính chủ',
        warranty: m >= 6 ? '180 ngày' : '30 ngày',
        priceVnd: m * 45000,
        code: `CC-${m}M`,
        available: m !== 11, // tháng 11 không bán để test
        orderFields: ['email', 'note'] as OrderFieldType[],
      };
    }),
  },
];

export type ScreenKey =
  | 'danh-sach'
  | 'tuy-chon'
  | 'dat-ho-so'
  | 'dat-rieng'
  | 'ho-so-day'
  | 'tin-chep'
  | 'mo-zalo'
  | 'rong'
  | 'loi-tai'
  | 'loi-nhap'
  | 'loi-chep'
  | 'ho-so-rong'
  | 'ho-so-cu'
  | 'ho-so-mot'
  | 'ho-so-loi';

export const SCREEN_DEFINITIONS: { key: ScreenKey; title: string; summary: string }[] = [
  { key: 'danh-sach', title: 'Danh sách gói', summary: '8 gói / 4 nguồn, tìm kiếm, lọc nguồn, giá 1/nhiều offer, có hàng & tạm hết' },
  { key: 'tuy-chon', title: 'Chọn tùy chọn', summary: 'Chọn thời hạn -> mở khoá loại TK, tổ hợp không bán báo hết & disabled' },
  { key: 'dat-ho-so', title: 'Đặt có hồ sơ/PIN', summary: 'Chọn hồ sơ, PIN 4 số che, ghi chú, xem trước tin theo đúng thứ tự' },
  { key: 'dat-rieng', title: 'Đặt gói riêng/Email', summary: 'Chỉ hiện Email theo yêu cầu gói, ẩn hoàn toàn trường hồ sơ/PIN' },
  { key: 'ho-so-day', title: 'Danh sách 12 hồ sơ', summary: 'Trang con trong cùng sheet: tìm hồ sơ, nhãn dài 40 ký tự, nút Đơn đặt' },
  { key: 'tin-chep', title: 'Tin chép', summary: 'Xem trước đủ nội dung + Mã gói + trạng thái Đã chép thành công' },
  { key: 'mo-zalo', title: 'Mở Zalo', summary: 'Mô phỏng chuyển app, hướng dẫn dán, cảnh báo tin chưa gửi' },
  { key: 'rong', title: 'Không có kết quả', summary: 'Từ khoá không khớp -> 0 card -> nút Xoá tìm kiếm phục hồi 8 gói' },
  { key: 'loi-tai', title: 'Lỗi tải', summary: 'Lỗi tải danh sách -> bấm Thử lại -> 3 khung xám loading -> phục hồi' },
  { key: 'loi-nhap', title: 'Lỗi nhập', summary: 'Chỉ lỗi đúng từng ô thiếu/sai, tắt nút Chép tin cho tới khi hợp lệ' },
  { key: 'loi-chep', title: 'Clipboard bị chặn', summary: 'Không báo Đã chép giả; giữ tin trong ô chọn/chép thủ công' },
  { key: 'ho-so-rong', title: '0 hồ sơ được cấp', summary: 'Ẩn ô chọn hồ sơ và bỏ dòng Hồ sơ của bạn khỏi tin xem trước' },
  { key: 'ho-so-cu', title: 'Giá trị cũ không hợp lệ', summary: 'Xoá giá trị cũ không còn trong options và yêu cầu chọn lại' },
  { key: 'ho-so-mot', title: 'Chỉ 1 hồ sơ', summary: 'Tự động chọn hồ sơ duy nhất, không bắt khách thao tác thừa' },
  { key: 'ho-so-loi', title: 'Hồ sơ chưa tải được', summary: 'Lỗi tải options có nút Thử lại, tách biệt rõ với 0 hồ sơ & legacy' },
];

export interface FlowStepGuide {
  flowId: string;
  storyId: string;
  title: string;
  steps: { screen: ScreenKey; note: string }[];
}

export const FLOW_GUIDES: FlowStepGuide[] = [
  {
    flowId: 'F01',
    storyId: 'S01',
    title: 'Xem & hiểu bảng giá',
    steps: [
      { screen: 'danh-sach', note: 'Mở bảng giá: 4 nguồn, 8 card, mỗi sản phẩm 1 card, giá Từ X hoặc giá chốt.' },
    ],
  },
  {
    flowId: 'F02',
    storyId: 'S02',
    title: 'Tìm & lọc nguồn',
    steps: [
      { screen: 'danh-sach', note: 'Tìm "Netflix" và lọc nguồn Netflix -> còn 2 gói.' },
      { screen: 'rong', note: 'Tìm từ khoá không khớp -> hiện trạng thái rỗng và nút Xoá tìm kiếm.' },
      { screen: 'loi-tai', note: 'Gặp lỗi tải -> bấm Thử lại -> qua 3 skeleton loading -> khôi phục 8 gói.' },
    ],
  },
  {
    flowId: 'F03',
    storyId: 'S03',
    title: 'Chọn tổ hợp gói bán',
    steps: [
      { screen: 'tuy-chon', note: 'Chọn thời hạn mở khoá loại TK; 12 tháng Dùng chung bị khoá (hết).' },
      { screen: 'dat-rieng', note: 'Gói 1 offer (Netflix Standard / Spotify Premium) bỏ qua tầng chọn, vào thẳng Đặt.' },
      { screen: 'dat-ho-so', note: 'Đủ tổ hợp (NF-1S) -> điền Hồ sơ / PIN / Ghi chú.' },
    ],
  },
  {
    flowId: 'F04',
    storyId: 'S04',
    title: 'Chọn hồ sơ được cấp',
    steps: [
      { screen: 'dat-ho-so', note: 'Mặc định chưa chọn; chạm Hồ sơ 2 -> xem trước in Hồ sơ của bạn: Hồ sơ 2.' },
      { screen: 'ho-so-day', note: 'Bấm Xem cả 12 hồ sơ -> tìm nhãn dài 40 ký tự -> chọn và quay Đơn đặt.' },
      { screen: 'ho-so-mot', note: 'Kiểm nhánh đặc biệt: 1 hồ sơ tự chọn, 0 hồ sơ ẩn dòng, giá trị cũ xoá, lỗi tải có Thử lại.' },
    ],
  },
  {
    flowId: 'F05',
    storyId: 'S05',
    title: 'Điền thông tin đặt',
    steps: [
      { screen: 'loi-nhap', note: 'Thiếu hoặc sai định dạng -> báo lỗi ngay dưới ô, tắt nút Chép tin.' },
      { screen: 'dat-rieng', note: 'Nhập email hợp lệ (minh@example.test) -> lỗi biến mất, bật nút Chép tin.' },
      { screen: 'dat-ho-so', note: 'Hồ sơ -> PIN (che) -> Ghi chú; mọi dữ liệu chỉ nằm trong RAM.' },
    ],
  },
  {
    flowId: 'F06',
    storyId: 'S06',
    title: 'Xem trước & chép tin',
    steps: [
      { screen: 'tin-chep', note: 'Tin đủ Mã gói NF-1S, không lặp loại TK trong tên; bấm Chép -> Đã chép.' },
      { screen: 'loi-chep', note: 'Khi clipboard bị chặn -> không báo thành công giả, cho chọn & chép tay.' },
    ],
  },
  {
    flowId: 'F07',
    storyId: 'S07',
    title: 'Mở Zalo & quay lại',
    steps: [
      { screen: 'mo-zalo', note: 'Bấm Mở Zalo (không tự chép, không tự gửi) -> xem hướng dẫn dán.' },
      { screen: 'danh-sach', note: 'Quay lại bảng giá -> giữ bộ lọc & hồ sơ phiên; mở lại cùng gói sẽ xoá PIN.' },
    ],
  },
];
