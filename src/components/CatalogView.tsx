import React from 'react';
import { AlertTriangle, Hash, RefreshCw, Search, X } from 'lucide-react';
import {
  CAMDAO_THEME,
  COVER_STYLE_OPTIONS,
  CoverStyleOption,
} from '../theme/camdaoTheme';
import { ProductItem, ProviderItem } from '../data/fixtures';
import { getCardPricingSummary } from '../logic/catalogLogic';
import {
  CatMascotAvatar,
  GenZBossCoverArt,
  ProductThumbnail,
  SassyPawPrint,
  SassyPawTrail,
} from './BrandAssets';

interface CatalogViewProps {
  providers: ProviderItem[];
  products: ProductItem[];
  allProductsCount: number;
  selectedProviderId: string | 'all';
  onSelectProvider: (id: string | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
  catalogStatus: 'ready' | 'loading' | 'error';
  onRetryLoad: () => void;
  onSimulateError: () => void;
  onSelectProduct: (product: ProductItem) => void;
  supportNoteVisible: boolean;
  onDismissSupportNote: () => void;
  coverStyle: CoverStyleOption;
  onChangeCoverStyle: (style: CoverStyleOption) => void;
  accountSlot?: React.ReactNode;
}

export function CatalogView({
  providers,
  products,
  allProductsCount,
  selectedProviderId,
  onSelectProvider,
  searchQuery,
  onSearchChange,
  onResetFilters,
  catalogStatus,
  onRetryLoad,
  onSimulateError,
  onSelectProduct,
  supportNoteVisible,
  onDismissSupportNote,
  coverStyle,
  onChangeCoverStyle,
  accountSlot,
}: CatalogViewProps) {
  const providerMap = React.useMemo(() => {
    const map = new Map<string, ProviderItem>();
    for (const p of providers) map.set(p.id, p);
    return map;
  }, [providers]);

  const isGenZ = coverStyle === 'genz-boss';

  return (
    <main id="bang-gia" className="max-w-[1200px] mx-auto px-4 md:px-6 pt-5 pb-16">
      {/* Hero Cover Banner: Switchable between Discord Cam & GenZ Boss Mèo */}
      <section
        aria-label="Giới thiệu bảng giá Cam Đào"
        data-testid="hero-cover-section"
        data-cover-style={coverStyle}
        className={`relative rounded-2xl p-5 md:p-7 mb-6 overflow-hidden transition-colors ${
          isGenZ
            ? 'bg-[#FFE7CC] border-2 border-[#F97316]/60 shadow-[0_12px_30px_rgba(201,69,14,0.18)]'
            : 'bg-gradient-to-br from-[#2B2D31] via-[#272422] to-[#3D2012] border border-[#F97316]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_28px_rgba(0,0,0,0.26)]'
        }`}
      >
        {isGenZ && <SassyPawTrail />}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-xl flex flex-col items-start">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <p
                className={`text-[12px] font-semibold tracking-wide ${
                  isGenZ ? 'text-[#B53D0A]' : 'text-[#FF9F5A]'
                }`}
              >
                {CAMDAO_THEME.brand.demoBadge}
              </p>
              {isGenZ && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9A3412]">
                  <SassyPawPrint
                    className="w-3.5 h-3.5 -rotate-12"
                    clawed
                    color="#C9450E"
                    accentColor="#FDBA74"
                  />
                  <span>GenZ Edition</span>
                </span>
              )}
            </div>

            <h1
              className={`font-display text-[clamp(1.5rem,2.6vw,2.15rem)] font-extrabold leading-[1.2] text-balance ${
                isGenZ ? 'text-[#23140B]' : 'text-[#F2F3F5]'
              }`}
            >
              {CAMDAO_THEME.brand.tagline}
            </h1>

            <p
              className={`text-[13.5px] md:text-[14.5px] mt-2 leading-[1.6] max-w-[52ch] ${
                isGenZ ? 'text-[#4E3220]' : 'text-[#C4C9D0]'
              }`}
            >
              {isGenZ ? CAMDAO_THEME.brand.genzSubtitle : CAMDAO_THEME.brand.subtitle}
            </p>

            {/* Cover Style Option Switcher */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span
                className={`text-xs font-semibold ${
                  isGenZ ? 'text-[#6E4427]' : 'text-[#949BA4]'
                }`}
              >
                Style cover:
              </span>
              <div
                role="group"
                aria-label="Chọn phong cách cover"
                className={`inline-flex items-center gap-1 p-1 rounded-xl border ${
                  isGenZ
                    ? 'bg-[#F5D6B3] border-[#E7B685]'
                    : 'bg-[#1E1F22] border-[#383A40]'
                }`}
              >
                {COVER_STYLE_OPTIONS.map((opt) => {
                  const active = coverStyle === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangeCoverStyle(opt.id)}
                      aria-pressed={active}
                      data-testid={`cover-option-${opt.id}`}
                      className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-all ${
                        active
                          ? 'dc-btn-primary'
                          : isGenZ
                          ? 'text-[#4E3220] hover:bg-[#EBC49A] hover:text-[#23140B]'
                          : 'text-[#B5BAC1] hover:bg-[#2B2D31] hover:text-[#F2F3F5]'
                      }`}
                    >
                      {opt.id === 'genz-boss' && (
                        <SassyPawPrint
                          className="w-3.5 h-3.5 -rotate-12 shrink-0"
                          clawed
                          color={active ? '#FFFFFF' : '#C9450E'}
                          accentColor={active ? '#FED7AA' : '#FDBA74'}
                        />
                      )}
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {isGenZ ? (
            <GenZBossCoverArt />
          ) : (
            <div className="flex items-center gap-3.5 shrink-0">
              <CatMascotAvatar size="lg" />
              <div className="sm:hidden">
                <p className="font-display text-base font-bold text-[#F2F3F5]">camdao</p>
                <p className="text-xs text-[#B5BAC1]">Shop gói số thân thiện</p>
              </div>
            </div>
          )}
        </div>

        {supportNoteVisible && (
          <div
            role="status"
            className="relative z-10 mt-4 rounded-lg bg-[#1E1F22] border border-[#F97316]/50 px-4 py-3 flex items-center justify-between gap-3 text-sm"
          >
            <span className="text-[#F2F3F5]">
              <strong className="text-[#FF9F5A]">Hỗ trợ Cam Đào:</strong>{' '}
              {CAMDAO_THEME.brand.supportPrompt} (Chức năng nhắn tin đang ở chế độ minh họa nội bộ).
            </span>
            <button
              type="button"
              onClick={onDismissSupportNote}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#35373C] text-[#B5BAC1]"
              aria-label="Đóng thông báo hỗ trợ"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>

      {accountSlot}

      {/* Main Responsive Workspace: Discord Channel Sidebar (#2B2D31) + 3-col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[232px_minmax(0,1fr)] gap-6 items-start">
        {/* Desktop Discord Channel Sidebar */}
        <aside
          aria-label="Lọc theo ứng dụng"
          className="hidden lg:flex flex-col bg-[#2B2D31] rounded-xl border border-[#1E1F22] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.16)]"
        >
          <div className="px-4 py-3 border-b border-[#1E1F22] flex items-center justify-between">
            <h2 className="font-display text-[13px] font-bold text-[#DBDEE1]">
              Nguồn ứng dụng
            </h2>
            <span className="text-xs font-semibold text-[#949BA4] tabular-nums">
              {providers.length}
            </span>
          </div>

          <div className="p-2 flex flex-col gap-0.5 max-h-[420px] overflow-y-auto cd-scroll-strip">
            <button
              type="button"
              onClick={() => onSelectProvider('all')}
              aria-pressed={selectedProviderId === 'all'}
              className={`min-h-[44px] px-2.5 py-2 rounded-md text-left text-sm font-medium flex items-center justify-between transition-colors ${
                selectedProviderId === 'all'
                  ? 'bg-[#404249] text-[#F2F3F5] font-semibold'
                  : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Hash
                  className={`w-4 h-4 shrink-0 ${
                    selectedProviderId === 'all' ? 'text-[#FF944D]' : 'text-[#80848E]'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate">tất-cả-gói</span>
              </span>
              <span className="text-xs tabular-nums text-[#B5BAC1]">{allProductsCount}</span>
            </button>

            {providers.map((prov) => {
              const active = selectedProviderId === prov.id;
              return (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => onSelectProvider(prov.id)}
                  aria-pressed={active}
                  className={`min-h-[44px] px-2.5 py-2 rounded-md text-left text-sm font-medium flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-[#404249] text-[#F2F3F5] font-semibold'
                      : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Hash
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-[#FF944D]' : 'text-[#80848E]'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{prov.name}</span>
                  </span>
                  {active && (
                    <span className="text-xs font-bold text-[#FF944D]" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Discord-style bottom Shop Voice/Profile status bar */}
          <div className="px-3 py-2.5 bg-[#232428] border-t border-[#1E1F22] flex items-center gap-2.5">
            <CatMascotAvatar size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#F2F3F5] truncate">camdao</p>
              <p className="text-[11px] text-[#949BA4] truncate">Bản minh họa</p>
            </div>
          </div>
        </aside>

        {/* Main Search + Mobile Chips + Cards Column */}
        <section aria-label="Danh sách gói tài khoản" className="min-w-0">
          {/* Search Bar & Count (Recessed #1E1F22 input well like Discord search) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
            <div className="relative flex-1">
              <label
                htmlFor="catalog-search-input"
                className="block text-xs font-semibold text-[#B5BAC1] mb-1.5"
              >
                Bạn đang tìm ứng dụng nào?
              </label>
              <div className="relative">
                <Search
                  className="w-4 h-4 text-[#949BA4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="catalog-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Tìm Netflix, ChatGPT, Canva, Spotify hoặc mã gói..."
                  className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-lg bg-[#1E1F22] border border-[#1E1F22] focus:border-[#F97316] text-sm text-[#F2F3F5] placeholder:text-[#949BA4]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Xoá từ khoá tìm kiếm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-md text-[#B5BAC1] hover:bg-[#35373C]"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <p
                className="text-sm text-[#B5BAC1] tabular-nums whitespace-nowrap"
                data-testid="catalog-count"
              >
                Hiển thị <strong className="font-display text-[#F2F3F5]">{products.length}</strong> gói
              </p>
              <button
                type="button"
                onClick={onSimulateError}
                className="dc-btn-secondary min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap"
              >
                Thử lỗi tải
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Single-Row Horizontal Scrollable Provider Chip Strip */}
          <div
            className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto cd-scroll-strip"
            role="region"
            aria-label="Lọc nhanh theo nguồn"
          >
            <div className="flex items-center gap-2 w-max pb-1">
              <button
                type="button"
                onClick={() => onSelectProvider('all')}
                aria-pressed={selectedProviderId === 'all'}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-[13.5px] font-semibold whitespace-nowrap shrink-0 ${
                  selectedProviderId === 'all' ? 'dc-btn-primary' : 'dc-btn-secondary'
                }`}
              >
                Tất cả ({allProductsCount})
              </button>
              {providers.map((prov) => {
                const active = selectedProviderId === prov.id;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => onSelectProvider(prov.id)}
                    aria-pressed={active}
                    className={`min-h-[44px] px-4 py-2 rounded-lg text-[13.5px] font-semibold whitespace-nowrap shrink-0 ${
                      active ? 'dc-btn-primary' : 'dc-btn-secondary'
                    }`}
                  >
                    {prov.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading State: 3 dark-slate skeleton cards */}
          {catalogStatus === 'loading' && (
            <div
              data-testid="catalog-loading"
              aria-live="polite"
              aria-label="Đang tải danh sách gói"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-4 flex flex-col gap-3 animate-pulse"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-[68px] h-[68px] rounded-xl bg-[#383A40] shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 w-3/4 rounded bg-[#383A40]" />
                      <div className="h-3 w-full rounded bg-[#35373C]" />
                      <div className="h-3 w-2/3 rounded bg-[#35373C]" />
                    </div>
                  </div>
                  <div className="mt-auto pt-3 border-t border-[#3F4147] flex items-center justify-between">
                    <div className="h-5 w-24 rounded bg-[#383A40]" />
                    <div className="h-11 w-24 rounded-lg bg-[#383A40]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State (loi-tai) */}
          {catalogStatus === 'error' && (
            <div
              role="alert"
              data-testid="catalog-error"
              className="rounded-xl bg-[#2B2D31] border border-[#DA373C] p-6 text-center max-w-lg mx-auto my-6"
            >
              <AlertTriangle
                className="w-8 h-8 text-[#FA777C] mx-auto mb-2"
                aria-hidden="true"
              />
              <h2 className="font-display text-lg font-bold text-[#FA777C]">
                Chưa tải được danh sách. Thử lại nhé.
              </h2>
              <p className="text-sm text-[#B5BAC1] mt-1.5 leading-relaxed">
                Kết nối mẫu đang bị gián đoạn tạm thời. Bấm Thử lại để tải lại 8 gói.
              </p>
              <button
                type="button"
                onClick={onRetryLoad}
                className="dc-btn-danger mt-4 min-h-[44px] px-5 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Thử lại</span>
              </button>
            </div>
          )}

          {/* Empty State (rong) */}
          {catalogStatus === 'ready' && products.length === 0 && (
            <div
              role="status"
              data-testid="catalog-empty"
              className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-8 text-center max-w-lg mx-auto my-6"
            >
              <h2 className="font-display text-lg font-bold text-[#F2F3F5]">
                Không có gói khớp
              </h2>
              <p className="text-sm text-[#B5BAC1] mt-1.5 leading-relaxed">
                Không tìm thấy gói nào phù hợp với từ khoá hoặc nguồn đang chọn.
              </p>
              <button
                type="button"
                onClick={onResetFilters}
                className="dc-btn-primary mt-4 min-h-[44px] px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                Xoá tìm kiếm
              </button>
            </div>
          )}

          {/* Product Grid: 3 columns on desktop, 1 column on mobile */}
          {catalogStatus === 'ready' && products.length > 0 && (
            <div
              data-testid="product-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {products.map((product) => {
                const provider = providerMap.get(product.providerId);
                const summary = getCardPricingSummary(product);
                const durationsCount = new Set(
                  product.offers.filter((o) => o.available).map((o) => o.duration)
                ).size;
                const knownWarranties = Array.from(
                  new Set(
                    product.offers
                      .filter((o) => o.available && o.warranty)
                      .map((o) => o.warranty as string)
                  )
                );

                return (
                  <article
                    key={product.id}
                    data-testid={`product-card-${product.id}`}
                    className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] hover:border-[#F97316]/60 p-4 flex flex-col justify-between gap-3.5 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_2px_10px_rgba(0,0,0,0.18)]"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <ProductThumbnail product={product} provider={provider} size={72} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-[#949BA4] truncate">
                          {provider?.name ?? product.providerId}
                          {summary.hasSellable && durationsCount > 0
                            ? ` · ${durationsCount} mức thời hạn`
                            : ' · Tạm hết suất'}
                        </p>
                        <h3
                          className="font-display text-[17px] font-bold leading-[1.3] text-[#F2F3F5] truncate mt-0.5"
                          title={product.name}
                        >
                          {product.name}
                        </h3>
                        <p className="text-[13px] text-[#B5BAC1] line-clamp-2 mt-1 leading-[1.55]">
                          {product.shortBenefit}
                        </p>
                      </div>
                    </div>

                    {/* Clean typographic metadata (zero static pills) */}
                    <div className="text-[12px] text-[#A8AEB7] flex items-center gap-1.5 flex-wrap border-t border-[#383A40] pt-3">
                      {summary.hasSellable ? (
                        <>
                          <span>
                            {summary.isSingleOffer
                              ? product.offers.find((o) => o.available)?.accountType
                              : 'Nhiều tuỳ chọn'}
                          </span>
                          {knownWarranties.length > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>
                                Bảo hành{' '}
                                {knownWarranties.length === 1
                                  ? knownWarranties[0]
                                  : 'theo gói'}
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="text-[#FACC15] font-medium">
                          Đang cập nhật suất mới
                        </span>
                      )}
                    </div>

                    {/* Price + Single-line Action Button (min-height 44px) */}
                    <div className="flex items-center justify-between gap-3 pt-0.5">
                      <div className="min-w-0">
                        <span className="block text-[11px] font-medium text-[#949BA4]">
                          Giá tham khảo
                        </span>
                        <span
                          className={`font-display block text-[19px] font-extrabold leading-tight tabular-nums whitespace-nowrap mt-0.5 ${
                            summary.hasSellable ? 'text-[#FFFFFF]' : 'text-[#FACC15]'
                          }`}
                        >
                          {summary.formattedPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={summary.ctaDisabled}
                        onClick={() => onSelectProduct(product)}
                        className={`min-h-[44px] px-5 py-2 rounded-lg text-[13.5px] font-semibold tracking-[0.01em] whitespace-nowrap shrink-0 ${
                          summary.ctaDisabled
                            ? 'bg-[#232428] text-[#80848E] border border-[#383A40] cursor-not-allowed'
                            : 'dc-btn-primary'
                        }`}
                      >
                        {summary.ctaLabel}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
