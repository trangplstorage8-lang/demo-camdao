import React from 'react';
import { CheckCircle2, ExternalLink, Info, X } from 'lucide-react';
import { CAMDAO_THEME, GENERATED_ASSETS_MANIFEST } from '../theme/camdaoTheme';
import { FLOW_GUIDES, SCREEN_DEFINITIONS, ScreenKey } from '../data/fixtures';

interface HandoverDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToScreen: (screen: ScreenKey) => void;
}

const COVERAGE_ROWS: {
  story: string;
  ac: string;
  flow: string;
  screenKey: ScreenKey;
  viewports: string;
  status: 'PASS' | 'ASSUMPTION';
}[] = [
  {
    story: 'S01 · Xem bảng giá',
    ac: 'AC1–AC3 (8 gói/4 nguồn, 1/nhiều/hết hàng, 1-line/2-line, 1440 3 cột)',
    flow: 'F01',
    screenKey: 'danh-sach',
    viewports: '390×844, 1440×900',
    status: 'PASS',
  },
  {
    story: 'S02 · Tìm & lọc nguồn',
    ac: 'AC1–AC3 (Netflix=2, rỗng+Xoá tìm kiếm, lỗi tải->3 skeleton->8 gói)',
    flow: 'F02',
    screenKey: 'rong',
    viewports: '390×844, 1440×900',
    status: 'PASS',
  },
  {
    story: 'S03 · Chọn tổ hợp bán',
    ac: 'AC1–AC4 (Khoá tầng 2, 12T dùng chung hết, ẩn BH<=1, 1 offer vào thẳng)',
    flow: 'F03',
    screenKey: 'tuy-chon',
    viewports: '390×844, 1440×900',
    status: 'PASS',
  },
  {
    story: 'S04 · Chọn hồ sơ',
    ac: 'AC1–AC4 (5 mặc định, 12 hồ sơ/40 ký tự, 0/1/legacy/stale/error, giữ/xoá PIN)',
    flow: 'F04',
    screenKey: 'ho-so-day',
    viewports: '390×844, 1440×900',
    status: 'PASS',
  },
  {
    story: 'S05 · Điền thông tin đặt',
    ac: 'AC1–AC3 (PIN che 4 số, Email validate, 0 network/0 storage)',
    flow: 'F05',
    screenKey: 'loi-nhap',
    viewports: '390×844, 1440×900',
    status: 'ASSUMPTION',
  },
  {
    story: 'S06 · Xem trước & chép tin',
    ac: 'AC1–AC3 (NF-1S, không lặp loại TK, Đã chép vs Clipboard chặn)',
    flow: 'F06',
    screenKey: 'tin-chep',
    viewports: '390×844, 1440×900',
    status: 'PASS',
  },
  {
    story: 'S07 · Mở Zalo & quay lại',
    ac: 'AC1–AC3 (Mở Zalo cạnh Chép >=44px, mô phỏng chưa gửi, giữ filter/xoá PIN)',
    flow: 'F07',
    screenKey: 'mo-zalo',
    viewports: '390×844, 1440×900',
    status: 'PASS',
  },
];

export function HandoverDocsModal({
  isOpen,
  onClose,
  onJumpToScreen,
}: HandoverDocsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[2px] p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="handover-docs-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#313338] rounded-2xl border border-[#1E1F22] shadow-2xl flex flex-col overflow-hidden text-[#F2F3F5]">
        <div className="px-5 py-4 bg-[#2B2D31] border-b border-[#1E1F22] flex items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs font-semibold text-[#FF9F5A]">
              Discord Design System (Orange Edition) · Bản minh họa
            </p>
            <h2 id="handover-docs-title" className="font-display text-lg font-extrabold text-[#F2F3F5]">
              Contact Sheet 15 Màn, Theme Tokens, Asset Manifest & Coverage
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng tài liệu bàn giao"
            className="dc-btn-secondary min-h-[44px] min-w-[44px] rounded-lg flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto cd-scroll-strip p-5 space-y-6">
          {/* 1. Contact Sheet */}
          <section className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-4 md:p-5">
            <h3 className="font-display text-base font-bold text-[#F2F3F5] mb-1">
              1. Contact Sheet — Điều hướng nhanh tới đủ 15 màn bắt buộc
            </h3>
            <p className="text-xs text-[#B5BAC1] mb-4">
              Bấm vào từng thẻ để mở ngay màn hình tương ứng ở kích thước hiện tại (hỗ trợ `?screen=&lt;key&gt;`).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SCREEN_DEFINITIONS.map((s, idx) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    onJumpToScreen(s.key);
                    onClose();
                  }}
                  className="text-left rounded-lg bg-[#1E1F22] hover:bg-[#35373C] border border-[#3F4147] hover:border-[#F97316] p-3 transition-colors flex flex-col justify-between gap-2 min-h-[88px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-code text-xs font-bold text-[#FF944D]">
                      {String(idx + 1).padStart(2, '0')} · {s.key}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#949BA4]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#F2F3F5]">{s.title}</p>
                    <p className="text-xs text-[#B5BAC1] mt-0.5 leading-snug">{s.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 2. PIN Demo Assumption */}
          <section className="rounded-xl bg-[#F0B232]/10 border border-[#F0B232]/40 p-4 md:p-5 space-y-2">
            <div className="flex items-center gap-2 text-[#FACC15]">
              <Info className="w-5 h-5 shrink-0" aria-hidden="true" />
              <h3 className="font-display text-base font-bold">
                2. Giả định PIN trong tin nhắn & Giới hạn prototype
              </h3>
            </div>
            <ul className="text-xs md:text-sm text-[#F2F3F5] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong>Giả định PIN:</strong> Ô nhập PIN luôn che (`type="password"`, 4 chữ số). Mục kèm PIN trong tin chép có checkbox cấu hình demo rõ ràng (không phải quyết định chính sách).
              </li>
              <li>
                <strong>Dữ liệu mẫu & RAM-only:</strong> Toàn bộ 8 gói / 4 nguồn và 20 nguồn stress là dữ liệu synthetic, không gọi mạng, không ghi `localStorage`/`sessionStorage`.
              </li>
            </ul>
          </section>

          {/* 3. Generated Asset Manifest */}
          <section className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-4 md:p-5">
            <h3 className="font-display text-base font-bold text-[#F2F3F5] mb-3">
              3. Asset Manifest (Hình minh hoạ & Thumbnail đã generate)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#3F4147] text-[#B5BAC1]">
                    <th className="py-2 pr-3 font-bold">Asset</th>
                    <th className="py-2 pr-3 font-bold">Mục đích</th>
                    <th className="py-2 pr-3 font-bold">Trạng thái</th>
                    <th className="py-2 font-bold">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3F4147]">
                  {GENERATED_ASSETS_MANIFEST.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 pr-3 font-mono-code font-semibold text-[#F2F3F5]">
                        {item.label}
                      </td>
                      <td className="py-2.5 pr-3 text-[#DBDEE1]">{item.purpose}</td>
                      <td className="py-2.5 pr-3 font-semibold text-[#4ADE80] whitespace-nowrap">
                        {item.status === 'generated'
                          ? 'Đã generate'
                          : item.status === 'uploaded'
                          ? 'Ảnh đính kèm'
                          : 'Stress fallback'}
                      </td>
                      <td className="py-2.5 text-[#B5BAC1]">{item.sourceNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Discord -> Orange Tokens */}
          <section className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-4 md:p-5">
            <h3 className="font-display text-base font-bold text-[#F2F3F5] mb-3">
              4. Token Hệ màu Discord chuyển đổi Blurple → Cam
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'Guild / Input Well', hex: CAMDAO_THEME.colors.bgTertiary },
                { name: 'Sidebar / Card', hex: CAMDAO_THEME.colors.bgSecondary },
                { name: 'Main Canvas', hex: CAMDAO_THEME.colors.bgPrimary },
                { name: 'Brand Orange CTA', hex: CAMDAO_THEME.colors.brandOrange },
                { name: 'Highlight Accent', hex: CAMDAO_THEME.colors.brandOrangeBright },
                { name: 'Primary Text', hex: CAMDAO_THEME.colors.textPrimary },
              ].map((t) => (
                <div key={t.name} className="rounded-lg border border-[#3F4147] p-2.5 bg-[#1E1F22]">
                  <div
                    className="w-full h-9 rounded-md border border-white/10 mb-2"
                    style={{ backgroundColor: t.hex }}
                  />
                  <p className="text-xs font-bold text-[#F2F3F5] leading-tight">{t.name}</p>
                  <p className="text-[11px] font-mono-code text-[#B5BAC1] mt-0.5">{t.hex}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Coverage Matrix */}
          <section className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-4 md:p-5">
            <h3 className="font-display text-base font-bold text-[#F2F3F5] mb-3">
              5. Bảng Coverage (Story · AC · Flow · Screen Key · Viewport)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#3F4147] text-[#B5BAC1]">
                    <th className="py-2 pr-3 font-bold">Story</th>
                    <th className="py-2 pr-3 font-bold">Tiêu chí AC</th>
                    <th className="py-2 pr-3 font-bold">Flow / Key</th>
                    <th className="py-2 pr-3 font-bold">Viewport</th>
                    <th className="py-2 font-bold">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3F4147]">
                  {COVERAGE_ROWS.map((row) => (
                    <tr key={row.story}>
                      <td className="py-2.5 pr-3 font-bold text-[#F2F3F5] whitespace-nowrap">
                        {row.story}
                      </td>
                      <td className="py-2.5 pr-3 text-[#DBDEE1]">{row.ac}</td>
                      <td className="py-2.5 pr-3 font-mono-code text-[#FF944D] whitespace-nowrap">
                        {row.flow} · {row.screenKey}
                      </td>
                      <td className="py-2.5 pr-3 text-[#B5BAC1] whitespace-nowrap">
                        {row.viewports}
                      </td>
                      <td className="py-2.5 font-semibold text-[#4ADE80] whitespace-nowrap inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-3 border-t border-[#3F4147]">
              <p className="text-xs font-bold text-[#F2F3F5] mb-1.5">Tóm tắt 7 Flow:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-[#B5BAC1]">
                {FLOW_GUIDES.map((f) => (
                  <p key={f.flowId}>
                    <strong className="text-[#F2F3F5]">
                      {f.flowId} ({f.storyId}):
                    </strong>{' '}
                    {f.title} — {f.steps.map((s) => s.screen).join(' → ')}
                  </p>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
