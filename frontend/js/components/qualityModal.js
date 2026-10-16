// KisanSetu Produce Quality Pre-Check Modal (Screen 7, F14)
// Interactive Client-Side Computer Vision Scanner with Live Photo Upload / Demo Presets

const QualityModal = {
  isOpen: false,
  produceType: "WHEAT",
  isScanning: false,
  result: null,
  activeSampleImg: null,

  open(produce = "WHEAT") {
    this.produceType = produce;
    this.isOpen = true;
    this.result = null;
    this.activeSampleImg = window.CVEngine.generateSampleProduceImage(this.produceType, "A");
    window.App.render();
  },

  close() {
    this.isOpen = false;
    this.result = null;
    this.isScanning = false;
    window.App.render();
  },

  render() {
    if (!this.isOpen) return '';
    const t = window.I18N.t;

    return `
      <div class="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between border-b pb-3">
            <div>
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 class="font-bold text-slate-900 text-base">${t('qualityTitle')}</h3>
              </div>
              <p class="text-xs text-slate-500">${t('qualitySubtitle')}</p>
            </div>
            <button onclick="QualityModal.close()" class="text-slate-400 hover:text-slate-600 text-lg">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Sample Image Canvas & Scanning Overlay -->
          <div class="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center min-h-[220px]">
            <img 
              id="cv_modal_sample_img" 
              src="${this.result?.annotatedImageUri || this.activeSampleImg}" 
              alt="Produce Sample" 
              class="w-full h-56 object-cover" />

            ${this.isScanning ? `
              <div class="cv-scanner-laser"></div>
              <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                <div class="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-xs font-bold font-mono-code text-emerald-300">HSV & Contour Analysis In Progress...</span>
              </div>
            ` : ''}

            <!-- Produce Tag Overlay -->
            <div class="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10">
              ${t('produceType')}: ${t(this.produceType.toLowerCase()) || this.produceType}
            </div>
          </div>

          <!-- Camera & Sample Action Bar -->
          <div class="space-y-2">
            <span class="text-[11px] font-bold text-slate-600">${t('loadSampleOrUpload')}</span>
            <div class="grid grid-cols-4 gap-2">
              <button 
                onclick="QualityModal.loadPreset('A')" 
                class="py-2 px-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-900 transition">
                ${t('sampleGradeA')}
              </button>
              <button 
                onclick="QualityModal.loadPreset('B')" 
                class="py-2 px-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-center text-xs font-bold text-amber-900 transition">
                ${t('sampleGradeB')}
              </button>
              <button 
                onclick="QualityModal.loadPreset('C')" 
                class="py-2 px-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-center text-xs font-bold text-red-900 transition">
                ${t('sampleGradeC')}
              </button>
              
              <!-- File Input trigger -->
              <label class="py-2 px-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-700 cursor-pointer flex items-center justify-center space-x-1">
                <i class="fa-solid fa-camera text-slate-500"></i>
                <span>${t('uploadBtn')}</span>
                <input type="file" accept="image/*" class="hidden" onchange="QualityModal.handleFileUpload(event)" />
              </label>
            </div>
          </div>

          <!-- Diagnostic Results Card -->
          ${this.result ? `
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 animate-in fade-in duration-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2.5">
                  <div class="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-lg font-black shadow-md">
                    ${this.result.suggestedGrade}
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">${t('suggestedGrade')}: Grade ${this.result.suggestedGrade}</h4>
                    <span class="text-[11px] text-slate-500">${this.result.confidence}% ${t('confidence')}</span>
                  </div>
                </div>

                <span class="text-[11px] font-mono-code font-bold px-2.5 py-1 rounded-full ${
                  this.result.suggestedGrade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                  this.result.suggestedGrade === 'B' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }">
                  Score: ${this.result.compositeScore}/100
                </span>
              </div>

              <!-- 3-Metric Score Breakdown -->
              <div class="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div class="bg-white p-2 rounded-xl border border-slate-200">
                  <span class="text-slate-400 block uppercase font-bold">${t('colorLuster')}</span>
                  <span class="font-black text-xs text-slate-800">${this.result.colorScore}%</span>
                </div>
                <div class="bg-white p-2 rounded-xl border border-slate-200">
                  <span class="text-slate-400 block uppercase font-bold">${t('purityLevel')}</span>
                  <span class="font-black text-xs text-slate-800">${this.result.impurityScore}%</span>
                </div>
                <div class="bg-white p-2 rounded-xl border border-slate-200">
                  <span class="text-slate-400 block uppercase font-bold">${t('grainUniformity')}</span>
                  <span class="font-black text-xs text-slate-800">${this.result.uniformityScore}%</span>
                </div>
              </div>

              <!-- Explainable Findings -->
              <div class="text-[11px] text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                <strong class="font-bold text-slate-800 block">${t('cvDiagnosticFindings')}</strong>
                <ul class="list-disc pl-4 space-y-0.5 text-slate-600">
                  ${this.result.reasons.map(r => `<li>${r}</li>`).join('')}
                </ul>
              </div>
            </div>
          ` : ''}

          <!-- Footer Buttons -->
          <div class="flex space-x-2 pt-2">
            <button onclick="QualityModal.close()" class="w-1/3 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50">
              ${t('closeBtn')}
            </button>
            <button onclick="QualityModal.proceedToBook()" class="w-2/3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 font-bold text-xs text-white shadow-md">
              ${t('proceedBookWithGrade')} &rarr;
            </button>
          </div>
        </div>
      </div>
    `;
  },

  loadPreset(grade) {
    this.isScanning = true;
    this.result = null;
    this.activeSampleImg = window.CVEngine.generateSampleProduceImage(this.produceType, grade);
    window.App.render();

    setTimeout(() => {
      this.analyzeCurrent();
    }, 450);
  },

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.activeSampleImg = e.target.result;
      this.isScanning = true;
      this.result = null;
      window.App.render();

      setTimeout(() => {
        this.analyzeCurrent();
      }, 500);
    };
    reader.readAsDataURL(file);
  },

  analyzeCurrent() {
    const img = new Image();
    img.src = this.activeSampleImg;
    img.onload = () => {
      window.CVEngine.analyzeImage(img, this.produceType).then(res => {
        this.isScanning = false;
        this.result = res;
        window.App.render();
      });
    };
  },

  proceedToBook() {
    this.close();
    FarmerAppComponent.showTab('CENTERS');
    const isEn = window.I18N && window.I18N.currentLang === 'en';
    window.App.showToast(isEn ? `Quality Grade ${this.result?.suggestedGrade || 'A'} saved. Please book token slot.` : `गुणवत्ता ग्रेड ${this.result?.suggestedGrade || 'A'} सुरक्षित हो गया। कृपया टोकन बुक करें।`, "success");
  }
};

window.QualityModal = QualityModal;

