// KisanSetu Center Staff Console (Screen 12 & Screen 13, F11)
// Gate Entry Scanner, Weighbridge Scale Capture, Optical Grading Review & Override, Payment Authorization

const StaffConsoleComponent = {
  activeMandiId: "CTR-JPR-01",
  searchTokenQuery: "",
  gradingModalTokenId: null,

  render() {
    const t = window.I18N.t;
    const centers = window.State.centers;
    const currentCenter = centers.find(c => c.id === this.activeMandiId) || centers[0];
    
    // Filter tokens for this center & search
    const tokens = window.State.tokens.filter(t => {
      const matchCenter = t.centerId === this.activeMandiId;
      const matchQuery = !this.searchTokenQuery || 
        t.id.toLowerCase().includes(this.searchTokenQuery.toLowerCase()) ||
        t.farmerName.toLowerCase().includes(this.searchTokenQuery.toLowerCase()) ||
        (t.farmerPhone && t.farmerPhone.includes(this.searchTokenQuery));
      return matchCenter && matchQuery;
    });

    return `
      <div class="space-y-6">
        <!-- Top Staff Header -->
        <div class="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <i class="fa-solid fa-scale-balanced"></i>
              <span>${t('staffTitle')}</span>
            </div>
            <h2 class="text-2xl font-black mt-1 text-white">${currentCenter.name}</h2>
            <p class="text-blue-200 text-xs mt-0.5">${t('operatorLabel')}</p>
          </div>

          <!-- Switch Center Dropdown -->
          <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <span class="text-xs text-blue-200 font-bold pl-2">${t('activeMandi')}</span>
            <select 
              onchange="StaffConsoleComponent.setMandi(this.value)" 
              class="bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl border border-white/20 focus:outline-none">
              ${centers.map(c => `<option value="${c.id}" ${c.id === this.activeMandiId ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Rapid Actions & Queue Management -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-base">${t('queueManagement')}</h3>
              <p class="text-xs text-slate-500">${t('queueManagementSub')}</p>
            </div>

            <!-- Search Token Box -->
            <div class="relative w-full sm:w-80">
              <i class="fa-solid fa-barcode absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base"></i>
              <input 
                type="text" 
                placeholder="${t('searchTokenPlaceholder')}" 
                value="${this.searchTokenQuery}"
                oninput="StaffConsoleComponent.setSearch(this.value)"
                class="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium" />
            </div>
          </div>

          <!-- Token Queue Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th class="py-3 px-4">Token ID & Channel</th>
                  <th class="py-3 px-4">${t('thFarmerDetails')}</th>
                  <th class="py-3 px-4">${t('thProduceWeight')}</th>
                  <th class="py-3 px-4">Current Stage</th>
                  <th class="py-3 px-4">${t('cropQuality')}</th>
                  <th class="py-3 px-4 text-right">Quick Next Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${tokens.map(token => {
                  const isPaid = token.status === "PAID";
                  const isWeighing = token.status === "WEIGHING";
                  const isGraded = token.status === "GRADED";
                  
                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="py-3.5 px-4">
                        <div class="font-mono-code font-bold text-slate-900 text-sm">${token.id}</div>
                        <span class="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          token.bookedVia === 'DEALER' ? 'bg-amber-100 text-amber-900' :
                          token.bookedVia === 'IVR' ? 'bg-purple-100 text-purple-900' :
                          token.bookedVia === 'SMS' ? 'bg-sky-100 text-sky-900' :
                          'bg-emerald-100 text-emerald-900'
                        }">
                          ${token.bookedVia}
                        </span>
                      </td>

                      <td class="py-3.5 px-4">
                        <div class="font-bold text-slate-900">${token.farmerName}</div>
                        <div class="text-[11px] text-slate-500">${token.village} • ${token.farmerPhone || 'No Phone'}</div>
                      </td>

                      <td class="py-3.5 px-4">
                        <div class="font-bold text-slate-800">${token.produce}</div>
                        <div class="text-[11px] text-slate-500">
                          ${token.actualWeighedKg ? `<strong>${token.actualWeighedKg} kg</strong> (Weighed)` : `~${token.estimatedQuantityKg} kg (Est)`}
                        </div>
                      </td>

                      <td class="py-3.5 px-4">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          token.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                          token.status === 'GRADED' ? 'bg-indigo-100 text-indigo-800' :
                          token.status === 'WEIGHING' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          'bg-slate-100 text-slate-700'
                        }">
                          ${token.status}
                        </span>
                      </td>

                      <td class="py-3.5 px-4">
                        ${token.finalGrade || token.suggestedGrade ? `
                          <div class="flex items-center space-x-1.5">
                            <span class="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                              ${token.finalGrade || token.suggestedGrade}
                            </span>
                            <span class="text-[10px] text-slate-400">
                              ${token.overrideReason ? '(Staff Mod)' : '(Scanner)'}
                            </span>
                          </div>
                        ` : `<span class="text-slate-400 italic text-[11px]">Pending</span>`}
                      </td>

                      <td class="py-3.5 px-4 text-right">
                        ${this.renderActionButton(token)}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        ${this.renderGradingModal()}
      </div>
    `;
  },

  renderActionButton(token) {
    const t = window.I18N.t;

    switch(token.status) {
      case "BOOKED":
        return `
          <button onclick="StaffConsoleComponent.advanceToken('${token.id}', 'ARRIVED')" class="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow-sm">
            <i class="fa-solid fa-truck-ramp-box mr-1"></i> ${t('btnGateEntry')}
          </button>
        `;
      case "ARRIVED":
        return `
          <button onclick="StaffConsoleComponent.advanceToken('${token.id}', 'IN_QUEUE')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm">
            <i class="fa-solid fa-people-line mr-1"></i> ${t('btnMoveQueue')}
          </button>
        `;
      case "IN_QUEUE":
        return `
          <button onclick="StaffConsoleComponent.openGradingModal('${token.id}')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-sm">
            <i class="fa-solid fa-scale-balanced mr-1"></i> ${t('btnStartWeighing')}
          </button>
        `;
      case "WEIGHING":
        return `
          <button onclick="StaffConsoleComponent.openGradingModal('${token.id}')" class="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs shadow-sm">
            <i class="fa-solid fa-camera mr-1"></i> ${t('btnCvGrading')}
          </button>
        `;
      case "GRADED":
        return `
          <button onclick="StaffConsoleComponent.advanceToken('${token.id}', 'PAID')" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm">
            <i class="fa-solid fa-money-bill-transfer mr-1"></i> ${t('btnPassPayment')}
          </button>
        `;
      case "PAID":
        return `
          <span class="text-xs text-emerald-800 font-bold flex items-center justify-end">
            <i class="fa-solid fa-circle-check mr-1 text-emerald-600"></i> ${t('paymentComplete')}
          </span>
        `;
      default:
        return '-';
    }
  },

  renderGradingModal() {
    if (!this.gradingModalTokenId) return '';
    const t = window.I18N.t;
    const token = window.State.tokens.find(t => t.id === this.gradingModalTokenId);
    if (!token) return '';

    return `
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between border-b pb-3">
            <div>
              <h3 class="font-bold text-slate-900 text-base">${t('modalWeighCvTitle')}</h3>
              <p class="text-xs text-slate-500">${token.id} • ${token.farmerName}</p>
            </div>
            <button onclick="StaffConsoleComponent.closeGradingModal()" class="text-slate-400 hover:text-slate-600">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">${t('actualWeighedKg')}</label>
              <input type="number" id="stf_weigh_val" value="${token.estimatedQuantityKg}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500" />
            </div>

            <!-- Optical Photo Pre-check / Live Trigger -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-800"><i class="fa-solid fa-microscope text-indigo-600 mr-1"></i> ${t('cvAnalysisTitle')}</span>
                <button onclick="StaffConsoleComponent.runCVScan('${token.produceCode}')" class="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-[11px] shadow-sm">
                  ${t('scanPhotoBtn')}
                </button>
              </div>

              <div id="stf_cv_result_box" class="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-slate-600">${t('aiSuggestedGrade')}</span>
                  <span class="font-bold text-sm text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg" id="stf_suggested_grade_display">Grade A (92% ${t('confidenceLabel')})</span>
                </div>
                <p class="text-[11px] text-slate-500">${t('gradeA_desc')}</p>
              </div>
            </div>

            <!-- Staff Override Option -->
            <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <label class="font-bold text-amber-900 block">${t('staffFinalDecision')}</label>
              <div class="flex space-x-3">
                <label class="flex items-center space-x-1 cursor-pointer font-bold text-slate-800">
                  <input type="radio" name="stf_grade_choice" value="A" checked /> <span>Grade A</span>
                </label>
                <label class="flex items-center space-x-1 cursor-pointer font-bold text-slate-800">
                  <input type="radio" name="stf_grade_choice" value="B" /> <span>Grade B</span>
                </label>
                <label class="flex items-center space-x-1 cursor-pointer font-bold text-slate-800">
                  <input type="radio" name="stf_grade_choice" value="C" /> <span>Grade C</span>
                </label>
              </div>
              <input 
                type="text" 
                id="stf_override_reason" 
                placeholder="${t('overrideReasonPlaceholder')}" 
                class="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-[11px] bg-white" />
            </div>

            <div class="flex space-x-2 pt-2">
              <button type="button" onclick="StaffConsoleComponent.closeGradingModal()" class="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50">
                ${t('cancelBtn')}
              </button>
              <button onclick="StaffConsoleComponent.confirmGradingAndAdvance()" class="w-2/3 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md">
                ${t('recordGradeWeightBtn')} &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  setMandi(centerId) {
    this.activeMandiId = centerId;
    window.App.render();
  },
  setSearch(query) {
    this.searchTokenQuery = query;
    window.App.render();
  },
  advanceToken(tokenId, nextStatus) {
    window.State.updateTokenStatus(tokenId, nextStatus, { staffId: "Staff Operator (Gate)" });
    const isEn = window.I18N && window.I18N.currentLang === 'en';
    window.App.showToast(isEn ? `Token ${tokenId} status updated: ${nextStatus}` : `टोकन ${tokenId} स्थिति अपडेट: ${nextStatus}`, "success");
    window.App.render();
  },
  openGradingModal(tokenId) {
    this.gradingModalTokenId = tokenId;
    window.App.render();
  },
  closeGradingModal() {
    this.gradingModalTokenId = null;
    window.App.render();
  },
  runCVScan(produceCode) {
    // Uses CV engine sample generator or live camera
    const sampleUri = window.CVEngine.generateSampleProduceImage(produceCode, "A");
    const img = new Image();
    img.src = sampleUri;
    img.onload = () => {
      window.CVEngine.analyzeImage(img, produceCode).then(res => {
        const box = document.getElementById("stf_cv_result_box");
        if (box) {
          box.innerHTML = `
            <div class="flex items-center justify-between">
              <span class="text-slate-600">${window.I18N.t('aiSuggestedGrade')}</span>
              <span class="font-bold text-sm text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">Grade ${res.suggestedGrade} (${res.confidence}% ${window.I18N.t('confidenceLabel')})</span>
            </div>
            <p class="text-[11px] text-slate-500">${res.reasons[0]}</p>
          `;
        }
      });
    };
  },
  confirmGradingAndAdvance() {
    const weightVal = document.getElementById("stf_weigh_val")?.value;
    const gradeChoice = document.querySelector('input[name="stf_grade_choice"]:checked')?.value || "A";
    const overrideReason = document.getElementById("stf_override_reason")?.value;
    const isEn = window.I18N && window.I18N.currentLang === 'en';

    window.State.updateTokenStatus(this.gradingModalTokenId, "GRADED", {
      staffId: "Weighbridge Operator (STF-902)",
      actualWeightKg: Number(weightVal),
      suggestedGrade: "A",
      finalGrade: gradeChoice,
      overrideReason: overrideReason || null
    });

    this.gradingModalTokenId = null;
    window.App.showToast(isEn ? `Weight ${weightVal} kg & Grade ${gradeChoice} recorded successfully!` : `वजन ${weightVal} किग्रा व ग्रेड ${gradeChoice} दर्ज किया गया!`, "success");
    window.App.render();
  }
};

window.StaffConsoleComponent = StaffConsoleComponent;

