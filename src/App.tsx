import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FLOW_GUIDES,
  MAIN_PRODUCTS,
  MAIN_PROVIDERS,
  ProductItem,
  ProfileScenarioMode,
  ScreenKey,
  STRESS_20_PROVIDERS,
  STRESS_EXTRA_PRODUCTS,
} from './data/fixtures';
import {
  filterProducts,
  OrderFormInput,
  resolveOptionTiers,
  resolveProfileState,
} from './logic/catalogLogic';
import { User } from 'firebase/auth';
import { CAMDAO_THEME, CoverStyleOption } from './theme/camdaoTheme';
import { Header } from './components/Header';
import { CatalogView } from './components/CatalogView';
import { OrderSheet, SheetSubView } from './components/OrderSheet';
import { HandoverDocsModal } from './components/HandoverDocsModal';
import {
  CustomerAccountPanel,
  DriveConfirmModal,
  PendingDriveAction,
} from './components/CustomerAccountPanel';
import {
  deleteDriveOrderFile,
  DriveOrderFile,
  getAccessToken,
  googleSignIn,
  initAuth,
  listCamDaoOrderFiles,
  logout,
  saveOrderNoteToDrive,
} from './services/googleDriveAuth';

interface ProductDraft {
  duration: string | null;
  accountType: string | null;
  warranty: string | null;
  profileValue: string;
  email: string;
  note: string;
}

const EMPTY_FORM: OrderFormInput = {
  profileValue: '',
  pin: '',
  email: '',
  note: '',
};

const VALID_SCREEN_KEYS = new Set<string>([
  'danh-sach',
  'tuy-chon',
  'dat-ho-so',
  'dat-rieng',
  'ho-so-day',
  'tin-chep',
  'mo-zalo',
  'rong',
  'loi-tai',
  'loi-nhap',
  'loi-chep',
  'ho-so-rong',
  'ho-so-cu',
  'ho-so-mot',
  'ho-so-loi',
]);

export default function App() {
  // RAM-only catalog & filter state (zero storage, zero network)
  const [stressMode, setStressMode] = useState(false);
  const [cleanPreviewMode, setCleanPreviewMode] = useState(false);
  const [coverStyle, setCoverStyle] = useState<CoverStyleOption>('discord-orange');
  const [catalogStatus, setCatalogStatus] = useState<'ready' | 'loading' | 'error'>('ready');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<string | 'all'>('all');
  const [supportNoteVisible, setSupportNoteVisible] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  // Active Screen & Flow tracker
  const [activeScreen, setActiveScreen] = useState<ScreenKey>('danh-sach');
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);

  // Sheet & Order state (all kept in RAM)
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);
  const [selectedWarranty, setSelectedWarranty] = useState<string | null>(null);
  const [profileMode, setProfileMode] = useState<ProfileScenarioMode>('default-5');
  const [formInput, setFormInput] = useState<OrderFormInput>(EMPTY_FORM);
  const [includePinInMessage, setIncludePinInMessage] = useState(true);
  const [subView, setSubView] = useState<SheetSubView>('order');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'blocked'>('idle');
  const [simulateClipboardBlocked, setSimulateClipboardBlocked] = useState(false);
  const [showValidationImmediately, setShowValidationImmediately] = useState(false);
  const [staleBannerDismissed, setStaleBannerDismissed] = useState(false);

  // Per-product RAM drafts (keeps profile/options on same product reopen, NEVER saves PIN)
  const draftsRef = useRef<Record<string, ProductDraft>>({});
  const retryTimerRef = useRef<number | null>(null);

  // Google Workspace Auth & Drive state (in-memory token only)
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveOrderFile[]>([]);
  const [driveFilesLoaded, setDriveFilesLoaded] = useState(false);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [pendingDriveAction, setPendingDriveAction] = useState<PendingDriveAction>(null);
  const [isSubmittingDriveAction, setIsSubmittingDriveAction] = useState(false);
  const [driveSaveSuccessName, setDriveSaveSuccessName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setDriveUser(user);
        setNeedsAuth(false);
        setAuthError(null);
      },
      () => {
        setNeedsAuth(true);
      }
    );
    return () => {
      unsubscribe();
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    setDriveError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setDriveUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Không thể đăng nhập Google. Vui lòng thử lại.';
      setAuthError(message);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const handleGoogleLogout = useCallback(async () => {
    await logout();
    setDriveUser(null);
    setNeedsAuth(true);
    setDriveFiles([]);
    setDriveFilesLoaded(false);
    setDriveError(null);
    setDriveSaveSuccessName(null);
  }, []);

  const handleFetchDriveFiles = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setDriveError('Phiên Google Drive đã hết hạn. Vui lòng Sign in with Google lại.');
      return;
    }
    setIsLoadingDrive(true);
    setDriveError(null);
    try {
      const files = await listCamDaoOrderFiles(token);
      setDriveFiles(files);
      setDriveFilesLoaded(true);
    } catch (err) {
      setDriveError(
        err instanceof Error ? err.message : 'Không đọc được danh sách Google Drive.'
      );
    } finally {
      setIsLoadingDrive(false);
    }
  }, []);

  const handleConfirmDriveAction = useCallback(async () => {
    if (!pendingDriveAction) return;
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setPendingDriveAction(null);
      setDriveError('Phiên Google Drive đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }
    setIsSubmittingDriveAction(true);
    setDriveError(null);
    try {
      if (pendingDriveAction.type === 'save') {
        const saved = await saveOrderNoteToDrive(token, {
          fileName: pendingDriveAction.fileName,
          content: pendingDriveAction.content,
        });
        setDriveSaveSuccessName(saved.name);
        setDriveFiles((prev) => [saved, ...prev]);
        setDriveFilesLoaded(true);
      } else {
        await deleteDriveOrderFile(token, pendingDriveAction.file.id);
        setDriveFiles((prev) =>
          prev.filter((f) => f.id !== pendingDriveAction.file.id)
        );
      }
      setPendingDriveAction(null);
    } catch (err) {
      setDriveError(
        err instanceof Error ? err.message : 'Thao tác Google Drive chưa thành công.'
      );
      setPendingDriveAction(null);
    } finally {
      setIsSubmittingDriveAction(false);
    }
  }, [pendingDriveAction]);

  const providers = useMemo(
    () => (stressMode ? STRESS_20_PROVIDERS : MAIN_PROVIDERS),
    [stressMode]
  );

  const allProducts = useMemo(
    () => (stressMode ? [...MAIN_PRODUCTS, ...STRESS_EXTRA_PRODUCTS] : MAIN_PRODUCTS),
    [stressMode]
  );

  const filteredProducts = useMemo(
    () => filterProducts(allProducts, searchQuery, selectedProviderId),
    [allProducts, searchQuery, selectedProviderId]
  );

  const activeProduct: ProductItem | null = useMemo(() => {
    if (!activeProductId) return null;
    return (
      allProducts.find((p) => p.id === activeProductId) ??
      [...MAIN_PRODUCTS, ...STRESS_EXTRA_PRODUCTS].find((p) => p.id === activeProductId) ??
      null
    );
  }, [activeProductId, allProducts]);

  const activeProvider = useMemo(() => {
    if (!activeProduct) return undefined;
    return [...MAIN_PROVIDERS, ...STRESS_20_PROVIDERS].find(
      (pr) => pr.id === activeProduct.providerId
    );
  }, [activeProduct]);

  const saveCurrentDraftToRam = useCallback(() => {
    if (!activeProductId) return;
    draftsRef.current[activeProductId] = {
      duration: selectedDuration,
      accountType: selectedAccountType,
      warranty: selectedWarranty,
      profileValue: formInput.profileValue,
      email: formInput.email,
      note: formInput.note,
    };
  }, [
    activeProductId,
    selectedDuration,
    selectedAccountType,
    selectedWarranty,
    formInput.profileValue,
    formInput.email,
    formInput.note,
  ]);

  const handleCloseSheet = useCallback(() => {
    saveCurrentDraftToRam();
    // Rule S04-AC4 & S07-AC3: Closing clears PIN, keeps search/filter & product profile draft in RAM
    setFormInput((prev) => ({ ...prev, pin: '' }));
    setSheetOpen(false);
    setSubView('order');
    setCopyStatus('idle');
    setShowValidationImmediately(false);
    setActiveScreen(
      catalogStatus === 'error'
        ? 'loi-tai'
        : filteredProducts.length === 0
        ? 'rong'
        : 'danh-sach'
    );
  }, [saveCurrentDraftToRam, catalogStatus, filteredProducts.length]);

  const handleOpenProduct = useCallback(
    (product: ProductItem) => {
      const savedDraft = draftsRef.current[product.id];
      const tiers = resolveOptionTiers(
        product,
        savedDraft?.duration ?? null,
        savedDraft?.accountType ?? null,
        savedDraft?.warranty ?? null
      );

      setActiveProductId(product.id);
      setSelectedDuration(savedDraft?.duration ?? null);
      setSelectedAccountType(savedDraft?.accountType ?? null);
      setSelectedWarranty(savedDraft?.warranty ?? null);

      const defaultMode =
        tiers.resolvedOffer?.defaultProfileMode ??
        product.offers.find((o) => o.defaultProfileMode)?.defaultProfileMode ??
        'default-5';

      setProfileMode(defaultMode);
      setFormInput({
        profileValue: savedDraft?.profileValue ?? '',
        pin: '', // PIN MUST always be cleared on reopen!
        email: savedDraft?.email ?? '',
        note: savedDraft?.note ?? '',
      });
      setSubView('order');
      setCopyStatus('idle');
      setSimulateClipboardBlocked(false);
      setShowValidationImmediately(false);
      setStaleBannerDismissed(false);
      setSheetOpen(true);
      setActiveScreen(tiers.requiresOptionStep && !tiers.resolvedOffer ? 'tuy-chon' : 'dat-ho-so');
    },
    []
  );

  const handleSelectDuration = useCallback((duration: string) => {
    // S03-AC2: Changing earlier tier resets dependent selections (accountType, warranty)
    setSelectedDuration(duration);
    setSelectedAccountType(null);
    setSelectedWarranty(null);
    setCopyStatus('idle');
  }, []);

  const handleSelectAccountType = useCallback((accountType: string) => {
    setSelectedAccountType(accountType);
    setSelectedWarranty(null);
    setCopyStatus('idle');
  }, []);

  const handleSelectWarranty = useCallback((warranty: string) => {
    setSelectedWarranty(warranty);
    setCopyStatus('idle');
  }, []);

  const handleUpdateFormInput = useCallback((patch: Partial<OrderFormInput>) => {
    setFormInput((prev) => ({ ...prev, ...patch }));
    if (patch.profileValue !== undefined) {
      setStaleBannerDismissed(true);
    }
    setCopyStatus('idle');
  }, []);

  const handleRetryCatalog = useCallback(() => {
    setCatalogStatus('loading');
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
    }
    retryTimerRef.current = window.setTimeout(() => {
      setCatalogStatus('ready');
      setActiveScreen('danh-sach');
    }, 350);
  }, []);

  const handleCopyMessage = useCallback(
    async (message: string) => {
      if (simulateClipboardBlocked) {
        setCopyStatus('blocked');
        setActiveScreen('loi-chep');
        return;
      }
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(message);
          setCopyStatus('copied');
          setActiveScreen('tin-chep');
        } else {
          setCopyStatus('blocked');
          setActiveScreen('loi-chep');
        }
      } catch {
        setCopyStatus('blocked');
        setActiveScreen('loi-chep');
      }
    },
    [simulateClipboardBlocked]
  );

  // Navigate directly to any of the 15 required screen keys
  const navigateToScreen = useCallback((key: ScreenKey) => {
    setActiveScreen(key);
    setShowValidationImmediately(false);
    setStaleBannerDismissed(false);

    switch (key) {
      case 'danh-sach': {
        setCatalogStatus('ready');
        setSearchQuery('');
        setSelectedProviderId('all');
        setSheetOpen(false);
        break;
      }
      case 'rong': {
        setCatalogStatus('ready');
        setSelectedProviderId('all');
        setSearchQuery('goi-khong-ton-tai');
        setSheetOpen(false);
        break;
      }
      case 'loi-tai': {
        setCatalogStatus('error');
        setSheetOpen(false);
        break;
      }
      case 'tuy-chon': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('12 tháng');
        setSelectedAccountType(null);
        setSelectedWarranty(null);
        setProfileMode('default-5');
        setFormInput(EMPTY_FORM);
        setSubView('order');
        setCopyStatus('idle');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'dat-ho-so': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('default-5');
        setFormInput({
          profileValue: '2',
          pin: '1234',
          email: '',
          note: 'Kích hoạt giúp mình trong tối nay nhé.',
        });
        setSubView('order');
        setCopyStatus('idle');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'dat-rieng': {
        setCatalogStatus('ready');
        setActiveProductId('cgpt-plus');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Nâng cấp chính chủ');
        setSelectedWarranty(null);
        setProfileMode('default-5');
        setFormInput({
          profileValue: '',
          pin: '',
          email: 'minh@example.test',
          note: '',
        });
        setSubView('order');
        setCopyStatus('idle');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'ho-so-day': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('full-12');
        setFormInput({
          profileValue: '12',
          pin: '1234',
          email: '',
          note: '',
        });
        setSubView('profiles-list');
        setCopyStatus('idle');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'tin-chep': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('default-5');
        setFormInput({
          profileValue: '2',
          pin: '1234',
          email: '',
          note: '',
        });
        setSubView('order');
        setCopyStatus('copied');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'mo-zalo': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('default-5');
        setFormInput({
          profileValue: '2',
          pin: '1234',
          email: '',
          note: '',
        });
        setSubView('zalo-sim');
        setCopyStatus('copied');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'loi-nhap': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('default-5');
        setFormInput({
          profileValue: '',
          pin: '12',
          email: '',
          note: '',
        });
        setShowValidationImmediately(true);
        setSubView('order');
        setCopyStatus('idle');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'loi-chep': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('default-5');
        setFormInput({
          profileValue: '2',
          pin: '1234',
          email: '',
          note: '',
        });
        setSubView('order');
        setSimulateClipboardBlocked(true);
        setCopyStatus('blocked');
        setSheetOpen(true);
        break;
      }
      case 'ho-so-rong': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('empty-0');
        setFormInput({
          profileValue: '',
          pin: '1234',
          email: '',
          note: '',
        });
        setSubView('order');
        setCopyStatus('idle');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'ho-so-cu': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('stale-selected');
        setFormInput({
          profileValue: '99', // Invalid legacy value -> cleared automatically!
          pin: '1234',
          email: '',
          note: '',
        });
        setShowValidationImmediately(true);
        setSubView('order');
        setCopyStatus('idle');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'ho-so-mot': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('single-1');
        setFormInput({
          profileValue: '',
          pin: '1234',
          email: '',
          note: '',
        });
        setSubView('order');
        setCopyStatus('idle');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
      case 'ho-so-loi': {
        setCatalogStatus('ready');
        setActiveProductId('nf-prem');
        setSelectedDuration('1 tháng');
        setSelectedAccountType('Dùng chung');
        setSelectedWarranty(null);
        setProfileMode('error-load');
        setFormInput({
          profileValue: '',
          pin: '1234',
          email: '',
          note: '',
        });
        setShowValidationImmediately(true);
        setSubView('order');
        setCopyStatus('idle');
        setSimulateClipboardBlocked(false);
        setSheetOpen(true);
        break;
      }
    }
  }, []);

  // Support URL params on initial load (?screen=<key>&stress=1&clean=1&cover=genz)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stress') === '1') {
      setStressMode(true);
    }
    if (params.get('clean') === '1') {
      setCleanPreviewMode(true);
    }
    const coverParam = params.get('cover');
    if (coverParam === 'genz' || coverParam === 'genz-boss') {
      setCoverStyle('genz-boss');
    } else if (coverParam === 'discord' || coverParam === 'discord-orange') {
      setCoverStyle('discord-orange');
    }
    const screenParam = params.get('screen');
    if (screenParam && VALID_SCREEN_KEYS.has(screenParam)) {
      navigateToScreen(screenParam as ScreenKey);
    }
  }, [navigateToScreen]);

  const handleSelectFlow = useCallback(
    (flowId: string | null) => {
      setActiveFlowId(flowId);
      if (!flowId) return;
      const guide = FLOW_GUIDES.find((f) => f.flowId === flowId);
      if (guide && guide.steps[0]) {
        navigateToScreen(guide.steps[0].screen);
      }
    },
    [navigateToScreen]
  );

  const handleStepFlow = useCallback(
    (dir: -1 | 1) => {
      if (!activeFlowId) return;
      const guide = FLOW_GUIDES.find((f) => f.flowId === activeFlowId);
      if (!guide) return;
      const idx = guide.steps.findIndex((s) => s.screen === activeScreen);
      const nextIdx =
        idx === -1
          ? 0
          : (idx + dir + guide.steps.length) % guide.steps.length;
      navigateToScreen(guide.steps[nextIdx].screen);
    },
    [activeFlowId, activeScreen, navigateToScreen]
  );

  const handleProfileModeChange = useCallback((mode: ProfileScenarioMode) => {
    setProfileMode(mode);
    setStaleBannerDismissed(false);
    setCopyStatus('idle');
    const resolved = resolveProfileState(
      mode,
      mode === 'stale-selected' ? '99' : formInput.profileValue
    );
    setFormInput((prev) => ({
      ...prev,
      profileValue: resolved.resolvedValue,
    }));
  }, [formInput.profileValue]);

  return (
    <div className="min-h-screen flex flex-col bg-[#313338] text-[#F2F3F5]">
      <Header
        activeScreen={activeScreen}
        onSelectScreen={(s) => {
          setActiveFlowId(null);
          navigateToScreen(s);
        }}
        activeFlowId={activeFlowId}
        onSelectFlow={handleSelectFlow}
        onStepFlow={handleStepFlow}
        stressMode={stressMode}
        onToggleStressMode={() => setStressMode((v) => !v)}
        onOpenDocs={() => setDocsOpen(true)}
        onScrollToCatalog={() => {
          setSheetOpen(false);
          document.getElementById('bang-gia')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onTriggerSupportToast={() => setSupportNoteVisible(true)}
        cleanPreviewMode={cleanPreviewMode}
        onToggleCleanPreview={() => setCleanPreviewMode((v) => !v)}
      />

      <div className="flex-1">
        <CatalogView
          providers={providers}
          products={filteredProducts}
          allProductsCount={allProducts.length}
          selectedProviderId={selectedProviderId}
          onSelectProvider={(id) => {
            setSelectedProviderId(id);
            setCatalogStatus('ready');
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCatalogStatus('ready');
          }}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedProviderId('all');
            setCatalogStatus('ready');
            setActiveScreen('danh-sach');
          }}
          catalogStatus={catalogStatus}
          onRetryLoad={handleRetryCatalog}
          onSimulateError={() => {
            setCatalogStatus('error');
            setActiveScreen('loi-tai');
          }}
          onSelectProduct={handleOpenProduct}
          supportNoteVisible={supportNoteVisible}
          onDismissSupportNote={() => setSupportNoteVisible(false)}
          coverStyle={coverStyle}
          onChangeCoverStyle={setCoverStyle}
          accountSlot={
            <CustomerAccountPanel
              user={driveUser}
              needsAuth={needsAuth}
              isLoggingIn={isLoggingIn}
              authError={authError}
              onLogin={handleGoogleLogin}
              onLogout={handleGoogleLogout}
              driveFiles={driveFiles}
              driveFilesLoaded={driveFilesLoaded}
              isLoadingDrive={isLoadingDrive}
              driveError={driveError}
              onFetchDriveFiles={handleFetchDriveFiles}
              onRequestDeleteFile={(file) =>
                setPendingDriveAction({ type: 'delete', file })
              }
            />
          }
        />
      </div>

      {/* Clean Discord Footer (#232428) */}
      <footer className="border-t border-[#1E1F22] bg-[#232428] py-6 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#B5BAC1]">
          <div>
            <p className="font-display text-sm font-bold text-[#F2F3F5]">
              {CAMDAO_THEME.brand.wordmark} — {CAMDAO_THEME.brand.displayName}
            </p>
            <p className="mt-0.5 text-[#949BA4]">
              {CAMDAO_THEME.brand.demoBadge} · Dữ liệu chỉ lưu tạm trong RAM, không thu mật khẩu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDocsOpen(true)}
            className="dc-btn-secondary min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center whitespace-nowrap"
          >
            Xem Coverage & Asset Manifest
          </button>
        </div>
      </footer>

      <OrderSheet
        isOpen={sheetOpen}
        product={activeProduct}
        provider={activeProvider}
        selectedDuration={selectedDuration}
        selectedAccountType={selectedAccountType}
        selectedWarranty={selectedWarranty}
        onSelectDuration={handleSelectDuration}
        onSelectAccountType={handleSelectAccountType}
        onSelectWarranty={handleSelectWarranty}
        profileMode={profileMode}
        onChangeProfileMode={handleProfileModeChange}
        onRetryProfileLoad={() => handleProfileModeChange('default-5')}
        formInput={formInput}
        onUpdateFormInput={handleUpdateFormInput}
        staleBannerDismissed={staleBannerDismissed}
        includePinInMessage={includePinInMessage}
        onToggleIncludePinInMessage={() => setIncludePinInMessage((v) => !v)}
        subView={subView}
        onChangeSubView={setSubView}
        copyStatus={copyStatus}
        simulateClipboardBlocked={simulateClipboardBlocked}
        onToggleSimulateClipboardBlocked={() =>
          setSimulateClipboardBlocked((v) => !v)
        }
        onCopyMessage={handleCopyMessage}
        onOpenZalo={() => {
          // S07-AC1: Opening Zalo NEVER auto-copies and NEVER sends!
          setSubView('zalo-sim');
          setActiveScreen('mo-zalo');
        }}
        onClose={handleCloseSheet}
        showValidationImmediately={showValidationImmediately}
        connectedEmail={!needsAuth ? driveUser?.email ?? null : null}
        canSaveToDrive={!needsAuth && Boolean(driveUser)}
        onRequestSaveToDrive={(fileName, content) =>
          setPendingDriveAction({ type: 'save', fileName, content })
        }
        driveSaveSuccessName={driveSaveSuccessName}
      />

      <DriveConfirmModal
        pendingAction={pendingDriveAction}
        isSubmitting={isSubmittingDriveAction}
        onCancel={() => setPendingDriveAction(null)}
        onConfirm={handleConfirmDriveAction}
      />

      <HandoverDocsModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
        onJumpToScreen={(key) => {
          setActiveFlowId(null);
          navigateToScreen(key);
        }}
      />
    </div>
  );
}
