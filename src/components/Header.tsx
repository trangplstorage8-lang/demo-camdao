import React from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Hash, Layers, MessageCircle } from 'lucide-react';
import { CAMDAO_THEME } from '../theme/camdaoTheme';
import { FLOW_GUIDES, SCREEN_DEFINITIONS, ScreenKey } from '../data/fixtures';
import { CatMascotAvatar } from './BrandAssets';

interface HeaderProps {
  activeScreen: ScreenKey;
  onSelectScreen: (screen: ScreenKey) => void;
  activeFlowId: string | null;
  onSelectFlow: (flowId: string | null) => void;
  onStepFlow: (dir: -1 | 1) => void;
  stressMode: boolean;
  onToggleStressMode: () => void;
  onOpenDocs: () => void;
  onScrollToCatalog: () => void;
  onTriggerSupportToast: () => void;
  cleanPreviewMode: boolean;
  onToggleCleanPreview: () => void;
}

export function Header({
  activeScreen,
  onSelectScreen,
  activeFlowId,
  onSelectFlow,
  onStepFlow,
  stressMode,
  onToggleStressMode,
  onOpenDocs,
  onScrollToCatalog,
  onTriggerSupportToast,
  cleanPreviewMode,
  onToggleCleanPreview,
}: HeaderProps) {
  const activeFlow = FLOW_GUIDES.find((f) => f.flowId === activeFlowId) ?? null;

  return (
    <div className="w-full">
      {/* Slim Discord Guild-Bar Prototype Switcher (#1E1F22) */}
      {!cleanPreviewMode && (
        <div className="bg-[#1E1F22] text-[#F2F3F5] border-b border-[#111214]">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                <span className="font-semibold text-[#FF944D] whitespace-nowrap">
                  {CAMDAO_THEME.brand.demoBadge}
                </span>
                <button
                  type="button"
                  onClick={onToggleCleanPreview}
                  className="sm:hidden px-2 py-1 rounded bg-[#2B2D31] text-[#F2F3F5] text-[11px] font-medium whitespace-nowrap"
                >
                  Thu gọn
                </button>
              </div>

              <label htmlFor="screen-key-select" className="sr-only">
                Chọn màn hình kiểm tra (15 screen keys)
              </label>
              <div className="flex items-center gap-1.5 flex-1 sm:flex-initial min-w-0">
                <Layers className="w-3.5 h-3.5 text-[#FF944D] shrink-0" aria-hidden="true" />
                <select
                  id="screen-key-select"
                  value={activeScreen}
                  onChange={(e) => onSelectScreen(e.target.value as ScreenKey)}
                  className="w-full sm:w-auto max-w-full bg-[#2B2D31] text-[#F2F3F5] border border-[#3F4147] rounded-md px-2 py-1 text-xs font-medium min-h-[34px] cursor-pointer"
                >
                  {SCREEN_DEFINITIONS.map((s, idx) => (
                    <option key={s.key} value={s.key}>
                      {String(idx + 1).padStart(2, '0')}. {s.key} — {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <label htmlFor="flow-walkthrough-select" className="sr-only">
                Chọn flow walkthrough (7 flow)
              </label>
              <select
                id="flow-walkthrough-select"
                value={activeFlowId ?? ''}
                onChange={(e) => onSelectFlow(e.target.value || null)}
                className="w-full sm:w-auto max-w-full bg-[#2B2D31] text-[#F2F3F5] border border-[#3F4147] rounded-md px-2 py-1 text-xs font-medium min-h-[34px] cursor-pointer"
              >
                <option value="">Walkthrough 7 Flow...</option>
                {FLOW_GUIDES.map((f) => (
                  <option key={f.flowId} value={f.flowId}>
                    {f.flowId} ({f.storyId}) · {f.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onToggleStressMode}
                aria-pressed={stressMode}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap min-h-[34px] ${
                  stressMode ? 'dc-btn-primary' : 'dc-btn-secondary'
                }`}
              >
                {stressMode ? 'Stress: Bật (20 nguồn)' : 'Fixture chuẩn (8 gói)'}
              </button>

              <button
                type="button"
                onClick={onOpenDocs}
                className="dc-btn-secondary px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap min-h-[34px]"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#FF9F5A]" aria-hidden="true" />
                <span>Bàn giao & Coverage</span>
              </button>

              <button
                type="button"
                onClick={onToggleCleanPreview}
                className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-[#B5BAC1] hover:text-[#F2F3F5] hover:bg-[#2B2D31] text-xs font-medium whitespace-nowrap min-h-[34px] transition-colors"
                title="Ẩn thanh điều hướng prototype để xem giao diện shop thuần"
              >
                Ẩn thanh demo
              </button>
            </div>
          </div>

          {activeFlow && (
            <div className="max-w-[1200px] mx-auto px-4 pb-2 pt-1 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-[#2B2D31]">
              <div className="flex items-center gap-2 text-[#F2F3F5]">
                <span className="font-semibold text-[#FF9F5A]">
                  {activeFlow.flowId} · {activeFlow.title}:
                </span>
                <span className="text-[#B5BAC1]">
                  {activeFlow.steps.find((s) => s.screen === activeScreen)?.note ??
                    activeFlow.steps[0]?.note}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onStepFlow(-1)}
                  className="dc-btn-secondary px-2.5 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 min-h-[32px]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  Trước
                </button>
                <button
                  type="button"
                  onClick={() => onStepFlow(1)}
                  className="dc-btn-primary px-2.5 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 min-h-[32px]"
                >
                  Bước tiếp
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {cleanPreviewMode && (
        <div className="bg-[#1E1F22] border-b border-[#2B2D31] px-4 py-1.5 text-center text-xs text-[#B5BAC1] flex items-center justify-center gap-3">
          <span>{CAMDAO_THEME.brand.demoBadge}</span>
          <button
            type="button"
            onClick={onToggleCleanPreview}
            className="underline font-semibold text-[#FF944D] hover:text-white"
          >
            Hiện thanh điều hướng 15 màn
          </button>
        </div>
      )}

      {/* Discord Channel-Topbar Header (#313338 with crisp #1E1F22 hairline) */}
      <header className="bg-[#313338] border-b border-[#1E1F22]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Lockup (Mascot avatar + lowercase camdao) */}
          <a
            href="#bang-gia"
            onClick={(e) => {
              e.preventDefault();
              onScrollToCatalog();
            }}
            className="flex items-center gap-2.5 shrink-0"
          >
            <CatMascotAvatar size="sm" />
            <span className="font-display text-[19px] font-extrabold tracking-tight text-[#F2F3F5] whitespace-nowrap inline-flex items-center gap-1">
              <Hash className="w-4 h-4 text-[#FF9F5A]" aria-hidden="true" />
              <span>{CAMDAO_THEME.brand.wordmark}</span>
            </span>
          </a>

          {/* Zone 2: 4 clean single-line text nav links */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden md:flex items-center gap-1 text-[13.5px] font-medium text-[#B5BAC1]"
          >
            <button
              type="button"
              onClick={onScrollToCatalog}
              className="px-3 py-2 rounded-md hover:bg-[#35373C] hover:text-[#F2F3F5] transition-colors whitespace-nowrap shrink-0"
            >
              Bảng giá
            </button>
            <button
              type="button"
              onClick={() => onSelectScreen('tuy-chon')}
              className="px-3 py-2 rounded-md hover:bg-[#35373C] hover:text-[#F2F3F5] transition-colors whitespace-nowrap shrink-0"
            >
              Chọn nhanh NF-1S
            </button>
            <button
              type="button"
              onClick={() => onSelectScreen('mo-zalo')}
              className="px-3 py-2 rounded-md hover:bg-[#35373C] hover:text-[#F2F3F5] transition-colors whitespace-nowrap shrink-0"
            >
              Hướng dẫn gửi Zalo
            </button>
            <button
              type="button"
              onClick={onOpenDocs}
              className="px-3 py-2 rounded-md hover:bg-[#35373C] hover:text-[#F2F3F5] transition-colors whitespace-nowrap shrink-0"
            >
              Tài liệu & Coverage
            </button>
          </nav>

          {/* Zone 3: 1 secondary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onTriggerSupportToast}
              className="dc-btn-secondary min-h-[44px] px-4 py-2 rounded-lg text-[13.5px] font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-[#FF9F5A]" aria-hidden="true" />
              <span>Nhắn Cam Đào</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
