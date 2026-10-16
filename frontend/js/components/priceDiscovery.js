// KisanSetu Best Price Discovery Matrix & Net Revenue Maximizer (Screen 14, F15)
// Transparent side-by-side MSP vs Mandi rates, Net In-Hand Revenue (factoring transport cost), and SMS surge alerts

const PriceDiscoveryComponent = {
  selectedCrop: "WHEAT",
  quantityQtl: 40, // Default 40 Quintal load

  render() {
    const t = window.I18N.t;
    const prices = window.State.prices;
    const centers = window.State.centers;
    const activePrice = prices.find(p => p.code === this.selectedCrop) || prices[0];

    // Calculate Net In-Hand Revenue for each center factoring transport logistics
    // Est Transport Cost = ₹12 per quintal per 10 km (Base logistics heuristic)
    const centerCalculations = centers.map(c => {
      const grossRate = activePrice.rates[c.id] || activePrice.mspRate;
      const grossTotal = grossRate * this.quantityQtl;
      const transportCostPerQtl = Math.round((c.distanceKm / 10) * 12);
      const totalTransportCost = transportCostPerQtl * this.quantityQtl;
      const netTotal = grossTotal - totalTransportCost;
      const netPerQtl = Math.round(netTotal / this.quantityQtl);

      return {
        ...c,
        grossRate,
        grossTotal,
        totalTransportCost,
        netTotal,
        netPerQtl
      };
    }).sort((a, b) => b.netTotal - a.netTotal);

    const bestCenter = centerCalculations[0];

    return `
      <div class="space-y-6">
        <!-- Top Price Header Banner -->
        <div class="bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <i class="fa-solid fa-coins"></i>
              <span>${t('priceMatrixTitle')}</span>
            </div>
            <h2 class="text-2xl font-black mt-1 text-white">${t('priceMatrixHeader')}</h2>
            <p class="text-emerald-200 text-xs mt-0.5">${t('priceMatrixSub')}</p>
          </div>

          <button 
            onclick="PriceDiscoveryComponent.openAlertModal()" 
            class="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl text-xs shadow-lg transition active:scale-95 flex items-center space-x-2">
            <i class="fa-solid fa-bell"></i>
            <span>${t('priceAlertBtn')}</span>
          </button>
        </div>

        <!-- Crop & Volume Configuration Bar -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <!-- Crop Selector -->
            <div>
              <label class="font-bold text-slate-700 text-xs block mb-2">${t('selectCrop')}</label>
              <div class="flex flex-wrap gap-2">
                ${prices.map(p => `
                  <button 
                    onclick="PriceDiscoveryComponent.setCrop('${p.code}')" 
                    class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${this.selectedCrop === p.code ? 'bg-emerald-800 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                    <span>${p.produce.split(' ')[0]}</span>
                    <span class="text-[10px] opacity-75 font-mono-code">₹${p.mspRate}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Volume Slider (5 qtl to 100 qtl) -->
            <div>
              <div class="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>${t('estProduceQuantity')}</span>
                <span class="text-base font-black text-emerald-800 font-mono-code">${this.quantityQtl} ${t('qtl')}</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="120" 
                step="5" 
                value="${this.quantityQtl}"
                oninput="PriceDiscoveryComponent.setQuantity(this.value)"
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
              <div class="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>${t('smallFarmer')}</span>
                <span>${t('largeFarmer')}</span>
              </div>
            </div>
          </div>

          <!-- MSP Badge Bar -->
          <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-900 gap-2">
            <div class="flex items-center space-x-2">
              <span class="font-bold">${t('govtMspBadge')}</span>
              <span class="font-black font-mono-code text-sm bg-white px-2 py-0.5 rounded border border-amber-300">₹${activePrice.mspRate} / क्विंटल</span>
            </div>
            <span class="text-[11px] text-amber-800">${t('sourceLabel')} ${activePrice.source} • ${activePrice.updatedAt}</span>
          </div>
        </div>

        <!-- Highlighted Best Choice Center Card -->
        <div class="bg-gradient-to-tr from-emerald-900 to-green-800 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
          <div class="absolute -right-8 -bottom-8 text-white/10 text-9xl font-black">₹</div>
          <div class="relative z-10 space-y-3 max-w-xl">
            <div class="inline-flex items-center space-x-1 bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              <i class="fa-solid fa-crown"></i>
              <span>${t('bestNetRevenueTitle')}</span>
            </div>
            <h3 class="text-2xl font-black text-white">${bestCenter.name}</h3>
            <p class="text-xs text-emerald-100">${bestCenter.location} • ${bestCenter.distanceKm} km away</p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-center">
                <span class="text-[10px] text-emerald-200 uppercase block font-bold">${t('rateLabel')}</span>
                <span class="text-base font-black">₹${bestCenter.grossRate}</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-center">
                <span class="text-[10px] text-emerald-200 uppercase block font-bold">${t('grossCropValue')}</span>
                <span class="text-base font-black">₹${bestCenter.grossTotal.toLocaleString('en-IN')}</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-center">
                <span class="text-[10px] text-emerald-200 uppercase block font-bold">${t('estTransportCost')}</span>
                <span class="text-base font-black text-amber-300">-₹${bestCenter.totalTransportCost.toLocaleString('en-IN')}</span>
              </div>
              <div class="bg-white p-3 rounded-2xl text-center text-emerald-950 shadow-md">
                <span class="text-[10px] uppercase font-bold text-slate-500 block">${t('estNetSavings')}</span>
                <span class="text-lg font-black text-emerald-800">₹${bestCenter.netTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div class="pt-3">
              <button 
                onclick="FarmerAppComponent.openBookingModal('${bestCenter.id}')" 
                class="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-xl text-xs shadow-md transition active:scale-95">
                ${t('bookHereBtn')} &rarr;
              </button>
            </div>
          </div>
        </div>

        <!-- Comprehensive Mandi Comparison Table -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 class="font-bold text-slate-900 text-base">All Nearby Mandis & Net Realization</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
                <tr>
                  <th class="py-3 px-4">Procurement Center</th>
                  <th class="py-3 px-4">Distance</th>
                  <th class="py-3 px-4">Mandi Rate</th>
                  <th class="py-3 px-4">${t('grossCropValue')}</th>
                  <th class="py-3 px-4">${t('estTransportCost')}</th>
                  <th class="py-3 px-4 font-bold text-emerald-900">${t('netInHand')}</th>
                  <th class="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${centerCalculations.map((c, i) => `
                  <tr class="hover:bg-slate-50 transition ${i === 0 ? 'bg-emerald-50/40 font-semibold' : ''}">
                    <td class="py-3.5 px-4">
                      <div class="font-bold text-slate-900">${c.name}</div>
                      <div class="text-[10px] text-slate-400 font-mono-code">${c.id}</div>
                    </td>
                    <td class="py-3.5 px-4 text-slate-600 font-medium">${c.distanceKm} km</td>
                    <td class="py-3.5 px-4 font-mono-code font-bold text-slate-900">₹${c.grossRate}</td>
                    <td class="py-3.5 px-4 text-slate-700">₹${c.grossTotal.toLocaleString('en-IN')}</td>
                    <td class="py-3.5 px-4 text-red-600 font-mono-code">-₹${c.totalTransportCost.toLocaleString('en-IN')}</td>
                    <td class="py-3.5 px-4 font-mono-code font-black text-sm text-emerald-800">
                      ₹${c.netTotal.toLocaleString('en-IN')}
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <button 
                        onclick="FarmerAppComponent.openBookingModal('${c.id}')" 
                        class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold">
                        ${t('bookHereBtn')}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  setCrop(code) {
    this.selectedCrop = code;
    window.App.render();
  },
  setQuantity(val) {
    this.quantityQtl = Number(val);
    window.App.render();
  },
  openAlertModal() {
    const promptMsg = window.I18N && window.I18N.t('priceAlertPrompt') ? window.I18N.t('priceAlertPrompt') : "Enter 10-digit mobile number for price surge SMS alerts:";
    const phone = prompt(promptMsg, "9829012345");
    if (phone) {
      window.State.subscribePriceAlert(phone, this.selectedCrop, 2400);
      window.App.showToast(window.I18N.t('priceAlertSuccess'), "success");
    }
  }
};

window.PriceDiscoveryComponent = PriceDiscoveryComponent;

