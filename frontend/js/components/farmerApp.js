// KisanSetu Farmer Portal & Mobile Application View (Screens 1, 2, 3, 4, 7)
// Persona 1 (Ramesh) & Persona 2 (Sita) UI with Smart Center Allocation & Produce Tracking

const FarmerAppComponent = {
  activeTab: "CENTERS", // 'CENTERS' or 'TRACKER'
  selectedProduce: "WHEAT",
  sortCriteria: "BEST_OVERALL", // 'BEST_OVERALL', 'LEAST_WAIT', 'BEST_PRICE', 'NEAREST'
  bookingModalOpen: false,
  targetCenterId: null,

  render() {
    const t = window.I18N.t;
    const activeToken = window.State.tokens.find(t => t.id === window.State.activeFarmerTokenId) || window.State.tokens[0];

    return `
      <div class="space-y-5">
        <!-- Farmer Greeting & Quick Navigation Bar -->
        <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 rounded-3xl p-5 text-white shadow-xl flex items-center justify-between">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="text-xl">🌾</span>
              <h2 class="text-lg font-bold tracking-tight">${t('greeting')}</h2>
            </div>
            <p class="text-xs text-emerald-200">Ramesh Meena • Chaksu, Jaipur (9829012345)</p>
          </div>

          <!-- Tab Switcher -->
          <div class="flex bg-black/20 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs font-semibold">
            <button 
              onclick="FarmerAppComponent.showTab('CENTERS')" 
              class="px-3.5 py-1.5 rounded-xl transition ${this.activeTab === 'CENTERS' ? 'bg-white text-emerald-900 shadow-md font-bold' : 'text-emerald-100 hover:text-white'}">
              <i class="fa-solid fa-store mr-1"></i> ${t('availableMandis')}
            </button>
            <button 
              onclick="FarmerAppComponent.showTab('TRACKER')" 
              class="px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1 ${this.activeTab === 'TRACKER' ? 'bg-white text-emerald-900 shadow-md font-bold' : 'text-emerald-100 hover:text-white'}">
              <i class="fa-solid fa-route mr-1"></i> ${t('liveProduceTracking')}
              ${activeToken ? `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>` : ''}
            </button>
          </div>
        </div>

        ${this.activeTab === 'CENTERS' ? this.renderCentersView() : this.renderTrackerView()}
        ${this.renderBookingModal()}
      </div>
    `;
  },

  renderCentersView() {
    const t = window.I18N.t;
    const rankedCenters = window.State.getRankedCenters(this.selectedProduce, this.sortCriteria);

    return `
      <div class="space-y-4">
        <!-- Produce Selector Bar -->
        <div class="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">${t('produceType')}</span>
            <button onclick="FarmerAppComponent.openVoiceModal()" class="text-xs text-emerald-700 font-bold flex items-center space-x-1 hover:underline">
              <i class="fa-solid fa-microphone text-emerald-600"></i>
              <span>${t('voiceSpeak')}</span>
            </button>
          </div>

          <div class="grid grid-cols-5 gap-2 text-center">
            ${[
              { code: "WHEAT", name: t('wheat').split(' ')[0], icon: "🌾" },
              { code: "MUSTARD", name: t('mustard').split(' ')[0], icon: "🌱" },
              { code: "SOYBEAN", name: t('soybean').split(' ')[0], icon: "🫘" },
              { code: "GRAM", name: t('gram').split(' ')[0], icon: "🫘" },
              { code: "BAJRA", name: t('bajra').split(' ')[0], icon: "🌾" }
            ].map(p => `
              <button onclick="FarmerAppComponent.setProduce('${p.code}')" class="py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition ${this.selectedProduce === p.code ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}">
                <span class="text-base">${p.icon}</span>
                <span class="text-[11px] mt-0.5">${p.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Center Sorting Pills -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-500"><i class="fa-solid fa-arrow-down-short-wide text-emerald-600 mr-1"></i> ${t('filterBestOverall')}</span>
          <div class="flex space-x-1 text-[10px] font-semibold">
            <button onclick="FarmerAppComponent.setSort('BEST_OVERALL')" class="px-2.5 py-1 rounded-lg ${this.sortCriteria === 'BEST_OVERALL' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}">${t('filterBestOverall')}</button>
            <button onclick="FarmerAppComponent.setSort('LEAST_WAIT')" class="px-2.5 py-1 rounded-lg ${this.sortCriteria === 'LEAST_WAIT' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}">${t('filterLeastWait')}</button>
            <button onclick="FarmerAppComponent.setSort('BEST_PRICE')" class="px-2.5 py-1 rounded-lg ${this.sortCriteria === 'BEST_PRICE' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}">${t('filterBestPrice')}</button>
          </div>
        </div>
      </div>

      <!-- Quick Quality Pre-Check Banner -->
      <div onclick="window.QualityModal.open('${this.selectedProduce}')" class="cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between hover:shadow-lg transition">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
            <i class="fa-solid fa-camera"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold">${t('preCheckQuality')}</h4>
            <p class="text-[11px] text-amber-100">${t('checkQualityDesc')}</p>
          </div>
        </div>
        <span class="text-xs bg-white text-amber-800 px-3 py-1 rounded-xl font-bold shadow-sm">${t('checkBtn')} &rarr;</span>
      </div>

      <!-- Ranked Center Cards List -->
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>${t('availableMandis')} (${rankedCenters.length})</span>
          <span class="text-[11px] text-emerald-700"><i class="fa-solid fa-rotate text-[10px]"></i> ${t('liveAiUpdate')}</span>
        </div>

        ${rankedCenters.map((center, index) => {
          const isTop = index === 0 && !center.isThrottled;
          const waitMinutes = center.predictedWaitMin;
          const waitColor = waitMinutes < 25 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : waitMinutes < 50 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-red-700 bg-red-50 border-red-200';
          const capacityColor = center.capacityPct < 60 ? 'bg-emerald-500' : center.capacityPct < 85 ? 'bg-amber-500' : 'bg-red-500';

          return `
            <div class="bg-white rounded-2xl p-4 shadow-sm border ${isTop ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'} relative transition hover:shadow-md">
              ${isTop ? `
                <div class="absolute -top-2.5 right-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                  <i class="fa-solid fa-crown text-amber-300 text-[9px]"></i>
                  <span>${t('topRecommendation')}</span>
                </div>
              ` : ''}

              ${center.isThrottled ? `
                <div class="absolute -top-2.5 right-4 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  ${t('mandiFullThrottled')}
                </div>
              ` : ''}

              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                    <span>${center.name}</span>
                  </h3>
                  <p class="text-[11px] text-slate-500 mt-0.5">
                    <i class="fa-solid fa-location-dot text-slate-400 mr-1"></i> ${center.location} • <strong class="text-slate-700">${center.distanceKm} ${t('distanceUnit')}</strong>
                  </p>
                </div>
              </div>

              <!-- Metrics Row: Wait Time, Mandi Price, Capacity -->
              <div class="grid grid-cols-3 gap-2 my-3 text-center">
                <div class="p-2 rounded-xl border ${waitColor}">
                  <span class="text-[10px] uppercase font-bold block opacity-75">${t('predictedWait')}</span>
                  <span class="text-sm font-black">~${waitMinutes} ${t('min')}</span>
                </div>

                <div class="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800">
                  <span class="text-[10px] uppercase font-bold text-slate-500 block">${t('mandiPrice')}</span>
                  <span class="text-sm font-black text-emerald-800">₹${center.currentMandiRate}</span>
                </div>

                <div class="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800">
                  <div class="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                    <span>${t('capacity')}</span>
                    <span>${center.capacityPct}%</span>
                  </div>
                  <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div class="${capacityColor} h-full rounded-full" style="width: ${Math.min(100, center.capacityPct)}%"></div>
                  </div>
                  <span class="text-[9px] text-slate-400 block mt-0.5">${center.currentQueue} ${t('farmersCount')}</span>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="flex items-center justify-between pt-1">
                <div class="text-[11px] text-slate-500">
                  <i class="fa-regular fa-clock mr-1"></i> ${center.operatingHours}
                </div>

                ${center.isThrottled ? `
                  <button disabled class="px-4 py-2 bg-slate-200 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed">
                    ${t('mandiClosed')}
                  </button>
                ` : `
                  <button 
                    onclick="FarmerAppComponent.openBookingModal('${center.id}')" 
                    class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 flex items-center space-x-1.5">
                    <i class="fa-solid fa-ticket"></i>
                    <span>${t('bookToken')}</span>
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderTrackerView() {
    const t = window.I18N.t;
    const token = window.State.tokens.find(t => t.id === window.State.activeFarmerTokenId) || window.State.tokens[0];

    if (!token) {
      return `
        <div class="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-4">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <h3 class="font-bold text-slate-800 text-base">${t('noActiveToken')}</h3>
          <button onclick="FarmerAppComponent.showTab('CENTERS')" class="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-xs">
            ${t('availableMandis')} &rarr;
          </button>
        </div>
      `;
    }

    const center = window.State.centers.find(c => c.id === token.centerId) || { name: token.centerId, location: "Rajasthan" };
    
    // Status Progression Stages
    const stages = [
      { key: "BOOKED", label: t('statusBooked'), icon: "fa-calendar-check" },
      { key: "ARRIVED", label: t('statusArrived'), icon: "fa-truck-ramp-box" },
      { key: "IN_QUEUE", label: t('statusInQueue'), icon: "fa-people-line" },
      { key: "WEIGHING", label: t('statusWeighing'), icon: "fa-scale-balanced" },
      { key: "GRADED", label: t('statusGraded'), icon: "fa-award" },
      { key: "PAID", label: t('statusPaid'), icon: "fa-money-bill-transfer" }
    ];

    const currentStageIndex = stages.findIndex(s => s.key === token.status);

    return `
      <div class="space-y-4">
        <!-- Token Summary Card -->
        <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div class="flex items-start justify-between border-b pb-4">
            <div>
              <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                ${token.id} • ${token.bookedVia}
              </span>
              <h3 class="font-black text-slate-900 text-lg mt-1">${token.farmerName}</h3>
              <p class="text-xs text-slate-500">${token.produce} • ~${(token.estimatedQuantityKg / 100).toFixed(0)} ${t('qtl')}</p>
            </div>

            <div class="text-right">
              <span class="text-[10px] text-slate-400 block">${t('arrivalWindow')}</span>
              <span class="text-xs font-bold text-slate-800">${token.arrivalWindow}</span>
              <p class="text-[11px] text-emerald-700 font-bold mt-0.5">${center.name}</p>
            </div>
          </div>

          <!-- Visual Step-by-Step Progress Timeline -->
          <div class="py-2">
            <div class="flex items-center justify-between relative">
              <!-- Connecting Line Background -->
              <div class="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0"></div>
              <div class="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500" style="width: ${(currentStageIndex / (stages.length - 1)) * 90}%"></div>

              ${stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const bg = isCurrent ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110' : isPassed ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-400';

                return `
                  <div class="relative z-10 flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full ${bg} flex items-center justify-center text-xs font-bold transition shadow-xs">
                      <i class="fa-solid ${stage.icon}"></i>
                    </div>
                    <span class="text-[9px] font-bold mt-1.5 ${isCurrent ? 'text-emerald-800' : 'text-slate-500'} whitespace-nowrap text-center max-w-[60px] truncate">
                      ${stage.label}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Quality & Weighment Verified Details -->
          ${token.suggestedGrade ? `
            <div class="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 flex items-center justify-between text-xs">
              <div class="flex items-center space-x-2.5">
                <div class="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                  ${token.finalGrade || token.suggestedGrade}
                </div>
                <div>
                  <strong class="text-emerald-950 font-bold block">${t('cropQuality')} Grade ${token.finalGrade || token.suggestedGrade}</strong>
                  <span class="text-[11px] text-emerald-800">${t('verifiedByCv')} ${token.overrideReason ? `• ${t('staffModified')} "${token.overrideReason}"` : ''}</span>
                </div>
              </div>
              <span class="text-xs font-mono-code font-bold text-emerald-900 bg-white px-2 py-1 rounded-lg border border-emerald-300">
                ₹${token.rateAppliedPerQtl} ${t('perQtl')}
              </span>
            </div>
          ` : ''}

          <!-- Estimated Total Payable Amount (if graded or paid) -->
          ${token.totalPayoutRupees ? `
            <div class="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">${t('totalPayout')}</span>
                <div class="text-xl font-black text-white">₹${token.totalPayoutRupees.toLocaleString('en-IN')}</div>
              </div>
              <span class="text-xs bg-emerald-500/30 text-emerald-200 font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                ${token.status === 'PAID' ? '✓ ' + t('statusPaid') : t('statusGraded')}
              </span>
            </div>
          ` : ''}

          <!-- Audit Timeline Log -->
          <div class="space-y-2 pt-2 border-t text-xs">
            <strong class="text-slate-700 font-bold text-[11px] block uppercase tracking-wider">${t('thHistory')}</strong>
            <div class="space-y-1.5">
              ${token.stateHistory.map(h => `
                <div class="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl">
                  <span><strong class="text-slate-800">${h.status}</strong> • ${h.by || 'System'}</span>
                  <span class="font-mono-code">${h.time}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Actions: Print Slip or Cancel -->
          <div class="flex items-center space-x-3 pt-2">
            <button 
              onclick="FarmerAppComponent.printSlip('${token.id}')" 
              class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1.5">
              <i class="fa-solid fa-print"></i>
              <span>${t('viewReceipt')}</span>
            </button>

            ${token.status === "BOOKED" ? `
              <button 
                onclick="FarmerAppComponent.cancelToken('${token.id}')" 
                class="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-xs transition">
                ${t('cancelToken')}
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  renderBookingModal() {
    if (!this.bookingModalOpen) return '';
    const t = window.I18N.t;
    const center = window.State.centers.find(c => c.id === this.targetCenterId) || window.State.centers[0];
    const priceObj = window.State.prices.find(p => p.code === this.selectedProduce) || window.State.prices[0];
    const rate = priceObj.rates[center.id] || priceObj.mspRate;

    return `
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between border-b pb-3">
            <div>
              <h3 class="font-bold text-slate-900 text-base">${t('modalBookingTitle')}</h3>
              <p class="text-xs text-slate-500">${center.name}</p>
            </div>
            <button onclick="FarmerAppComponent.closeBookingModal()" class="text-slate-400 hover:text-slate-600">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form onsubmit="FarmerAppComponent.submitBooking(event)" class="space-y-3.5 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">${t('farmerFullName')}</label>
              <input type="text" id="bk_farmer_name" value="Ramesh Meena" required class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">${t('mobileNumberSms')}</label>
              <input type="tel" id="bk_farmer_phone" value="9829012345" required class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-700 block mb-1">${t('produceType')}</label>
                <select id="bk_produce" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="WHEAT" ${this.selectedProduce === 'WHEAT' ? 'selected' : ''}>${t('wheat')}</option>
                  <option value="MUSTARD" ${this.selectedProduce === 'MUSTARD' ? 'selected' : ''}>${t('mustard')}</option>
                  <option value="GRAM" ${this.selectedProduce === 'GRAM' ? 'selected' : ''}>${t('gram')}</option>
                  <option value="BAJRA" ${this.selectedProduce === 'BAJRA' ? 'selected' : ''}>${t('bajra')}</option>
                  <option value="SOYBEAN" ${this.selectedProduce === 'SOYBEAN' ? 'selected' : ''}>${t('soybean')}</option>
                </select>
              </div>

              <div>
                <label class="font-bold text-slate-700 block mb-1">${t('estWeightKg')}</label>
                <input type="number" id="bk_weight" value="3500" step="100" required class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
              <span class="text-emerald-900 font-semibold">${t('todayMandiRate')}</span>
              <span class="font-black text-emerald-950 text-sm">₹${rate} ${t('perQtl')}</span>
            </div>

            <div class="flex space-x-2 pt-2">
              <button type="button" onclick="FarmerAppComponent.closeBookingModal()" class="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition">
                ${t('cancelBtn')}
              </button>
              <button type="submit" class="w-2/3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition active:scale-95">
                ${t('confirmBookingBtn')} &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  showTab(tab) {
    this.activeTab = tab;
    window.App.render();
  },
  setProduce(produce) {
    this.selectedProduce = produce;
    window.App.render();
  },
  setSort(sort) {
    this.sortCriteria = sort;
    window.App.render();
  },
  openBookingModal(centerId) {
    this.targetCenterId = centerId;
    this.bookingModalOpen = true;
    window.App.render();
  },
  closeBookingModal() {
    this.bookingModalOpen = false;
    window.App.render();
  },
  submitBooking(e) {
    e.preventDefault();
    const name = document.getElementById("bk_farmer_name").value;
    const phone = document.getElementById("bk_farmer_phone").value;
    const produceCode = document.getElementById("bk_produce").value;
    const weight = Number(document.getElementById("bk_weight").value);

    const priceObj = window.State.prices.find(p => p.code === produceCode) || window.State.prices[0];
    const rate = priceObj.rates[this.targetCenterId] || priceObj.mspRate;

    const token = window.State.bookToken({
      farmerName: name,
      farmerPhone: phone,
      village: "Chaksu, Jaipur",
      centerId: this.targetCenterId,
      produce: priceObj.produce,
      produceCode: produceCode,
      estimatedQuantityKg: weight,
      rateAppliedPerQtl: rate,
      bookedVia: "APP"
    });

    this.bookingModalOpen = false;
    this.activeTab = "TRACKER";
    window.App.showToast(`${window.I18N.t('tokenBookedSuccess')} (ID: ${token.id})`, "success");
    window.App.render();
  },
  cancelToken(tokenId) {
    if (confirm(window.I18N.t('cancelTokenConfirm'))) {
      window.State.updateTokenStatus(tokenId, "CANCELLED");
      window.App.showToast(window.I18N.t('tokenCancelledMsg'), "info");
      window.App.render();
    }
  },
  printSlip(tokenId) {
    const token = window.State.tokens.find(t => t.id === tokenId);
    if (!token) return;
    const center = window.State.centers.find(c => c.id === token.centerId) || { name: token.centerId };
    const t = window.I18N.t;
    const isEn = window.I18N.currentLang === 'en';

    const printArea = document.getElementById("printable-receipt");
    if (printArea) {
      printArea.innerHTML = `
        <div style="padding: 24px; border: 2px solid #000; max-width: 400px; margin: 0 auto; font-family: monospace;">
          <h2 style="text-align: center; margin: 0; font-size: 20px;">KISANSETU (किसानसेतु)</h2>
          <p style="text-align: center; margin: 4px 0 16px 0; font-size: 12px;">${isEn ? 'E-Procurement Digital Token Slip' : 'ई-प्रोक्योरमेंट डिजिटल टोकन पर्ची'}</p>
          <hr style="border-top: 1px dashed #000;" />
          <div style="margin: 12px 0; font-size: 13px; line-height: 1.6;">
            <p><strong>${isEn ? 'Token ID:' : 'टोकन नंबर:'}</strong> ${token.id}</p>
            <p><strong>${isEn ? 'Farmer Name:' : 'किसान:'}</strong> ${token.farmerName}</p>
            <p><strong>${isEn ? 'Phone:' : 'फ़ोन:'}</strong> ${token.farmerPhone || '-'}</p>
            <p><strong>${isEn ? 'Procurement Mandi:' : 'मंडी:'}</strong> ${center.name}</p>
            <p><strong>${isEn ? 'Produce Type:' : 'फसल:'}</strong> ${t(token.produceCode.toLowerCase()) || token.produce}</p>
            <p><strong>${isEn ? 'Est Quantity:' : 'अनुमानित वजन:'}</strong> ${(token.estimatedQuantityKg / 100).toFixed(0)} ${t('qtl')}</p>
            <p><strong>${isEn ? 'Arrival Window:' : 'पहुंचने का समय:'}</strong> ${token.arrivalWindow}</p>
          </div>
          <hr style="border-top: 1px dashed #000;" />
          <div style="text-align: center; margin-top: 16px;">
            <div style="display: inline-block; padding: 8px; border: 1px solid #ccc; font-size: 11px;">
              [ QR CODE VERIFIED ]<br />${token.id}
            </div>
            <p style="font-size: 10px; margin-top: 8px;">${isEn ? 'Please show this slip at the weighbridge gate upon arrival.' : 'कृपया गेट पर तौलाई के समय यह पर्ची दिखाएं।'}</p>
          </div>
        </div>
      `;
      window.print();
    }
  },
  openVoiceModal() {
    window.Voice.startListening(window.I18N.currentLang === 'hi' ? 'hi-IN' : 'en-IN');
  }
};

window.FarmerAppComponent = FarmerAppComponent;

