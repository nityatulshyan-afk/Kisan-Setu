// KisanSetu Main Application Orchestrator & Router

class AppController {
  constructor() {
    this.currentRole = "FARMER"; // 'FARMER', 'DEALER', 'OFFICER', 'STAFF', 'PRICES', 'TELEPHONY'
    this.mobileFrameView = false; // Toggle smartphone simulator frame for Farmer App
    this.toasts = [];
    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener("kisansetu_state_updated", () => {
      this.render();
    });

    window.addEventListener("kisansetu_lang_changed", () => {
      this.render();
    });

    window.addEventListener("kisansetu_voice_response", (e) => {
      const { responseText, action } = e.detail;
      this.showToast(responseText, "info");
      if (action?.type === "OPEN_BOOKING_MODAL") {
        window.FarmerAppComponent.openBookingModal("CTR-JPR-01");
      }
      this.render();
    });
  }

  setRole(role) {
    this.currentRole = role;
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  setLanguage(lang) {
    window.I18N.setLanguage(lang);
    this.render();
  }

  toggleMobileFrame() {
    this.mobileFrameView = !this.mobileFrameView;
    this.render();
  }

  showToast(message, type = "info") {
    const id = Date.now();
    this.toasts.push({ id, message, type });
    this.renderToasts();
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this.renderToasts();
    }, 4500);
  }

  renderToasts() {
    const container = document.getElementById("toast-container");
    if (!container) return;

    container.innerHTML = this.toasts.map(toast => {
      const isSuccess = toast.type === "success";
      const isError = toast.type === "error";
      const bg = isSuccess ? "bg-emerald-800 text-white" : isError ? "bg-red-800 text-white" : "bg-slate-900 text-white";
      const icon = isSuccess ? "fa-circle-check text-emerald-300" : isError ? "fa-circle-exclamation text-red-300" : "fa-bell text-amber-300";

      return `
        <div class="${bg} px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center space-x-3 text-xs max-w-sm animate-in slide-in-from-top-4 duration-200">
          <i class="fa-solid ${icon} text-base"></i>
          <span class="font-medium">${toast.message}</span>
        </div>
      `;
    }).join('');
  }

  render() {
    const root = document.getElementById("app-root");
    if (!root) return;

    const t = window.I18N.t;
    const currentLang = window.I18N.currentLang;

    root.innerHTML = `
      <div class="min-h-screen flex flex-col">
        <!-- Top Main Navigation Bar -->
        <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between min-h-[64px] py-2 gap-3">
              <!-- Brand Logo -->
              <div class="flex items-center space-x-3 cursor-pointer shrink-0" onclick="App.setRole('FARMER')">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-green-600 flex items-center justify-center text-white shadow-md text-xl shrink-0">
                  🌾
                </div>
                <div class="flex flex-col justify-center">
                  <div class="flex items-center gap-2">
                    <span class="font-black text-slate-900 text-lg tracking-tight leading-tight">${t('appTitle')}</span>
                    <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase whitespace-nowrap leading-none tracking-wide">E-Procurement</span>
                  </div>
                  <p class="text-[10px] text-slate-500 font-medium hidden md:block whitespace-nowrap mt-0.5 leading-tight">${t('tagline')}</p>
                </div>
              </div>

              <!-- Center Role Navigation Tabs -->
              <nav class="hidden xl:flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-slate-600 shrink-0">
                <button onclick="App.setRole('FARMER')" class="px-3 py-1.5 rounded-xl transition whitespace-nowrap ${this.currentRole === 'FARMER' ? 'bg-white text-emerald-800 shadow-sm' : 'hover:text-slate-900'}">
                  <i class="fa-solid fa-wheat-awn mr-1 text-emerald-600"></i> ${t('roleFarmer')}
                </button>
                <button onclick="App.setRole('DEALER')" class="px-3 py-1.5 rounded-xl transition whitespace-nowrap ${this.currentRole === 'DEALER' ? 'bg-white text-amber-900 shadow-sm' : 'hover:text-slate-900'}">
                  <i class="fa-solid fa-handshake mr-1 text-amber-600"></i> ${t('roleDealer')}
                </button>
                <button onclick="App.setRole('OFFICER')" class="px-3 py-1.5 rounded-xl transition whitespace-nowrap ${this.currentRole === 'OFFICER' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}">
                  <i class="fa-solid fa-gauge-high mr-1 text-indigo-600"></i> ${t('roleOfficer')}
                </button>
                <button onclick="App.setRole('STAFF')" class="px-3 py-1.5 rounded-xl transition whitespace-nowrap ${this.currentRole === 'STAFF' ? 'bg-blue-900 shadow-sm' : 'hover:text-slate-900'}">
                  <i class="fa-solid fa-scale-balanced mr-1 text-blue-600"></i> ${t('roleStaff')}
                </button>
                <button onclick="App.setRole('PRICES')" class="px-3 py-1.5 rounded-xl transition whitespace-nowrap ${this.currentRole === 'PRICES' ? 'bg-teal-900 shadow-sm' : 'hover:text-slate-900'}">
                  <i class="fa-solid fa-tags mr-1 text-teal-600"></i> ${t('rolePrices')}
                </button>
                <button onclick="App.setRole('TELEPHONY')" class="px-3 py-1.5 rounded-xl transition whitespace-nowrap ${this.currentRole === 'TELEPHONY' ? 'bg-white text-amber-900 shadow-sm' : 'hover:text-slate-900'}">
                  <i class="fa-solid fa-phone mr-1 text-amber-600"></i> ${t('roleTelephony')}
                </button>
              </nav>

              <!-- Right Tools: Language Picker & Reset -->
              <div class="flex items-center space-x-2 shrink-0">
                <!-- Mobile Frame Toggle for Farmer App -->
                ${this.currentRole === 'FARMER' ? `
                  <button 
                    onclick="App.toggleMobileFrame()" 
                    title="Toggle Smartphone Frame"
                    class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap ${this.mobileFrameView ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}">
                    <i class="fa-solid fa-mobile-screen-button"></i>
                    <span class="text-[11px]">${this.mobileFrameView ? (currentLang === 'en' ? 'Mobile View' : 'मोबाइल व्यू') : (currentLang === 'en' ? 'Full Screen' : 'फुल स्क्रीन')}</span>
                  </button>
                ` : ''}

                <!-- Language Selector -->
                <div class="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500 shadow-2xs">
                  <i class="fa-solid fa-language text-emerald-600 text-sm mr-1.5 pointer-events-none"></i>
                  <select 
                    id="app-language-selector"
                    onchange="App.setLanguage(this.value)" 
                    class="bg-transparent border-0 text-slate-800 text-xs font-bold focus:outline-none cursor-pointer pr-1">
                    <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
                    <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                    <option value="raj" ${currentLang === 'raj' ? 'selected' : ''}>राजस्थानी (Marwari)</option>
                    <option value="pb" ${currentLang === 'pb' ? 'selected' : ''}>ਪੰਜਾਬੀ (Punjabi)</option>
                  </select>
                </div>

                <!-- Reset Seed Demo Data -->
                <button 
                  onclick="window.State.resetToDefaults(); App.showToast(window.I18N.currentLang === 'en' ? 'Demo data reset successfully.' : 'डेमो डेटा रीसेट किया गया।', 'info');" 
                  title="Reset Demo Data" 
                  class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                  <i class="fa-solid fa-arrows-rotate text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Sub-navbar for mobile and tablet screens below xl -->
            <div class="xl:hidden flex overflow-x-auto space-x-2 py-2 border-t border-slate-100 text-xs font-semibold scrollbar-none">
              <button onclick="App.setRole('FARMER')" class="px-3 py-1 rounded-xl whitespace-nowrap ${this.currentRole === 'FARMER' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'}">${t('roleFarmer')}</button>
              <button onclick="App.setRole('DEALER')" class="px-3 py-1 rounded-xl whitespace-nowrap ${this.currentRole === 'DEALER' ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-700'}">${t('roleDealer')}</button>
              <button onclick="App.setRole('OFFICER')" class="px-3 py-1 rounded-xl whitespace-nowrap ${this.currentRole === 'OFFICER' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}">${t('roleOfficer')}</button>
              <button onclick="App.setRole('STAFF')" class="px-3 py-1 rounded-xl whitespace-nowrap ${this.currentRole === 'STAFF' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'}">${t('roleStaff')}</button>
              <button onclick="App.setRole('PRICES')" class="px-3 py-1 rounded-xl whitespace-nowrap ${this.currentRole === 'PRICES' ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-700'}">${t('rolePrices')}</button>
              <button onclick="App.setRole('TELEPHONY')" class="px-3 py-1 rounded-xl whitespace-nowrap ${this.currentRole === 'TELEPHONY' ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-700'}">${t('roleTelephony')}</button>
            </div>
          </div>
        </header>

        <!-- Main Body Content Area -->
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          ${this.renderActiveRoleView()}
        </main>

        <!-- Modals and Overlays -->
        ${window.QualityModal.render()}

        <!-- Global Toast Alert Container -->
        <div id="toast-container" class="fixed top-20 right-4 z-50 space-y-2 pointer-events-none"></div>

        <!-- Hidden Container for Physical Print Receipt -->
        <div id="printable-receipt" class="hidden"></div>
      </div>
    `;

    this.renderToasts();
  }

  renderActiveRoleView() {
    if (this.currentRole === "FARMER") {
      if (this.mobileFrameView) {
        return `
          <div class="mobile-frame-container">
            <div class="mobile-device">
              <div class="mobile-notch"><div class="mobile-camera"></div></div>
              <div class="p-4 pt-8 overflow-y-auto flex-1 bg-slate-50">
                ${window.FarmerAppComponent.render()}
              </div>
            </div>
          </div>
        `;
      }
      return `
        <div class="max-w-2xl mx-auto">
          ${window.FarmerAppComponent.render()}
        </div>
      `;
    }

    if (this.currentRole === "DEALER") {
      return window.DealerPortalComponent.render();
    }

    if (this.currentRole === "OFFICER") {
      return window.OfficerDashboardComponent.render();
    }

    if (this.currentRole === "STAFF") {
      return window.StaffConsoleComponent.render();
    }

    if (this.currentRole === "PRICES") {
      return window.PriceDiscoveryComponent.render();
    }

    if (this.currentRole === "TELEPHONY") {
      return window.TelephonySimComponent.render();
    }

    return '';
  }
}

window.App = new AppController();

document.addEventListener("DOMContentLoaded", () => {
  window.App.render();
});
