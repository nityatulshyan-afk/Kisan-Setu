// KisanSetu Village Dealer / Sahayak Portal (Screen 8 & Screen 9, F9)
// Dedicated proxy booking & offline farmer registry for phone-less farmers (Persona 3: Bhanwar Lal)

const DealerPortalComponent = {
  showAddFarmerModal: false,
  searchTerm: "",

  render() {
    const t = window.I18N.t;
    const farmers = window.State.farmers.filter(f => 
      f.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      f.village.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (f.phone && f.phone.includes(this.searchTerm))
    );

    const assistedCount = window.State.tokens.filter(t => t.bookedVia === "DEALER").length;

    return `
      <div class="space-y-6">
        <!-- Top Dealer Banner -->
        <div class="bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <i class="fa-solid fa-handshake"></i>
              <span>${t('dealerKendra')}</span>
            </div>
            <h2 class="text-2xl font-black mt-1 text-white">${t('dealerTitle')}</h2>
            <p class="text-amber-200 text-xs mt-0.5">${t('dealerOperator')}</p>
          </div>

          <div class="flex items-center space-x-3">
            <div class="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
              <span class="text-[10px] text-amber-200 uppercase font-bold block">${t('assistedBookings')}</span>
              <span class="text-xl font-black text-white">${assistedCount}</span>
            </div>

            <button 
              onclick="DealerPortalComponent.openAddModal()" 
              class="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-2xl text-xs shadow-lg transition active:scale-95 flex items-center space-x-2">
              <i class="fa-solid fa-user-plus"></i>
              <span>${t('registerFarmerBtn')}</span>
            </button>
          </div>
        </div>

        <!-- 100% Inclusion Strategy Policy Box -->
        <div class="bg-amber-50 rounded-3xl p-4 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
          <div class="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-900 shrink-0 mt-0.5">
            <i class="fa-solid fa-universal-access"></i>
          </div>
          <div>
            <strong class="font-bold">${t('inclusionPolicyTitle')}</strong>
            <p class="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              ${t('inclusionPolicyDesc')}
            </p>
          </div>
        </div>

        <!-- Registered Farmers Management Table -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-base">${t('registeredFarmers')}</h3>
              <p class="text-xs text-slate-500">${t('dealerFarmersSub')}</p>
            </div>

            <!-- Search Bar -->
            <div class="relative w-full sm:w-72">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input 
                type="text" 
                placeholder="${t('searchFarmerPlaceholder')}" 
                value="${this.searchTerm}"
                oninput="DealerPortalComponent.setSearch(this.value)"
                class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th class="py-3 px-4">${t('thFarmerName')}</th>
                  <th class="py-3 px-4">${t('thVillage')}</th>
                  <th class="py-3 px-4">${t('thPhoneStatus')}</th>
                  <th class="py-3 px-4">${t('thActiveToken')}</th>
                  <th class="py-3 px-4">${t('thCurrentStatus')}</th>
                  <th class="py-3 px-4 text-right">${t('thActions')}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${farmers.map(farmer => {
                  const token = window.State.tokens.find(t => t.farmerId === farmer.id || t.farmerName.includes(farmer.name.split(' ')[0]));
                  return `
                    <tr class="hover:bg-slate-50/80 transition">
                      <td class="py-3.5 px-4">
                        <div class="font-bold text-slate-900">${farmer.name}</div>
                        <div class="text-[10px] text-slate-400 font-mono-code">${farmer.id}</div>
                      </td>
                      <td class="py-3.5 px-4 text-slate-600 font-medium">
                        ${farmer.village}
                      </td>
                      <td class="py-3.5 px-4">
                        ${farmer.hasPhone ? `
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <i class="fa-solid fa-mobile-screen mr-1"></i> ${farmer.phone}
                          </span>
                        ` : `
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            <i class="fa-solid fa-ban mr-1"></i> ${t('noPhoneDealerProxy')}
                          </span>
                        `}
                      </td>
                      <td class="py-3.5 px-4 font-mono-code font-bold text-slate-800">
                        ${token ? token.id : `<span class="text-slate-400 font-normal">${t('noActiveTokenYet')}</span>`}
                      </td>
                      <td class="py-3.5 px-4">
                        ${token ? `
                          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            token.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                            token.status === 'WEIGHING' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            'bg-blue-100 text-blue-800'
                          }">
                            ${token.status}
                          </span>
                        ` : '-'}
                      </td>
                      <td class="py-3.5 px-4 text-right space-x-1.5">
                        ${token ? `
                          <button onclick="FarmerAppComponent.printSlip('${token.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]">
                            <i class="fa-solid fa-print"></i> ${t('slipBtn')}
                          </button>
                          <button onclick="DealerPortalComponent.markInformed('${token.id}')" class="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[11px]">
                            <i class="fa-solid fa-bullhorn"></i> ${t('informedBtn')}
                          </button>
                        ` : `
                          <button onclick="DealerPortalComponent.openQuickBookModal('${farmer.id}')" class="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] shadow-xs">
                            ${t('newTokenBtn')}
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        ${this.renderAddFarmerModal()}
      </div>
    `;
  },

  renderAddFarmerModal() {
    if (!this.showAddFarmerModal) return '';
    const t = window.I18N.t;
    const centers = window.State.centers;
    const prices = window.State.prices;

    return `
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between border-b pb-3">
            <div>
              <h3 class="font-bold text-slate-900 text-base">${t('modalAddFarmerTitle')}</h3>
              <p class="text-xs text-slate-500">${t('modalAddFarmerSub')}</p>
            </div>
            <button onclick="DealerPortalComponent.closeAddModal()" class="text-slate-400 hover:text-slate-600">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form onsubmit="DealerPortalComponent.submitAddFarmer(event)" class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">${t('farmerName')} *</label>
              <input type="text" id="dlr_farmer_name" placeholder="e.g. Bhanwar Lal (भंवर लाल)" required class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">${t('village')} *</label>
              <input type="text" id="dlr_village" placeholder="e.g. Dudu, Jaipur" required class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">${t('phoneAvailability')}</label>
              <div class="grid grid-cols-2 gap-2">
                <label class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 font-bold">
                  <input type="radio" name="dlr_has_phone" value="no" checked onchange="document.getElementById('dlr_phone_field').classList.add('hidden')" />
                  <span>${t('noPhoneDealerProxy')}</span>
                </label>
                <label class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 font-bold">
                  <input type="radio" name="dlr_has_phone" value="yes" onchange="document.getElementById('dlr_phone_field').classList.remove('hidden')" />
                  <span>${t('hasPhone')}</span>
                </label>
              </div>
            </div>

            <div id="dlr_phone_field" class="hidden">
              <label class="font-bold text-slate-700 block mb-1">${t('enter10DigitPhone')}</label>
              <input type="tel" id="dlr_phone_val" placeholder="98290XXXXX" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">${t('allocatedCenter')}</label>
              <select id="dlr_center_id" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500">
                ${centers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-700 block mb-1">${t('produceType')}</label>
                <select id="dlr_produce_code" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  ${prices.map(p => `<option value="${p.code}">${p.produce}</option>`).join('')}
                </select>
              </div>

              <div>
                <label class="font-bold text-slate-700 block mb-1">${t('estWeightKg')} *</label>
                <input type="number" id="dlr_weight" value="4000" step="100" required class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>

            <div class="flex space-x-2 pt-2">
              <button type="button" onclick="DealerPortalComponent.closeAddModal()" class="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition">
                ${t('cancelBtn')}
              </button>
              <button type="submit" class="w-2/3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black shadow-md transition active:scale-95">
                ${t('saveAndBookBtn')} &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  setSearch(val) {
    this.searchTerm = val;
    window.App.render();
  },
  openAddModal() {
    this.showAddFarmerModal = true;
    window.App.render();
  },
  closeAddModal() {
    this.showAddFarmerModal = false;
    window.App.render();
  },
  submitAddFarmer(e) {
    e.preventDefault();
    const name = document.getElementById("dlr_farmer_name").value.trim();
    const village = document.getElementById("dlr_village").value.trim();
    const hasPhone = document.querySelector('input[name="dlr_has_phone"]:checked').value === "yes";
    const phone = hasPhone ? document.getElementById("dlr_phone_val").value.trim() : null;
    const centerId = document.getElementById("dlr_center_id").value;
    const produceCode = document.getElementById("dlr_produce_code").value;
    const weight = Number(document.getElementById("dlr_weight").value);

    if (!name || !village) {
      alert(window.I18N.t('pleaseFillNameVillage'));
      return;
    }

    const farmerId = `FARMER-${Date.now().toString().slice(-4)}`;
    window.State.farmers.unshift({
      id: farmerId,
      name,
      phone,
      village,
      hasPhone,
      persona: hasPhone ? "Feature Phone" : "No-Phone Offline Farmer",
      defaultCenter: centerId
    });

    const priceObj = window.State.prices.find(p => p.code === produceCode) || window.State.prices[0];
    const token = window.State.bookToken({
      farmerId,
      farmerName: name,
      farmerPhone: phone,
      village,
      centerId,
      produce: priceObj.produce,
      produceCode,
      estimatedQuantityKg: weight,
      bookedVia: "DEALER",
      registeredByDealer: "DLR-JPR-489"
    });

    this.showAddFarmerModal = false;
    window.App.showToast(`${window.I18N.t('tokenBookedSuccess')} (ID: ${token.id} - ${name})`, "success");
    window.App.render();
  },
  markInformed(tokenId) {
    window.App.showToast(`Token ${tokenId}: ${window.I18N.t('informedSuccess')}`, "info");
  },
  openQuickBookModal(farmerId) {
    const farmer = window.State.farmers.find(f => f.id === farmerId);
    if (!farmer) return;

    const token = window.State.bookToken({
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      village: farmer.village,
      centerId: "CTR-JPR-01",
      produce: "Wheat (गेहूं)",
      produceCode: "WHEAT",
      estimatedQuantityKg: 2500,
      bookedVia: "DEALER",
      registeredByDealer: "DLR-JPR-489"
    });

    window.App.showToast(`${window.I18N.t('tokenBookedSuccess')} (ID: ${token.id} - ${farmer.name})`, "success");
    window.App.render();
  }
};

window.DealerPortalComponent = DealerPortalComponent;

