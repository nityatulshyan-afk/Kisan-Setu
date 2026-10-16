// KisanSetu District Officer Dashboard (Screen 10 & Screen 11, F10)
// Congestion Heatmaps, Center Capacity Throttling, Daily Price Management, and Immutable Audit Trail

const OfficerDashboardComponent = {
  activeSubView: "CONGESTION", // 'CONGESTION', 'PRICES', 'AUDIT'

  render() {
    const t = window.I18N.t;
    const centers = window.State.centers;
    const totalQueue = centers.reduce((sum, c) => sum + c.currentQueue, 0);
    const avgWait = Math.round(centers.reduce((sum, c) => sum + window.State.computePredictedWaitMin(c.id), 0) / centers.length);
    const congestedCount = centers.filter(c => (c.currentQueue / c.capacityMax) >= 0.85 || c.isThrottled).length;

    return `
      <div class="space-y-6">
        <!-- Top District Header -->
        <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <i class="fa-solid fa-building-columns"></i>
              <span>${t('districtControlCell')}</span>
            </div>
            <h2 class="text-2xl font-black mt-1 text-white">${t('officerTitle')}</h2>
            <p class="text-slate-300 text-xs mt-0.5">${t('districtOfficerRole')}</p>
          </div>

          <!-- Sub-view Navigation Tabs -->
          <div class="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-xs font-bold">
            <button 
              onclick="OfficerDashboardComponent.setSubView('CONGESTION')" 
              class="px-3.5 py-2 rounded-xl transition ${this.activeSubView === 'CONGESTION' ? 'bg-indigo-600 text-white shadow' : 'text-slate-200 hover:text-white'}">
              <i class="fa-solid fa-chart-pie mr-1"></i> ${t('tabCongestion')}
            </button>
            <button 
              onclick="OfficerDashboardComponent.setSubView('PRICES')" 
              class="px-3.5 py-2 rounded-xl transition ${this.activeSubView === 'PRICES' ? 'bg-indigo-600 text-white shadow' : 'text-slate-200 hover:text-white'}">
              <i class="fa-solid fa-tags mr-1"></i> ${t('tabDailyPrices')}
            </button>
            <button 
              onclick="OfficerDashboardComponent.setSubView('AUDIT')" 
              class="px-3.5 py-2 rounded-xl transition ${this.activeSubView === 'AUDIT' ? 'bg-indigo-600 text-white shadow' : 'text-slate-200 hover:text-white'}">
              <i class="fa-solid fa-list-check mr-1"></i> ${t('tabAudit')}
            </button>
          </div>
        </div>

        <!-- District KPI Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center space-x-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl">
              <i class="fa-solid fa-users-line"></i>
            </div>
            <div>
              <span class="text-xs text-slate-500 font-semibold block">${t('totalQueue')}</span>
              <span class="text-2xl font-black text-slate-900">${totalQueue} ${t('farmersCount')}</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center space-x-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
              <i class="fa-solid fa-stopwatch"></i>
            </div>
            <div>
              <span class="text-xs text-slate-500 font-semibold block">${t('avgWaitDistrict')}</span>
              <span class="text-2xl font-black text-slate-900">~${avgWait} ${t('min')}</span>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-4 shadow-sm border ${congestedCount > 0 ? 'border-red-300 bg-red-50/50' : 'border-slate-200'} flex items-center space-x-3">
            <div class="w-12 h-12 rounded-2xl ${congestedCount > 0 ? 'bg-red-500 text-white animate-bounce' : 'bg-slate-100 text-slate-700'} flex items-center justify-center text-xl">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <span class="text-xs text-slate-500 font-semibold block">${t('overCapacityAlert')}</span>
              <span class="text-2xl font-black ${congestedCount > 0 ? 'text-red-700' : 'text-slate-900'}">${congestedCount} Mandis</span>
            </div>
          </div>
        </div>

        ${this.activeSubView === "CONGESTION" ? this.renderCongestionGrid() :
          this.activeSubView === "PRICES" ? this.renderPriceManagement() :
          this.renderAuditLogs()}
      </div>
    `;
  },

  renderCongestionGrid() {
    const t = window.I18N.t;
    const centers = window.State.centers;

    return `
      <!-- Automated Smart Rebalance Recommendation Banner -->
      <div class="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-3xl p-5 shadow-md flex items-start justify-between">
        <div class="flex items-start space-x-3.5">
          <div class="w-10 h-10 rounded-2xl bg-indigo-500/30 flex items-center justify-center text-xl text-amber-300">
            <i class="fa-solid fa-network-wired"></i>
          </div>
          <div>
            <h4 class="font-bold text-sm text-white">${t('rebalanceAdviceTitle')}</h4>
            <p class="text-xs text-indigo-200 mt-1 max-w-2xl leading-relaxed">
              ${t('rebalanceAdviceDesc')}
            </p>
          </div>
        </div>
        <span class="text-[11px] bg-indigo-500/40 text-indigo-100 font-bold px-3 py-1 rounded-full border border-indigo-400/30">
          ${t('activeAlgorithm')}
        </span>
      </div>

      <!-- Live Center Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${centers.map(center => {
          const waitMin = window.State.computePredictedWaitMin(center.id);
          const capacityPct = Math.round((center.currentQueue / center.capacityMax) * 100);
          const isRed = capacityPct >= 85 || center.isThrottled;
          const isAmber = capacityPct >= 60 && capacityPct < 85;

          return `
            <div class="bg-white rounded-3xl p-5 shadow-sm border ${center.isThrottled ? 'border-red-400 ring-2 ring-red-500/20' : 'border-slate-200'} space-y-4">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-mono-code font-bold text-xs text-slate-500">${center.id}</span>
                    ${center.isThrottled ? `
                      <span class="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ${t('statusThrottled')}
                      </span>
                    ` : `
                      <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ${t('statusOpen')}
                      </span>
                    `}
                  </div>
                  <h3 class="font-bold text-slate-900 text-base mt-1">${center.name}</h3>
                  <p class="text-xs text-slate-500">${center.location} • ${t('contactPrefix')} ${center.contactPhone}</p>
                </div>
              </div>

              <!-- Capacity Heat Bar -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-bold">
                  <span class="text-slate-600">${t('capacityUtil')} ${center.currentQueue} / ${center.capacityMax}</span>
                  <span class="${isRed ? 'text-red-600' : isAmber ? 'text-amber-600' : 'text-emerald-700'} font-black">${capacityPct}%</span>
                </div>
                <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div class="h-full rounded-full transition-all duration-500 ${isRed ? 'bg-red-500' : isAmber ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${Math.min(100, capacityPct)}%"></div>
                </div>
              </div>

              <!-- Live Stats: Wait & Processing -->
              <div class="grid grid-cols-2 gap-2 text-center text-xs">
                <div class="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span class="text-[10px] text-slate-500 block">${t('predictedWait')}</span>
                  <span class="text-sm font-black text-slate-900">~${waitMin} ${t('min')}</span>
                </div>
                <div class="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span class="text-[10px] text-slate-500 block">${t('avgProcPrefix')}</span>
                  <span class="text-sm font-black text-slate-900">${center.avgProcessingMin} ${t('farmerUnit')}</span>
                </div>
              </div>

              <!-- Throttling Toggle Action -->
              <div class="pt-2 border-t flex items-center justify-between">
                <span class="text-xs text-slate-500">
                  ${center.isThrottled ? '⚠️ Queue paused for load redistribution' : '🟢 Accepting all incoming bookings'}
                </span>

                ${center.isThrottled ? `
                  <button 
                    onclick="OfficerDashboardComponent.toggleThrottle('${center.id}', false)" 
                    class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition">
                    ${t('reopenQueueBtn')}
                  </button>
                ` : `
                  <button 
                    onclick="OfficerDashboardComponent.toggleThrottle('${center.id}', true)" 
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition">
                    ${t('throttleQueueBtn')}
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderPriceManagement() {
    const t = window.I18N.t;
    const prices = window.State.prices;
    const centers = window.State.centers;

    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div class="border-b pb-4 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-900 text-base">${t('publishPrice')}</h3>
            <p class="text-xs text-slate-500">${t('officerPriceSub')}</p>
          </div>
          <span class="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-xl">
            ${t('priceSourceBadge')}
          </span>
        </div>

        <div class="space-y-4">
          ${prices.map(p => `
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">🌾</span>
                  <h4 class="font-bold text-slate-900 text-sm">${p.produce}</h4>
                  <span class="text-[11px] font-mono-code font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                    ${t('mspFull')} ₹${p.mspRate}/qtl
                  </span>
                </div>
                <span class="text-[11px] text-slate-400">${t('lastUpdatedPrefix')} ${p.updatedAt}</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${centers.map(center => {
                  const currentRate = p.rates[center.id] || p.mspRate;
                  return `
                    <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <span class="text-[10px] text-slate-500 font-bold block truncate">${center.name.split(' ')[0]} Mandi</span>
                      <div class="flex items-center space-x-1">
                        <span class="text-xs text-slate-400 font-bold">₹</span>
                        <input 
                          type="number" 
                          id="price_input_${p.code}_${center.id}" 
                          value="${currentRate}" 
                          class="w-full font-bold text-xs text-slate-900 px-2 py-1 rounded border border-slate-200 focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <button 
                        onclick="OfficerDashboardComponent.savePrice('${p.code}', '${center.id}')" 
                        class="w-full py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[10px] font-bold">
                        ${t('saveBtn')}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderAuditLogs() {
    const t = window.I18N.t;
    const logs = window.State.auditLogs;

    return `
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div class="border-b pb-4 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-900 text-base">${t('auditTitle')}</h3>
            <p class="text-xs text-slate-500">${t('auditSub')}</p>
          </div>
          <span class="font-mono-code text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl font-bold">
            ${t('totalTokensCount')} ${window.State.tokens.length}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
              <tr>
                <th class="py-3 px-4">Log ID</th>
                <th class="py-3 px-4">Timestamp</th>
                <th class="py-3 px-4">Event</th>
                <th class="py-3 px-4">Token ID</th>
                <th class="py-3 px-4">Mandi Center</th>
                <th class="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono-code text-[11px]">
              ${logs.map(log => `
                <tr class="hover:bg-slate-50">
                  <td class="py-2.5 px-4 font-bold text-slate-500">${log.id}</td>
                  <td class="py-2.5 px-4 text-slate-600">${log.timestamp}</td>
                  <td class="py-2.5 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.event.includes('PAYMENT') ? 'bg-emerald-100 text-emerald-800' :
                      log.event.includes('GATE') ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }">
                      ${log.event}
                    </span>
                  </td>
                  <td class="py-2.5 px-4 font-bold text-slate-900">${log.tokenId || '-'}</td>
                  <td class="py-2.5 px-4 text-slate-600">${log.centerId || '-'}</td>
                  <td class="py-2.5 px-4 font-sans text-slate-700">${log.details}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  setSubView(view) {
    this.activeSubView = view;
    window.App.render();
  },
  toggleThrottle(centerId, isThrottled) {
    window.State.toggleCenterThrottle(centerId, isThrottled);
    const isEn = window.I18N && window.I18N.currentLang === 'en';
    window.App.showToast(isThrottled ? (isEn ? `Center ${centerId} throttled.` : `मंडी ${centerId} की कतार रोकी गई।`) : (isEn ? `Center ${centerId} reopened.` : `मंडी ${centerId} पुनः खोली गई।`), isThrottled ? "info" : "success");
    window.App.render();
  },
  savePrice(produceCode, centerId) {
    const val = document.getElementById(`price_input_${produceCode}_${centerId}`)?.value;
    if (val) {
      window.State.updatePrice(produceCode, centerId, val);
      const isEn = window.I18N && window.I18N.currentLang === 'en';
      window.App.showToast(isEn ? `Rate Updated: ${produceCode} → ₹${val}/qtl` : `दाम अपडेट: ${produceCode} → ₹${val}/क्विंटल`, "success");
      window.App.render();
    }
  }
};

window.OfficerDashboardComponent = OfficerDashboardComponent;

