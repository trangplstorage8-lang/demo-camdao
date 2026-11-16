export type CoverStyleOption = 'discord-orange' | 'genz-boss';

export interface AssetManifestEntry {
  id: string;
  label: string;
  path: string;
  purpose: string;
  status: 'generated' | 'uploaded' | 'fallback-stress';
  sourceNote: string;
}

export const GENERATED_ASSETS = {
  catMascot: '/src/assets/images/cat_mascot_discord_1794844004275.jpg',
  genzBossCover: '/assets/aistudio/Screenshot_2026-11-16_225817_1b83c319.png',
  thumbnails: {
    netflix: '/src/assets/images/thumb_netflix_1794844004598.jpg',
    chatgpt: '/src/assets/images/thumb_chatgpt_1794844005347.jpg',
    canva: '/src/assets/images/thumb_canva_1794844006297.jpg',
    spotify: '/src/assets/images/thumb_spotify_1794844007459.jpg',
  } as Record<string, string>,
} as const;

export const COVER_STYLE_OPTIONS: {
  id: CoverStyleOption;
  label: string;
  audience: string;
}[] = [
  { id: 'discord-orange', label: 'Discord Cam', audience: 'Dark Gamer / Tech' },
  { id: 'genz-boss', label: 'GenZ · Boss Mèo', audience: 'GenZ Vênh Váo' },
];

export const CAMDAO_THEME = {
  brand: {
    wordmark: 'camdao',
    displayName: 'Cam Đào',
    tagline: 'Gói bạn cần, Cam Đào lo.',
    subtitle:
      'Chọn gói học tập, làm việc và giải trí. Xem rõ giá, thời hạn và chính sách bảo hành trước khi đặt.',
    genzSubtitle:
      'Chọn gói xịn giá nét cho học tập, làm việc và chill. Rõ giá, rõ thời hạn, bảo hành minh bạch trước khi chốt đơn.',
    supportPrompt: 'Chưa biết chọn gói nào? Nhắn Cam Đào nhé.',
    demoBadge: 'Bản minh họa — giá và dữ liệu mẫu',
  },
  colors: {
    bgTertiary: '#1E1F22',
    bgSecondary: '#2B2D31',
    bgPrimary: '#313338',
    bgHover: '#35373C',
    bgSelected: '#404249',
    borderSubtle: '#3F4147',
    textPrimary: '#F2F3F5',
    textSecondary: '#B5BAC1',
    textMuted: '#949BA4',
    brandOrange: '#C9450E',
    brandOrangeHover: '#B23B0A',
    brandOrangeBright: '#F97316',
    brandOrangeText: '#FF944D',
    genzPeachBg: '#FFE7CC',
    genzInk: '#23140B',
    genzInkMuted: '#4E3220',
    statusSuccessBg: '#15803D',
    statusSuccessText: '#4ADE80',
    statusWarnText: '#FACC15',
    statusErrorBg: '#DA373C',
    statusErrorText: '#FA777C',
  },
  typography: {
    displayFamily: '"Bricolage Grotesque", "Be Vietnam Pro", system-ui, sans-serif',
    sansFamily: '"Be Vietnam Pro", system-ui, sans-serif',
    monoFamily: '"JetBrains Mono", ui-monospace, monospace',
    note: 'Font pairing tối ưu tiếng Việt: Bricolage Grotesque (Display/Tiêu đề/Giá) + Be Vietnam Pro (Nội dung & Nút bấm) + JetBrains Mono (Mã gói).',
  },
  layout: {
    desktopMaxWidthPx: 1200,
    minTouchTargetPx: 44,
  },
} as const;

export const GENERATED_ASSETS_MANIFEST: AssetManifestEntry[] = [
  {
    id: 'cat-mascot-discord',
    label: 'cat_mascot_discord.jpg',
    path: GENERATED_ASSETS.catMascot,
    purpose: 'Mascot mèo cam đeo tai nghe phong cách Discord — avatar header & cover Discord Cam',
    status: 'generated',
    sourceNote: 'Generated bằng công cụ ảnh của phiên làm việc.',
  },
  {
    id: 'genz-boss-cover',
    label: 'genz_boss_cat_cover.png',
    path: GENERATED_ASSETS.genzBossCover,
    purpose: 'Cover option GenZ (“Sen chọn đi, boss ngồi đây.”) kết hợp decoration dấu chân mèo vênh váo',
    status: 'uploaded',
    sourceNote: 'Asset đính kèm từ người dùng trên nền kem đào #FFE7CC.',
  },
  {
    id: 'thumb-netflix',
    label: 'thumb_netflix.jpg',
    path: GENERATED_ASSETS.thumbnails.netflix,
    purpose: 'Thumbnail 1:1 cho Netflix Premium & Netflix Standard',
    status: 'generated',
    sourceNote: 'Generated 3D obsidian tile với viền sáng cam–đỏ.',
  },
  {
    id: 'thumb-chatgpt',
    label: 'thumb_chatgpt.jpg',
    path: GENERATED_ASSETS.thumbnails.chatgpt,
    purpose: 'Thumbnail 1:1 cho ChatGPT Plus & ChatGPT Pro',
    status: 'generated',
    sourceNote: 'Generated 3D dark slate tile với motif neural teal.',
  },
  {
    id: 'thumb-canva',
    label: 'thumb_canva.jpg',
    path: GENERATED_ASSETS.thumbnails.canva,
    purpose: 'Thumbnail 1:1 cho Canva Pro & Canva Business',
    status: 'generated',
    sourceNote: 'Generated 3D dark slate tile với lớp thẻ đồ hoạ cyan–tím.',
  },
  {
    id: 'thumb-spotify',
    label: 'thumb_spotify.jpg',
    path: GENERATED_ASSETS.thumbnails.spotify,
    purpose: 'Thumbnail 1:1 cho Spotify Premium & Spotify Family',
    status: 'generated',
    sourceNote: 'Generated 3D dark slate tile với vòng sóng âm xanh.',
  },
  {
    id: 'stress-missing-broken',
    label: 'stress missing / broken fallback',
    path: 'CSS/SVG Fallback',
    purpose: 'Kiểm thử trạng thái thiếu ảnh & ảnh hỏng trong bộ fixture stress',
    status: 'fallback-stress',
    sourceNote: 'Container dự phòng đạt chuẩn Zero-Broken-Image.',
  },
];
