import React, { useState } from 'react';
import { ImageOff, Image as ImageIcon } from 'lucide-react';
import { ProductItem, ProviderItem } from '../data/fixtures';
import { GENERATED_ASSETS } from '../theme/camdaoTheme';

/**
 * Generated Cam Đào Orange Mascot Avatar / Hero Spotlight (Discord style)
 * Includes resilient Zero-Broken-Image fallback.
 */
export function CatMascotAvatar({
  size = 'sm',
}: {
  size?: 'sm' | 'lg';
}) {
  const [imgError, setImgError] = useState(false);

  if (size === 'sm') {
    return (
      <div className="relative w-10 h-10 rounded-full bg-[#1E1F22] border border-[#F97316]/60 overflow-hidden shrink-0 shadow-sm">
        {!imgError ? (
          <img
            src={GENERATED_ASSETS.catMascot}
            alt="Mascot mèo cam Cam Đào"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-extrabold text-[#FF944D]">
            CD
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#1E1F22] border border-[#F97316]/50 overflow-hidden shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
      {!imgError ? (
        <img
          src={GENERATED_ASSETS.catMascot}
          alt="Mascot mèo cam đeo tai nghe của Cam Đào"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-[#FF944D] p-2 text-center">
          <ImageIcon className="w-6 h-6 mb-1" aria-hidden="true" />
          <span className="text-[10px] font-bold">camdao</span>
        </div>
      )}
    </div>
  );
}

/**
 * Custom sassy cat paw print SVG with playful pointed claws ("chút vênh váo")
 */
export function SassyPawPrint({
  className = '',
  clawed = true,
  color = '#EA580C',
  accentColor = '#FB923C',
}: {
  className?: string;
  clawed?: boolean;
  color?: string;
  accentColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cheeky little pointed claw flicks */}
      {clawed && (
        <g fill={color}>
          <path d="M16 25L12 13L21 21Z" />
          <path d="M31 15L30 3L37 13Z" />
          <path d="M51 15L55 4L57 16Z" />
          <path d="M65 27L73 18L69 30Z" />
        </g>
      )}
      {/* 4 expressive toe beans */}
      <ellipse cx="18" cy="31" rx="6.2" ry="8.2" transform="rotate(-22 18 31)" fill={color} />
      <ellipse cx="33" cy="21" rx="6.4" ry="8.8" transform="rotate(-8 33 21)" fill={color} />
      <ellipse cx="51" cy="22" rx="6.4" ry="8.8" transform="rotate(10 51 22)" fill={color} />
      <ellipse cx="64" cy="34" rx="6" ry="8" transform="rotate(24 64 34)" fill={color} />

      {/* Plump asymmetric metacarpal pad */}
      <path
        d="M23 48C23 40.5 31 35 41 35C51 35 58.5 40.8 58.5 48.5C58.5 55.2 52.8 58.8 47.4 58.2C44.5 57.9 43.1 56.6 40.8 56.6C38.5 56.6 36.6 58.4 33.4 58.4C27.5 58.4 23 54.4 23 48Z"
        fill={color}
      />
      {/* Subtle glossy inner bean highlight for attitude */}
      <ellipse cx="39" cy="44" rx="7" ry="4" fill={accentColor} opacity="0.45" />
    </svg>
  );
}

/**
 * Strutting catwalk paw-trail backdrop for GenZ Boss Cat cover
 */
export function SassyPawTrail() {
  return (
    <div
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Top-left cheeky paw stamp */}
      <SassyPawPrint
        className="absolute -top-2 left-[42%] w-11 h-11 rotate-[24deg] opacity-[0.22]"
        clawed
        color="#EA580C"
        accentColor="#FDBA74"
      />
      {/* Diagonal confident strut across lower-left / center */}
      <SassyPawPrint
        className="hidden sm:block absolute bottom-2 left-[14%] w-10 h-10 -rotate-[18deg] opacity-[0.18]"
        clawed={false}
        color="#D94D12"
        accentColor="#FDBA74"
      />
      <SassyPawPrint
        className="absolute bottom-4 left-[36%] sm:left-[47%] w-14 h-14 rotate-[14deg] opacity-[0.26]"
        clawed
        color="#EA580C"
        accentColor="#FED7AA"
      />
      <SassyPawPrint
        className="hidden md:block absolute top-10 left-[56%] w-9 h-9 -rotate-[12deg] opacity-[0.2]"
        clawed
        color="#C9450E"
        accentColor="#FDBA74"
      />
    </div>
  );
}

/**
 * GenZ Boss Cat cover illustration (/assets/aistudio/Screenshot_2026-11-16_225817_1b83c319.png)
 * Blends seamlessly into #FFE7CC peach canvas with playful clawed paw accents.
 */
export function GenZBossCoverArt() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative flex items-end justify-center shrink-0">
      {/* Extra sassy paw stamps framing the boss cat */}
      <SassyPawPrint
        className="hidden sm:block absolute -left-8 top-3 w-10 h-10 -rotate-[22deg] opacity-80 drop-shadow-[0_2px_4px_rgba(201,69,14,0.2)]"
        clawed
        color="#EA580C"
        accentColor="#FED7AA"
      />
      <SassyPawPrint
        className="absolute -right-2 -top-2 w-8 h-8 rotate-[20deg] opacity-75"
        clawed
        color="#C9450E"
        accentColor="#FED7AA"
      />

      {!imgError ? (
        <div className="relative w-[280px] sm:w-[320px] md:w-[336px] aspect-[336/206] rounded-2xl overflow-hidden bg-[#FFE7CC]">
          <img
            src={GENERATED_ASSETS.genzBossCover}
            alt="Boss mèo cam ngồi vênh váo với bóng thoại: Sen chọn đi, boss ngồi đây."
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="w-[280px] sm:w-[320px] aspect-[336/206] rounded-2xl bg-[#F6D7B3] border border-[#EA580C]/40 flex flex-col items-center justify-center p-4 text-center">
          <SassyPawPrint className="w-12 h-12 mb-2" clawed color="#C9450E" />
          <p className="font-display text-sm font-bold text-[#23140B]">
            Sen chọn đi, boss ngồi đây.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 1:1 Product Thumbnail with generated artwork + resilient missing/broken fallback
 */
export function ProductThumbnail({
  product,
  provider,
  size = 68,
}: {
  product: ProductItem;
  provider?: ProviderItem;
  size?: number;
}) {
  const [loadFailed, setLoadFailed] = useState(false);
  const generatedSrc = GENERATED_ASSETS.thumbnails[product.providerId];
  const accent = provider?.accentHex ?? '#F97316';

  if (product.thumbnailState === 'missing') {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-xl bg-[#1E1F22] border border-dashed border-[#4E5058] flex flex-col items-center justify-center p-1.5 text-center shrink-0"
        aria-label={`${product.name} — chưa có ảnh`}
      >
        <ImageIcon className="w-4 h-4 text-[#949BA4]" aria-hidden="true" />
        <span className="text-[9px] font-medium text-[#B5BAC1] leading-tight mt-1">
          Chưa có ảnh
        </span>
      </div>
    );
  }

  if (product.thumbnailState === 'broken' || loadFailed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-xl bg-[#DA373C]/15 border border-[#FA777C]/50 flex flex-col items-center justify-center p-1.5 text-center shrink-0"
        aria-label={`${product.name} — ảnh lỗi fallback`}
      >
        <ImageOff className="w-4 h-4 text-[#FA777C]" aria-hidden="true" />
        <span className="text-[9px] font-semibold text-[#FA777C] leading-tight mt-1">
          Ảnh lỗi
        </span>
      </div>
    );
  }

  if (generatedSrc) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-xl bg-[#1E1F22] border border-[#3F4147] overflow-hidden shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
      >
        <img
          src={generatedSrc}
          alt={`Ảnh minh hoạ gói ${product.name}`}
          referrerPolicy="no-referrer"
          onError={() => setLoadFailed(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Clean fallback for extra stress providers (Claude, etc.) without broken image
  return (
    <div
      style={{
        width: size,
        height: size,
        borderColor: `${accent}66`,
      }}
      className="rounded-xl bg-[#1E1F22] border flex flex-col items-center justify-center p-1.5 text-center shrink-0"
    >
      <span
        className="text-[10px] font-extrabold tracking-tight leading-none whitespace-nowrap"
        style={{ color: '#F2F3F5' }}
      >
        {provider?.name ?? 'App'}
      </span>
      <span className="text-[8px] font-medium text-[#949BA4] leading-tight mt-1 whitespace-nowrap">
        1:1 Tile
      </span>
    </div>
  );
}
