const nameInput = document.getElementById("nameInput");
const fontSelect = document.getElementById("fontSelect");
const fontImportButton = document.getElementById("fontImportButton");
const fontInput = document.getElementById("fontInput");
const fontImportStatus = document.getElementById("fontImportStatus");
const importedFontNotice = document.getElementById("importedFontNotice");
const fontImportLegalText = "User-imported fonts are shared with everyone. Upload only fonts you have permission to share; MakerNames does not verify ownership or third-party font licences.";
const isDesktopApp = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) ||
  new URLSearchParams(window.location.search).get("desktop") === "1";
const colorSwatches = document.getElementById("colorSwatches");
const customColor = document.getElementById("customColor");
const joinToggle = document.getElementById("joinToggle");
const lineToggle = document.getElementById("lineToggle");
const spacingDown = document.getElementById("spacingDown");
const spacingUp = document.getElementById("spacingUp");
const spacingValue = document.getElementById("spacingValue");
const txtInput = document.getElementById("txtInput");
const svgInput = document.getElementById("svgInput");
const dxfInput = document.getElementById("dxfInput");
const imageInput = document.getElementById("imageInput");
const txtStatus = document.getElementById("txtStatus");
const nextName = document.getElementById("nextName");
const exportSvg = document.getElementById("exportSvg");
const exportDxf = document.getElementById("exportDxf");
let exportStl = document.getElementById("exportStl");
const downloadPackage = document.getElementById("downloadPackage");
const downloadMenuToggle = document.getElementById("downloadMenuToggle");
const downloadFormatMenu = document.getElementById("downloadFormatMenu");
const saveStatus = document.getElementById("saveStatus");
const lineRange = document.getElementById("lineRange");
const lineYRange = document.getElementById("lineYRange");
const lineUp = document.getElementById("lineUp");
const lineDown = document.getElementById("lineDown");
const autoBase = document.getElementById("autoBase");
const lineYValue = document.getElementById("lineYValue");
const batchCount = document.getElementById("batchCount");
const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const zoomLabel = document.getElementById("zoomLabel");
const canvas = document.getElementById("canvas");
const designObject = document.getElementById("designObject");
const canvasWrap = document.querySelector(".canvas-wrap");
const editorHeader = document.querySelector(".editor-header");
const editorActions = document.querySelector(".editor-actions");
const previewAxisTools = document.querySelector(".preview-axis-tools");
const mobileActionsSlot = document.getElementById("mobileActionsSlot");
const leftPanel = document.querySelector(".left-panel");
const rightPanel = document.querySelector(".right-panel");
const letterPrev = document.getElementById("letterPrev");
const letterNext = document.getElementById("letterNext");
const letterStatus = document.getElementById("letterStatus");
const letterLeft = document.getElementById("letterLeft");
const letterRight = document.getElementById("letterRight");
const letterUp = document.getElementById("letterUp");
const letterDown = document.getElementById("letterDown");
const letterLockX = document.getElementById("letterLockX");
const letterLockY = document.getElementById("letterLockY");
const letterRotateLeft = document.getElementById("letterRotateLeft");
const letterRotateRight = document.getElementById("letterRotateRight");
const letterScaleDown = document.getElementById("letterScaleDown");
const letterScaleUp = document.getElementById("letterScaleUp");
const resetLetters = document.getElementById("resetLetters");
const placeNameButton = document.getElementById("placeNameButton");
const placedNamesStatus = document.getElementById("placedNamesStatus");
const placedNameTools = document.querySelector(".placed-name-tools");
const placedNameLeft = document.getElementById("placedNameLeft");
const placedNameRight = document.getElementById("placedNameRight");
const placedNameUp = document.getElementById("placedNameUp");
const placedNameDown = document.getElementById("placedNameDown");
const placedNameRotateLeft = document.getElementById("placedNameRotateLeft");
const placedNameRotateRight = document.getElementById("placedNameRotateRight");
const placedNameScaleDown = document.getElementById("placedNameScaleDown");
const placedNameScaleUp = document.getElementById("placedNameScaleUp");
const placedNameDelete = document.getElementById("placedNameDelete");
const accessoryStatus = document.getElementById("accessoryStatus");
const accessoryPreview = document.getElementById("accessoryPreview");
const accessoryQuality = document.getElementById("accessoryQuality");
const accessoryColorSwatches = document.getElementById("accessoryColorSwatches");
const customAccessoryColor = document.getElementById("customAccessoryColor");
const accessoryQuickGrid = document.getElementById("accessoryQuickGrid");
const accessoryLeft = document.getElementById("accessoryLeft");
const accessoryRight = document.getElementById("accessoryRight");
const accessoryUp = document.getElementById("accessoryUp");
const accessoryDown = document.getElementById("accessoryDown");
const accessoryRotateLeft = document.getElementById("accessoryRotateLeft");
const accessoryRotateRight = document.getElementById("accessoryRotateRight");
const accessoryScaleDown = document.getElementById("accessoryScaleDown");
const accessoryScaleUp = document.getElementById("accessoryScaleUp");
const accessoryReset = document.getElementById("accessoryReset");
const accessoryLibraryOpen = document.getElementById("accessoryLibraryOpen");
const accessoryLibraryOpenMobile = document.getElementById("accessoryLibraryOpenMobile");
const imageAccessoryImport = document.getElementById("imageAccessoryImport");
const imageImportMode = document.getElementById("imageImportMode");
const imageSearchQuery = document.getElementById("imageSearchQuery");
const imageSearchOpen = document.getElementById("imageSearchOpen");
const imageSearchStatus = document.getElementById("imageSearchStatus");
const imageSearchResults = document.getElementById("imageSearchResults");
const libraryModal = document.getElementById("libraryModal");
const libraryClose = document.getElementById("libraryClose");
const librarySearch = document.getElementById("librarySearch");
const libraryCategories = document.getElementById("libraryCategories");
const libraryGrid = document.getElementById("libraryGrid");
const libraryEmpty = document.getElementById("libraryEmpty");
const authOpen = document.getElementById("authOpen");
const authRegisterOpen = document.getElementById("authRegisterOpen");
const accountPill = document.getElementById("accountPill");
const accountName = document.getElementById("accountName");
const logoutButton = document.getElementById("logoutButton");
const mobileEditorOpen = document.getElementById("mobileEditorOpen");
const authModal = document.getElementById("authModal");
const authClose = document.getElementById("authClose");
const authLoginTab = document.getElementById("authLoginTab");
const authRegisterTab = document.getElementById("authRegisterTab");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authNameGroup = document.getElementById("authNameGroup");
const authName = document.getElementById("authName");
const authEmailGroup = document.getElementById("authEmailGroup");
const authEmail = document.getElementById("authEmail");
const authPasswordGroup = document.getElementById("authPasswordGroup");
const authPassword = document.getElementById("authPassword");
const authPasswordToggle = document.getElementById("authPasswordToggle");
const forgotPasswordOpen = document.getElementById("forgotPasswordOpen");
const authSubmit = document.getElementById("authSubmit");
const authMessage = document.getElementById("authMessage");
const cookieConsent = document.getElementById("cookieConsent");
const cookieAccept = document.getElementById("cookieAccept");
const cookieReject = document.getElementById("cookieReject");
const rewardModal = document.getElementById("rewardModal");
const rewardClose = document.getElementById("rewardClose");
const rewardCancel = document.getElementById("rewardCancel");
const rewardContinue = document.getElementById("rewardContinue");
const stlPreviewModal = document.getElementById("stlPreviewModal");
const stlPreviewOpen = document.getElementById("stlPreviewOpen");
const stlPreviewClose = document.getElementById("stlPreviewClose");
const stlPreviewModel = document.getElementById("stlPreviewModel");
const stlPreviewStatus = document.getElementById("stlPreviewStatus");
const stlMaterialPicker = document.getElementById("stlMaterialPicker");
const stlRenderButton = document.getElementById("stlRenderButton");
const communityPreviewGrid = document.getElementById("communityPreviewGrid");
const COOKIE_CONSENT_KEY = "makernames_cookie_consent_v1";
const GA_MEASUREMENT_ID = "G-N4BDNZ88KJ";
const ADSENSE_CLIENT_ID = "ca-pub-8920926193000918";

let namesList = [];
let currentIndex = 0;
let zoom = getDefaultZoom();
let zoomAdjustedByUser = false;
let selectedLetter = null;
let selectedLetterMode = "none";
let offsets = [];
let pieceColor = "#e83aa9";
let accessoryColor = "#111111";
let uploadedFontNames = new Set();
let previewRequest = 0;
let previewInputTimer = null;
let previewFrameKey = "";
let previewFrameViewBox = "";
let initialPreviewInteracted = false;
let metricRulerAnchor = null;
let metricRulerAnchorKey = "";
let spacingAdjust = 22;
let importedObject = null;
let importedObjects = [];
let importedObjectId = 0;
let selectedImportedObjectId = null;
let placedNames = [];
let placedNameId = 0;
let selectedPlacedNameId = null;
let accessoryCatalog = [];
let accessoryCatalogLoaded = false;
const verifiedAccessoryCategory = "Verified for 3D";
const reviewAccessoryCategory = "Needs STL review";
let accessoryCategory = verifiedAccessoryCategory;
let accessoryDrag = null;
let placedNameDrag = null;
let letterDrag = null;
let letterRotateDrag = null;
let activeMobilePanel = null;
let letterDragAxis = null;
let leftPointerPressed = false;
let currentUser = null;
let optionalCookieScriptsLoaded = false;
let authMode = "login";
let passwordResetToken = "";
let rewardTimer = null;
let pendingRewardResolve = null;
let rewardedAdsConfig = null;
let rewardedAdsConfigPromise = null;
let stlPreviewAnimation = 0;
let stlPreviewToken = 0;
let stlPreviewMesh = null;
let stlPreviewRotationX = -0.12;
let stlPreviewRotationZ = -0.22;
let stlPreviewMaterial = "plastic";
let stlPreviewLightPhase = 0;
let stlPreviewLastFrame = 0;
let stlPreviewDrag = null;
let gptLoadPromise = null;

const stlMaterials = {
  plastic: { label: "Plastic", base: null, highlight: "#ffffff", shadow: "#55456b", gloss: 0.2, glow: 0, ambient: 0.8, depth: 0.04, light: 0.1, stroke: 0.035, strokeAlpha: 0.16 },
  matte: { label: "Matte", base: null, highlight: "#f7f3ff", shadow: "#5a4d69", gloss: 0.07, glow: 0, ambient: 0.82, depth: 0.03, light: 0.08, stroke: 0.035, strokeAlpha: 0.12 },
  acrylic: { label: "Acrylic", base: null, highlight: "#ffffff", shadow: "#3b2f5d", gloss: 0.44, glow: 0.08, ambient: 0.78, depth: 0.04, light: 0.14, stroke: 0.035, strokeAlpha: 0.14 },
  gold: { label: "Gold", base: "#f5b93f", highlight: "#fff0a8", shadow: "#8a4f0a", gloss: 0.5, glow: 0.06, ambient: 0.66, depth: 0.08, light: 0.2, stroke: 0.07, strokeAlpha: 0.24 },
  silver: { label: "Silver", base: "#aeb7c4", highlight: "#f7fbff", shadow: "#3e4653", gloss: 0.58, glow: 0.03, ambient: 0.7, depth: 0.07, light: 0.18, stroke: 0.05, strokeAlpha: 0.22 },
  wood: { label: "Wood", base: "#b87538", highlight: "#f3c17b", shadow: "#6f3f1e", gloss: 0.14, glow: 0, ambient: 0.68, depth: 0.08, light: 0.14, stroke: 0.06, strokeAlpha: 0.22 },
  neon: { label: "Neon", base: null, highlight: "#e9fbff", shadow: "#032033", gloss: 0.7, glow: 0.46, ambient: 0.78, depth: 0.04, light: 0.16, stroke: 0.04, strokeAlpha: 0.18 },
  ceramic: { label: "Ceramic", base: "#f8f6ef", highlight: "#ffffff", shadow: "#d2c9dd", gloss: 0.3, glow: 0, ambient: 0.78, depth: 0.04, light: 0.14, stroke: 0.04, strokeAlpha: 0.16 },
  black: { label: "Black", base: "#15141f", highlight: "#c9c4ff", shadow: "#05040b", gloss: 0.42, glow: 0.02, ambient: 0.56, depth: 0.08, light: 0.22, stroke: 0.04, strokeAlpha: 0.24 }
};

const mobilePanelConfig = [
  { key: "text", label: "Text", title: "Text", icon: "text" },
  { key: "move", label: "Move", title: "Move", icon: "move" },
  { key: "spacing", label: "Gap", title: "Spacing", icon: "spacing" },
  { key: "support", label: "Base", title: "Support line", icon: "line" },
  { key: "accessory", label: "Art", title: "Accessory", icon: "star" },
  { key: "files", label: "Files", title: "Files", icon: "files" }
];
const mobileOriginalParents = new Map();
let mobileToolRail = null;
let mobileDownloadSlot = null;

if (!exportStl) {
  exportStl = document.createElement("button");
  exportStl.id = "exportStl";
  exportStl.textContent = "STL";
  exportDxf.insertAdjacentElement("afterend", exportStl);
}

function getDefaultZoom() {
  if (window.matchMedia("(max-width: 650px)").matches) return 4.1;
  if (window.matchMedia("(max-width: 900px)").matches) return 4.7;
  return 4.2;
}

function isMobileEditorLayout() {
  return window.matchMedia("(max-width: 900px)").matches;
}

function syncResponsiveZoom() {
  if (zoomAdjustedByUser) return;
  const nextZoom = getDefaultZoom();
  if (Math.abs(zoom - nextZoom) < 0.001) return;
  zoom = nextZoom;
  updateZoom();
  updatePreview({ recenter: true });
}

function markInitialPreviewInteraction() {
  initialPreviewInteracted = true;
}

function queueInitialPreviewCentering() {
  [700, 1800].forEach(delay => {
    window.setTimeout(() => {
      if (initialPreviewInteracted || zoomAdjustedByUser) return;
      updatePreview({ recenter: true });
    }, delay);
  });
}

function rememberOriginalPosition(element) {
  if (!element || mobileOriginalParents.has(element)) return;
  mobileOriginalParents.set(element, {
    parent: element.parentElement,
    next: element.nextElementSibling
  });
}

function moveElementTo(element, parent) {
  if (!element || !parent || element.parentElement === parent) return;
  rememberOriginalPosition(element);
  parent.appendChild(element);
}

function restoreElement(element) {
  const original = mobileOriginalParents.get(element);
  if (!element || !original?.parent) return;

  if (original.next && original.next.parentElement === original.parent) {
    original.parent.insertBefore(element, original.next);
  } else {
    original.parent.appendChild(element);
  }
}

function ensureMobileToolDock() {
  if (!canvasWrap || !mobileActionsSlot) return null;

  if (!mobileToolRail) {
    mobileToolRail = document.createElement("div");
    mobileToolRail.className = "mobile-tool-rail";
    mobilePanelConfig.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `${getMobileToolIcon(item.icon)}<span>${item.label}</span>`;
      button.title = item.title;
      button.setAttribute("aria-label", item.title);
      button.dataset.mobileTool = item.key;
      button.addEventListener("click", () => toggleMobilePanel(item.key));
      mobileToolRail.appendChild(button);
    });
  }

  if (!mobileDownloadSlot) {
    mobileDownloadSlot = document.createElement("div");
    mobileDownloadSlot.className = "mobile-download-slot";
  }

  if (mobileToolRail.parentElement !== canvasWrap) {
    canvasWrap.appendChild(mobileToolRail);
  }
  if (mobileDownloadSlot.parentElement !== canvasWrap) {
    canvasWrap.appendChild(mobileDownloadSlot);
  }

  mobilePanelConfig.forEach(item => {
    if (mobileActionsSlot.querySelector(`[data-mobile-panel-target="${item.key}"]`)) return;

    const panel = document.createElement("div");
    panel.className = "mobile-tool-panel";
    panel.dataset.mobilePanelTarget = item.key;
    mobileActionsSlot.appendChild(panel);
  });

  return mobileActionsSlot;
}

function getMobileToolIcon(icon) {
  const svg = {
    text: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18l4.5-12h2L16 18" /><path d="M7 14h7" /><path d="M17 18V9h3" /></svg>',
    move: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18" /><path d="M8 7l4-4 4 4" /><path d="M8 17l4 4 4-4" /><path d="M3 12h18" /><path d="M7 8l-4 4 4 4" /><path d="M17 8l4 4-4 4" /></svg>',
    spacing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6v12" /><path d="M19 6v12" /><path d="M8 12h8" /><path d="M10 9l-3 3 3 3" /><path d="M14 9l3 3-3 3" /></svg>',
    line: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16h16" /><path d="M7 8c2-2 4-2 6 0s4 2 6 0" /></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.3 6-.9L12 3z" /></svg>',
    files: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h6l2 2h6v10H5z" /><path d="M8 12h8" /><path d="M13 9l3 3-3 3" /></svg>'
  };

  return svg[icon] || svg.text;
}

function getMobilePanel(key) {
  return mobileActionsSlot?.querySelector(`[data-mobile-panel-target="${key}"]`) || null;
}

function toggleMobilePanel(key) {
  activeMobilePanel = activeMobilePanel === key ? null : key;
  syncMobilePanelVisibility();
}

function syncMobilePanelVisibility() {
  document.querySelectorAll(".mobile-tool-panel").forEach(panel => {
    panel.hidden = panel.dataset.mobilePanelTarget !== activeMobilePanel;
  });
  document.querySelectorAll(".mobile-tool-rail button").forEach(button => {
    const active = button.dataset.mobileTool === activeMobilePanel;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  mobileActionsSlot?.classList.toggle("has-open-panel", Boolean(activeMobilePanel));
}

function syncMobileLayout() {
  if (!editorHeader || !editorActions || !previewAxisTools || !mobileActionsSlot || !canvasWrap) return;

  if (isMobileEditorLayout()) {
    ensureMobileToolDock();

    document.querySelectorAll("[data-mobile-panel]").forEach(group => {
      moveElementTo(group, getMobilePanel(group.dataset.mobilePanel));
    });
    moveElementTo(previewAxisTools, getMobilePanel("move"));
    moveElementTo(editorActions, getMobilePanel("files"));
    moveElementTo(txtStatus, getMobilePanel("files"));
    moveElementTo(document.querySelector(".batch-box"), getMobilePanel("files"));
    moveElementTo(nextName, getMobilePanel("files"));
    moveElementTo(downloadPackage, mobileDownloadSlot);
    moveElementTo(saveStatus, mobileDownloadSlot);
    syncMobilePanelVisibility();
  } else {
    activeMobilePanel = null;
    document.querySelectorAll("[data-mobile-panel]").forEach(restoreElement);
    restoreElement(txtStatus);
    restoreElement(document.querySelector(".batch-box"));
    restoreElement(nextName);
    restoreElement(downloadPackage);
    restoreElement(saveStatus);
    const titleBlock = editorHeader.firstElementChild;
    if (previewAxisTools.parentElement !== editorHeader) {
      titleBlock.insertAdjacentElement("afterend", previewAxisTools);
    }
    if (editorActions.parentElement !== editorHeader) {
      editorHeader.appendChild(editorActions);
    }
    syncMobilePanelVisibility();
  }
}

async function openMobileWorkspace(event) {
  if (!isMobileEditorLayout()) return;

  event.preventDefault();
  document.documentElement.classList.add("workspace-mode");
  document.body.classList.add("workspace-mode");

  const url = new URL(window.location.href);
  url.searchParams.set("workspace", "1");
  window.history.replaceState({}, "", url);

  syncMobileLayout();
  updatePreview({ recenter: true });

  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // Fullscreen may be unavailable on some mobile browsers.
  }

  try {
    if (screen.orientation?.lock) await screen.orientation.lock("landscape");
  } catch {
    // iOS and some browsers require the user to rotate the device manually.
  }
}

function readCookieConsentChoice() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    return null;
  }
}

function saveCookieConsentChoice(choice) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  } catch {
    // Consent still applies for the current page, even if storage is blocked.
  }
}

function loadOptionalCookieScripts() {
  if (optionalCookieScriptsLoaded) return;
  optionalCookieScriptsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  const analyticsScript = document.createElement("script");
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(analyticsScript);

  const adsScript = document.createElement("script");
  adsScript.async = true;
  adsScript.crossOrigin = "anonymous";
  adsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT_ID)}`;
  document.head.appendChild(adsScript);
}

function setCookieConsentChoice(choice) {
  saveCookieConsentChoice(choice);
  if (cookieConsent) cookieConsent.hidden = true;
  if (choice === "accepted") loadOptionalCookieScripts();
}

function initCookieConsent() {
  const choice = readCookieConsentChoice();
  if (choice === "accepted") {
    loadOptionalCookieScripts();
    return;
  }

  if (!choice && cookieConsent) cookieConsent.hidden = false;

  cookieAccept?.addEventListener("click", () => setCookieConsentChoice("accepted"));
  cookieReject?.addEventListener("click", () => setCookieConsentChoice("rejected"));
}

function setAuthPasswordVisible(isVisible, keepFocus = false) {
  if (!authPassword || !authPasswordToggle) return;

  const selectionStart = keepFocus ? authPassword.selectionStart : null;
  const selectionEnd = keepFocus ? authPassword.selectionEnd : null;
  authPassword.type = isVisible ? "text" : "password";
  authPasswordToggle.setAttribute("aria-label", isVisible ? "Hide password" : "Show password");
  authPasswordToggle.setAttribute("aria-pressed", String(isVisible));
  authPasswordToggle.querySelector(".password-eye-open").hidden = isVisible;
  authPasswordToggle.querySelector(".password-eye-closed").hidden = !isVisible;

  if (keepFocus) {
    authPassword.focus();
    if (Number.isInteger(selectionStart) && Number.isInteger(selectionEnd)) {
      authPassword.setSelectionRange(selectionStart, selectionEnd);
    }
  }
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const needsEmail = !isReset;
  const needsPassword = !isForgot;

  authLoginTab.classList.toggle("active", !isRegister);
  authRegisterTab.classList.toggle("active", isRegister);
  authNameGroup.hidden = !isRegister;
  authEmailGroup.hidden = !needsEmail;
  authEmail.required = needsEmail;
  authPasswordGroup.hidden = !needsPassword;
  authPassword.required = needsPassword;
  forgotPasswordOpen.hidden = isRegister || isForgot || isReset;
  authTitle.textContent = isReset
    ? "New password"
    : isForgot
      ? "Reset password"
      : isRegister
        ? "Create account"
        : "Sign in";
  authSubmit.textContent = isReset
    ? "Save new password"
    : isForgot
      ? "Send reset link"
      : isRegister
        ? "Create account"
        : "Sign in";
  authPassword.setAttribute("autocomplete", isRegister || isReset ? "new-password" : "current-password");
  authPassword.placeholder = isReset ? "New password" : "At least 8 characters";
  setAuthPasswordVisible(false);
  authMessage.textContent = "";
  authMessage.className = "auth-message";
}

function openAuthModal(mode = "login") {
  setAuthMode(mode);
  authModal.hidden = false;
  setTimeout(() => {
    if (mode === "register") authName.focus();
    else if (mode === "reset") authPassword.focus();
    else authEmail.focus();
  }, 30);
}

function closeAuthModal() {
  authModal.hidden = true;
  authForm.reset();
  setAuthPasswordVisible(false);
  authMessage.textContent = "";
  authMessage.className = "auth-message";
}

function updateAuthUi() {
  const isLoggedIn = Boolean(currentUser);

  authOpen.hidden = isLoggedIn;
  authRegisterOpen.hidden = isLoggedIn;
  accountPill.hidden = !isLoggedIn;

  if (currentUser) {
    accountName.textContent = `${currentUser.name} - signed in - no video needed`;
    accountPill.title = "Signed-in accounts can download without watching the sponsor video.";
  } else {
    accountName.textContent = "Account";
    accountPill.removeAttribute("title");
  }
}

function showAuthMessage(message, type = "error") {
  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
}

async function refreshAuth() {
  try {
    const response = await fetch("/api/Auth/me", { credentials: "same-origin" });
    if (!response.ok) {
      currentUser = null;
      updateAuthUi();
      return null;
    }

    const data = await response.json();
    currentUser = data.user;
    updateAuthUi();
    return currentUser;
  } catch {
    currentUser = null;
    updateAuthUi();
    return null;
  }
}

async function submitAuth(event) {
  event.preventDefault();

  const isRegister = authMode === "register";
  const isForgot = authMode === "forgot";
  const isReset = authMode === "reset";

  if (isForgot) {
    if (!validateAuthEmail()) return;
    await submitForgotPassword();
    return;
  }

  if (isReset) {
    if (!validateAuthPassword()) return;
    await submitPasswordReset();
    return;
  }

  if (!validateAuthEmail() || !validateAuthPassword()) return;

  const payload = {
    email: authEmail.value.trim(),
    password: authPassword.value
  };

  if (isRegister) payload.name = authName.value.trim();

  authSubmit.disabled = true;
  showAuthMessage("Working on it...", "success");

  try {
    const response = await fetch(isRegister ? "/api/Auth/register" : "/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      showAuthMessage(data.message || "We could not sign you in.");
      return;
    }

    if (isRegister && !data.user) {
      showAuthMessage(data.message || "Account created. Check your email to activate it.", "success");
      authPassword.value = "";
      return;
    }

    currentUser = data.user;
    updateAuthUi();
    closeAuthModal();
  } catch {
    showAuthMessage("Could not reach the server.");
  } finally {
    authSubmit.disabled = false;
  }
}

function validateAuthEmail() {
  const email = authEmail.value.trim();

  if (!email) {
    showAuthMessage("Enter your email address.");
    authEmail.focus();
    return false;
  }

  if (!authEmail.validity.valid) {
    showAuthMessage("Enter a valid email address.");
    authEmail.focus();
    return false;
  }

  return true;
}

function validateAuthPassword() {
  if (!authPassword.value) {
    showAuthMessage("Enter your password.");
    authPassword.focus();
    return false;
  }

  if (authPassword.value.length < 8) {
    showAuthMessage("Password must be at least 8 characters.");
    authPassword.focus();
    return false;
  }

  return true;
}

async function submitForgotPassword() {
  authSubmit.disabled = true;
  showAuthMessage("Sending...", "success");

  try {
    const response = await fetch("/api/Auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email: authEmail.value.trim() })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      showAuthMessage(data.message || "We could not send the reset email.");
      return;
    }

    showAuthMessage(data.message || "If that account exists, we sent a reset link.", "success");
  } catch {
    showAuthMessage("Could not reach the server.");
  } finally {
    authSubmit.disabled = false;
  }
}

async function submitPasswordReset() {
  authSubmit.disabled = true;
  showAuthMessage("Saving...", "success");

  try {
    const response = await fetch("/api/Auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        token: passwordResetToken,
        password: authPassword.value
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      showAuthMessage(data.message || "We could not update your password.");
      return;
    }

    currentUser = data.user;
    updateAuthUi();
    showAuthMessage("Password updated. You are signed in.", "success");
    setTimeout(closeAuthModal, 800);
  } catch {
    showAuthMessage("Could not reach the server.");
  } finally {
    authSubmit.disabled = false;
  }
}

async function logout() {
  try {
    await fetch("/api/Auth/logout", {
      method: "POST",
      credentials: "same-origin"
    });
  } finally {
    currentUser = null;
    updateAuthUi();
  }
}

async function readApiMessage(response, fallback) {
  const data = await response.json().catch(() => null);
  return data?.message || fallback;
}

function handleDownloadBlocked(status, message) {
  if (isDesktopApp) {
    alert(message);
    return;
  }

  if (status === 401) {
    openAuthModal("login");
    showAuthMessage("Sign in to download without watching a sponsor video.", "success");
  }

  alert(message);
}

async function ensureDownloadSession() {
  if (isDesktopApp) return true;
  if (!currentUser) await refreshAuth();
  return true;
}

async function requireRewardVideo() {
  if (isDesktopApp) return true;
  if (currentUser || await refreshAuth()) return Promise.resolve(true);

  const granted = await showGoogleRewardedAd();
  if (granted !== null) return granted;

  const config = await getRewardedAdsConfig();
  if (!config.fallbackEnabled) {
    alert("No rewarded ad is available right now. Please try again in a moment.");
    return false;
  }

  return new Promise(resolve => {
    pendingRewardResolve = resolve;
    let remaining = 8;

    rewardModal.hidden = false;
    rewardContinue.disabled = true;
    rewardContinue.textContent = `Continue in ${remaining}s`;

    clearInterval(rewardTimer);
    rewardTimer = setInterval(() => {
      remaining -= 1;

      if (remaining > 0) {
        rewardContinue.textContent = `Continue in ${remaining}s`;
        return;
      }

      clearInterval(rewardTimer);
      rewardTimer = null;
      rewardContinue.disabled = false;
      rewardContinue.textContent = "Continue to download";
    }, 1000);
  });
}

async function getRewardedAdsConfig() {
  if (rewardedAdsConfig) return rewardedAdsConfig;
  if (rewardedAdsConfigPromise) return rewardedAdsConfigPromise;

  rewardedAdsConfigPromise = fetch("/api/Ads/rewarded-config", {
    credentials: "same-origin",
    cache: "no-store"
  })
    .then(response => response.ok ? response.json() : null)
    .catch(() => null)
    .then(config => {
      rewardedAdsConfig = {
        provider: config?.provider || "google-ad-manager",
        enabled: Boolean(config?.enabled && config?.adUnitPath),
        adUnitPath: config?.adUnitPath || "",
        fallbackEnabled: config?.fallbackEnabled !== false
      };
      return rewardedAdsConfig;
    });

  return rewardedAdsConfigPromise;
}

function loadGooglePublisherTag() {
  if (window.googletag?.apiReady) return Promise.resolve(true);
  if (gptLoadPromise) return gptLoadPromise;

  gptLoadPromise = new Promise(resolve => {
    window.googletag = window.googletag || { cmd: [] };

    const existing = document.querySelector("script[data-gpt]");
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.dataset.gpt = "true";
    script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return gptLoadPromise;
}

async function showGoogleRewardedAd() {
  const config = await getRewardedAdsConfig();
  if (!config.enabled || config.provider !== "google-ad-manager") return null;
  if (!(await loadGooglePublisherTag())) return null;

  return new Promise(resolve => {
    let resolved = false;
    let rewardedSlot = null;
    let rewardGranted = false;

    const finish = result => {
      if (resolved) return;
      resolved = true;
      if (rewardedSlot && window.googletag?.destroySlots) {
        window.googletag.destroySlots([rewardedSlot]);
      }
      resolve(result);
    };

    const timeout = setTimeout(() => finish(null), 8000);

    window.googletag.cmd.push(() => {
      rewardedSlot = window.googletag.defineOutOfPageSlot(
        config.adUnitPath,
        window.googletag.enums.OutOfPageFormat.REWARDED
      );

      if (!rewardedSlot) {
        clearTimeout(timeout);
        finish(null);
        return;
      }

      rewardedSlot.addService(window.googletag.pubads());

      window.googletag.pubads().addEventListener("rewardedSlotReady", event => {
        clearTimeout(timeout);
        event.makeRewardedVisible();
      });

      window.googletag.pubads().addEventListener("rewardedSlotGranted", () => {
        rewardGranted = true;
      });

      window.googletag.pubads().addEventListener("rewardedSlotClosed", () => {
        clearTimeout(timeout);
        finish(rewardGranted);
      });

      window.googletag.enableServices();
      window.googletag.display(rewardedSlot);
    });
  });
}

function finishRewardVideo(accepted) {
  clearInterval(rewardTimer);
  rewardTimer = null;
  rewardModal.hidden = true;

  if (pendingRewardResolve) {
    pendingRewardResolve(accepted);
    pendingRewardResolve = null;
  }
}

function updateUsageFromResponse(data) {
  if (data?.usage) {
    currentUser = data.usage;
    updateAuthUi();
  } else {
    refreshAuth();
  }
}

function getName() {
  const current = nameInput.value.trim();
  if (current) return current;
  return placedNames.length ? "" : "Name";
}

function ensureOffsets() {
  const len = getName().length;
  while (offsets.length < len) offsets.push({ x: 0, y: 0, rotation: 0, scale: 1 });
  offsets = offsets.slice(0, len);
  offsets = offsets.map(item => ({
    x: item?.x || 0,
    y: item?.y || 0,
    rotation: item?.rotation || 0,
    scale: item?.scale || 1
  }));
}

function updateLetterNav() {
  const name = getName();
  if (name.length === 0) {
    selectedLetter = null;
    selectedLetterMode = "none";
    letterStatus.textContent = "Letter: none";
    updateCanvasTouchState();
    return;
  }

  if (selectedLetter === null) {
    selectedLetterMode = "none";
    letterStatus.textContent = "Letter: none";
    return;
  }

  if (selectedLetter >= name.length) selectedLetter = Math.max(0, name.length - 1);
  if (selectedLetter < 0) selectedLetter = 0;
  if (selectedLetterMode === "none") selectedLetterMode = "move";
  letterStatus.textContent = `Letter: ${selectedLetter + 1}/${name.length}`;
}

function clearLetterSelection() {
  selectedLetter = null;
  selectedLetterMode = "none";
  updateCanvasTouchState();
  updateLetterNav();
}

function setLetterSelection(index, mode = "move") {
  selectedLetter = index;
  selectedLetterMode = mode;
  clearPlacedNameSelection(false);
  clearAccessorySelection(false);
  updateCanvasTouchState();
  updateLetterNav();
}

function updateCanvasTouchState() {
  canvas.classList.toggle("has-letter-selection", selectedLetter !== null);
}

function getAutoSize(name) {
  let size = 110;
  if (name.length > 9) size -= (name.length - 9) * 6;
  return Math.max(58, size);
}

function syncLineLabels() {
  lineYValue.textContent = Math.round(Number(lineYRange.value));
}

function syncSpacingLabel() {
  spacingValue.textContent = spacingAdjust > 0 ? `+${spacingAdjust}` : String(spacingAdjust);
}

function normalizePieceColor(value) {
  const color = String(value || "").trim();
  const shortHex = /^#([0-9a-f]{3})$/i.exec(color);

  if (shortHex) {
    return `#${shortHex[1].split("").map(ch => ch + ch).join("")}`.toLowerCase();
  }

  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color.toLowerCase();
  }

  return "#111111";
}

function setPieceColor(color, shouldRender = true) {
  pieceColor = normalizePieceColor(color);
  document.documentElement.style.setProperty("--piece-color", pieceColor);

  colorSwatches?.querySelectorAll("button[data-color]").forEach(button => {
    button.classList.toggle("is-active", normalizePieceColor(button.dataset.color) === pieceColor);
  });

  if (customColor && customColor.value !== pieceColor) {
    customColor.value = pieceColor;
  }

  if (stlPreviewModal && !stlPreviewModal.hidden) {
    showStlPreview("Refreshing the real 3D preview...", buildProject({ showBaseLine: false }));
  }

  if (shouldRender) {
    updatePreview();
  }
}

function setAccessoryColor(color, shouldRender = true) {
  accessoryColor = normalizePieceColor(color);
  document.documentElement.style.setProperty("--accessory-color", accessoryColor);
  const selected = getSelectedImportedObject();
  if (selected) selected.color = accessoryColor;

  accessoryColorSwatches?.querySelectorAll("button[data-color]").forEach(button => {
    button.classList.toggle("is-active", normalizePieceColor(button.dataset.color) === accessoryColor);
  });

  if (customAccessoryColor && customAccessoryColor.value !== accessoryColor) {
    customAccessoryColor.value = accessoryColor;
  }

  if (accessoryPreview) {
    accessoryPreview.style.color = accessoryColor;
  }

  if (stlPreviewModal && !stlPreviewModal.hidden) {
    showStlPreview("Refreshing the real 3D preview...", buildProject({ showBaseLine: false }));
  }

  if (shouldRender) {
    updatePreview({ recenter: false });
  }
}

function hexToRgb(color) {
  const normalized = normalizePieceColor(color).slice(1);
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function shadeRgb(rgb, amount) {
  const clamp = value => Math.max(0, Math.min(255, Math.round(value)));

  return `rgb(${clamp(rgb.r * amount)}, ${clamp(rgb.g * amount)}, ${clamp(rgb.b * amount)})`;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function mixRgb(from, to, amount) {
  const t = clamp01(amount);

  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t
  };
}

function rgbToCss(rgb, alpha = 1) {
  const clamp = value => Math.max(0, Math.min(255, Math.round(value)));

  if (alpha < 1) {
    return `rgba(${clamp(rgb.r)}, ${clamp(rgb.g)}, ${clamp(rgb.b)}, ${clamp01(alpha).toFixed(3)})`;
  }

  return `rgb(${clamp(rgb.r)}, ${clamp(rgb.g)}, ${clamp(rgb.b)})`;
}

function getSelectedImportedObject() {
  if (selectedImportedObjectId) {
    const selected = importedObjects.find(item => item.id === selectedImportedObjectId);
    if (selected) return selected;
  }

  if (importedObject && importedObjects.length === 0) return importedObject;
  return null;
}

function getSelectedImportedObjectIndex() {
  const selected = getSelectedImportedObject();
  if (!selected) return -1;
  return importedObjects.findIndex(item => item.id === selected.id);
}

function normalizeImageImportMode(value, fallback = "line-art") {
  const mode = String(value || "").trim().toLowerCase();
  if (mode === "silhouette" || mode === "cookie-cutter" || mode === "line-art") return mode;
  return fallback;
}

function getImageImportMode() {
  return normalizeImageImportMode(imageImportMode?.value || "line-art");
}

function isImageTraceObject(object) {
  if (!object) return false;
  const issues = Array.isArray(object.catalogIssues) ? object.catalogIssues : [];
  return object.sourceKind === "image-trace" ||
    issues.some(issue => String(issue).toLowerCase() === "image trace");
}

function getImageTraceStlQuality(mode) {
  const normalized = normalizeImageImportMode(mode);

  if (normalized === "silhouette") {
    return {
      level: "warning",
      message: "Silhouette mode fills the imported image as a solid shape. Check holes in 3D Preview."
    };
  }

  if (normalized === "cookie-cutter") {
    return {
      level: "warning",
      message: "Cookie cutter mode keeps outline openings and exports taller cutter-style walls."
    };
  }

  return {
    level: "warning",
    message: "Outline mode keeps image openings. Check the 3D preview before printing."
  };
}

function getImageTraceCatalogIssues(mode) {
  const normalized = normalizeImageImportMode(mode);
  const issues = ["image trace"];

  if (normalized === "silhouette") issues.push("silhouette");
  if (normalized === "cookie-cutter") issues.push("cookie cutter");

  return issues;
}

function cloneImportedObjectForProject(object) {
  if (!object) return null;
  const catalogIssues = Array.isArray(object.catalogIssues) ? object.catalogIssues : [];
  const isImageTrace = object.sourceKind === "image-trace" ||
    catalogIssues.some(issue => String(issue).toLowerCase() === "image trace");

  return {
    id: object.id || "",
    name: object.name || "",
    type: object.type || "",
    sourceKind: object.sourceKind || (isImageTrace ? "image-trace" : ""),
    stlMode: normalizeImageImportMode(object.stlMode || (isImageTrace ? "line-art" : ""), ""),
    color: object.color || accessoryColor,
    svgInner: object.svgInner || "",
    previewSvg: object.previewSvg || "",
    sourceSvg: object.sourceSvg || "",
    contours: Array.isArray(object.contours) ? object.contours : [],
    stlQuality: object.stlQuality || null,
    verified3d: object.verified3d === true,
    catalogRisk: object.catalogRisk || null,
    catalogIssues,
    x: Number.isFinite(object.x) ? object.x : 250,
    y: Number.isFinite(object.y) ? object.y : 120,
    rotation: Number.isFinite(object.rotation) ? object.rotation : 0,
    scale: Number.isFinite(object.scale) ? object.scale : 0.3
  };
}

function addImportedObject(object) {
  if (!object) return null;

  object.id = object.id || `accessory-${++importedObjectId}`;
  object.color = normalizePieceColor(object.color || accessoryColor);
  importedObjects.push(object);
  selectedImportedObjectId = object.id;
  importedObject = object;
  setAccessoryColor(object.color, false);
  clearLetterSelection();
  clearPlacedNameSelection(false);
  syncAccessoryStatus();
  return object;
}

function selectImportedObject(id, shouldRender = true) {
  const selected = importedObjects.find(item => item.id === id);
  if (!selected) return;

  selectedImportedObjectId = selected.id;
  importedObject = selected;
  setAccessoryColor(selected.color || accessoryColor, false);
  clearLetterSelection();
  clearPlacedNameSelection(false);
  syncAccessoryStatus();
  if (shouldRender) updatePreview({ recenter: false });
}

function clearAccessorySelection(shouldRender = false) {
  if (!selectedImportedObjectId && !importedObject) {
    syncAccessoryStatus();
    return;
  }

  selectedImportedObjectId = null;
  importedObject = null;
  syncAccessoryStatus();
  if (shouldRender) updatePreview({ recenter: false });
}

function syncAccessoryStatus() {
  const selected = getSelectedImportedObject();
  const count = importedObjects.length || (selected ? 1 : 0);
  const index = getSelectedImportedObjectIndex();

  importedObject = selected;
  accessoryStatus.textContent = selected
    ? `${selected.name || selected.type.toUpperCase()} selected${count > 1 && index >= 0 ? ` (${index + 1}/${count})` : ""}`
    : count
      ? `${count} accessor${count === 1 ? "y" : "ies"} on canvas.`
    : "No accessory";
  syncAccessoryPreview();
  syncAccessoryQuality();
  syncImageImportModeControl();
}

function syncAccessoryPreview() {
  if (!accessoryPreview) return;
  const selected = getSelectedImportedObject();
  accessoryPreview.style.color = selected?.color || accessoryColor;

  if (!selected) {
    accessoryPreview.innerHTML = "<span>No preview</span>";
    return;
  }

  if (selected.type === "svg" && selected.previewSvg) {
    accessoryPreview.innerHTML = selected.previewSvg;
    return;
  }

  const paths = (selected.contours || [])
    .slice(0, 18)
    .map(contour => {
      const points = contour.points || contour;
      if (!Array.isArray(points) || points.length === 0) return "";
      const d = points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");
      return `<path d="${d}" />`;
    })
    .join("");

  accessoryPreview.innerHTML = `
    <svg viewBox="0 0 120 120" role="img" aria-label="Selected accessory">
      <g transform="translate(12 12) scale(0.2)">${paths}</g>
    </svg>
  `;
}

function syncAccessoryQuality() {
  if (!accessoryQuality) return;
  const selected = getSelectedImportedObject();

  if (!selected || !selected.stlQuality) {
    accessoryQuality.hidden = true;
    accessoryQuality.textContent = "";
    accessoryQuality.classList.remove("is-safe", "is-warning", "is-danger");
    return;
  }

  const quality = selected.stlQuality;
  accessoryQuality.hidden = false;
  let level = quality.level;
  let message = quality.message;

  if (selected.verified3d && quality.level === "safe") {
    level = "safe";
    message = "Verified for STL. Optimized for 3D printing.";
  } else if (selected.catalogRisk === "visual-only") {
    level = "danger";
    message = "2D-only accessory: it may generate defective 3D geometry.";
  } else if (selected.catalogRisk === "review" && quality.level === "safe") {
    level = "warning";
    message = "Needs STL review: check the 3D preview before printing.";
  }

  accessoryQuality.textContent = message;
  accessoryQuality.classList.toggle("is-safe", level === "safe");
  accessoryQuality.classList.toggle("is-warning", level === "warning");
  accessoryQuality.classList.toggle("is-danger", level === "danger");
}

function syncImageImportModeControl() {
  if (!imageImportMode) return;
  const selected = getSelectedImportedObject();

  if (isImageTraceObject(selected)) {
    imageImportMode.value = normalizeImageImportMode(selected.stlMode);
    imageImportMode.title = "Mode used by the selected imported image.";
    return;
  }

  imageImportMode.title = "Mode used for the next imported image.";
}

function cloneLetterItems(letters) {
  return (letters || []).map(letter => ({
    character: letter.character,
    x: letter.x || 0,
    y: letter.y || 0,
    offsetX: letter.offsetX || 0,
    offsetY: letter.offsetY || 0,
    rotation: letter.rotation || 0,
    scale: letter.scale || 1
  }));
}

function clonePlacedNameForProject(item) {
  return {
    id: item.id,
    text: item.text,
    fontName: item.fontName,
    fontSize: item.fontSize,
    letterSpacing: item.letterSpacing,
    useBaseLine: item.useBaseLine,
    showBaseLine: item.showBaseLine,
    baseLineY: item.baseLineY,
    baseLineThickness: item.baseLineThickness,
    pieceColor: item.pieceColor,
    x: item.x || 0,
    y: item.y || 0,
    rotation: item.rotation || 0,
    scale: item.scale || 1,
    letters: cloneLetterItems(item.letters)
  };
}

function getSelectedPlacedName() {
  if (!selectedPlacedNameId) return null;
  return placedNames.find(item => item.id === selectedPlacedNameId) || null;
}

function syncPlacedNameStatus() {
  const selected = getSelectedPlacedName();
  const count = placedNames.length;

  if (placedNamesStatus) {
    placedNamesStatus.textContent = selected
      ? `Selected saved name: ${selected.text || "Untitled"}`
      : count
        ? `${count} saved name${count === 1 ? "" : "s"} on canvas.`
        : "No saved names yet.";
  }

  placedNameTools?.classList.toggle("is-disabled", !selected);
  [
    placedNameLeft,
    placedNameRight,
    placedNameUp,
    placedNameDown,
    placedNameRotateLeft,
    placedNameRotateRight,
    placedNameScaleDown,
    placedNameScaleUp,
    placedNameDelete
  ].forEach(button => {
    if (button) button.disabled = !selected;
  });
}

function clearPlacedNameSelection(shouldRender = false) {
  if (!selectedPlacedNameId) {
    syncPlacedNameStatus();
    return;
  }

  selectedPlacedNameId = null;
  syncPlacedNameStatus();
  if (shouldRender) updatePreview({ recenter: false });
}

function selectPlacedName(id, shouldRender = false) {
  if (!placedNames.some(item => item.id === id)) return;
  selectedPlacedNameId = id;
  clearLetterSelection();
  clearAccessorySelection(false);
  syncPlacedNameStatus();
  if (shouldRender) updatePreview({ recenter: false });
}

function placeCurrentName() {
  const currentText = nameInput.value.trim();
  if (!currentText) {
    saveStatus.textContent = "Type a name before adding it to the canvas.";
    return;
  }

  const project = buildProject({ showBaseLine: true, includePlacedNames: false });
  if (!project.letters.length) return;

  const id = `placed-name-${++placedNameId}`;
  placedNames.push({
    id,
    text: project.text,
    fontName: project.fontName,
    fontSize: project.fontSize,
    letterSpacing: project.letterSpacing,
    useBaseLine: false,
    showBaseLine: false,
    baseLineY: project.baseLineY,
    baseLineThickness: project.baseLineThickness,
    pieceColor: project.pieceColor,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    letters: cloneLetterItems(project.letters)
  });

  selectedPlacedNameId = id;
  selectedLetter = null;
  selectedLetterMode = "none";
  offsets = [];
  nameInput.value = "";
  metricRulerAnchor = null;
  metricRulerAnchorKey = "";
  syncPlacedNameStatus();
  updateCanvasTouchState();
  updateLetterNav();
  updatePreview();
  nameInput.focus();
}

function movePlacedName(dx, dy) {
  const item = getSelectedPlacedName();
  if (!item) return;
  item.x += dx;
  item.y += dy;
  updatePreview({ recenter: false });
}

function rotatePlacedName(delta) {
  const item = getSelectedPlacedName();
  if (!item) return;
  item.rotation += delta;
  updatePreview({ recenter: false });
}

function scalePlacedName(delta) {
  const item = getSelectedPlacedName();
  if (!item) return;
  item.scale = Math.min(4, Math.max(0.2, item.scale + delta));
  updatePreview({ recenter: false });
}

function deleteSelectedPlacedName() {
  if (!selectedPlacedNameId) return;
  placedNames = placedNames.filter(item => item.id !== selectedPlacedNameId);
  selectedPlacedNameId = null;
  syncPlacedNameStatus();
  updatePreview();
}

function mapFontName() {
  if (fontSelect.value === "bold") return "Impact";
  if (fontSelect.value === "elegant") return "Georgia";
  if (fontSelect.value === "script") return "Georgia";
  return fontSelect.value;
}

function getFontCss(fontName, fontSize) {
  const safeName = fontName.replace(/"/g, '\\"');
  if (fontName === "Impact") return `${fontSize}px Impact, Arial Black, sans-serif`;
  return `900 ${fontSize}px "${safeName}", Impact, Arial Black, sans-serif`;
}

function getPreviewFrameKey() {
  return [
    getName(),
    fontSelect.value,
    pieceColor,
    accessoryColor,
    joinToggle.classList.contains("active") ? "joined" : "spaced",
    lineToggle.classList.contains("active") ? "line" : "no-line",
    lineYRange.value,
    spacingAdjust,
    JSON.stringify(placedNames.map(item => ({
      id: item.id,
      x: item.x,
      y: item.y,
      rotation: item.rotation,
      scale: item.scale,
      text: item.text,
      color: item.pieceColor
    }))),
    JSON.stringify(importedObjects.map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
      x: item.x,
      y: item.y,
      rotation: item.rotation,
      scale: item.scale,
      color: item.color
    })))
  ].join("|");
}

function getMetricRulerAnchorKey() {
  return [
    getName(),
    fontSelect.value,
    joinToggle.classList.contains("active") ? "joined" : "spaced",
    spacingAdjust
  ].join("|");
}

function buildProject(options = {}) {
  const name = getName();
  const fontSize = getAutoSize(name);
  const lineY = Number(lineYRange.value);
  const joined = joinToggle.classList.contains("active");
  const letterSpacing = (joined ? -30 : 6) + spacingAdjust;
  const fontName = mapFontName();
  const canvas = buildProject.canvas || (buildProject.canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  ctx.font = getFontCss(fontName, fontSize);

  let currentX = 50;
  const textAnchorY = 240;
  const baseY = textAnchorY - fontSize * 0.78;
  ensureOffsets();

  const letters = [...name].map((ch, i) => {
    const item = {
      character: ch,
      x: currentX,
      y: baseY,
      offsetX: offsets[i]?.x || 0,
      offsetY: offsets[i]?.y || 0,
      rotation: offsets[i]?.rotation || 0,
      scale: offsets[i]?.scale || 1
    };

    currentX += ctx.measureText(ch).width + letterSpacing;
    return item;
  });

  const projectImportedObjects = importedObjects.map(cloneImportedObjectForProject);
  const selectedImportedObject = getSelectedImportedObject();
  const project = {
    text: name,
    fontName,
    fontSize,
    letterSpacing,
    useBaseLine: lineToggle.classList.contains("active"),
    showBaseLine: options.showBaseLine ?? false,
    baseLineY: lineY,
    baseLineThickness: Number(lineRange.value),
    pieceColor,
    accessoryColor,
    letters,
    importedObject: selectedImportedObject ? cloneImportedObjectForProject(selectedImportedObject) : null,
    importedObjects: projectImportedObjects,
    placedNames: options.includePlacedNames === false
      ? []
      : placedNames.map(clonePlacedNameForProject)
  };

  return project;
}

async function updatePreview(options = {}) {
  if (previewInputTimer) {
    clearTimeout(previewInputTimer);
    previewInputTimer = null;
  }

  updateLetterNav();
  const requestId = ++previewRequest;
  const frameKey = getPreviewFrameKey();

  try {
    const response = await fetch(`/api/Generate/svg?t=${Date.now()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(buildProject({ showBaseLine: true }))
    });

    if (!response.ok || requestId !== previewRequest) return;

    const svg = await response.text();
    if (requestId !== previewRequest) return;

    designObject.innerHTML = svg;
    const previewSvg = designObject.querySelector("svg");
    if (previewSvg) {
      previewSvg.id = "nameSvg";
      previewSvg.removeAttribute("width");
      previewSvg.removeAttribute("height");
      drawMetricRulers(previewSvg);
      if (previewFrameViewBox && options.recenter !== true) {
        previewSvg.setAttribute("viewBox", previewFrameViewBox);
      } else {
        centerPreviewSvg(previewSvg, frameKey, options.recenter === true);
      }
      previewSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      drawSelectedLetterBox(previewSvg);
      drawSelectedPlacedNameBox(previewSvg);
      drawSelectedAccessoryBox(previewSvg);
      enableLetterDrag(previewSvg);
      enablePlacedNameDrag(previewSvg);
      enableAccessoryDrag(previewSvg);
    }

    syncLineLabels();
  } catch {
    designObject.innerHTML = "<p>Could not render preview.</p>";
  }
}

function schedulePreviewUpdate(delay = 140) {
  if (previewInputTimer) clearTimeout(previewInputTimer);
  previewInputTimer = setTimeout(() => {
    previewInputTimer = null;
    updatePreview();
  }, delay);
}

function enableLetterDrag(previewSvg) {
  const paths = [...previewSvg.querySelectorAll("path.letter-path")];

  paths.forEach((path, index) => {
    path.addEventListener("pointerdown", event => {
      if (event.pointerType === "touch") {
        event.preventDefault();
        event.stopPropagation();
        ensureOffsets();
        setLetterSelection(index, selectedLetter === index ? selectedLetterMode : "move");
        drawSelectedLetterBox(previewSvg);
        return;
      }

      const startPoint = getSvgPoint(previewSvg, event);
      if (!startPoint) return;

      event.preventDefault();
      event.stopPropagation();
      ensureOffsets();
      const wasSelected = selectedLetter === index;
      const startMode = wasSelected ? selectedLetterMode : "none";

      setLetterSelection(index, wasSelected ? startMode : "move");
      path.setPointerCapture?.(event.pointerId);
      path.classList.add("is-dragging");

      if (event.button === 2 && selectedLetterMode === "transform") {
        const box = getElementBox(path);
        letterRotateDrag = {
          pointerId: event.pointerId,
          element: path,
          index,
          startClientX: event.clientX,
          startRotation: offsets[index]?.rotation || 0,
          centerX: box ? box.x + box.width / 2 : startPoint.x,
          centerY: box ? box.y + box.height / 2 : startPoint.y
        };
        drawSelectedLetterBox(previewSvg);
        return;
      }

      if (event.button !== 0) {
        path.classList.remove("is-dragging");
        path.releasePointerCapture?.(event.pointerId);
        return;
      }

      letterDrag = {
        pointerId: event.pointerId,
        element: path,
        svg: previewSvg,
        startPointer: startPoint,
        startX: offsets[index]?.x || 0,
        startY: offsets[index]?.y || 0,
        startBox: getElementBox(path),
        index,
        wasSelected,
        startMode,
        canMove: !wasSelected || startMode === "move"
      };

      if (event.pointerType === "touch") {
        letterDrag.canMove = true;
      }

      drawSelectedLetterBox(previewSvg);
    });
  });
}

function getElementBox(element) {
  try {
    return element.getBBox();
  } catch {
    return null;
  }
}

function enableAccessoryDrag(previewSvg) {
  const accessories = [...previewSvg.querySelectorAll(".imported-object")];
  if (!accessories.length) return;

  accessories.forEach(accessory => {
    accessory.addEventListener("pointerdown", event => {
    if (event.pointerType === "touch" && isMobileEditorLayout()) return;

    const id = accessory.dataset.accessoryId;
    const object = id
      ? importedObjects.find(item => item.id === id)
      : getSelectedImportedObject();
    const startPoint = getSvgPoint(previewSvg, event);
    if (!object || !startPoint) return;

    event.preventDefault();
    event.stopPropagation();
    selectImportedObject(object.id, false);
    drawSelectedAccessoryBox(previewSvg);
    accessory.setPointerCapture?.(event.pointerId);
    accessory.classList.add("is-dragging");

    accessoryDrag = {
      pointerId: event.pointerId,
      element: accessory,
      svg: previewSvg,
      id: object.id,
      type: object.type,
      startPointer: startPoint,
      startX: object.x,
      startY: object.y,
      rotation: object.rotation,
      scale: object.scale
    };
    });
  });
}

function enablePlacedNameDrag(previewSvg) {
  const groups = [...previewSvg.querySelectorAll(".placed-name-object[data-placed-id]")];

  groups.forEach(group => {
    const id = group.dataset.placedId;

    group.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      if (event.pointerType === "touch" && isMobileEditorLayout()) return;

      const item = placedNames.find(placed => placed.id === id);
      const startPoint = getSvgPoint(previewSvg, event);
      if (!item || !startPoint) return;

      event.preventDefault();
      event.stopPropagation();
      selectedPlacedNameId = id;
      selectedLetter = null;
      selectedLetterMode = "none";
      updateCanvasTouchState();
      updateLetterNav();
      syncPlacedNameStatus();
      drawSelectedPlacedNameBox(previewSvg);
      group.setPointerCapture?.(event.pointerId);
      group.classList.add("is-dragging");

      placedNameDrag = {
        pointerId: event.pointerId,
        element: group,
        svg: previewSvg,
        id,
        startPointer: startPoint,
        startX: item.x || 0,
        startY: item.y || 0
      };
    });
  });
}

function getSvgPoint(svg, event) {
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;

  const point = new DOMPoint(event.clientX, event.clientY);
  return point.matrixTransform(matrix.inverse());
}

function getSvgViewBox(svg) {
  const values = (svg.getAttribute("viewBox") || "0 0 1200 600")
    .split(/\s+/)
    .map(Number);

  if (values.length !== 4 || values.some(value => !Number.isFinite(value)))
    return { x: 0, y: 0, width: 1200, height: 600 };

  return { x: values[0], y: values[1], width: values[2], height: values[3] };
}

function onPlacedNamePointerMove(event) {
  if (!placedNameDrag || event.pointerId !== placedNameDrag.pointerId) return;

  const point = getSvgPoint(placedNameDrag.svg, event);
  if (!point) return;

  event.preventDefault();
  const dx = point.x - placedNameDrag.startPointer.x;
  const dy = point.y - placedNameDrag.startPointer.y;
  placedNameDrag.element.setAttribute("transform", `translate(${dx} ${dy})`);
}

function onPlacedNamePointerUp(event) {
  if (!placedNameDrag || event.pointerId !== placedNameDrag.pointerId) return;

  const point = getSvgPoint(placedNameDrag.svg, event);
  const dx = point ? point.x - placedNameDrag.startPointer.x : 0;
  const dy = point ? point.y - placedNameDrag.startPointer.y : 0;
  const item = placedNames.find(placed => placed.id === placedNameDrag.id);

  if (item) {
    item.x = placedNameDrag.startX + dx;
    item.y = placedNameDrag.startY + dy;
  }

  placedNameDrag.element.classList.remove("is-dragging");
  placedNameDrag.element.releasePointerCapture?.(event.pointerId);
  placedNameDrag = null;
  updatePreview({ recenter: false });
}

function onAccessoryPointerMove(event) {
  if (!accessoryDrag || event.pointerId !== accessoryDrag.pointerId) return;

  const point = getSvgPoint(accessoryDrag.svg, event);
  if (!point) return;

  const dx = point.x - accessoryDrag.startPointer.x;
  const dy = point.y - accessoryDrag.startPointer.y;

  if (accessoryDrag.type === "svg") {
    accessoryDrag.element.setAttribute(
      "transform",
      `translate(${accessoryDrag.startX + dx} ${accessoryDrag.startY + dy}) rotate(${accessoryDrag.rotation}) scale(${accessoryDrag.scale})`
    );
  } else {
    accessoryDrag.element.setAttribute("transform", `translate(${dx} ${dy})`);
  }
}

function onAccessoryPointerUp(event) {
  if (!accessoryDrag || event.pointerId !== accessoryDrag.pointerId) return;

  const point = getSvgPoint(accessoryDrag.svg, event);
  const dx = point ? point.x - accessoryDrag.startPointer.x : 0;
  const dy = point ? point.y - accessoryDrag.startPointer.y : 0;

  const object = importedObjects.find(item => item.id === accessoryDrag.id) || getSelectedImportedObject();
  if (object) {
    object.x = accessoryDrag.startX + dx;
    object.y = accessoryDrag.startY + dy;
  }

  accessoryDrag.element.classList.remove("is-dragging");
  accessoryDrag.element.releasePointerCapture?.(event.pointerId);
  accessoryDrag = null;
  updatePreview({ recenter: false });
}

function getConstrainedLetterDelta(dx, dy) {
  if (letterDragAxis === "x") return { dx, dy: 0 };
  if (letterDragAxis === "y") return { dx: 0, dy };
  return { dx, dy };
}

function clampLetterDeltaToPreview(dx, dy, drag) {
  const constrained = getConstrainedLetterDelta(dx, dy);
  const view = getSvgViewBox(drag.svg);
  const box = drag.startBox;

  if (!box || !Number.isFinite(box.x) || box.width <= 0 || box.height <= 0)
    return constrained;

  const minDx = view.x - box.x;
  const maxDx = view.x + view.width - (box.x + box.width);
  const minDy = view.y - box.y;
  const maxDy = view.y + view.height - (box.y + box.height);

  return {
    dx: minDx <= maxDx ? Math.min(maxDx, Math.max(minDx, constrained.dx)) : 0,
    dy: minDy <= maxDy ? Math.min(maxDy, Math.max(minDy, constrained.dy)) : 0
  };
}

function onLetterPointerMove(event) {
  if (!letterDrag || event.pointerId !== letterDrag.pointerId) return;
  if (!letterDrag.canMove) return;

  if (event.pointerType === "touch") {
    event.preventDefault();
  }

  const point = getSvgPoint(letterDrag.svg, event);
  if (!point) return;

  const rawDx = point.x - letterDrag.startPointer.x;
  const rawDy = point.y - letterDrag.startPointer.y;
  const { dx, dy } = clampLetterDeltaToPreview(rawDx, rawDy, letterDrag);

  letterDrag.element.setAttribute("transform", `translate(${dx} ${dy})`);
}

function onLetterPointerUp(event) {
  if (!letterDrag || event.pointerId !== letterDrag.pointerId) return;

  if (event.pointerType === "touch") {
    event.preventDefault();
  }

  const point = getSvgPoint(letterDrag.svg, event);
  const rawDx = point ? point.x - letterDrag.startPointer.x : 0;
  const rawDy = point ? point.y - letterDrag.startPointer.y : 0;
  const { dx, dy } = clampLetterDeltaToPreview(rawDx, rawDy, letterDrag);

  ensureOffsets();
  const moved = letterDrag.canMove && (Math.abs(dx) > 1.5 || Math.abs(dy) > 1.5);

  if (offsets[letterDrag.index] && moved) {
    offsets[letterDrag.index].x = letterDrag.startX + dx;
    offsets[letterDrag.index].y = letterDrag.startY + dy;
  }

  if (moved) {
    setLetterSelection(letterDrag.index, "move");
  } else if (!letterDrag.wasSelected) {
    setLetterSelection(letterDrag.index, "move");
  } else if (letterDrag.startMode === "move") {
    setLetterSelection(letterDrag.index, "transform");
  } else {
    clearLetterSelection();
  }
  letterDrag.element.classList.remove("is-dragging");
  letterDrag.element.releasePointerCapture?.(event.pointerId);
  letterDrag = null;
  updatePreview();
}

function onLetterRotatePointerMove(event) {
  if (!letterRotateDrag || event.pointerId !== letterRotateDrag.pointerId) return;

  event.preventDefault();
  const delta = (event.clientX - letterRotateDrag.startClientX) * 0.45;
  letterRotateDrag.element.setAttribute(
    "transform",
    `rotate(${delta} ${letterRotateDrag.centerX} ${letterRotateDrag.centerY})`
  );
}

function onLetterRotatePointerUp(event) {
  if (!letterRotateDrag || event.pointerId !== letterRotateDrag.pointerId) return;

  event.preventDefault();
  const delta = (event.clientX - letterRotateDrag.startClientX) * 0.45;

  ensureOffsets();
  if (offsets[letterRotateDrag.index])
    offsets[letterRotateDrag.index].rotation = letterRotateDrag.startRotation + delta;

  setLetterSelection(letterRotateDrag.index, "transform");
  letterRotateDrag.element.classList.remove("is-dragging");
  letterRotateDrag.element.releasePointerCapture?.(event.pointerId);
  letterRotateDrag = null;
  updatePreview();
}

function drawSelectedLetterBox(previewSvg) {
  previewSvg.querySelector("#selectedLetterBox")?.remove();
  if (selectedLetter === null) return;

  const paths = [...previewSvg.querySelectorAll("path.letter-path")];
  const path = paths[selectedLetter];
  if (!path) return;

  try {
    const box = path.getBBox();
    if (!Number.isFinite(box.x) || box.width <= 0 || box.height <= 0) return;

    const pad = 4;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("id", "selectedLetterBox");
    rect.setAttribute("x", box.x - pad);
    rect.setAttribute("y", box.y - pad);
    rect.setAttribute("width", box.width + pad * 2);
    rect.setAttribute("height", box.height + pad * 2);
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", selectedLetterMode === "transform" ? "#2563eb" : "#ef4444");
    rect.setAttribute("stroke-width", "1.2");
    rect.setAttribute("vector-effect", "non-scaling-stroke");
    rect.setAttribute("pointer-events", "none");
    previewSvg.appendChild(rect);
  } catch {
    // Selection is visual only; ignore transient SVG bbox failures.
  }
}

function drawSelectedPlacedNameBox(previewSvg) {
  previewSvg.querySelector("#selectedPlacedNameBox")?.remove();
  if (!selectedPlacedNameId) return;

  const selector = `.placed-name-object[data-placed-id="${escapeCssSelector(selectedPlacedNameId)}"]`;
  const group = previewSvg.querySelector(selector);
  if (!group) return;

  try {
    const box = group.getBBox();
    if (!Number.isFinite(box.x) || box.width <= 0 || box.height <= 0) return;

    const pad = 6;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("id", "selectedPlacedNameBox");
    rect.setAttribute("x", box.x - pad);
    rect.setAttribute("y", box.y - pad);
    rect.setAttribute("width", box.width + pad * 2);
    rect.setAttribute("height", box.height + pad * 2);
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "#6d36e8");
    rect.setAttribute("stroke-width", "1.35");
    rect.setAttribute("stroke-dasharray", "5 4");
    rect.setAttribute("vector-effect", "non-scaling-stroke");
    rect.setAttribute("pointer-events", "none");
    previewSvg.appendChild(rect);
  } catch {
    // Selection is visual only; ignore transient SVG bbox failures.
  }
}

function drawSelectedAccessoryBox(previewSvg) {
  previewSvg.querySelector("#selectedAccessoryBox")?.remove();
  const selected = getSelectedImportedObject();
  if (!selected?.id) return;

  const selector = `.imported-object[data-accessory-id="${escapeCssSelector(selected.id)}"]`;
  const group = previewSvg.querySelector(selector);
  if (!group) return;

  try {
    const box = group.getBBox();
    if (!Number.isFinite(box.x) || box.width <= 0 || box.height <= 0) return;

    const pad = 6;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("id", "selectedAccessoryBox");
    rect.setAttribute("x", box.x - pad);
    rect.setAttribute("y", box.y - pad);
    rect.setAttribute("width", box.width + pad * 2);
    rect.setAttribute("height", box.height + pad * 2);
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "#10b981");
    rect.setAttribute("stroke-width", "1.35");
    rect.setAttribute("stroke-dasharray", "4 4");
    rect.setAttribute("vector-effect", "non-scaling-stroke");
    rect.setAttribute("pointer-events", "none");
    previewSvg.appendChild(rect);
  } catch {
    // Selection is visual only; ignore transient SVG bbox failures.
  }
}

function escapeCssSelector(value) {
  if (window.CSS?.escape) return CSS.escape(value);
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}

function drawMetricRulers(previewSvg) {
  previewSvg.querySelector("#metricRulers")?.remove();

  const paths = [...previewSvg.querySelectorAll("path.letter-path")];
  if (paths.length === 0) return;

  const bounds = getElementsBounds(paths);
  const anchor = getMetricRulerAnchor(paths);
  if (!anchor || !bounds) return;

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const cm = 10;
  const startX = anchor.x;
  const zeroY = anchor.y;
  const yAxisX = startX - 22;
  const xLength = Math.max(80, bounds.right - startX + 36);
  const yLength = Math.max(70, zeroY - bounds.top + 24);
  const maxXCm = Math.floor(xLength / cm);
  const maxYCm = Math.floor(yLength / cm);

  group.id = "metricRulers";
  group.classList.add("metric-rulers");

  appendMetricText(group, startX - 8, zeroY + 27, "cm", 13, "#6d36e8");
  appendMetricLine(group, startX, zeroY, startX + maxXCm * cm, zeroY, "#6d36e8", 1.4);
  appendMetricLine(group, yAxisX, zeroY, yAxisX, zeroY - maxYCm * cm, "#6d36e8", 1.4);

  for (let i = 0; i <= maxXCm; i += 1) {
    const x = startX + i * cm;
    const major = i % 5 === 0;
    appendMetricLine(group, x, zeroY, x, zeroY + (major ? 10 : 6), "#6d36e8", major ? 1.1 : 0.8);

    if (major)
      appendMetricText(group, x - 3, zeroY + 23, String(i), 11, "#3c315f");
  }

  for (let i = 0; i <= maxYCm; i += 1) {
    const y = zeroY - i * cm;
    const major = i % 5 === 0;
    appendMetricLine(group, yAxisX, y, yAxisX - (major ? 10 : 6), y, "#6d36e8", major ? 1.1 : 0.8);

    if (major)
      appendMetricText(group, yAxisX - 25, y + 4, String(i), 11, "#3c315f");
  }

  previewSvg.appendChild(group);
}

function getMetricRulerAnchor(paths) {
  const key = getMetricRulerAnchorKey();

  if (metricRulerAnchor && metricRulerAnchorKey === key)
    return metricRulerAnchor;

  const firstBox = getElementBox(paths[0]);
  if (!firstBox || !Number.isFinite(firstBox.x) || firstBox.width <= 0 || firstBox.height <= 0)
    return null;

  metricRulerAnchorKey = key;
  metricRulerAnchor = {
    x: firstBox.x,
    y: firstBox.y + firstBox.height + 8,
    width: firstBox.width,
    height: firstBox.height
  };

  return metricRulerAnchor;
}

function getElementsBounds(elements) {
  let bounds = null;

  elements.forEach(element => {
    const box = getElementBox(element);
    if (!box || !Number.isFinite(box.x) || box.width <= 0 || box.height <= 0) return;

    const current = {
      left: box.x,
      top: box.y,
      right: box.x + box.width,
      bottom: box.y + box.height
    };

    bounds = bounds
      ? {
          left: Math.min(bounds.left, current.left),
          top: Math.min(bounds.top, current.top),
          right: Math.max(bounds.right, current.right),
          bottom: Math.max(bounds.bottom, current.bottom)
        }
      : current;
  });

  return bounds;
}

function prepareImportedAccessory(object = importedObject) {
  if (!object) return;
  fitImportedAccessoryToNameHeight(object);
}

function fitImportedAccessoryToNameHeight(object) {
  const nameHeight = getCurrentNameVisualHeight();
  const accessorySize = getImportedAccessoryNaturalSize(object);

  if (!Number.isFinite(nameHeight) || nameHeight <= 0 || !accessorySize || accessorySize.height <= 0)
    return;

  const currentScale = Number.isFinite(object.scale) ? object.scale : 1;
  const maxAccessoryHeight = Math.max(18, nameHeight * 0.68);
  const currentHeight = accessorySize.height * currentScale;

  if (currentHeight <= maxAccessoryHeight) return;

  object.scale = Math.max(0.03, maxAccessoryHeight / accessorySize.height);
}

function getCurrentNameVisualHeight() {
  const previewSvg = designObject.querySelector("svg");
  const paths = previewSvg ? [...previewSvg.querySelectorAll("path.letter-path")] : [];
  const bounds = paths.length ? getElementsBounds(paths) : null;

  if (bounds) {
    const height = bounds.bottom - bounds.top;
    if (Number.isFinite(height) && height > 0) return height;
  }

  return Math.max(24, getAutoSize(getName()) * 0.78);
}

function getImportedAccessoryNaturalSize(object) {
  const contourBounds = getContourCollectionBounds(object.contours || []);

  if (contourBounds) {
    return {
      width: contourBounds.right - contourBounds.left,
      height: contourBounds.bottom - contourBounds.top
    };
  }

  if (object.previewSvg) {
    const viewBoxSize = getSvgTextViewBoxSize(object.previewSvg);
    if (viewBoxSize) return viewBoxSize;
  }

  return null;
}

function getContourCollectionBounds(contours) {
  let bounds = null;

  contours.forEach(contour => {
    contour.forEach(point => {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return;

      bounds = bounds
        ? {
            left: Math.min(bounds.left, point.x),
            top: Math.min(bounds.top, point.y),
            right: Math.max(bounds.right, point.x),
            bottom: Math.max(bounds.bottom, point.y)
          }
        : {
            left: point.x,
            top: point.y,
            right: point.x,
            bottom: point.y
          };
    });
  });

  if (!bounds || bounds.right <= bounds.left || bounds.bottom <= bounds.top) return null;
  return bounds;
}

function getSvgTextViewBoxSize(svgText) {
  try {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return null;

    const viewBox = (svg.getAttribute("viewBox") || "")
      .split(/\s+/)
      .map(Number);

    if (viewBox.length === 4 && viewBox.every(Number.isFinite) && viewBox[2] > 0 && viewBox[3] > 0) {
      return { width: viewBox[2], height: viewBox[3] };
    }

    const width = parseFloat(svg.getAttribute("width"));
    const height = parseFloat(svg.getAttribute("height"));

    if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
      return { width, height };
    }
  } catch {
    // Fall back to contour bounds when the preview SVG cannot be parsed.
  }

  return null;
}

function appendMetricLine(group, x1, y1, x2, y2, stroke, width) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1.toFixed(2));
  line.setAttribute("y1", y1.toFixed(2));
  line.setAttribute("x2", x2.toFixed(2));
  line.setAttribute("y2", y2.toFixed(2));
  line.setAttribute("stroke", stroke);
  line.setAttribute("stroke-width", String(width));
  group.appendChild(line);
}

function appendMetricText(group, x, y, text, size, fill, rotation = 0) {
  const item = document.createElementNS("http://www.w3.org/2000/svg", "text");
  item.setAttribute("x", x.toFixed(2));
  item.setAttribute("y", y.toFixed(2));
  item.setAttribute("font-size", String(size));
  item.setAttribute("fill", fill);
  if (rotation) item.setAttribute("transform", `rotate(${rotation} ${x.toFixed(2)} ${y.toFixed(2)})`);
  item.textContent = text;
  group.appendChild(item);
}

function centerPreviewSvg(previewSvg, frameKey, force = false) {
  if (!force && previewFrameKey === frameKey && previewFrameViewBox) {
    previewSvg.setAttribute("viewBox", previewFrameViewBox);
    return;
  }

  const mainContent = [
    ...previewSvg.querySelectorAll("path.letter-path, .placed-name-object, .imported-object")
  ];
  const frameContent = [
    ...mainContent,
    ...previewSvg.querySelectorAll(".metric-rulers"),
    ...[...previewSvg.children].filter(element => element.tagName.toLowerCase() === "line")
  ];

  const mainBounds = getSvgElementBounds(mainContent);
  const frameBounds = getSvgElementBounds(frameContent);

  if (!frameBounds) {
    previewFrameKey = frameKey;
    previewFrameViewBox = "0 80 760 330";
    previewSvg.setAttribute("viewBox", previewFrameViewBox);
    return;
  }

  const centerBounds = mainBounds || frameBounds;
  const contentWidth = frameBounds.right - frameBounds.left;
  const contentHeight = frameBounds.bottom - frameBounds.top;
  const centerX = centerBounds.left + (centerBounds.right - centerBounds.left) / 2;
  const centerY = centerBounds.top + (centerBounds.bottom - centerBounds.top) / 2;
  const requiredWidth = Math.max(centerX - frameBounds.left, frameBounds.right - centerX) * 2;
  const requiredHeight = Math.max(centerY - frameBounds.top, frameBounds.bottom - centerY) * 2;
  const horizontalPaddingScale = zoom >= 4 ? 5.2 : 4.1;
  const viewWidth = Math.max(640, contentWidth * horizontalPaddingScale, requiredWidth * 1.25);
  const viewHeight = Math.max(430, contentHeight * 4.35, requiredHeight * 1.45);

  previewFrameKey = frameKey;
  previewFrameViewBox = `${centerX - viewWidth / 2} ${centerY - viewHeight / 2} ${viewWidth} ${viewHeight}`;
  previewSvg.setAttribute("viewBox", previewFrameViewBox);
}

function getSvgElementBounds(elements) {
  let bounds = null;

  elements.forEach(element => {
    try {
      const box = element.getBBox();
      if (!Number.isFinite(box.x) || (box.width <= 0 && box.height <= 0)) return;

      const current = {
        left: box.x,
        top: box.y,
        right: box.x + box.width,
        bottom: box.y + box.height
      };

      bounds = bounds
        ? {
            left: Math.min(bounds.left, current.left),
            top: Math.min(bounds.top, current.top),
            right: Math.max(bounds.right, current.right),
            bottom: Math.max(bounds.bottom, current.bottom)
          }
        : current;
    } catch {
      // Ignore elements that cannot report bounds while rendering.
    }
  });

  return bounds;
}

function updateZoom() {
  designObject.style.transform = `scale(${zoom})`;
  if (isMobileEditorLayout()) {
    zoomOut.textContent = "Menos";
    zoomIn.textContent = "Mais";
    zoomLabel.textContent = `Zoom ${Math.round(zoom * 100)}%`;
  } else {
    zoomOut.textContent = "-";
    zoomIn.textContent = "+";
    zoomLabel.textContent = `Zoom: ${Math.round(zoom * 100)}%`;
  }
}

function moveSelected(dx, dy) {
  if (selectedLetter === null) return;
  ensureOffsets();
  if (!offsets[selectedLetter]) return;
  offsets[selectedLetter].x += dx;
  offsets[selectedLetter].y += dy;
  updatePreview();
}

function rotateSelected(delta) {
  if (selectedLetter === null) return;
  ensureOffsets();
  if (!offsets[selectedLetter]) return;
  selectedLetterMode = "transform";
  offsets[selectedLetter].rotation += delta;
  updatePreview();
}

function scaleSelected(delta) {
  if (selectedLetter === null) return;
  ensureOffsets();
  if (!offsets[selectedLetter]) return;
  selectedLetterMode = "transform";
  offsets[selectedLetter].scale = Math.min(1.8, Math.max(0.45, offsets[selectedLetter].scale + delta));
  updatePreview();
}

function onCanvasWheel(event) {
  if (selectedLetter === null || selectedLetterMode !== "transform") return;

  event.preventDefault();
  event.stopPropagation();

  const direction = event.deltaY < 0 ? 1 : -1;

  if (leftPointerPressed || (event.buttons & 1)) {
    rotateSelected(direction * 4);
  } else {
    scaleSelected(direction * 0.05);
  }
}

function onSelectedLetterWheel(event) {
  if (selectedLetter === null || selectedLetterMode !== "transform") return;

  event.preventDefault();
  event.stopImmediatePropagation();
  onCanvasWheel(event);
}

function onSelectedLetterContextMenu(event) {
  if (selectedLetter === null || selectedLetterMode !== "transform") return;

  event.preventDefault();
  event.stopPropagation();
}

function isTypingTarget(target) {
  return target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || target?.isContentEditable;
}

function setLetterDragAxis(axis) {
  letterDragAxis = letterDragAxis === axis ? null : axis;

  letterLockX.classList.toggle("is-active", letterDragAxis === "x");
  letterLockY.classList.toggle("is-active", letterDragAxis === "y");
  letterLockX.setAttribute("aria-pressed", letterDragAxis === "x" ? "true" : "false");
  letterLockY.setAttribute("aria-pressed", letterDragAxis === "y" ? "true" : "false");
}

authOpen.addEventListener("click", () => openAuthModal("login"));
authRegisterOpen.addEventListener("click", () => openAuthModal("register"));
authClose.addEventListener("click", closeAuthModal);
authLoginTab.addEventListener("click", () => setAuthMode("login"));
authRegisterTab.addEventListener("click", () => setAuthMode("register"));
forgotPasswordOpen.addEventListener("click", () => setAuthMode("forgot"));
authPasswordToggle?.addEventListener("click", () => setAuthPasswordVisible(authPassword.type === "password", true));
authForm.addEventListener("submit", submitAuth);
logoutButton.addEventListener("click", logout);
rewardContinue.addEventListener("click", () => finishRewardVideo(true));
rewardClose.addEventListener("click", () => finishRewardVideo(false));
rewardCancel.addEventListener("click", () => finishRewardVideo(false));
authModal.addEventListener("click", event => {
  if (event.target === authModal) closeAuthModal();
});
rewardModal.addEventListener("click", event => {
  if (event.target === rewardModal) finishRewardVideo(false);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !authModal.hidden) closeAuthModal();
  if (event.key === "Escape" && !rewardModal.hidden) finishRewardVideo(false);
  if (event.key === "Escape" && stlPreviewModal && !stlPreviewModal.hidden) hideStlPreview();
  if (event.key === "Escape" && !libraryModal.hidden) closeAccessoryLibrary();
  if (isTypingTarget(event.target)) return;
  if ((event.key === "Delete" || event.key === "Backspace") && selectedPlacedNameId) {
    event.preventDefault();
    deleteSelectedPlacedName();
    return;
  }
  if ((event.key === "Delete" || event.key === "Backspace") && getSelectedImportedObject()) {
    event.preventDefault();
    deleteAccessory();
    return;
  }
  if (selectedLetter === null || selectedLetterMode !== "transform") return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    rotateSelected(-4);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    rotateSelected(4);
  }
});

nameInput.addEventListener("input", () => {
  clearLetterSelection();
  clearPlacedNameSelection(false);
  schedulePreviewUpdate();
});

fontSelect.addEventListener("change", () => {
  syncImportedFontNotice();
  updatePreview();
});

fontImportButton?.addEventListener("click", () => {
  fontInput?.click();
});

fontInput?.addEventListener("change", async event => {
  const file = event.target.files?.[0];
  if (!file) return;

  await uploadFontFile(file);
  event.target.value = "";
});

lineUp.addEventListener("click", () => moveLine(-2.5));
lineDown.addEventListener("click", () => moveLine(2.5));
autoBase.addEventListener("click", setAutoBaseLine);
spacingDown.addEventListener("click", () => changeSpacing(-2));
spacingUp.addEventListener("click", () => changeSpacing(2));
letterPrev.addEventListener("click", () => selectRelativeLetter(-1));
letterNext.addEventListener("click", () => selectRelativeLetter(1));

letterLeft.addEventListener("click", () => moveSelected(-6, 0));
letterRight.addEventListener("click", () => moveSelected(6, 0));
letterUp.addEventListener("click", () => moveSelected(0, -6));
letterDown.addEventListener("click", () => moveSelected(0, 6));
letterLockX.addEventListener("click", () => setLetterDragAxis("x"));
letterLockY.addEventListener("click", () => setLetterDragAxis("y"));
letterRotateLeft.addEventListener("click", () => rotateSelected(-5));
letterRotateRight.addEventListener("click", () => rotateSelected(5));
letterScaleDown.addEventListener("click", () => scaleSelected(-0.06));
letterScaleUp.addEventListener("click", () => scaleSelected(0.06));
placeNameButton?.addEventListener("click", placeCurrentName);
placedNameLeft?.addEventListener("click", () => movePlacedName(-5, 0));
placedNameRight?.addEventListener("click", () => movePlacedName(5, 0));
placedNameUp?.addEventListener("click", () => movePlacedName(0, -5));
placedNameDown?.addEventListener("click", () => movePlacedName(0, 5));
placedNameRotateLeft?.addEventListener("click", () => rotatePlacedName(-5));
placedNameRotateRight?.addEventListener("click", () => rotatePlacedName(5));
placedNameScaleDown?.addEventListener("click", () => scalePlacedName(-0.04));
placedNameScaleUp?.addEventListener("click", () => scalePlacedName(0.04));
placedNameDelete?.addEventListener("click", deleteSelectedPlacedName);
accessoryLeft?.addEventListener("click", () => moveAccessory(-5, 0));
accessoryRight?.addEventListener("click", () => moveAccessory(5, 0));
accessoryUp?.addEventListener("click", () => moveAccessory(0, -5));
accessoryDown?.addEventListener("click", () => moveAccessory(0, 5));
accessoryRotateLeft.addEventListener("click", () => rotateAccessory(-5));
accessoryRotateRight.addEventListener("click", () => rotateAccessory(5));
accessoryScaleDown.addEventListener("click", () => scaleAccessory(-0.02));
accessoryScaleUp.addEventListener("click", () => scaleAccessory(0.02));
accessoryReset.addEventListener("click", resetAccessoryTransform);
accessoryLibraryOpen.addEventListener("click", openAccessoryLibrary);
accessoryLibraryOpenMobile.addEventListener("click", openAccessoryLibrary);
libraryClose.addEventListener("click", closeAccessoryLibrary);
librarySearch.addEventListener("input", renderAccessoryLibrary);
imageAccessoryImport?.addEventListener("click", () => imageInput?.click());
imageImportMode?.addEventListener("change", () => {
  const selected = getSelectedImportedObject();

  if (!isImageTraceObject(selected)) return;

  selected.stlMode = getImageImportMode();
  selected.stlQuality = getImageTraceStlQuality(selected.stlMode);
  selected.catalogIssues = getImageTraceCatalogIssues(selected.stlMode);
  syncAccessoryStatus();
  updatePreview({ recenter: false });
});
imageSearchOpen?.addEventListener("click", openOutlineImageSearch);
imageSearchQuery?.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  openOutlineImageSearch();
});
libraryModal.addEventListener("click", event => {
  if (event.target === libraryModal) closeAccessoryLibrary();
});
document.addEventListener("pointermove", onAccessoryPointerMove);
document.addEventListener("pointerup", onAccessoryPointerUp);
document.addEventListener("pointercancel", onAccessoryPointerUp);
document.addEventListener("pointermove", onPlacedNamePointerMove);
document.addEventListener("pointerup", onPlacedNamePointerUp);
document.addEventListener("pointercancel", onPlacedNamePointerUp);
document.addEventListener("pointermove", onLetterPointerMove);
document.addEventListener("pointerup", onLetterPointerUp);
document.addEventListener("pointercancel", onLetterPointerUp);
document.addEventListener("pointermove", onLetterRotatePointerMove);
document.addEventListener("pointerup", onLetterRotatePointerUp);
document.addEventListener("pointercancel", onLetterRotatePointerUp);
canvas.addEventListener("wheel", onCanvasWheel, { passive: false });
canvas.addEventListener("pointerdown", event => {
  if (event.button === 0) leftPointerPressed = true;
}, { passive: false, capture: true });
document.addEventListener("pointerup", event => {
  if (event.button === 0) leftPointerPressed = false;
});
document.addEventListener("pointercancel", () => {
  leftPointerPressed = false;
});
document.addEventListener("wheel", onSelectedLetterWheel, { passive: false, capture: true });
document.addEventListener("contextmenu", onSelectedLetterContextMenu, true);

resetLetters.addEventListener("click", () => {
  offsets = [];
  updatePreview();
});

function moveLine(delta) {
  const min = Number(lineYRange.min);
  const max = Number(lineYRange.max);
  lineYRange.value = Math.min(max, Math.max(min, Number(lineYRange.value) + delta));
  syncLineLabels();
  updatePreview();
}

function changeSpacing(delta) {
  spacingAdjust = Math.min(60, Math.max(-80, spacingAdjust + delta));
  syncSpacingLabel();
  updatePreview();
}

function moveAccessory(dx, dy) {
  const selected = getSelectedImportedObject();
  if (!selected) return;
  selected.x += dx;
  selected.y += dy;
  updatePreview({ recenter: false });
}

function rotateAccessory(delta) {
  const selected = getSelectedImportedObject();
  if (!selected) return;
  selected.rotation += delta;
  updatePreview({ recenter: false });
}

function scaleAccessory(delta) {
  const selected = getSelectedImportedObject();
  if (!selected) return;
  selected.scale = Math.min(12, Math.max(0.05, selected.scale + delta));
  updatePreview({ recenter: false });
}

function resetAccessoryTransform() {
  const selected = getSelectedImportedObject();
  if (!selected) return;
  selected.x = 250;
  selected.y = 120;
  selected.rotation = 0;
  selected.scale = 0.3;
  prepareImportedAccessory(selected);
  updatePreview({ recenter: false });
}

function deleteAccessory() {
  const selected = getSelectedImportedObject();
  if (!selected) return;
  const removedIndex = getSelectedImportedObjectIndex();
  importedObjects = importedObjects.filter(item => item.id !== selected.id);
  const next = importedObjects[Math.min(Math.max(removedIndex, 0), importedObjects.length - 1)] || null;
  selectedImportedObjectId = next?.id || null;
  importedObject = next;
  if (next) setAccessoryColor(next.color || accessoryColor, false);
  importedObjectId += 1;
  syncAccessoryStatus();
  updatePreview({ recenter: false });
}

function openOutlineImageSearch() {
  const query = imageSearchQuery?.value.trim();
  if (!query) {
    alert("Type what image you want to search for.");
    return;
  }

  renderImageSearchResults([]);
  const searchTerms = `${query} coloring page outline black and white`;
  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchTerms)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  setImageSearchStatus("Opened a coloring image search. Save an image, then use Import image.");
}

function setImageSearchStatus(message) {
  if (!imageSearchStatus) return;
  imageSearchStatus.hidden = !message;
  imageSearchStatus.textContent = message || "";
}

function renderImageSearchResults(items) {
  if (!imageSearchResults) return;

  imageSearchResults.innerHTML = "";
  imageSearchResults.hidden = !items.length;

  items.slice(0, 12).forEach(item => {
    const button = document.createElement("button");
    const image = document.createElement("img");
    const title = document.createElement("strong");
    const source = document.createElement("small");

    button.type = "button";
    button.className = "image-search-card";
    image.alt = item.title || "Outline image";
    image.loading = "lazy";
    image.src = item.thumbnailUrl || item.imageUrl;
    title.textContent = item.title || "Outline image";
    source.textContent = item.source || "Image result";

    button.append(image, title, source);
    button.addEventListener("click", () => useSearchImageAsAccessory(item));
    imageSearchResults.appendChild(button);
  });
}

async function useSearchImageAsAccessory(item) {
  const imageUrl = item.imageUrl || item.thumbnailUrl;
  if (!imageUrl) return;

  setImageSearchStatus("Converting selected image to SVG...");

  try {
    const response = await fetch(`/api/ImageSearch/proxy?url=${encodeURIComponent(imageUrl)}`, {
      cache: "force-cache"
    });

    if (!response.ok) {
      const fallbackUrl = item.thumbnailUrl && item.thumbnailUrl !== imageUrl ? item.thumbnailUrl : "";
      if (fallbackUrl) {
        await useSearchImageAsAccessory({ ...item, imageUrl: fallbackUrl, thumbnailUrl: "" });
        return;
      }

      throw new Error("Could not load that image.");
    }

    const blob = await response.blob();
    const file = new File([blob], `${cleanSearchImageName(item.title)}.${guessImageExtension(blob.type)}`, {
      type: blob.type || "image/png"
    });

    const object = await createImageImportedObject(file, {
      x: 250,
      y: 120,
      rotation: 0,
      scale: 0.65
    });
    prepareImportedAccessory(object);
    addImportedObject(object);
    updatePreview({ recenter: false });
    queueCommunityAccessorySave(object, "image-search");
    setImageSearchStatus("Image converted to SVG accessory.");
  } catch (error) {
    setImageSearchStatus(error.message || "Could not convert that image.");
  }
}

function cleanSearchImageName(value) {
  return String(value || "outline-image")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "outline-image";
}

function guessImageExtension(contentType) {
  if (contentType?.includes("jpeg")) return "jpg";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";
  return "png";
}

async function openAccessoryLibrary() {
  libraryModal.hidden = false;
  await loadAccessoryCatalog();
  renderAccessoryLibrary();
  librarySearch.focus();
}

function closeAccessoryLibrary() {
  libraryModal.hidden = true;
}

async function loadAccessoryCatalog() {
  if (accessoryCatalogLoaded) return;

  const officialCatalog = await fetchAccessoryCatalogSource("/accessories/catalog.json");
  const communityCatalog = await fetchAccessoryCatalogSource("/api/Accessories/community?take=180");
  accessoryCatalog = [...communityCatalog, ...officialCatalog];
  accessoryCatalogLoaded = true;
  renderQuickAccessories();
}

async function fetchAccessoryCatalogSource(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("Catalog unavailable.");
    const items = await response.json();
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function renderQuickAccessories() {
  if (!accessoryQuickGrid) return;

  const verifiedItems = accessoryCatalog.filter(isVerified3dAccessory);
  const items = (verifiedItems.length >= 4 ? verifiedItems : accessoryCatalog).slice(0, 4);
  accessoryQuickGrid.innerHTML = "";
  accessoryQuickGrid.hidden = items.length === 0;

  items.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "accessory-quick-item";
    button.title = item.name || "Accessory";
    button.innerHTML = `<img src="${item.file}" alt="">`;
    button.addEventListener("click", () => applyLibraryAccessory(item));
    accessoryQuickGrid.appendChild(button);
  });
}

function isVerified3dAccessory(item) {
  return item?.verified3d === true || item?.stlRisk === "safe";
}

function isReviewAccessory(item) {
  return item?.stlRisk === "review";
}

function getAccessoryQualityBadge(item) {
  if (isVerified3dAccessory(item)) return "Verified for STL";
  if (isReviewAccessory(item)) return "Check 3D";
  if (item?.stlRisk === "visual-only") return "2D only";
  return "Unrated";
}

function setupStaticQuickAccessories() {
  document.querySelectorAll(".accessory-quick-item[data-file]").forEach(button => {
    button.addEventListener("click", () => applyLibraryAccessory({
      name: button.dataset.name || button.title || "Accessory",
      file: button.dataset.file,
      type: "svg",
      scale: parseNumber(button.dataset.scale || "0.34")
    }));
  });
}

function renderAccessoryLibrary() {
  const query = librarySearch.value.trim().toLowerCase();
  const categoryNames = [...new Set(accessoryCatalog.map(item => item.category || "Other"))];
  const categories = [verifiedAccessoryCategory, "All", reviewAccessoryCategory, ...categoryNames];
  if (!categories.includes(accessoryCategory)) {
    accessoryCategory = categories[0] || "All";
  }

  libraryCategories.innerHTML = "";
  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.classList.toggle("is-active", accessoryCategory === category);
    button.addEventListener("click", () => {
      accessoryCategory = category;
      renderAccessoryLibrary();
    });
    libraryCategories.appendChild(button);
  });

  const items = accessoryCatalog.filter(item => {
    let matchesCategory = accessoryCategory === "All";
    if (accessoryCategory === verifiedAccessoryCategory) matchesCategory = isVerified3dAccessory(item);
    else if (accessoryCategory === reviewAccessoryCategory) matchesCategory = isReviewAccessory(item);
    else if (accessoryCategory !== "All") matchesCategory = item.category === accessoryCategory;

    const text = `${item.name || ""} ${item.category || ""} ${getAccessoryQualityBadge(item)}`.toLowerCase();
    return matchesCategory && (!query || text.includes(query));
  });
  const visibleItems = accessoryCategory === "All" && !query ? items.slice(0, 160) : items;

  libraryGrid.innerHTML = "";
  libraryEmpty.hidden = visibleItems.length > 0;

  visibleItems.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "library-item";
    button.classList.toggle("is-verified", isVerified3dAccessory(item));
    button.classList.toggle("is-review", isReviewAccessory(item));
    button.classList.toggle("is-visual-only", item.stlRisk === "visual-only");
    button.classList.toggle("is-community", item.source === "community");
    button.title = item.stlIssues?.length
      ? `STL notes: ${item.stlIssues.join(", ")}`
      : getAccessoryQualityBadge(item);
    button.innerHTML = `
      <img src="${item.file}" alt="">
      <strong></strong>
      <span></span>
      <small class="library-badge"></small>
    `;
    button.querySelector("strong").textContent = item.name || "Accessory";
    button.querySelector("span").textContent = item.source === "community"
      ? `${item.category || "Community"} · by ${item.authorName || "Maker"}`
      : item.category || "Accessory";
    button.querySelector(".library-badge").textContent = getAccessoryQualityBadge(item);
    button.addEventListener("click", () => applyLibraryAccessory(item));
    libraryGrid.appendChild(button);
  });
}

async function applyLibraryAccessory(item) {
  try {
    const response = await fetch(item.file, { cache: "no-store" });
    if (!response.ok) throw new Error("Accessory unavailable.");

    const text = await response.text();
    const object = createSvgImportedObject(text, {
      name: item.name || "Accessory",
      x: 250,
      y: 120,
      rotation: 0,
      scale: Number.isFinite(item.scale) ? item.scale : 0.3,
      verified3d: isVerified3dAccessory(item),
      catalogRisk: item.stlRisk || null,
      catalogIssues: item.stlIssues || []
    });
    prepareImportedAccessory(object);
    addImportedObject(object);
    updatePreview({ recenter: false });
    closeAccessoryLibrary();
  } catch {
    alert("I could not load this accessory.");
  }
}

function selectRelativeLetter(delta) {
  const len = getName().length;
  if (len === 0) {
    clearLetterSelection();
    return;
  }

  const next = selectedLetter === null
    ? 0
    : (selectedLetter + delta + len) % len;
  setLetterSelection(next, "move");
  updatePreview();
}

function setAutoBaseLine() {
  const previewSvg = designObject.querySelector("svg");
  if (!previewSvg) return;

  const paths = [...previewSvg.querySelectorAll("path.letter-path")];
  let maxY = Number.NEGATIVE_INFINITY;

  paths.forEach(path => {
    try {
      const box = path.getBBox();
      if (Number.isFinite(box.y) && box.height > 0) {
        maxY = Math.max(maxY, box.y + box.height);
      }
    } catch {
      // Some browsers can fail getBBox while SVG is mid-render.
    }
  });

  if (!Number.isFinite(maxY)) return;

  const min = Number(lineYRange.min);
  const max = Number(lineYRange.max);
  lineYRange.value = Math.min(max, Math.max(min, Math.round(maxY)));
  syncLineLabels();
  updatePreview();
}

zoomIn.addEventListener("click", () => {
  zoomAdjustedByUser = true;
  zoom = Math.min(5, zoom + 0.1);
  updateZoom();
});

zoomOut.addEventListener("click", () => {
  zoomAdjustedByUser = true;
  zoom = Math.max(0.7, zoom - 0.1);
  updateZoom();
});

window.addEventListener("resize", syncResponsiveZoom);
window.addEventListener("resize", syncMobileLayout);

colorSwatches?.addEventListener("click", event => {
  const button = event.target.closest("button[data-color]");
  if (!button) return;
  setPieceColor(button.dataset.color);
});

customColor?.addEventListener("input", event => {
  setPieceColor(event.target.value);
});

accessoryColorSwatches?.addEventListener("click", event => {
  const button = event.target.closest("button[data-color]");
  if (!button) return;
  setAccessoryColor(button.dataset.color);
});

customAccessoryColor?.addEventListener("input", event => {
  setAccessoryColor(event.target.value);
});

joinToggle.addEventListener("click", () => {
  joinToggle.classList.toggle("active");
  updatePreview();
});

lineToggle.addEventListener("click", () => {
  lineToggle.classList.toggle("active");
  updatePreview();
});

svgInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  const object = createSvgImportedObject(text, {
    name: file.name?.replace(/\.[^.]+$/, "") || "SVG",
    x: 250,
    y: 120,
    rotation: 0,
    scale: 0.3
  });
  prepareImportedAccessory(object);
  addImportedObject(object);
  updatePreview({ recenter: false });
  queueCommunityAccessorySave(object, "svg-upload");
});

dxfInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  const contours = parseDxfContours(text);

  if (contours.length === 0) {
    alert("I could not find usable lines or contours in this DXF.");
    return;
  }

  const object = {
    type: "dxf",
    name: file.name?.replace(/\.[^.]+$/, "") || "DXF",
    color: accessoryColor,
    svgInner: "",
    contours,
    x: 250,
    y: 120,
    rotation: 0,
    scale: 0.3
  };
  prepareImportedAccessory(object);
  addImportedObject(object);
  updatePreview({ recenter: false });
});

imageInput?.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const object = await createImageImportedObject(file, {
      x: 250,
      y: 120,
      rotation: 0,
      scale: 0.65
    });
    prepareImportedAccessory(object);
    addImportedObject(object);
    updatePreview({ recenter: false });
    queueCommunityAccessorySave(object, "image-upload");
  } catch {
    alert("I could not convert this image. Try a simple black-and-white drawing with a white background.");
  } finally {
    imageInput.value = "";
  }
});

txtInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  namesList = text
    .split(/\r?\n/)
    .map(x => x.trim())
    .filter(Boolean);

  currentIndex = 0;
  batchCount.textContent = `${namesList.length} names`;

  if (namesList.length > 0) {
    nameInput.value = namesList[0];
    offsets = [];
    clearLetterSelection();
    updatePreview({ recenter: true });
    txtStatus.textContent = `${namesList.length} names loaded.`;
  } else {
    txtStatus.textContent = "This TXT file does not contain usable names.";
  }
});

nextName.addEventListener("click", () => {
  if (namesList.length === 0) {
    alert("Import a TXT list first.");
    return;
  }

  currentIndex = (currentIndex + 1) % namesList.length;
  nameInput.value = namesList[currentIndex];
  offsets = [];
  clearLetterSelection();
  updatePreview();
  txtStatus.textContent = `Name ${currentIndex + 1} of ${namesList.length}.`;
});

function closeDownloadFormatMenu() {
  if (!downloadFormatMenu || !downloadMenuToggle) return;
  downloadFormatMenu.hidden = true;
  downloadMenuToggle.setAttribute("aria-expanded", "false");
}

downloadMenuToggle?.addEventListener("click", event => {
  event.stopPropagation();
  const willOpen = downloadFormatMenu.hidden;
  downloadFormatMenu.hidden = !willOpen;
  downloadMenuToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
  if (willOpen) downloadFormatMenu.querySelector("button")?.focus();
});
downloadFormatMenu?.addEventListener("click", event => event.stopPropagation());
document.addEventListener("click", closeDownloadFormatMenu);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeDownloadFormatMenu();
});

exportSvg.addEventListener("click", () => { closeDownloadFormatMenu(); exportFromApi("svg", "image/svg+xml"); });
exportDxf.addEventListener("click", () => { closeDownloadFormatMenu(); exportFromApi("dxf", "application/dxf"); });
exportStl.addEventListener("click", () => { closeDownloadFormatMenu(); exportFromApi("stl", "model/stl"); });
downloadPackage?.addEventListener("click", () => exportFromApi("package", "application/zip", "zip"));
stlPreviewOpen?.addEventListener("click", () => {
  showStlPreview("Loading the real 3D preview...", buildProject({ showBaseLine: false }));
});
stlPreviewClose?.addEventListener("click", hideStlPreview);
stlPreviewModal?.addEventListener("click", event => {
  if (event.target === stlPreviewModal) hideStlPreview();
});
stlPreviewModel?.addEventListener("pointerdown", startStlPreviewDrag);
stlPreviewModel?.addEventListener("pointermove", moveStlPreviewDrag);
stlPreviewModel?.addEventListener("pointerup", endStlPreviewDrag);
stlPreviewModel?.addEventListener("pointercancel", endStlPreviewDrag);
stlMaterialPicker?.addEventListener("click", event => {
  const button = event.target.closest("button[data-material]");
  if (!button) return;

  stlPreviewMaterial = button.dataset.material in stlMaterials ? button.dataset.material : "plastic";
  stlMaterialPicker.querySelectorAll("button[data-material]").forEach(materialButton => {
    materialButton.classList.toggle("is-active", materialButton === button);
  });

  if (stlPreviewMesh) drawStlMesh(stlPreviewMesh);
});
stlRenderButton?.addEventListener("click", generateStlRenderImage);

function showStlPreview(message = "Loading the real 3D preview...", project = null) {
  if (!stlPreviewModal || !stlPreviewModel || !stlPreviewStatus) return;

  const token = ++stlPreviewToken;
  stlPreviewMesh = null;
  stlPreviewRotationX = -0.12;
  stlPreviewRotationZ = -0.22;
  stlPreviewLightPhase = 0;
  stlPreviewLastFrame = 0;
  stlPreviewStatus.textContent = message;
  stlPreviewModal.hidden = false;
  drawStlPreviewLoading("Building STL preview...");

  if (project) {
    loadActualStlPreview(project, token);
  }
}

function hideStlPreview() {
  if (!stlPreviewModal) return;

  stlPreviewToken++;
  if (stlPreviewAnimation) {
    cancelAnimationFrame(stlPreviewAnimation);
    stlPreviewAnimation = 0;
  }

  stlPreviewDrag = null;
  stlPreviewModal.hidden = true;
}

function updateStlPreviewStatus(message) {
  if (stlPreviewStatus) stlPreviewStatus.textContent = message;
}

function setupStlPreviewCanvas() {
  if (!stlPreviewModel || typeof stlPreviewModel.getContext !== "function") return null;

  const rect = stlPreviewModel.getBoundingClientRect();
  const width = Math.max(320, Math.round(rect.width || stlPreviewModel.clientWidth || 700));
  const height = Math.max(180, Math.round(rect.height || stlPreviewModel.clientHeight || 340));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const targetWidth = Math.round(width * pixelRatio);
  const targetHeight = Math.round(height * pixelRatio);

  if (stlPreviewModel.width !== targetWidth || stlPreviewModel.height !== targetHeight) {
    stlPreviewModel.width = targetWidth;
    stlPreviewModel.height = targetHeight;
  }

  const ctx = stlPreviewModel.getContext("2d");
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return { ctx, width, height };
}

function drawStlPreviewLoading(message) {
  const canvasState = setupStlPreviewCanvas();
  if (!canvasState) return;

  const { ctx, width, height } = canvasState;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(16, 14, 24, 0.72)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(width / 2, height * 0.58, width * 0.32, height * 0.14, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 14px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(message, width / 2, height / 2);
}

async function loadActualStlPreview(project, token) {
  try {
    const scene = await fetchStlSceneForProject(project);

    if (token !== stlPreviewToken) return;

    if (!scene.triangles.length) {
      updateStlPreviewStatus("Could not read STL triangles.");
      drawStlPreviewLoading("Preview unavailable");
      return;
    }

    updateStlPreviewStatus("Drag the model to rotate it.");
    startStlCanvasPreview(scene, token);
  } catch {
    if (token !== stlPreviewToken) return;
    updateStlPreviewStatus("Could not render the STL preview.");
    drawStlPreviewLoading("Preview unavailable");
  }
}

async function fetchStlSceneForProject(project) {
  const accessoryObjects = getProjectImportedObjects(project);
  const requests = [
    fetchStlMesh({ ...project, importedObject: null, importedObjects: [] }, pieceColor)
  ];

  accessoryObjects.forEach(object => {
    requests.push(fetchStlMesh({
      ...project,
      text: "",
      letters: [],
      placedNames: [],
      importedObject: object,
      importedObjects: [object],
      useBaseLine: false,
      showBaseLine: false
    }, object.color || accessoryColor));
  });

  const meshes = (await Promise.all(requests)).filter(mesh => mesh && mesh.triangles.length);
  return createStlScene(meshes);
}

function getProjectImportedObjects(project) {
  if (Array.isArray(project.importedObjects) && project.importedObjects.length) {
    return project.importedObjects.filter(Boolean);
  }

  return project.importedObject ? [project.importedObject] : [];
}

async function fetchStlMesh(project, color) {
  const response = await fetch("/api/Generate/stl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify(project)
    });

  if (!response.ok) throw new Error("STL preview unavailable.");

  const stlText = await response.text();
  const mesh = parseAsciiStl(stlText);
  mesh.color = normalizePieceColor(color);
  return mesh;
}

function createStlScene(meshes) {
  const visibleMeshes = meshes.filter(mesh => mesh && mesh.triangles.length);

  if (!visibleMeshes.length) {
    return { triangles: [] };
  }

  const bounds = visibleMeshes.reduce((current, mesh) => ({
    minX: Math.min(current.minX, mesh.bounds.minX),
    minY: Math.min(current.minY, mesh.bounds.minY),
    minZ: Math.min(current.minZ, mesh.bounds.minZ),
    maxX: Math.max(current.maxX, mesh.bounds.maxX),
    maxY: Math.max(current.maxY, mesh.bounds.maxY),
    maxZ: Math.max(current.maxZ, mesh.bounds.maxZ)
  }), {
    minX: Infinity,
    minY: Infinity,
    minZ: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
    maxZ: -Infinity
  });

  return {
    triangles: visibleMeshes.flatMap(mesh =>
      mesh.triangles.map(triangle => ({
        vertices: triangle,
        color: mesh.color || pieceColor
      }))
    ),
    center: {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
      z: (bounds.minZ + bounds.maxZ) / 2
    },
    sizeX: Math.max(1, bounds.maxX - bounds.minX),
    sizeY: Math.max(1, bounds.maxY - bounds.minY),
    sizeZ: Math.max(1, bounds.maxZ - bounds.minZ)
  };
}

function parseAsciiStl(stlText) {
  const numberPattern = "[-+]?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?";
  const vertexRegex = new RegExp(`vertex\\s+(${numberPattern})\\s+(${numberPattern})\\s+(${numberPattern})`, "g");
  const vertices = [];
  let match;

  while ((match = vertexRegex.exec(stlText)) !== null) {
    const vertex = {
      x: Number(match[1]),
      y: Number(match[2]),
      z: Number(match[3])
    };

    if (Number.isFinite(vertex.x) && Number.isFinite(vertex.y) && Number.isFinite(vertex.z)) {
      vertices.push(vertex);
    }
  }

  if (vertices.length < 3) return { triangles: [] };

  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  vertices.forEach(vertex => {
    minX = Math.min(minX, vertex.x);
    minY = Math.min(minY, vertex.y);
    minZ = Math.min(minZ, vertex.z);
    maxX = Math.max(maxX, vertex.x);
    maxY = Math.max(maxY, vertex.y);
    maxZ = Math.max(maxZ, vertex.z);
  });

  const maxTriangles = 9000;
  const triangleCount = Math.floor(vertices.length / 3);
  const step = Math.max(1, Math.ceil(triangleCount / maxTriangles));
  const triangles = [];

  for (let i = 0; i + 2 < vertices.length; i += 3 * step) {
    triangles.push([vertices[i], vertices[i + 1], vertices[i + 2]]);
  }

  return {
    triangles,
    bounds: { minX, minY, minZ, maxX, maxY, maxZ },
    center: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: (minZ + maxZ) / 2
    },
    sizeX: Math.max(1, maxX - minX),
    sizeY: Math.max(1, maxY - minY),
    sizeZ: Math.max(1, maxZ - minZ)
  };
}

function startStlCanvasPreview(mesh, token) {
  if (stlPreviewAnimation) {
    cancelAnimationFrame(stlPreviewAnimation);
    stlPreviewAnimation = 0;
  }

  if (token !== stlPreviewToken) return;

  stlPreviewMesh = mesh;
  stlPreviewLastFrame = performance.now();
  drawStlMesh(mesh);
  stlPreviewAnimation = requestAnimationFrame(time => animateStlPreview(time, token));
}

function animateStlPreview(time, token) {
  if (token !== stlPreviewToken || !stlPreviewMesh || !stlPreviewModal || stlPreviewModal.hidden) {
    stlPreviewAnimation = 0;
    return;
  }

  const delta = Math.min(0.05, Math.max(0, (time - (stlPreviewLastFrame || time)) / 1000));
  stlPreviewLastFrame = time;
  stlPreviewLightPhase += delta * 0.85;

  if (!stlPreviewDrag) {
    stlPreviewRotationZ += delta * 0.18;
  }

  drawStlMesh(stlPreviewMesh);
  stlPreviewAnimation = requestAnimationFrame(nextTime => animateStlPreview(nextTime, token));
}

function drawStlMesh(mesh, rotationZ = stlPreviewRotationZ, rotationX = stlPreviewRotationX) {
  const canvasState = setupStlPreviewCanvas();
  if (!canvasState) return;

  const { ctx, width, height } = canvasState;
  drawStlSceneToContext(ctx, width, height, mesh, {
    rotationZ,
    rotationX,
    material: stlPreviewMaterial,
    lightPhase: stlPreviewLightPhase,
    clear: true,
    paintStage: true,
    renderMode: false
  });
}

function drawStlSceneToContext(ctx, width, height, mesh, options = {}) {
  const {
    rotationZ = stlPreviewRotationZ,
    rotationX = stlPreviewRotationX,
    material = stlPreviewMaterial,
    lightPhase = stlPreviewLightPhase,
    clear = true,
    paintStage = true,
    renderMode = false,
    scaleMultiplier = 1
  } = options;
  const yawCos = Math.cos(rotationZ);
  const yawSin = Math.sin(rotationZ);
  const pitchCos = Math.cos(rotationX);
  const pitchSin = Math.sin(rotationX);
  const scale = Math.min(width * 0.82 / mesh.sizeX, height * 0.68 / Math.max(mesh.sizeY, 1)) * scaleMultiplier;
  const cameraDistance = 1200;
  const materialConfig = stlMaterials[material] || stlMaterials.plastic;
  const light = normalizeVector({
    x: Math.cos(lightPhase) * 0.58 - 0.18,
    y: -0.48 + Math.sin(lightPhase * 0.7) * 0.1,
    z: 0.92 + Math.cos(lightPhase * 0.45) * 0.08
  });

  const transformVertex = vertex => {
    const x = vertex.x - mesh.center.x;
    const y = vertex.y - mesh.center.y;
    const z = (vertex.z - mesh.center.z) * 6.2;
    const yawedX = x * yawCos + z * yawSin;
    const yawedZ = -x * yawSin + z * yawCos;
    const pitchedY = y * pitchCos - yawedZ * pitchSin;
    const pitchedZ = y * pitchSin + yawedZ * pitchCos;
    const perspective = cameraDistance / Math.max(120, cameraDistance - pitchedZ);

    return {
      x: width / 2 + yawedX * scale * perspective,
      y: height * 0.54 - pitchedY * scale * perspective,
      z: pitchedZ,
      rawX: yawedX,
      rawY: pitchedY,
      rawZ: pitchedZ
    };
  };

  const projected = mesh.triangles.map(triangle => {
    const points = triangle.vertices.map(transformVertex);
    const normal = getTriangleNormal(points[0], points[1], points[2]);
    const textureX = triangle.vertices.reduce((total, vertex) => total + vertex.x, 0) / 3;
    const textureY = triangle.vertices.reduce((total, vertex) => total + vertex.y, 0) / 3;

    return {
      points,
      depth: (points[0].z + points[1].z + points[2].z) / 3,
      color: triangle.color || pieceColor,
      normal,
      textureX,
      textureY
    };
  }).sort((a, b) => a.depth - b.depth);

  const minDepth = projected.reduce((min, triangle) => Math.min(min, triangle.depth), Infinity);
  const maxDepth = projected.reduce((max, triangle) => Math.max(max, triangle.depth), -Infinity);
  const depthRange = Math.max(1, maxDepth - minDepth);

  if (clear) {
    ctx.clearRect(0, 0, width, height);
  }

  if (paintStage) {
    ctx.fillStyle = renderMode ? "rgba(16, 14, 24, 0.2)" : "rgba(16, 14, 24, 0.03)";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.save();
  ctx.fillStyle = renderMode ? "rgba(0, 0, 0, 0.26)" : "rgba(0, 0, 0, 0.14)";
  ctx.filter = renderMode ? "blur(22px)" : "blur(16px)";
  ctx.beginPath();
  ctx.ellipse(width / 2, height * 0.77, width * 0.34, height * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  projected.forEach(triangle => {
    const [a, b, c] = triangle.points;
    const style = getStlTriangleStyle(triangle, materialConfig, light, minDepth, depthRange, renderMode);

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();
    ctx.shadowBlur = style.shadowBlur;
    ctx.shadowColor = style.shadowColor;
    ctx.fillStyle = style.fill;
    ctx.fill();
    if (style.strokeWidth > 0) {
      ctx.lineWidth = style.strokeWidth;
      ctx.strokeStyle = style.stroke;
      ctx.stroke();
    }
  });
  ctx.restore();
}

function getStlTriangleStyle(triangle, materialConfig, light, minDepth, depthRange, renderMode = false) {
  const selectedColor = hexToRgb(triangle.color);
  const materialBase = materialConfig.base ? hexToRgb(materialConfig.base) : selectedColor;
  const materialHighlight = hexToRgb(materialConfig.highlight);
  const materialShadow = hexToRgb(materialConfig.shadow);
  const depthT = clamp01((triangle.depth - minDepth) / depthRange);
  const lightDot = Math.abs(dotVector(triangle.normal, light));
  const frontT = Math.abs(triangle.normal.z);
  const lightT = clamp01(0.48 + lightDot * 0.52);
  const facingT = clamp01(0.66 + frontT * 0.34);
  const ambient = materialConfig.ambient ?? 0.68;
  const depthStrength = materialConfig.depth ?? 0.08;
  const lightStrength = materialConfig.light ?? 0.18;
  let base = mixRgb(materialShadow, materialBase, clamp01(ambient + depthT * depthStrength + lightT * lightStrength));
  let highlight = Math.pow(lightT, 2.15) * materialConfig.gloss;

  if (materialConfig === stlMaterials.plastic) {
    base = mixRgb(base, selectedColor, 0.92);
  } else if (materialConfig === stlMaterials.matte) {
    base = mixRgb(base, selectedColor, 0.9);
    highlight *= 0.45;
  } else if (materialConfig === stlMaterials.acrylic) {
    base = mixRgb(base, selectedColor, 0.88);
    base = mixRgb(base, materialHighlight, 0.05 + lightT * 0.08);
    highlight += 0.06;
  } else if (materialConfig === stlMaterials.neon) {
    base = mixRgb(selectedColor, materialHighlight, 0.22 + lightT * 0.24);
    highlight += 0.18;
  } else if (materialConfig === stlMaterials.wood) {
    const grain = (Math.sin(triangle.textureX * 0.09 + triangle.textureY * 0.035) + 1) / 2;
    base = mixRgb(base, materialHighlight, grain * 0.24);
    base = mixRgb(base, materialShadow, (1 - grain) * 0.12);
  } else if (materialConfig === stlMaterials.gold || materialConfig === stlMaterials.silver) {
    const band = (Math.sin(triangle.textureX * 0.05 + triangle.depth * 0.02) + 1) / 2;
    base = mixRgb(base, materialHighlight, band * 0.2 + lightT * 0.16);
  } else if (materialConfig === stlMaterials.ceramic) {
    base = mixRgb(base, materialHighlight, 0.08 + lightT * 0.12);
    highlight *= 0.65;
  } else if (materialConfig === stlMaterials.black) {
    base = mixRgb(base, materialHighlight, 0.06 + lightT * 0.12);
    highlight += 0.04;
  }

  const fill = mixRgb(base, materialHighlight, Math.min(0.5, highlight));
  const stroke = mixRgb(fill, materialShadow, (materialConfig.stroke ?? 0.06) + (1 - facingT) * 0.04);
  const strokeAlpha = clamp01((materialConfig.strokeAlpha ?? 0.22) * (renderMode ? 0.38 : 1));
  const glowColor = materialConfig === stlMaterials.neon ? selectedColor : materialHighlight;

  return {
    fill: rgbToCss(fill),
    stroke: rgbToCss(stroke, strokeAlpha),
    strokeWidth: renderMode ? 0.08 : 0.2,
    shadowBlur: materialConfig.glow ? (renderMode ? 30 : 16) * materialConfig.glow : 0,
    shadowColor: rgbToCss(glowColor, materialConfig.glow ? 0.46 : 0)
  };
}

function normalizeVector(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
}

function dotVector(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function getTriangleNormal(a, b, c) {
  const ux = b.rawX - a.rawX;
  const uy = b.rawY - a.rawY;
  const uz = b.rawZ - a.rawZ;
  const vx = c.rawX - a.rawX;
  const vy = c.rawY - a.rawY;
  const vz = c.rawZ - a.rawZ;
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const length = Math.hypot(nx, ny, nz) || 1;

  return {
    x: nx / length,
    y: ny / length,
    z: nz / length
  };
}

function startStlPreviewDrag(event) {
  if (!stlPreviewMesh || !stlPreviewModel) return;

  event.preventDefault();
  stlPreviewDrag = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    rotationX: stlPreviewRotationX,
    rotationZ: stlPreviewRotationZ
  };
  stlPreviewModel.setPointerCapture?.(event.pointerId);
}

function moveStlPreviewDrag(event) {
  if (!stlPreviewDrag || !stlPreviewMesh || stlPreviewDrag.pointerId !== event.pointerId) return;

  event.preventDefault();
  const dx = event.clientX - stlPreviewDrag.x;
  const dy = event.clientY - stlPreviewDrag.y;
  stlPreviewRotationZ = stlPreviewDrag.rotationZ + dx * 0.012;
  stlPreviewRotationX = Math.max(-1.35, Math.min(0.55, stlPreviewDrag.rotationX + dy * 0.01));
  drawStlMesh(stlPreviewMesh);
}

function endStlPreviewDrag(event) {
  if (!stlPreviewDrag || stlPreviewDrag.pointerId !== event.pointerId) return;

  stlPreviewModel?.releasePointerCapture?.(event.pointerId);
  stlPreviewDrag = null;
}

window.addEventListener("resize", () => {
  if (!stlPreviewModal || stlPreviewModal.hidden || !stlPreviewMesh) return;
  drawStlMesh(stlPreviewMesh);
});

function generateStlRenderImage() {
  if (!stlPreviewMesh) {
    updateStlPreviewStatus("Open the 3D preview before generating a render.");
    return;
  }

  const output = createStlRenderCanvas(stlPreviewMesh, {
    rotationZ: stlPreviewRotationZ,
    rotationX: stlPreviewRotationX,
    material: stlPreviewMaterial,
    lightPhase: stlPreviewLightPhase + 0.9
  });

  const fileBase = (nameInput?.value || "makernames")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "makernames";

  output.toBlob(blob => {
    if (!blob) return;
    downloadBlob(blob, `${fileBase}-3d-render.png`);
    updateStlPreviewStatus("Render downloaded as PNG.");
  }, "image/png", 0.96);
}

function createStlRenderCanvas(mesh, options = {}) {
  const output = document.createElement("canvas");
  output.width = options.width || 1600;
  output.height = options.height || 1000;
  const ctx = output.getContext("2d");
  if (!ctx) return output;

  const background = ctx.createLinearGradient(0, 0, output.width, output.height);
  background.addColorStop(0, "#171325");
  background.addColorStop(0.48, "#2d2450");
  background.addColorStop(1, "#07131d");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, output.width, output.height);

  const glow = ctx.createRadialGradient(output.width * 0.48, output.height * 0.28, 80, output.width * 0.48, output.height * 0.28, 720);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.24)");
  glow.addColorStop(0.42, "rgba(124, 61, 240, 0.18)");
  glow.addColorStop(1, "rgba(124, 61, 240, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, output.width, output.height);

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  for (let x = 120; x < output.width - 120; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 110);
    ctx.lineTo(x, output.height - 150);
    ctx.stroke();
  }
  for (let y = 120; y < output.height - 130; y += 48) {
    ctx.beginPath();
    ctx.moveTo(120, y);
    ctx.lineTo(output.width - 120, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(output.width / 2, output.height * 0.76, output.width * 0.33, output.height * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawStlSceneToContext(ctx, output.width, output.height, mesh, {
    rotationZ: options.rotationZ ?? -0.08,
    rotationX: options.rotationX ?? -0.12,
    material: options.material || stlPreviewMaterial,
    lightPhase: options.lightPhase ?? 0.9,
    clear: false,
    paintStage: false,
    renderMode: true,
    scaleMultiplier: options.scaleMultiplier ?? 0.9
  });

  return output;
}

async function createStlRenderDataUrl(project) {
  const scene = await fetchStlSceneForProject(project);
  if (!scene.triangles.length) return "";

  const output = createStlRenderCanvas(scene, {
    rotationZ: -0.08,
    rotationX: -0.12,
    lightPhase: 0.9,
    scaleMultiplier: 0.88
  });

  return output.toDataURL("image/png", 0.92);
}

async function exportFromApi(format, mime, extension = format) {
  if (!(await ensureDownloadSession())) return;
  if (!(await requireRewardVideo())) return;

  if (isDesktopApp) {
    await exportDirectFromApi(format, mime, extension);
    return;
  }

  const isPackage = format === "package";
  const project = buildProject({ showBaseLine: false });
  let renderPngDataUrl = "";
  setExporting(true);
  if (isPackage) {
    saveStatus.textContent = "Creating your download pack...";
  }

  try {
    if (isPackage) {
      saveStatus.textContent = "Rendering your 3D preview image...";
      try {
        renderPngDataUrl = await createStlRenderDataUrl(project);
      } catch {
        renderPngDataUrl = "";
      }
      saveStatus.textContent = "Creating your download pack...";
    }

    const response = await fetch("/api/Generate/prepare-downloads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify(renderPngDataUrl ? { ...project, renderPngDataUrl } : project)
    });

    if (!response.ok) {
      const message = await readApiMessage(response, `Could not create ${format.toUpperCase()}.`);
      handleDownloadBlocked(response.status, message);
      return;
    }

    const links = await response.json();
    const downloadUrl = links[format];

    if (!downloadUrl) {
      alert(`${format.toUpperCase()} is not available yet.`);
      return;
    }

    triggerBrowserDownload(downloadUrl);
    if (format === "package") saveStatus.textContent = "Your download should start now.";
    if (format === "package") queueCommunityShare(project, renderPngDataUrl);
    setTimeout(refreshAuth, 1400);
  } finally {
    setTimeout(() => {
      setExporting(false);
    }, 1200);
  }
}

async function exportDirectFromApi(format, mime, extension = format) {
  const project = buildProject({ showBaseLine: false });
  const safeName = (project.text || "makernames")
    .toString()
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 80) || "makernames";

  setExporting(true);
  saveStatus.textContent = `Creating ${format.toUpperCase()}...`;

  try {
    const response = await fetch(`/api/Generate/${format}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify(project)
    });

    if (!response.ok) {
      const message = await readApiMessage(response, `Could not create ${format.toUpperCase()}.`);
      saveStatus.textContent = message;
      return;
    }

    const blob = await response.blob();
    downloadBlob(blob, `${safeName}.${extension}`);
    saveStatus.textContent = `${format.toUpperCase()} download started.`;
  } catch {
    saveStatus.textContent = `Could not create ${format.toUpperCase()}.`;
  } finally {
    setTimeout(() => setExporting(false), 600);
  }
}

function triggerBrowserDownload(url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = "";
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getCommunityClientId() {
  const key = "makernames_community_client";

  try {
    let clientId = localStorage.getItem(key);
    if (!clientId) {
      clientId = window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(key, clientId);
    }

    return clientId;
  } catch {
    return "browser-session";
  }
}

async function loadCommunityPreview() {
  if (!communityPreviewGrid) return;

  try {
    const response = await fetch("/api/Library?take=5", {
      credentials: "same-origin",
      cache: "no-store"
    });

    if (!response.ok) throw new Error("Could not load download library.");

    const items = await response.json();
    communityPreviewGrid.innerHTML = "";

    if (!Array.isArray(items) || items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "community-empty";
      empty.textContent = "The download library is being prepared.";
      communityPreviewGrid.appendChild(empty);
      return;
    }

    items.forEach(item => {
      communityPreviewGrid.appendChild(createCommunityCard(item));
    });
  } catch {
    communityPreviewGrid.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "community-empty";
    empty.textContent = "The download library is loading slowly. Try again soon.";
    communityPreviewGrid.appendChild(empty);
  }
}

function queueCommunityShare() {
  // The download library is curated. User downloads are not published automatically.
}

function getCommunityProjectTitle(project) {
  const names = [];

  if (Array.isArray(project?.placedNames)) {
    project.placedNames.forEach(item => {
      if (item?.text) names.push(item.text);
    });
  }

  if (project?.text) names.push(project.text);

  const title = [...new Set(names
    .map(item => String(item).trim())
    .filter(Boolean))]
    .join(" + ");

  return title || "MakerNames design";
}

function createCommunityCard(item) {
  const card = document.createElement("article");
  card.className = "community-card";

  const link = document.createElement("a");
  link.className = "community-card-link";
  link.href = item?.pageUrl || "/library.html";

  const thumb = document.createElement("div");
  thumb.className = "community-card-thumb";

  const image = document.createElement("img");
  image.alt = `${item?.title || "MakerNames"} download preview`;
  image.loading = "lazy";
  image.src = item?.previewUrl || svgToCommunityDataUri("");
  image.classList.toggle("is-render", Boolean(item?.previewUrl));
  thumb.classList.toggle("has-render", Boolean(item?.previewUrl));
  thumb.appendChild(image);

  const body = document.createElement("div");
  body.className = "community-card-body";

  const title = document.createElement("strong");
  if (item?.title) {
    title.textContent = item.title;
  } else {
    title.innerHTML = `<span class="notranslate" translate="no">MakerNames</span> design`;
  }

  const formats = document.createElement("span");
  formats.textContent = Array.isArray(item?.formats) && item.formats.length
    ? item.formats.join(" + ")
    : "Download pack";

  body.append(title, formats);
  link.append(thumb, body);
  card.append(link);

  return card;
}

function syncCommunityLikeButton(button, likes, liked) {
  button.textContent = liked ? `Liked ${likes}` : `Like ${likes}`;
  button.classList.toggle("is-liked", liked);
}

async function toggleCommunityLike(id, button) {
  if (!id || !button) return;

  button.disabled = true;
  try {
    const response = await fetch(`/api/Community/${encodeURIComponent(id)}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ clientId: getCommunityClientId() })
    });

    if (!response.ok) return;

    const result = await response.json();
    syncCommunityLikeButton(button, result.likes || 0, result.liked === true);
  } finally {
    button.disabled = false;
  }
}

function svgToCommunityDataUri(svg) {
  if (!svg) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 160'%3E%3Ctext x='150' y='84' text-anchor='middle' font-family='Arial' font-size='18' fill='%2368627a'%3ENo preview%3C/text%3E%3C/svg%3E";
  }

  const bytes = new TextEncoder().encode(svg);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 8192) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }

  return `data:image/svg+xml;base64,${btoa(binary)}`;
}

function getCommunityPngThumbnail(item) {
  const value = item?.thumbnailPng;
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed.length > 3_600_000) return "";
  return /^data:image\/png;base64,[a-z0-9+/=\s]+$/i.test(trimmed) ? trimmed : "";
}

function setExporting(isExporting) {
  const buttons = [exportSvg, exportDxf, exportStl, downloadPackage];

  buttons.forEach(button => {
    if (!button) return;
    button.disabled = isExporting;
    button.classList.toggle("is-loading", isExporting);
  });
}

async function saveToDownloads() {
  if (!(await ensureDownloadSession())) return;
  if (!(await requireRewardVideo())) return;

  setExporting(true);
  saveStatus.textContent = "Creating your files...";

  try {
    const response = await fetch("/api/Generate/save-to-downloads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify(buildProject({ showBaseLine: false }))
    });

    if (!response.ok) {
      const message = await readApiMessage(response, "Could not save the files.");
      saveStatus.textContent = message;
      if (response.status === 401) openAuthModal("login");
      return;
    }

    const result = await response.json();
    saveStatus.textContent = `Saved to: ${result.folder}`;
    updateUsageFromResponse(result);
  } catch {
    saveStatus.textContent = "Could not save the files.";
  } finally {
    setExporting(false);
  }
}

function extractSvgInner(text) {
  const withoutScripts = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  const start = withoutScripts.search(/<svg\b[^>]*>/i);
  const end = withoutScripts.toLowerCase().lastIndexOf("</svg>");

  if (start < 0 || end < 0) return withoutScripts;

  const openEnd = withoutScripts.indexOf(">", start);
  return withoutScripts.slice(openEnd + 1, end);
}

function buildAccessoryPreviewSvg(text) {
  try {
    const doc = new DOMParser().parseFromString(text, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return "";

    svg.querySelectorAll("script, foreignObject").forEach(node => node.remove());
    const width = parseFloat(svg.getAttribute("width")) || 120;
    const height = parseFloat(svg.getAttribute("height")) || 120;

    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Selected accessory");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    if (!svg.getAttribute("viewBox")) {
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }

    return svg.outerHTML;
  } catch {
    return "";
  }
}

function createSvgImportedObject(text, options = {}) {
  const rawContours = parseSvgContours(text);
  const cleanContours = sanitizeSvgContours(rawContours);
  const stlQuality = analyzeAccessoryStlQuality(text, rawContours, cleanContours);
  const previewSvg = buildAccessoryPreviewSvg(text);

  return {
    id: options.id || "",
    type: "svg",
    sourceKind: options.sourceKind || "",
    stlMode: options.stlMode || "",
    name: options.name || "Accessory",
    color: options.color || accessoryColor,
    svgInner: extractSvgInner(text),
    previewSvg,
    sourceSvg: previewSvg,
    contours: cleanContours,
    stlQuality,
    verified3d: options.verified3d === true,
    catalogRisk: options.catalogRisk || null,
    catalogIssues: Array.isArray(options.catalogIssues) ? options.catalogIssues : [],
    x: Number.isFinite(options.x) ? options.x : 250,
    y: Number.isFinite(options.y) ? options.y : 120,
    rotation: Number.isFinite(options.rotation) ? options.rotation : 0,
    scale: Number.isFinite(options.scale) ? options.scale : 0.3
  };
}

async function createImageImportedObject(file, options = {}) {
  const image = await loadRasterImage(file);

  try {
    const trace = traceRasterImageToSvg(image);
    const stlMode = normalizeImageImportMode(options.stlMode || getImageImportMode());

    return {
      id: options.id || "",
      type: "svg",
      sourceKind: "image-trace",
      stlMode,
      name: file.name?.replace(/\.[^.]+$/, "") || "Image",
      color: options.color || accessoryColor,
      svgInner: trace.svgInner,
      previewSvg: trace.previewSvg,
      sourceSvg: trace.previewSvg,
      contours: trace.contours,
      stlQuality: getImageTraceStlQuality(stlMode),
      verified3d: false,
      catalogRisk: "review",
      catalogIssues: getImageTraceCatalogIssues(stlMode),
      x: Number.isFinite(options.x) ? options.x : 250,
      y: Number.isFinite(options.y) ? options.y : 120,
      rotation: Number.isFinite(options.rotation) ? options.rotation : 0,
      scale: Number.isFinite(options.scale) ? options.scale : 0.65
    };
  } finally {
    image.close?.();
  }
}

function queueCommunityAccessorySave(object, source = "upload") {
  if (!object || object.type !== "svg") return;

  saveCommunityAccessory(object, source).catch(() => {
    // Library sharing is a helpful extra, never a blocker for the editor.
  });
}

async function saveCommunityAccessory(object, source) {
  const svgText = object.sourceSvg || object.previewSvg || "";
  if (!svgText || svgText.length > 240_000) return;

  const response = await fetch("/api/Accessories/community", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: object.name || (source === "image-search" ? "Outline image" : "Community SVG"),
      svgText,
      verified3d: object.verified3d === true || object.stlQuality?.level === "safe",
      stlRisk: getImportedObjectStlRisk(object),
      stlIssues: getImportedObjectStlIssues(object),
      stlNodes: getImportedObjectNodeCount(object)
    })
  });

  if (!response.ok) return;
  const item = await response.json();
  mergeCommunityAccessory(item);
}

function mergeCommunityAccessory(item) {
  if (!item?.file) return;

  accessoryCatalog = [
    item,
    ...accessoryCatalog.filter(candidate => candidate.file !== item.file && candidate.id !== item.id)
  ];
  renderQuickAccessories();

  if (libraryModal && !libraryModal.hidden) {
    renderAccessoryLibrary();
  }
}

function getImportedObjectStlRisk(object) {
  if (object.verified3d === true || object.stlQuality?.level === "safe") return "safe";
  if (object.stlQuality?.level === "danger") return "visual-only";
  return "review";
}

function getImportedObjectStlIssues(object) {
  const issues = Array.isArray(object.catalogIssues) ? [...object.catalogIssues] : [];
  const message = object.stlQuality?.message || "";

  if (message && !/^Optimized for STL\.?$/i.test(message)) {
    issues.push(message);
  }

  if (object.catalogRisk && object.catalogRisk !== "safe") {
    issues.push(object.catalogRisk);
  }

  return [...new Set(issues.filter(Boolean))].slice(0, 8);
}

function getImportedObjectNodeCount(object) {
  return (object.contours || []).reduce((total, contour) => total + contour.length, 0);
}

async function loadRasterImage(file) {
  if (window.createImageBitmap) {
    return createImageBitmap(file);
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image."));
    };
    image.src = url;
  });
}

function traceRasterImageToSvg(image) {
  const maxSize = 360;
  const sourceWidth = Math.max(1, image.width || 1);
  const sourceHeight = Math.max(1, image.height || 1);
  const ratio = Math.min(1, maxSize / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * ratio));
  const height = Math.max(1, Math.round(sourceHeight * ratio));
  const canvasElement = document.createElement("canvas");
  canvasElement.width = width;
  canvasElement.height = height;

  const ctx = canvasElement.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const mask = imageDataToTraceMask(imageData, width, height);
  removeSmallTraceComponents(mask, width, height, 10);

  const rawContours = traceMaskEdges(mask, width, height);
  const cleanContours = sanitizeSvgContours(rawContours)
    .sort((a, b) => Math.abs(svgPolygonArea(b)) - Math.abs(svgPolygonArea(a)))
    .slice(0, 140);

  if (cleanContours.length === 0) {
    throw new Error("No usable contours.");
  }

  const normalized = normalizeTraceContours(cleanContours);
  const pathData = traceContoursToPathData(normalized.contours);
  const svgInner = `<path d="${pathData}" fill="currentColor" fill-rule="evenodd"/>`;
  const previewSvg = `<svg viewBox="0 0 ${formatTraceNumber(normalized.width)} ${formatTraceNumber(normalized.height)}" role="img" aria-label="Converted image accessory" preserveAspectRatio="xMidYMid meet">${svgInner}</svg>`;

  return {
    contours: normalized.contours,
    svgInner,
    previewSvg
  };
}

function imageDataToTraceMask(imageData, width, height) {
  const data = imageData.data;
  const mask = new Uint8Array(width * height);

  for (let i = 0; i < mask.length; i++) {
    const offset = i * 4;
    const alpha = data[offset + 3];
    if (alpha < 24) continue;

    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const luminance = (red * 0.2126) + (green * 0.7152) + (blue * 0.0722);

    if (luminance < 215) {
      mask[i] = 1;
    }
  }

  return mask;
}

function removeSmallTraceComponents(mask, width, height, minPixels) {
  const visited = new Uint8Array(mask.length);

  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || visited[start]) continue;

    const component = [];
    const stack = [start];
    visited[start] = 1;

    while (stack.length) {
      const index = stack.pop();
      component.push(index);
      const x = index % width;
      const y = Math.floor(index / width);
      const neighbors = [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        y > 0 ? index - width : -1,
        y < height - 1 ? index + width : -1
      ];

      neighbors.forEach(next => {
        if (next >= 0 && mask[next] && !visited[next]) {
          visited[next] = 1;
          stack.push(next);
        }
      });
    }

    if (component.length < minPixels) {
      component.forEach(index => {
        mask[index] = 0;
      });
    }
  }
}

function traceMaskEdges(mask, width, height) {
  const edges = [];
  const outgoing = new Map();

  const addEdge = (fromX, fromY, toX, toY) => {
    const fromKey = `${fromX},${fromY}`;
    const toKey = `${toX},${toY}`;
    const edge = { fromX, fromY, toX, toY, fromKey, toKey, id: `${fromKey}>${toKey}` };
    edges.push(edge);
    if (!outgoing.has(fromKey)) outgoing.set(fromKey, []);
    outgoing.get(fromKey).push(edge);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isTraceMaskPixel(mask, width, height, x, y)) continue;
      if (!isTraceMaskPixel(mask, width, height, x, y - 1)) addEdge(x, y, x + 1, y);
      if (!isTraceMaskPixel(mask, width, height, x + 1, y)) addEdge(x + 1, y, x + 1, y + 1);
      if (!isTraceMaskPixel(mask, width, height, x, y + 1)) addEdge(x + 1, y + 1, x, y + 1);
      if (!isTraceMaskPixel(mask, width, height, x - 1, y)) addEdge(x, y + 1, x, y);
    }
  }

  const used = new Set();
  const contours = [];

  edges.forEach(edge => {
    if (used.has(edge.id)) return;

    const points = [{ x: edge.fromX, y: edge.fromY }];
    const startKey = edge.fromKey;
    let current = edge;
    let guard = 0;

    while (current && !used.has(current.id) && guard < edges.length + 8) {
      used.add(current.id);
      points.push({ x: current.toX, y: current.toY });
      guard += 1;

      if (current.toKey === startKey) break;

      const candidates = (outgoing.get(current.toKey) || []).filter(candidate => !used.has(candidate.id));
      current = pickNextTraceEdge(current, candidates);
    }

    const last = points[points.length - 1];
    const first = points[0];
    if (points.length >= 4 && last.x === first.x && last.y === first.y) {
      contours.push(points);
    }
  });

  return contours;
}

function isTraceMaskPixel(mask, width, height, x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return false;
  return mask[(y * width) + x] === 1;
}

function pickNextTraceEdge(current, candidates) {
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];

  const currentAngle = Math.atan2(current.toY - current.fromY, current.toX - current.fromX);
  return candidates
    .map(candidate => {
      const angle = Math.atan2(candidate.toY - candidate.fromY, candidate.toX - candidate.fromX);
      return { candidate, turn: Math.abs(normalizeTraceAngle(angle - currentAngle)) };
    })
    .sort((a, b) => a.turn - b.turn)[0].candidate;
}

function normalizeTraceAngle(angle) {
  let result = angle;
  while (result <= -Math.PI) result += Math.PI * 2;
  while (result > Math.PI) result -= Math.PI * 2;
  return result;
}

function normalizeTraceContours(contours) {
  const allPoints = contours.flat();
  const minX = Math.min(...allPoints.map(point => point.x));
  const maxX = Math.max(...allPoints.map(point => point.x));
  const minY = Math.min(...allPoints.map(point => point.y));
  const maxY = Math.max(...allPoints.map(point => point.y));
  const sourceWidth = Math.max(1, maxX - minX);
  const sourceHeight = Math.max(1, maxY - minY);
  const scale = Math.min(300 / sourceWidth, 240 / sourceHeight);
  const normalizedWidth = sourceWidth * scale;
  const normalizedHeight = sourceHeight * scale;

  return {
    width: normalizedWidth,
    height: normalizedHeight,
    contours: contours.map(contour => contour.map(point => ({
      x: (point.x - minX) * scale,
      y: (point.y - minY) * scale
    })))
  };
}

function traceContoursToPathData(contours) {
  return contours
    .map(contour => {
      const [first, ...rest] = contour;
      return [
        `M ${formatTraceNumber(first.x)} ${formatTraceNumber(first.y)}`,
        ...rest.map(point => `L ${formatTraceNumber(point.x)} ${formatTraceNumber(point.y)}`),
        "Z"
      ].join(" ");
    })
    .join(" ");
}

function formatTraceNumber(value) {
  return Number(value.toFixed(2)).toString();
}

function parseDxfContours(text) {
  const lines = text
    .replace(/\0/g, "")
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const pairs = [];
  const contours = [];

  for (let i = 0; i < lines.length - 1; i += 2) {
    pairs.push({ code: lines[i], value: lines[i + 1] });
  }

  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i].code !== "0") continue;

    const entity = pairs[i].value.toUpperCase();

    if (entity === "LINE") {
      const entityPairs = readDxfEntity(pairs, i + 1);
      contours.push([
        { x: getDxfValue(entityPairs.items, "10"), y: getDxfValue(entityPairs.items, "20") },
        { x: getDxfValue(entityPairs.items, "11"), y: getDxfValue(entityPairs.items, "21") }
      ]);
      i = entityPairs.end - 1;
    } else if (entity === "LWPOLYLINE") {
      const entityPairs = readDxfEntity(pairs, i + 1);
      const points = collectDxfPoints(entityPairs.items, "10", "20");
      if (points.length >= 2) contours.push(points);
      i = entityPairs.end - 1;
    } else if (entity === "POLYLINE") {
      const result = readDxfPolyline(pairs, i + 1);
      if (result.points.length >= 2) contours.push(result.points);
      i = result.end - 1;
    } else if (entity === "SPLINE") {
      const entityPairs = readDxfEntity(pairs, i + 1);
      const points = collectDxfPoints(entityPairs.items, "10", "20");
      const fitPoints = collectDxfPoints(entityPairs.items, "11", "21");
      const contour = fitPoints.length >= 2 ? fitPoints : points;
      if (contour.length >= 2) contours.push(contour);
      i = entityPairs.end - 1;
    } else if (entity === "CIRCLE") {
      const entityPairs = readDxfEntity(pairs, i + 1);
      contours.push(approximateDxfArc(
        getDxfValue(entityPairs.items, "10"),
        getDxfValue(entityPairs.items, "20"),
        getDxfValue(entityPairs.items, "40"),
        0,
        360
      ));
      i = entityPairs.end - 1;
    } else if (entity === "ARC") {
      const entityPairs = readDxfEntity(pairs, i + 1);
      contours.push(approximateDxfArc(
        getDxfValue(entityPairs.items, "10"),
        getDxfValue(entityPairs.items, "20"),
        getDxfValue(entityPairs.items, "40"),
        getDxfValue(entityPairs.items, "50"),
        getDxfValue(entityPairs.items, "51")
      ));
      i = entityPairs.end - 1;
    }
  }

  return contours.filter(contour => contour.length >= 2);
}

function readDxfEntity(pairs, start) {
  let end = start;

  while (end < pairs.length && pairs[end].code !== "0") {
    end += 1;
  }

  return { items: pairs.slice(start, end), end };
}

function readDxfPolyline(pairs, start) {
  const points = [];
  let i = start;

  while (i < pairs.length) {
    if (pairs[i].code === "0" && pairs[i].value.toUpperCase() === "VERTEX") {
      const entityPairs = readDxfEntity(pairs, i + 1);
      points.push({
        x: getDxfValue(entityPairs.items, "10"),
        y: getDxfValue(entityPairs.items, "20")
      });
      i = entityPairs.end;
    } else if (pairs[i].code === "0" && pairs[i].value.toUpperCase() === "SEQEND") {
      return { points, end: i + 1 };
    } else if (pairs[i].code === "0") {
      return { points, end: i };
    } else {
      i += 1;
    }
  }

  return { points, end: i };
}

function collectDxfPoints(items, xCode, yCode) {
  const points = [];
  let currentX = null;

  items.forEach(item => {
    if (item.code === xCode) currentX = parseNumber(item.value);
    else if (item.code === yCode && currentX !== null) {
      points.push({ x: currentX, y: parseNumber(item.value) });
      currentX = null;
    }
  });

  return points;
}

function getDxfValue(items, code) {
  const item = items.find(entry => entry.code === code);
  return item ? parseNumber(item.value) : 0;
}

function approximateDxfArc(cx, cy, radius, startDeg, endDeg) {
  const points = [];
  let end = endDeg;
  if (end <= startDeg) end += 360;
  const steps = Math.max(16, Math.ceil((end - startDeg) / 12));

  for (let i = 0; i <= steps; i++) {
    const angle = (startDeg + ((end - startDeg) * i) / steps) * Math.PI / 180;
    points.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius
    });
  }

  return points;
}

function parseSvgContours(text) {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const contours = [];

  doc.querySelectorAll("path[d]").forEach(path => {
    contours.push(...parseSvgPath(path.getAttribute("d")));
  });

  doc.querySelectorAll("polygon[points]").forEach(polygon => {
    const points = parseSvgPointList(polygon.getAttribute("points"));
    if (points.length >= 3) {
      points.push({ ...points[0] });
      pushClosedSvgContour(contours, points, points[0]);
    }
  });

  doc.querySelectorAll("rect").forEach(rect => {
    const x = parseNumber(rect.getAttribute("x"));
    const y = parseNumber(rect.getAttribute("y"));
    const width = parseNumber(rect.getAttribute("width"));
    const height = parseNumber(rect.getAttribute("height"));

    if (width > 0 && height > 0) {
      const points = [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
        { x, y }
      ];
      pushClosedSvgContour(contours, points, points[0]);
    }
  });

  doc.querySelectorAll("circle").forEach(circle => {
    const cx = parseNumber(circle.getAttribute("cx"));
    const cy = parseNumber(circle.getAttribute("cy"));
    const radius = parseNumber(circle.getAttribute("r"));
    if (radius > 0) contours.push(approximateSvgEllipse(cx, cy, radius, radius));
  });

  doc.querySelectorAll("ellipse").forEach(ellipse => {
    const cx = parseNumber(ellipse.getAttribute("cx"));
    const cy = parseNumber(ellipse.getAttribute("cy"));
    const rx = parseNumber(ellipse.getAttribute("rx"));
    const ry = parseNumber(ellipse.getAttribute("ry"));
    if (rx > 0 && ry > 0) contours.push(approximateSvgEllipse(cx, cy, rx, ry));
  });

  return contours;
}

function parseSvgPath(d) {
  const contours = [];
  const tokens = tokenizeSvgPath(d);
  let current = [];
  let point = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };
  let command = " ";
  let lastCubicControl = null;
  let lastQuadraticControl = null;
  let i = 0;

  while (i < tokens.length) {
    if (isSvgCommand(tokens[i])) command = tokens[i++];

    const relative = command === command.toLowerCase();
    const cmd = command.toUpperCase();

    if (cmd === "M") {
      const x = readSvgNumber(tokens, () => i++);
      const y = readSvgNumber(tokens, () => i++);
      pushClosedSvgContour(contours, current, start);
      point = { x: relative ? point.x + x : x, y: relative ? point.y + y : y };
      start = point;
      current = [point];
      command = relative ? "l" : "L";
      lastCubicControl = null;
      lastQuadraticControl = null;
    } else if (cmd === "L") {
      const x = readSvgNumber(tokens, () => i++);
      const y = readSvgNumber(tokens, () => i++);
      point = { x: relative ? point.x + x : x, y: relative ? point.y + y : y };
      current.push(point);
      lastCubicControl = null;
      lastQuadraticControl = null;
    } else if (cmd === "H") {
      const x = readSvgNumber(tokens, () => i++);
      point = { x: relative ? point.x + x : x, y: point.y };
      current.push(point);
      lastCubicControl = null;
      lastQuadraticControl = null;
    } else if (cmd === "V") {
      const y = readSvgNumber(tokens, () => i++);
      point = { x: point.x, y: relative ? point.y + y : y };
      current.push(point);
      lastCubicControl = null;
      lastQuadraticControl = null;
    } else if (cmd === "C") {
      const p1 = { x: readSvgNumber(tokens, () => i++), y: readSvgNumber(tokens, () => i++) };
      const p2 = { x: readSvgNumber(tokens, () => i++), y: readSvgNumber(tokens, () => i++) };
      const p3 = { x: readSvgNumber(tokens, () => i++), y: readSvgNumber(tokens, () => i++) };
      if (relative) {
        p1.x += point.x; p1.y += point.y;
        p2.x += point.x; p2.y += point.y;
        p3.x += point.x; p3.y += point.y;
      }
      for (let s = 1; s <= 16; s++) current.push(bezierPoint(point, p1, p2, p3, s / 16));
      point = p3;
      lastCubicControl = p2;
      lastQuadraticControl = null;
    } else if (cmd === "S") {
      const p1 = lastCubicControl
        ? { x: point.x + (point.x - lastCubicControl.x), y: point.y + (point.y - lastCubicControl.y) }
        : { ...point };
      const p2 = { x: readSvgNumber(tokens, () => i++), y: readSvgNumber(tokens, () => i++) };
      const p3 = { x: readSvgNumber(tokens, () => i++), y: readSvgNumber(tokens, () => i++) };
      if (relative) {
        p2.x += point.x; p2.y += point.y;
        p3.x += point.x; p3.y += point.y;
      }
      for (let s = 1; s <= 16; s++) current.push(bezierPoint(point, p1, p2, p3, s / 16));
      point = p3;
      lastCubicControl = p2;
      lastQuadraticControl = null;
    } else if (cmd === "Q") {
      const p1 = { x: readSvgNumber(tokens, () => i++), y: readSvgNumber(tokens, () => i++) };
      const p2 = { x: readSvgNumber(tokens, () => i++), y: readSvgNumber(tokens, () => i++) };
      if (relative) {
        p1.x += point.x; p1.y += point.y;
        p2.x += point.x; p2.y += point.y;
      }
      for (let s = 1; s <= 14; s++) current.push(quadraticPoint(point, p1, p2, s / 14));
      point = p2;
      lastQuadraticControl = p1;
      lastCubicControl = null;
    } else if (cmd === "T") {
      const p1 = lastQuadraticControl
        ? { x: point.x + (point.x - lastQuadraticControl.x), y: point.y + (point.y - lastQuadraticControl.y) }
        : { ...point };
      const p2 = { x: readSvgNumber(tokens, () => i++), y: readSvgNumber(tokens, () => i++) };
      if (relative) {
        p2.x += point.x; p2.y += point.y;
      }
      for (let s = 1; s <= 14; s++) current.push(quadraticPoint(point, p1, p2, s / 14));
      point = p2;
      lastQuadraticControl = p1;
      lastCubicControl = null;
    } else if (cmd === "A") {
      readSvgNumber(tokens, () => i++);
      readSvgNumber(tokens, () => i++);
      readSvgNumber(tokens, () => i++);
      readSvgNumber(tokens, () => i++);
      readSvgNumber(tokens, () => i++);
      const x = readSvgNumber(tokens, () => i++);
      const y = readSvgNumber(tokens, () => i++);
      const end = { x: relative ? point.x + x : x, y: relative ? point.y + y : y };
      for (let s = 1; s <= 8; s++) {
        current.push({
          x: point.x + ((end.x - point.x) * s / 8),
          y: point.y + ((end.y - point.y) * s / 8)
        });
      }
      point = end;
      lastCubicControl = null;
      lastQuadraticControl = null;
    } else if (cmd === "Z") {
      current.push(start);
      pushClosedSvgContour(contours, current, start);
      current = [];
      point = start;
      lastCubicControl = null;
      lastQuadraticControl = null;
    } else {
      i++;
    }
  }

  pushClosedSvgContour(contours, current, start);
  return contours;
}

function parseSvgPointList(value) {
  const numbers = String(value || "")
    .match(/[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/gi)
    ?.map(parseNumber) || [];
  const points = [];

  for (let i = 0; i + 1 < numbers.length; i += 2) {
    points.push({ x: numbers[i], y: numbers[i + 1] });
  }

  return points;
}

function approximateSvgEllipse(cx, cy, rx, ry) {
  const steps = 48;
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (Math.PI * 2 * i) / steps;
    points.push({
      x: cx + Math.cos(angle) * rx,
      y: cy + Math.sin(angle) * ry
    });
  }

  return points;
}

function sanitizeSvgContours(contours) {
  return (contours || [])
    .map(contour => cleanSvgContour(contour))
    .filter(contour => contour.length >= 3 && Math.abs(svgPolygonArea(contour)) > 4);
}

function cleanSvgContour(contour) {
  let points = (contour || [])
    .filter(point => Number.isFinite(point.x) && Number.isFinite(point.y))
    .map(point => ({ x: point.x, y: point.y }));

  points = removeRepeatedSvgPoints(points, 0.08);
  points = removeShortSvgSegments(points, 0.2);
  points = removeCollinearSvgPoints(points, 0.02);

  let tolerance = 0.38;
  points = simplifySvgClosedContour(points, tolerance);

  while (points.length > 520 && tolerance < 6) {
    tolerance *= 1.45;
    points = simplifySvgClosedContour(points, tolerance);
  }

  points = removeRepeatedSvgPoints(points, 0.08);
  points = removeShortSvgSegments(points, 0.2);
  points = removeCollinearSvgPoints(points, 0.02);

  if (hasSvgSelfIntersections(points)) {
    points = simplifySvgClosedContour(points, Math.max(1.1, tolerance * 1.8));
    points = removeRepeatedSvgPoints(points, 0.16);
    points = removeShortSvgSegments(points, 0.32);
    points = removeCollinearSvgPoints(points, 0.04);
  }

  return points;
}

function analyzeAccessoryStlQuality(text, rawContours, cleanContours) {
  const totalNodes = rawContours.reduce((total, contour) => total + contour.length, 0);
  const cleanedNodes = cleanContours.reduce((total, contour) => total + contour.length, 0);
  const openPaths = countOpenSvgPaths(text);
  const unsupportedCommands = countUnsupportedSvgCommands(text);
  const tinyContours = rawContours.filter(contour => {
    const box = getSvgContourBounds(contour);
    return Math.abs(svgPolygonArea(contour)) < 8 || box.width < 1.5 || box.height < 1.5;
  }).length;
  const intersections = cleanContours.filter(hasSvgSelfIntersections).length;
  const issues = [];

  if (openPaths > 0) issues.push("open paths");
  if (unsupportedCommands > 0) issues.push("simplified curves");
  if (totalNodes > 1800) issues.push("many nodes");
  if (rawContours.length > 80) issues.push("many islands");
  if (tinyContours > 8) issues.push("tiny details");
  if (intersections > 0) issues.push("intersections");
  if (cleanContours.length === 0 && rawContours.length > 0) issues.push("unsafe contours");

  if (cleanContours.length === 0) {
    return {
      level: "danger",
      message: "SVG visual only: this accessory is not safe enough for STL."
    };
  }

  if (issues.length > 0) {
    return {
      level: issues.includes("intersections") || issues.includes("unsafe contours") ? "danger" : "warning",
      message: `SVG Safe warning: ${issues.slice(0, 3).join(", ")}. STL will be simplified.`
    };
  }

  const reduction = totalNodes > 0 ? Math.round((1 - (cleanedNodes / totalNodes)) * 100) : 0;

  return {
    level: "safe",
    message: reduction > 15
      ? `Optimized for STL: simplified ${reduction}% of points.`
      : "Optimized for STL."
  };
}

function countOpenSvgPaths(text) {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  let count = 0;

  doc.querySelectorAll("path[d]").forEach(path => {
    const d = path.getAttribute("d") || "";
    if (!/[zZ]\s*$/.test(d.trim()) && !/[zZ](?=\s*[mM]|$)/.test(d)) count += 1;
  });

  return count;
}

function countUnsupportedSvgCommands(text) {
  const supported = new Set(["M", "L", "H", "V", "C", "S", "Q", "T", "A", "Z"]);
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  let count = 0;

  doc.querySelectorAll("path[d]").forEach(path => {
    const commands = (path.getAttribute("d") || "").match(/[a-zA-Z]/g) || [];
    count += commands.filter(command => !supported.has(command.toUpperCase())).length;
  });

  return count;
}

function removeRepeatedSvgPoints(points, distance) {
  const result = [];

  points.forEach(point => {
    if (!result.length || svgDistance(result[result.length - 1], point) > distance) {
      result.push(point);
    }
  });

  if (result.length > 1 && svgDistance(result[0], result[result.length - 1]) <= distance) {
    result.pop();
  }

  return result;
}

function removeShortSvgSegments(points, distance) {
  const result = [];

  points.forEach(point => {
    if (!result.length || svgDistance(result[result.length - 1], point) >= distance) {
      result.push(point);
    }
  });

  if (result.length > 2 && svgDistance(result[0], result[result.length - 1]) < distance) {
    result.pop();
  }

  return result;
}

function removeCollinearSvgPoints(points, tolerance) {
  if (points.length < 4) return points;
  const result = [];

  points.forEach((point, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const area = Math.abs(((point.x - previous.x) * (next.y - previous.y)) - ((point.y - previous.y) * (next.x - previous.x)));
    if (area > tolerance) result.push(point);
  });

  return result.length >= 3 ? result : points;
}

function simplifySvgClosedContour(points, tolerance) {
  if (points.length <= 12) return points;
  const open = [...points, points[0]];
  const simplified = simplifySvgPolyline(open, tolerance);

  if (simplified.length > 1 && svgDistance(simplified[0], simplified[simplified.length - 1]) < 0.1) {
    simplified.pop();
  }

  return simplified.length >= 3 ? simplified : points;
}

function simplifySvgPolyline(points, tolerance) {
  if (points.length < 3) return [...points];

  let maxDistance = 0;
  let index = -1;

  for (let i = 1; i < points.length - 1; i++) {
    const distance = svgPerpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }

  if (maxDistance <= tolerance || index < 0) {
    return [points[0], points[points.length - 1]];
  }

  const left = simplifySvgPolyline(points.slice(0, index + 1), tolerance);
  const right = simplifySvgPolyline(points.slice(index), tolerance);
  left.pop();
  return left.concat(right);
}

function svgPerpendicularDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  if (length < 0.0001) return svgDistance(point, start);

  return Math.abs((dy * point.x) - (dx * point.y) + (end.x * start.y) - (end.y * start.x)) / length;
}

function hasSvgSelfIntersections(points) {
  if (!points || points.length < 4) return false;

  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];

    for (let j = i + 1; j < points.length; j++) {
      if (Math.abs(i - j) <= 1) continue;
      if (i === 0 && j === points.length - 1) continue;

      const c = points[j];
      const d = points[(j + 1) % points.length];
      if (svgSegmentsIntersect(a, b, c, d)) return true;
    }
  }

  return false;
}

function svgSegmentsIntersect(a, b, c, d) {
  const o1 = svgOrientation(a, b, c);
  const o2 = svgOrientation(a, b, d);
  const o3 = svgOrientation(c, d, a);
  const o4 = svgOrientation(c, d, b);

  if (o1 * o2 < 0 && o3 * o4 < 0) return true;
  return false;
}

function svgOrientation(a, b, c) {
  return ((b.x - a.x) * (c.y - a.y)) - ((b.y - a.y) * (c.x - a.x));
}

function svgPolygonArea(points) {
  let area = 0;

  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    area += (a.x * b.y) - (b.x * a.y);
  }

  return area / 2;
}

function getSvgContourBounds(points) {
  const xs = points.map(point => point.x);
  const ys = points.map(point => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return { width: maxX - minX, height: maxY - minY };
}

function svgDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pushClosedSvgContour(contours, current, start) {
  if (current.length <= 2) return;

  const last = current[current.length - 1];
  if (!sameSvgPoint(last, start)) return;

  contours.push(current);
}

function sameSvgPoint(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) < 0.5;
}

function tokenizeSvgPath(d) {
  return d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/gi) || [];
}

function isSvgCommand(token) {
  return /^[a-zA-Z]$/.test(token);
}

function readSvgNumber(tokens, advance) {
  const value = parseNumber(tokens[advance()]);
  return Number.isFinite(value) ? value : 0;
}

function bezierPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: (u * u * u * p0.x) + (3 * u * u * t * p1.x) + (3 * u * t * t * p2.x) + (t * t * t * p3.x),
    y: (u * u * u * p0.y) + (3 * u * u * t * p1.y) + (3 * u * t * t * p2.y) + (t * t * t * p3.y)
  };
}

function quadraticPoint(p0, p1, p2, t) {
  const u = 1 - t;
  return {
    x: (u * u * p0.x) + (2 * u * t * p1.x) + (t * t * p2.x),
    y: (u * u * p0.y) + (2 * u * t * p1.y) + (t * t * p2.y)
  };
}

function parseNumber(value) {
  const parsed = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

mobileEditorOpen?.addEventListener("click", openMobileWorkspace);
syncMobileLayout();
setPieceColor(pieceColor, false);
setAccessoryColor(accessoryColor, false);
updatePreview();
updateZoom();
["pointerdown", "keydown", "wheel"].forEach(type => {
  document.addEventListener(type, markInitialPreviewInteraction, { once: true, capture: true });
});
queueInitialPreviewCentering();
syncLineLabels();
syncSpacingLabel();
syncAccessoryStatus();
syncPlacedNameStatus();
showEmailVerificationResult();
showPasswordResetForm();
initCookieConsent();
refreshAuth();
setupStaticQuickAccessories();
loadFonts();
loadAccessoryCatalog();
loadCommunityPreview();

function showEmailVerificationResult() {
  const params = new URLSearchParams(window.location.search);
  const result = params.get("emailVerified");
  if (result === null) return;

  if (result === "1") {
    openAuthModal("login");
    showAuthMessage("Account verified. You can now use MakerNames.", "success");
  } else {
    openAuthModal("login");
    showAuthMessage(params.get("message") || "We could not verify this account.");
  }

  const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
  window.history.replaceState({}, document.title, cleanUrl);
}

function showPasswordResetForm() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("resetPassword");
  if (!token) return;

  passwordResetToken = token;
  openAuthModal("reset");
  showAuthMessage("Choose a new password for your account.", "success");

  const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
  window.history.replaceState({}, document.title, cleanUrl);
}

async function loadFonts(preferredFont = "") {
  try {
    const selectedFont = preferredFont || fontSelect.value;
    await loadCustomFonts();

    const response = await fetch("/api/Generate/fonts", { cache: "no-store" });
    if (!response.ok) return;

    const fonts = await response.json();
    const preferred = ["Something", "Things Valentine", "Artland Clean", "Battleground", "Black Arcade", "Blank River", "Macabro", "Takota", "Baby Valentina", "Admire Gustavo", "Brittany Signature", "Waltograph", "Arial", "Arial Black", "Impact", "Georgia", "Verdana", "Comic Sans MS", "Segoe UI"];
    const ordered = [
      ...preferred.filter(font => fonts.includes(font)),
      ...fonts.filter(font => !preferred.includes(font))
    ];

    fontSelect.innerHTML = "";

    ordered.forEach(font => {
      const option = document.createElement("option");
      option.value = font;
      option.textContent = uploadedFontNames.has(font) ? `${font} - user import` : font;
      fontSelect.appendChild(option);
    });

    if (selectedFont && ordered.includes(selectedFont)) {
      fontSelect.value = selectedFont;
    } else if (ordered.includes("Waltograph")) {
      fontSelect.value = "Waltograph";
    } else if (ordered.includes("Something")) {
      fontSelect.value = "Something";
    } else if (ordered.includes("Artland Clean")) {
      fontSelect.value = "Artland Clean";
    } else if (ordered.includes("Baby Valentina")) {
      fontSelect.value = "Baby Valentina";
    } else if (ordered.includes("Impact")) {
      fontSelect.value = "Impact";
    }

    syncImportedFontNotice();
    updatePreview();
  } catch {
    // Keep the bundled fallback choices.
  }
}

async function loadCustomFonts() {
  if (!("FontFace" in window) || !document.fonts) {
    uploadedFontNames = new Set();
    return;
  }

  const response = await fetch("/api/Generate/font-catalog", { cache: "no-store" });
  if (!response.ok) {
    uploadedFontNames = new Set();
    return;
  }

  const fonts = await response.json();
  uploadedFontNames = new Set(fonts.filter(font => font?.imported).map(font => font.name));

  await Promise.all(fonts.map(async font => {
    if (!font?.name || !font?.file) return;

    try {
      const face = new FontFace(font.name, `url("/fonts/${encodeURIComponent(font.file)}")`);
      const loaded = await face.load();
      document.fonts.add(loaded);
    } catch {
      // Keep the rest of the font catalog available if one file cannot load.
    }
  }));
}

function syncImportedFontNotice() {
  if (!importedFontNotice) return;

  importedFontNotice.hidden = !uploadedFontNames.has(fontSelect.value);
}

function setFontImportStatus(message = fontImportLegalText) {
  if (!fontImportStatus) return;

  if (message === fontImportLegalText) {
    fontImportStatus.innerHTML = `User-imported fonts are shared with everyone. Upload only fonts you have permission to share; <span class="notranslate" translate="no">MakerNames</span> does not verify ownership or third-party font licences.`;
    return;
  }

  fontImportStatus.textContent = message;
}

async function uploadFontFile(file) {
  if (!/\.(ttf|otf)$/i.test(file.name || "")) {
    setFontImportStatus("Only .ttf and .otf font files can be imported.");
    return;
  }

  const confirmed = window.confirm("Imported fonts are shared with every MakerNames user. Upload only fonts you have permission to share. MakerNames does not verify ownership or third-party font licences. Continue?");
  if (!confirmed) {
    setFontImportStatus();
    return;
  }

  const form = new FormData();
  form.append("file", file);

  try {
    fontImportButton.disabled = true;
    setFontImportStatus("Uploading font...");

    const response = await fetch("/api/Generate/font-upload", {
      method: "POST",
      body: form,
      credentials: "same-origin"
    });

    if (!response.ok) {
      const message = await readApiMessage(response, "Could not import that font.");
      throw new Error(message);
    }

    const font = await response.json();
    await loadFonts(font?.name || "");
    setFontImportStatus(`${font?.name || "Font"} imported. It is now available in the shared font list.`);
  } catch (error) {
    setFontImportStatus(error?.message || "Could not import that font.");
  } finally {
    fontImportButton.disabled = false;
  }
}
