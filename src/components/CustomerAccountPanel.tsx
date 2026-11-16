import React from 'react';
import { User } from 'firebase/auth';
import {
  AlertCircle,
  ExternalLink,
  FolderOpen,
  HardDrive,
  LogOut,
  Trash2,
} from 'lucide-react';
import { DriveOrderFile } from '../services/googleDriveAuth';
import { GoogleSignInButton } from './GoogleSignInButton';

export type PendingDriveAction =
  | {
      type: 'save';
      fileName: string;
      content: string;
    }
  | {
      type: 'delete';
      file: DriveOrderFile;
    }
  | null;

interface CustomerAccountPanelProps {
  user: User | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  authError: string | null;
  onLogin: () => void;
  onLogout: () => void;
  driveFiles: DriveOrderFile[];
  driveFilesLoaded: boolean;
  isLoadingDrive: boolean;
  driveError: string | null;
  onFetchDriveFiles: () => void;
  onRequestDeleteFile: (file: DriveOrderFile) => void;
}

export function CustomerAccountPanel({
  user,
  needsAuth,
  isLoggingIn,
  authError,
  onLogin,
  onLogout,
  driveFiles,
  driveFilesLoaded,
  isLoadingDrive,
  driveError,
  onFetchDriveFiles,
  onRequestDeleteFile,
}: CustomerAccountPanelProps) {
  return (
    <section
      aria-label="Móc nối tài khoản Google và Google Drive"
      data-testid="customer-drive-panel"
      className="rounded-xl bg-[#2B2D31] border border-[#1E1F22] p-4 mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.16)]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#1E1F22] border border-[#383A40] flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5 text-[#FF9F5A]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-[14.5px] font-bold text-[#F2F3F5]">
              Móc nối tài khoản khách · Google Drive
            </h2>
            {!needsAuth && user ? (
              <p className="text-xs text-[#B5BAC1] mt-0.5 truncate">
                Đã kết nối:{' '}
                <strong className="text-[#F2F3F5]">
                  {user.displayName || user.email}
                </strong>
                {user.email ? ` (${user.email})` : ''} · Sẵn sàng điền email & lưu phiếu đơn lên Drive.
              </p>
            ) : (
              <p className="text-xs text-[#B5BAC1] mt-0.5 leading-relaxed">
                Đăng nhập Google để tự điền email nhận gói và lưu/xem phiếu đặt hàng trên Google Drive cá nhân (tùy chọn).
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {needsAuth || !user ? (
            <GoogleSignInButton
              onClick={onLogin}
              disabled={isLoggingIn}
              label={isLoggingIn ? 'Đang kết nối...' : 'Sign in with Google'}
            />
          ) : (
            <>
              <button
                type="button"
                onClick={onFetchDriveFiles}
                disabled={isLoadingDrive}
                className="dc-btn-tint min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <FolderOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  {isLoadingDrive ? 'Đang tải...' : 'Xem phiếu trên Drive'}
                </span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="dc-btn-secondary min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Đăng xuất</span>
              </button>
            </>
          )}
        </div>
      </div>

      {authError && (
        <div
          role="alert"
          className="mt-3 rounded-lg bg-[#DA373C]/15 border border-[#DA373C]/60 px-3 py-2 text-xs text-[#FA777C] flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{authError}</span>
        </div>
      )}

      {driveError && (
        <div
          role="alert"
          className="mt-3 rounded-lg bg-[#DA373C]/15 border border-[#DA373C]/60 px-3 py-2 text-xs text-[#FA777C] flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{driveError}</span>
        </div>
      )}

      {!needsAuth && user && driveFilesLoaded && (
        <div className="mt-3 pt-3 border-t border-[#383A40]">
          <p className="text-xs font-semibold text-[#B5BAC1] mb-2">
            Phiếu đơn Cam Đào trên Google Drive ({driveFiles.length}):
          </p>
          {driveFiles.length === 0 ? (
            <p className="text-xs text-[#949BA4]">
              Chưa có tệp nào tên “CamDao-DonHang*” trong Drive. Bạn có thể lưu phiếu ngay khi đặt gói.
            </p>
          ) : (
            <ul className="space-y-2">
              {driveFiles.map((file) => (
                <li
                  key={file.id}
                  className="rounded-lg bg-[#1E1F22] border border-[#383A40] px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#F2F3F5] truncate">
                      {file.name}
                    </p>
                    {file.modifiedTime && (
                      <p className="text-[11px] text-[#949BA4]">
                        Cập nhật: {new Date(file.modifiedTime).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dc-btn-secondary min-h-[36px] px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Mở trên Drive</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onRequestDeleteFile(file)}
                      className="dc-btn-danger min-h-[36px] px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap"
                      aria-label={`Xoá tệp ${file.name} khỏi Google Drive`}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Xoá</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

interface DriveConfirmModalProps {
  pendingAction: PendingDriveAction;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DriveConfirmModal({
  pendingAction,
  isSubmitting,
  onCancel,
  onConfirm,
}: DriveConfirmModalProps) {
  if (!pendingAction) return null;

  const isDelete = pendingAction.type === 'delete';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drive-confirm-title"
    >
      <div className="absolute inset-0" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl bg-[#313338] border border-[#1E1F22] shadow-2xl overflow-hidden text-[#F2F3F5]">
        <div className="px-5 py-4 bg-[#2B2D31] border-b border-[#1E1F22]">
          <h3
            id="drive-confirm-title"
            className="font-display text-base font-bold text-[#F2F3F5]"
          >
            {isDelete
              ? 'Xác nhận xoá tệp khỏi Google Drive'
              : 'Xác nhận lưu phiếu đơn lên Google Drive'}
          </h3>
        </div>

        <div className="p-5 space-y-3 text-sm">
          {isDelete ? (
            <p className="text-[#DBDEE1] leading-relaxed">
              Bạn chắc chắn muốn xoá tệp{' '}
              <strong className="text-[#FA777C]">{pendingAction.file.name}</strong>{' '}
              khỏi Google Drive? Thao tác này không thể hoàn tác.
            </p>
          ) : (
            <>
              <p className="text-[#DBDEE1] leading-relaxed">
                Tạo tệp văn bản mới trên Google Drive của bạn với tên{' '}
                <strong className="text-[#FF9F5A]">{pendingAction.fileName}</strong>?
              </p>
              <pre className="rounded-lg bg-[#1E1F22] border border-[#383A40] p-3 text-xs text-[#F2F3F5] whitespace-pre-wrap break-words font-sans max-h-40 overflow-y-auto">
                {pendingAction.content}
              </pre>
            </>
          )}
        </div>

        <div className="px-5 py-3.5 bg-[#2B2D31] border-t border-[#1E1F22] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="dc-btn-secondary min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`min-h-[44px] px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
              isDelete ? 'dc-btn-danger' : 'dc-btn-primary'
            }`}
          >
            {isSubmitting
              ? 'Đang xử lý...'
              : isDelete
              ? 'Xác nhận xoá'
              : 'Xác nhận lưu lên Drive'}
          </button>
        </div>
      </div>
    </div>
  );
}
