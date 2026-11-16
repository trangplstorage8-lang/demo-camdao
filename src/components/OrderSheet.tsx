import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardCopy,
  ExternalLink,
  HardDrive,
  Lock,
  RefreshCw,
  Search,
  Send,
  X,
} from 'lucide-react';
import {
  ProductItem,
  ProductOffer,
  ProfileScenarioMode,
  ProviderItem,
} from '../data/fixtures';
import {
  buildOrderMessage,
  formatVnd,
  OrderFormInput,
  resolveOptionTiers,
  resolveProfileState,
  validateOrderForm,
} from '../logic/catalogLogic';
import { ProductThumbnail } from './BrandAssets';

export type SheetSubView = 'order' | 'profiles-list' | 'zalo-sim';

interface OrderSheetProps {
  isOpen: boolean;
  product: ProductItem | null;
  provider?: ProviderItem;
  selectedDuration: string | null;
  selectedAccountType: string | null;
  selectedWarranty: string | null;
  onSelectDuration: (duration: string) => void;
  onSelectAccountType: (accountType: string) => void;
  onSelectWarranty: (warranty: string) => void;
  profileMode: ProfileScenarioMode;
  onChangeProfileMode: (mode: ProfileScenarioMode) => void;
  onRetryProfileLoad: () => void;
  formInput: OrderFormInput;
  onUpdateFormInput: (patch: Partial<OrderFormInput>) => void;
  staleBannerDismissed: boolean;
  includePinInMessage: boolean;
  onToggleIncludePinInMessage: () => void;
  subView: SheetSubView;
  onChangeSubView: (view: SheetSubView) => void;
  copyStatus: 'idle' | 'copied' | 'blocked';
  simulateClipboardBlocked: boolean;
  onToggleSimulateClipboardBlocked: () => void;
  onCopyMessage: (message: string) => void;
  onOpenZalo: () => void;
  onClose: () => void;
  showValidationImmediately: boolean;
  connectedEmail?: string | null;
  canSaveToDrive?: boolean;
  onRequestSaveToDrive?: (fileName: string, content: string) => void;
  driveSaveSuccessName?: string | null;
}

export function OrderSheet({
  isOpen,
  product,
  provider,
  selectedDuration,
  selectedAccountType,
  selectedWarranty,
  onSelectDuration,
  onSelectAccountType,
  onSelectWarranty,
  profileMode,
  onChangeProfileMode,
  onRetryProfileLoad,
  formInput,
  onUpdateFormInput,
  staleBannerDismissed,
  includePinInMessage,
  onToggleIncludePinInMessage,
  subView,
  onChangeSubView,
  copyStatus,
  simulateClipboardBlocked,
  onToggleSimulateClipboardBlocked,
  onCopyMessage,
  onOpenZalo,
  onClose,
  showValidationImmediately,
  connectedEmail = null,
  canSaveToDrive = false,
  onRequestSaveToDrive,
  driveSaveSuccessName = null,
}: OrderSheetProps) {
  const [profileSearch, setProfileSearch] = useState('');
  const [touchedSubmit, setTouchedSubmit] = useState(false);
  const manualTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setTouchedSubmit(showValidationImmediately);
  }, [showValidationImmediately, product?.id]);

  useEffect(() => {
    if (!isOpen) {
      setProfileSearch('');
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (subView !== 'order') {
          onChangeSubView('order');
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, subView, onChangeSubView, onClose]);

  const tiers = useMemo(() => {
    if (!product) return null;
    return resolveOptionTiers(
      product,
      selectedDuration,
      selectedAccountType,
      selectedWarranty
    );
  }, [product, selectedDuration, selectedAccountType, selectedWarranty]);

  const resolvedOffer: ProductOffer | null = tiers?.resolvedOffer ?? null;

  const profileResolution = useMemo(
    () => resolveProfileState(profileMode, formInput.profileValue),
    [profileMode, formInput.profileValue]
  );

  const effectiveInput: OrderFormInput = useMemo(
    () => ({
      ...formInput,
      profileValue: profileResolution.resolvedValue,
    }),
    [formInput, profileResolution.resolvedValue]
  );

  const validation = useMemo(
    () => validateOrderForm(resolvedOffer, profileResolution, effectiveInput),
    [resolvedOffer, profileResolution, effectiveInput]
  );

  const generatedMessage = useMemo(() => {
    if (!product || !resolvedOffer) return '';
    return buildOrderMessage({
      productName: product.name,
      offer: resolvedOffer,
      profileResolution,
      input: effectiveInput,
      includePinInMessage,
    });
  }, [product, resolvedOffer, profileResolution, effectiveInput, includePinInMessage]);

  const filteredProfiles = useMemo(() => {
    const q = profileSearch.trim().toLowerCase();
    if (!q) return profileResolution.options;
    return profileResolution.options.filter((o) =>
      o.label.toLowerCase().includes(q)
    );
  }, [profileResolution.options, profileSearch]);

  if (!isOpen || !product || !tiers) return null;

  const shouldShowFieldError = (field: 'profile' | 'pin' | 'email') => {
    if (showValidationImmediately || touchedSubmit) return true;
    if (field === 'email' && effectiveInput.email.length > 0) return true;
    if (field === 'pin' && effectiveInput.pin.length > 0) return true;
    return false;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-sheet-title"
      data-testid="order-sheet"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet Container: Discord Dark Modal (#313338) / Mobile Bottom Sheet */}
      <div className="relative w-full md:max-w-2xl max-h-[92vh] md:max-h-[88vh] bg-[#313338] text-[#F2F3F5] rounded-t-3xl md:rounded-2xl border border-[#1E1F22] shadow-2xl flex flex-col overflow-hidden">
        {/* Mobile drag handle */}
        <div className="md:hidden pt-2.5 pb-1 flex justify-center shrink-0 bg-[#2B2D31]">
          <div className="w-10 h-1.5 rounded-full bg-[#4E5058]" aria-hidden="true" />
        </div>

        {/* Sheet Header (#2B2D31) */}
        <div className="px-4 md:px-6 py-3.5 bg-[#2B2D31] border-b border-[#1E1F22] flex items-center justify-between gap-3 shrink-0">
          {subView === 'profiles-list' ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => onChangeSubView('order')}
                className="dc-btn-secondary min-h-[44px] px-3.5 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Đơn đặt</span>
              </button>
              <h2
                id="order-sheet-title"
                className="font-display text-[17px] font-bold text-[#F2F3F5] truncate"
              >
                Chọn hồ sơ ({profileResolution.options.length})
              </h2>
            </div>
          ) : subView === 'zalo-sim' ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => onChangeSubView('order')}
                className="dc-btn-secondary min-h-[44px] px-3.5 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Quay lại đơn đặt</span>
              </button>
              <h2
                id="order-sheet-title"
                className="font-display text-[17px] font-bold text-[#F2F3F5] truncate"
              >
                Mô phỏng mở Zalo
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <ProductThumbnail product={product} provider={provider} size={48} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#B5BAC1] truncate">
                  {provider?.name ?? product.providerId} · Bản minh họa
                </p>
                <h2
                  id="order-sheet-title"
                  className="font-display text-[17px] md:text-[18px] font-bold leading-snug text-[#F2F3F5] truncate"
                >
                  {product.name}
                </h2>
              </div>
            </div>
          )}

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp đặt gói"
            className="dc-btn-secondary min-h-[44px] min-w-[44px] rounded-lg flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* SUB-VIEW 1: 12-Profile Full Sub-page (ho-so-day) */}
        {subView === 'profiles-list' && (
          <div className="flex-1 flex flex-col min-h-0 p-4 md:p-6 gap-4">
            <div className="relative shrink-0">
              <label htmlFor="profile-subsearch" className="sr-only">
                Tìm kiếm hồ sơ
              </label>
              <Search
                className="w-4 h-4 text-[#949BA4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="profile-subsearch"
                type="search"
                value={profileSearch}
                onChange={(e) => setProfileSearch(e.target.value)}
                placeholder="Tìm tên hồ sơ..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-lg bg-[#1E1F22] border border-[#1E1F22] focus:border-[#F97316] text-sm text-[#F2F3F5] placeholder:text-[#949BA4]"
              />
            </div>

            <div
              data-testid="full-profile-list"
              className="flex-1 overflow-y-auto cd-scroll-strip space-y-2 pr-1"
            >
              {filteredProfiles.map((opt) => {
                const selected = effectiveInput.profileValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      onUpdateFormInput({ profileValue: opt.value });
                      onChangeSubView('order');
                    }}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-lg border text-left flex items-center justify-between gap-3 transition-colors ${
                      selected
                        ? 'bg-[#C9450E]/20 border-2 border-[#F97316] text-[#F2F3F5]'
                        : 'bg-[#2B2D31] border-[#1E1F22] hover:bg-[#35373C] text-[#DBDEE1]'
                    }`}
                  >
                    <span className="text-sm font-medium break-words leading-snug">
                      {opt.label}
                    </span>
                    {selected && (
                      <Check
                        className="w-4 h-4 text-[#FF944D] shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}

              {filteredProfiles.length === 0 && (
                <div className="rounded-lg bg-[#2B2D31] border border-[#1E1F22] p-6 text-center text-sm text-[#B5BAC1]">
                  Không tìm thấy hồ sơ khớp từ khoá.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB-VIEW 2: Simulated Zalo App Handoff (mo-zalo) */}
        {subView === 'zalo-sim' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div
              role="status"
              data-testid="zalo-sim-warning"
              className="rounded-xl bg-[#F0B232]/15 border border-[#F0B232]/50 p-4 flex items-start gap-3"
            >
              <AlertCircle
                className="w-5 h-5 text-[#FACC15] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-bold text-[#FACC15]">
                  Mô phỏng chuyển sang Zalo — Tin nhắn CHƯA được gửi
                </p>
                <p className="text-xs text-[#F2F3F5] mt-1 leading-relaxed">
                  Mở Zalo không tự chép tin và không tự gửi đơn thay bạn. Bản minh họa không kết nối mạng ra Zalo thật.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] overflow-hidden">
              <div className="px-4 py-3 bg-[#232428] border-b border-[#1E1F22] flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#F2F3F5]">
                    Cam Đào · Tiếp nhận đơn (Mô phỏng)
                  </p>
                  <p className="text-xs text-[#B5BAC1]">
                    {copyStatus === 'copied'
                      ? 'Bạn đã chép tin vào bộ nhớ tạm — sẵn sàng dán.'
                      : 'Lưu ý: bạn chưa bấm Chép tin hoặc thiết bị chặn chép tự động.'}
                  </p>
                </div>
                <Send className="w-4 h-4 text-[#FF944D]" aria-hidden="true" />
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs font-semibold text-[#B5BAC1]">
                  Hướng dẫn dán tin gửi shop:
                </p>
                <ol className="text-sm text-[#F2F3F5] space-y-1.5 list-decimal list-inside">
                  <li>Mở khung chat Cam Đào trên ứng dụng Zalo của bạn.</li>
                  <li>Nhấn giữ vào ô nhập tin nhắn và chọn <strong>Dán (Paste)</strong>.</li>
                  <li>Kiểm tra lại mã gói, thông tin hồ sơ/email rồi bấm <strong>Gửi</strong>.</li>
                </ol>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-[#B5BAC1] mb-1.5">
                    Nội dung tin chờ dán:
                  </p>
                  <pre className="rounded-lg bg-[#1E1F22] border border-[#3F4147] p-3 text-xs text-[#F2F3F5] whitespace-pre-wrap break-words font-sans leading-relaxed">
                    {generatedMessage || 'Chưa chọn đủ tuỳ chọn gói để tạo tin.'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => onChangeSubView('order')}
                className="dc-btn-secondary flex-1 min-h-[44px] px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                Quay lại đơn đặt
              </button>
              <button
                type="button"
                onClick={onClose}
                className="dc-btn-primary flex-1 min-h-[44px] px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                Về bảng giá
              </button>
            </div>
          </div>
        )}

        {/* SUB-VIEW 3: Main Option Tiers + Order Form + Message Preview */}
        {subView === 'order' && (
          <>
            <div className="flex-1 overflow-y-auto cd-scroll-strip p-4 md:p-6 space-y-4">
              {/* STEP 1: Option Tiers */}
              {tiers.requiresOptionStep && (
                <section
                  aria-label="Chọn cấu hình gói"
                  className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-4 space-y-4"
                >
                  {/* Tier 1: Thời hạn */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-display text-[13px] font-bold text-[#DBDEE1]">
                        1. Chọn thời hạn
                      </span>
                      <span className="text-xs font-semibold text-[#FF9F5A]">
                        {selectedDuration ?? 'Chưa chọn'}
                      </span>
                    </div>
                    <div
                      className="overflow-x-auto cd-scroll-strip pb-1"
                      role="group"
                      aria-label="Thời hạn gói"
                    >
                      <div className="flex items-center gap-2 w-max">
                        {tiers.durations.map((dur) => {
                          const isSelected = selectedDuration === dur.value;
                          return (
                            <button
                              key={dur.value}
                              type="button"
                              disabled={!dur.hasAvailable}
                              aria-pressed={isSelected}
                              onClick={() => onSelectDuration(dur.value)}
                              className={`min-h-[44px] px-4 py-2 rounded-lg text-[13.5px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                                !dur.hasAvailable
                                  ? 'bg-[#1A1B1E] text-[#6D717A] border border-[#26282C] cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#C9450E]/18 text-[#FFFFFF] border border-[#F97316] ring-1 ring-[#F97316]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                                  : 'bg-[#1E1F22] text-[#DBDEE1] border border-[#383A40] hover:bg-[#35373C] hover:border-[#4E5058]'
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#FF9F5A] shrink-0" aria-hidden="true" />
                              )}
                              <span>{dur.value}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Tier 2: Loại tài khoản */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-display text-[13px] font-bold text-[#DBDEE1]">
                        2. Chọn loại tài khoản
                      </span>
                      {!selectedDuration && (
                        <span className="text-xs text-[#949BA4] inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" aria-hidden="true" />
                          Chọn thời hạn trước
                        </span>
                      )}
                    </div>
                    <div
                      className="flex flex-wrap gap-2"
                      role="group"
                      aria-label="Loại tài khoản"
                    >
                      {tiers.accountTypes.map((at) => {
                        const isSelected = selectedAccountType === at.value;
                        const isDisabled = !selectedDuration || !at.enabled;
                        return (
                          <button
                            key={at.value}
                            type="button"
                            disabled={isDisabled}
                            aria-pressed={isSelected}
                            onClick={() => onSelectAccountType(at.value)}
                            className={`min-h-[44px] px-4 py-2 rounded-lg text-[13.5px] font-semibold inline-flex items-center gap-2 whitespace-nowrap transition-all ${
                              isDisabled
                                ? 'bg-[#1A1B1E] text-[#6D717A] border border-[#26282C] cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#C9450E]/18 text-[#FFFFFF] border border-[#F97316] ring-1 ring-[#F97316]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                                : 'bg-[#1E1F22] text-[#DBDEE1] border border-[#383A40] hover:bg-[#35373C] hover:border-[#4E5058]'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#FF9F5A] shrink-0" aria-hidden="true" />
                            )}
                            <span>{at.value}</span>
                            {at.soldOut && (
                              <span className="text-[11px] font-bold text-[#FA777C]">
                                · hết
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {tiers.accountTypes.some((a) => a.soldOut) && (
                      <p className="text-xs text-[#FACC15] mt-1.5">
                        Tổ hợp ghi “hết” hiện không bán. Vui lòng chọn thời hạn hoặc loại tài khoản khác.
                      </p>
                    )}
                  </div>

                  {/* Tier 3: Bảo hành (only when >1 warranty value) */}
                  {tiers.warranties.length > 1 && (
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="font-display text-[13px] font-bold text-[#DBDEE1]">
                          3. Chọn mức bảo hành
                        </span>
                        <span className="text-xs font-semibold text-[#FF9F5A]">
                          {selectedWarranty ?? 'Chưa chọn'}
                        </span>
                      </div>
                      <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label="Mức bảo hành"
                      >
                        {tiers.warranties.map((w) => {
                          const isSelected = selectedWarranty === w;
                          return (
                            <button
                              key={w}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => onSelectWarranty(w)}
                              className={`min-h-[44px] px-4 py-2 rounded-lg text-[13.5px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-all ${
                                isSelected
                                  ? 'bg-[#C9450E]/18 text-[#FFFFFF] border border-[#F97316] ring-1 ring-[#F97316]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                                  : 'bg-[#1E1F22] text-[#DBDEE1] border border-[#383A40] hover:bg-[#35373C] hover:border-[#4E5058]'
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#FF9F5A] shrink-0" aria-hidden="true" />
                              )}
                              <span>Bảo hành {w}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Selected Offer Summary Bar */}
              {resolvedOffer ? (
                <div
                  data-testid="resolved-offer-summary"
                  className="rounded-xl bg-[#2B2D31] border border-[#F97316]/55 p-4 flex flex-wrap items-center justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#B5BAC1]">
                      Cấu hình đã chọn · Mã gói:{' '}
                      <span className="font-mono-code font-bold text-[#FF9F5A]">
                        {resolvedOffer.code}
                      </span>
                    </p>
                    <p className="text-[14.5px] font-bold text-[#F2F3F5] mt-0.5">
                      {resolvedOffer.duration} · {resolvedOffer.accountType}
                      {resolvedOffer.warranty ? ` · Bảo hành ${resolvedOffer.warranty}` : ''}
                    </p>
                  </div>
                  <p className="font-display text-[22px] font-extrabold text-[#FF9F5A] tabular-nums">
                    {formatVnd(resolvedOffer.priceVnd)}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-[#2B2D31] border border-dashed border-[#4E5058] p-4 text-sm text-[#B5BAC1]">
                  Hãy chọn đủ thời hạn{tiers.warranties.length > 1 ? ', loại tài khoản và bảo hành' : ' và loại tài khoản'} để xem giá chính xác và điền thông tin đặt.
                </div>
              )}

              {/* STEP 2: Order Input Fields */}
              {resolvedOffer && (
                <section
                  aria-label="Thông tin đặt gói"
                  className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-4 space-y-4"
                >
                  {/* Profile Field */}
                  {resolvedOffer.orderFields.includes('profile') &&
                    profileResolution.uiKind !== 'hidden-empty' && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-sm font-bold text-[#F2F3F5]">
                            Hồ sơ của bạn{' '}
                            <span className="text-[#FA777C]" aria-hidden="true">
                              *
                            </span>
                          </label>

                          <select
                            aria-label="Chế độ fixture hồ sơ (demo)"
                            value={profileMode}
                            onChange={(e) =>
                              onChangeProfileMode(e.target.value as ProfileScenarioMode)
                            }
                            className="text-xs bg-[#1E1F22] border border-[#3F4147] rounded-md px-2 py-1 text-[#B5BAC1]"
                          >
                            <option value="default-5">Mẫu: 5 hồ sơ</option>
                            <option value="full-12">Mẫu: 12 hồ sơ (40 ký tự)</option>
                            <option value="single-1">Mẫu: Chỉ 1 hồ sơ</option>
                            <option value="empty-0">Mẫu: 0 hồ sơ (ẩn ô)</option>
                            <option value="stale-selected">Mẫu: Giá trị cũ hết hiệu lực</option>
                            <option value="error-load">Mẫu: Lỗi tải hồ sơ</option>
                            <option value="legacy-missing">Mẫu: Legacy gõ tay</option>
                          </select>
                        </div>

                        {profileResolution.uiKind === 'error' && (
                          <div
                            role="alert"
                            data-testid="profile-error-box"
                            className="rounded-lg bg-[#DA373C]/15 border border-[#DA373C] p-3.5 flex flex-wrap items-center justify-between gap-3"
                          >
                            <div>
                              <p className="text-sm font-bold text-[#FA777C]">
                                Chưa tải được danh sách hồ sơ
                              </p>
                              <p className="text-xs text-[#F2F3F5] mt-0.5">
                                Lỗi tải danh sách tuỳ chọn (khác với gói 0 hồ sơ). Vui lòng thử lại.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={onRetryProfileLoad}
                              className="dc-btn-danger min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Thử lại</span>
                            </button>
                          </div>
                        )}

                        {profileResolution.uiKind === 'manual-legacy' && (
                          <div>
                            <input
                              type="text"
                              value={effectiveInput.profileValue}
                              onChange={(e) =>
                                onUpdateFormInput({ profileValue: e.target.value })
                              }
                              placeholder="Nhập tên hồ sơ của bạn (ví dụ: Hồ sơ 2)"
                              aria-invalid={Boolean(
                                shouldShowFieldError('profile') && validation.errors.profile
                              )}
                              className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#1E1F22] border border-[#3F4147] focus:border-[#F97316] text-sm text-[#F2F3F5]"
                            />
                            <p className="text-xs text-[#949BA4] mt-1">
                              Gói dạng cũ chưa có danh sách chọn sẵn — vui lòng tự điền tên hồ sơ.
                            </p>
                          </div>
                        )}

                        {profileResolution.uiKind === 'options' && (
                          <div className="space-y-2">
                            {profileResolution.staleCleared && !staleBannerDismissed && (
                              <div
                                role="status"
                                data-testid="profile-stale-alert"
                                className="rounded-lg bg-[#F0B232]/15 border border-[#F0B232]/50 px-3 py-2 text-xs font-medium text-[#FACC15]"
                              >
                                Lựa chọn hồ sơ cũ không còn nằm trong danh sách hiện tại nên đã được xoá. Vui lòng chọn lại hồ sơ.
                              </div>
                            )}

                            {profileResolution.autoSelectedSingle && (
                              <p className="text-xs font-medium text-[#4ADE80] bg-[#23A55A]/15 border border-[#23A55A]/40 px-3 py-1.5 rounded-lg inline-block">
                                Gói chỉ có 1 hồ sơ nên đã tự chọn sẵn cho bạn.
                              </p>
                            )}

                            <div
                              className="flex flex-wrap gap-2"
                              role="group"
                              aria-label="Danh sách chọn hồ sơ"
                            >
                              {profileResolution.options.slice(0, 5).map((opt) => {
                                const selected = effectiveInput.profileValue === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() =>
                                      onUpdateFormInput({ profileValue: opt.value })
                                    }
                                    className={`min-h-[44px] px-4 py-2 rounded-lg text-[13.5px] font-semibold inline-flex items-center gap-1.5 transition-all max-w-full ${
                                      selected
                                        ? 'bg-[#C9450E]/18 text-[#FFFFFF] border border-[#F97316] ring-1 ring-[#F97316]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                                        : 'bg-[#1E1F22] text-[#DBDEE1] border border-[#383A40] hover:bg-[#35373C] hover:border-[#4E5058]'
                                    }`}
                                  >
                                    {selected && (
                                      <Check
                                        className="w-3.5 h-3.5 text-[#FF9F5A] shrink-0"
                                        aria-hidden="true"
                                      />
                                    )}
                                    <span className="truncate">{opt.label}</span>
                                  </button>
                                );
                              })}

                              {profileResolution.options.length > 5 && (
                                <button
                                  type="button"
                                  onClick={() => onChangeSubView('profiles-list')}
                                  className="dc-btn-tint min-h-[44px] px-4 py-2 rounded-lg text-[13.5px] font-semibold whitespace-nowrap"
                                >
                                  Xem cả {profileResolution.options.length} hồ sơ
                                </button>
                              )}
                            </div>

                            {effectiveInput.profileValue &&
                              !profileResolution.options
                                .slice(0, 5)
                                .some((o) => o.value === effectiveInput.profileValue) && (
                                <div className="rounded-lg bg-[#C9450E]/15 border border-[#F97316]/60 px-3 py-2 text-xs text-[#F2F3F5]">
                                  Đã chọn:{' '}
                                  <strong>
                                    {
                                      profileResolution.options.find(
                                        (o) => o.value === effectiveInput.profileValue
                                      )?.label
                                    }
                                  </strong>
                                </div>
                              )}
                          </div>
                        )}

                        {shouldShowFieldError('profile') && validation.errors.profile && (
                          <p
                            role="alert"
                            data-testid="error-profile"
                            className="text-xs font-semibold text-[#FA777C]"
                          >
                            {validation.errors.profile}
                          </p>
                        )}
                      </div>
                    )}

                  {/* PIN Field */}
                  {resolvedOffer.orderFields.includes('pin') && (
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label
                          htmlFor="order-pin-input"
                          className="text-sm font-bold text-[#F2F3F5]"
                        >
                          Mã PIN hồ sơ (4 chữ số){' '}
                          <span className="text-[#FA777C]" aria-hidden="true">
                            *
                          </span>
                        </label>
                        <span className="text-[11px] text-[#949BA4]">
                          Luôn che khi nhập · Không thu mật khẩu
                        </span>
                      </div>

                      <input
                        id="order-pin-input"
                        type="password"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={4}
                        value={effectiveInput.pin}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 4);
                          onUpdateFormInput({ pin: digitsOnly });
                        }}
                        placeholder="••••"
                        aria-invalid={Boolean(
                          shouldShowFieldError('pin') && validation.errors.pin
                        )}
                        className="w-full sm:w-48 min-h-[44px] px-3.5 py-2 rounded-lg bg-[#1E1F22] border border-[#3F4147] focus:border-[#F97316] text-base tracking-[0.35em] font-mono-code text-[#F2F3F5]"
                      />

                      {shouldShowFieldError('pin') && validation.errors.pin && (
                        <p
                          role="alert"
                          data-testid="error-pin"
                          className="text-xs font-semibold text-[#FA777C]"
                        >
                          {validation.errors.pin}
                        </p>
                      )}

                      <label className="flex items-start gap-2 pt-1 cursor-pointer text-xs text-[#B5BAC1]">
                        <input
                          type="checkbox"
                          checked={includePinInMessage}
                          onChange={onToggleIncludePinInMessage}
                          className="mt-0.5 w-4 h-4 accent-[#F97316] rounded"
                        />
                        <span>
                          <strong className="text-[#F2F3F5]">Cấu hình demo giả định:</strong> Kèm PIN trong tin chép (chưa phải quyết định chính sách cuối; dữ liệu chỉ lưu trong RAM).
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Email Field */}
                  {resolvedOffer.orderFields.includes('email') && (
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label
                          htmlFor="order-email-input"
                          className="text-sm font-bold text-[#F2F3F5] block"
                        >
                          Email nhận gói / nâng cấp{' '}
                          <span className="text-[#FA777C]" aria-hidden="true">
                            *
                          </span>
                        </label>
                        {connectedEmail && effectiveInput.email !== connectedEmail && (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateFormInput({ email: connectedEmail })
                            }
                            className="text-xs font-semibold text-[#FF9F5A] hover:text-[#FFC294] underline whitespace-nowrap"
                          >
                            Dùng email Google ({connectedEmail})
                          </button>
                        )}
                      </div>
                      <input
                        id="order-email-input"
                        type="email"
                        value={effectiveInput.email}
                        onChange={(e) =>
                          onUpdateFormInput({ email: e.target.value })
                        }
                        placeholder="minh@example.test"
                        aria-invalid={Boolean(
                          shouldShowFieldError('email') && validation.errors.email
                        )}
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#1E1F22] border border-[#3F4147] focus:border-[#F97316] text-sm text-[#F2F3F5] placeholder:text-[#72767D]"
                      />
                      {shouldShowFieldError('email') && validation.errors.email && (
                        <p
                          role="alert"
                          data-testid="error-email"
                          className="text-xs font-semibold text-[#FA777C]"
                        >
                          {validation.errors.email}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Note Field */}
                  {resolvedOffer.orderFields.includes('note') && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="order-note-input"
                        className="text-sm font-bold text-[#F2F3F5] block"
                      >
                        Ghi chú cho Cam Đào (tuỳ chọn)
                      </label>
                      <textarea
                        id="order-note-input"
                        rows={2}
                        value={effectiveInput.note}
                        onChange={(e) =>
                          onUpdateFormInput({ note: e.target.value })
                        }
                        placeholder="Ví dụ: Cần kích hoạt trước 20h tối nay..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#1E1F22] border border-[#3F4147] focus:border-[#F97316] text-sm text-[#F2F3F5] placeholder:text-[#72767D] resize-y"
                      />
                    </div>
                  )}
                </section>
              )}

              {/* STEP 3: Message Preview & Copy Status */}
              {resolvedOffer && (
                <section
                  aria-label="Tin nhắn xem trước"
                  className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#F2F3F5]">
                      Tin nhắn gửi Cam Đào (xem trước)
                    </h3>
                    <label className="inline-flex items-center gap-1.5 text-xs text-[#B5BAC1] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={simulateClipboardBlocked}
                        onChange={onToggleSimulateClipboardBlocked}
                        className="w-3.5 h-3.5 accent-[#F97316]"
                      />
                      <span>Giả lập chặn clipboard</span>
                    </label>
                  </div>

                  {copyStatus === 'copied' && (
                    <div
                      role="status"
                      data-testid="copy-success-banner"
                      className="rounded-lg bg-[#23A55A]/15 border border-[#23A55A] px-3.5 py-2.5 flex items-center gap-2 text-xs font-semibold text-[#4ADE80]"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>
                        Đã chép tin. Mở Zalo và dán để gửi Cam Đào.
                      </span>
                    </div>
                  )}

                  {copyStatus === 'blocked' ? (
                    <div
                      role="alert"
                      data-testid="clipboard-blocked-box"
                      className="rounded-lg bg-[#DA373C]/15 border border-[#DA373C] p-3.5 space-y-2.5"
                    >
                      <div className="flex items-start gap-2 text-[#FA777C]">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-xs font-bold">
                            Trình duyệt chặn chép tự động — chưa thể tự chép
                          </p>
                          <p className="text-xs text-[#F2F3F5] mt-0.5">
                            Không báo thành công giả. Hãy chọn toàn bộ tin bên dưới rồi nhấn Ctrl+C / Sao chép thủ công.
                          </p>
                        </div>
                      </div>
                      <textarea
                        ref={manualTextareaRef}
                        readOnly
                        rows={7}
                        value={generatedMessage}
                        aria-label="Nội dung tin nhắn để chép thủ công"
                        className="w-full rounded-lg bg-[#1E1F22] border border-[#FA777C]/60 p-3 text-xs text-[#F2F3F5] font-sans leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          manualTextareaRef.current?.focus();
                          manualTextareaRef.current?.select();
                        }}
                        className="dc-btn-danger min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap"
                      >
                        Chọn toàn bộ tin để chép tay
                      </button>
                    </div>
                  ) : (
                    <pre
                      data-testid="order-message-preview"
                      className="rounded-lg bg-[#1E1F22] border border-[#3F4147] p-3.5 text-[13px] text-[#F2F3F5] whitespace-pre-wrap break-words font-sans leading-relaxed"
                    >
                      {generatedMessage}
                    </pre>
                  )}

                  {canSaveToDrive && onRequestSaveToDrive && resolvedOffer && validation.isValid && (
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const safeStamp = new Date().toISOString().slice(0, 10);
                          const fileName = `CamDao-DonHang-${resolvedOffer.code}-${safeStamp}.txt`;
                          onRequestSaveToDrive(fileName, generatedMessage);
                        }}
                        className="dc-btn-secondary min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <HardDrive className="w-3.5 h-3.5 text-[#FF9F5A]" aria-hidden="true" />
                        <span>Lưu phiếu đơn lên Google Drive</span>
                      </button>
                      {driveSaveSuccessName && (
                        <span className="text-xs font-semibold text-[#4ADE80]">
                          Đã lưu: {driveSaveSuccessName}
                        </span>
                      )}
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Footer (#2B2D31) */}
            <div className="px-4 md:px-6 py-3.5 bg-[#2B2D31] border-t border-[#1E1F22] flex items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="dc-btn-secondary min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                Huỷ
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onOpenZalo}
                  disabled={!resolvedOffer}
                  className="dc-btn-tint min-h-[44px] px-4 py-2 rounded-lg disabled:opacity-45 disabled:cursor-not-allowed text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Mở Zalo</span>
                </button>

                <button
                  type="button"
                  disabled={!resolvedOffer || !validation.isValid}
                  onClick={() => {
                    setTouchedSubmit(true);
                    if (validation.isValid) {
                      onCopyMessage(generatedMessage);
                    }
                  }}
                  data-testid="copy-message-btn"
                  className={`min-h-[44px] px-5 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap ${
                    !resolvedOffer || !validation.isValid
                      ? 'bg-[#232428] text-[#72767D] border border-[#383A40] cursor-not-allowed'
                      : copyStatus === 'copied'
                      ? 'dc-btn-success'
                      : 'dc-btn-primary'
                  }`}
                >
                  {copyStatus === 'copied' ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Chép tin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
