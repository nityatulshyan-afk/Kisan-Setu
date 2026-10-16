// KisanSetu Interactive Feature-Phone IVR & 2-Way SMS Simulator (Screen 5, Screen 6, F6, F7, F8)
// Demonstrates inclusion for farmers with basic keypad phones (Persona 2: Sita)

const TelephonySimComponent = {
  activeMode: "IVR", // 'IVR' or 'SMS'
  
  // IVR State Machine
  ivrState: "IDLE", // 'IDLE', 'LANG_MENU', 'MAIN_MENU', 'STATUS_INPUT', 'SPEAKING', 'CALLBACK_CONFIRMED'
  ivrLang: "en",
  dialedDigits: "",
  ivrSpokenText: "",
  ivrCallActive: false,

  // Multilingual SMS Storage
  smsMessagesByLang: {
    en: [
      { sender: "SYSTEM", text: "Welcome to KisanSetu SMS Service. Send 'STATUS <Token ID>' to check queue status or 'BOOK JAIPUR WHEAT 30' to 56161.", time: "08:00 AM" },
      { sender: "FARMER", text: "STATUS KS-102", time: "09:15 AM" },
      { sender: "SYSTEM", text: "KisanSetu: Token KS-102 (Sita Devi) is currently at Weighbridge. Estimated wait ~15 minutes. Alwar Center.", time: "09:15 AM" }
    ],
    hi: [
      { sender: "SYSTEM", text: "किसानसेतु SMS सेवा में स्वागत है। स्थिति जानने के लिए 'STATUS <टोकन>' या नया टोकन बुक करने के लिए 'BOOK JAIPUR WHEAT' 56161 पर भेजें।", time: "08:00 AM" },
      { sender: "FARMER", text: "STATUS KS-102", time: "09:15 AM" },
      { sender: "SYSTEM", text: "किसानसेतु: टोकन KS-102 (सीता देवी) कांटा तौलाई पर है। अनुमानित इंतज़ार ~15 मिनट। अलवर मंडी।", time: "09:15 AM" }
    ],
    raj: [
      { sender: "SYSTEM", text: "किसानसेतु SMS सेवा में थांरो स्वागत है। स्थिति जानबा सारु 'STATUS <टोकन>' या 'BOOK JAIPUR WHEAT' 56161 पर भेजो।", time: "08:00 AM" },
      { sender: "FARMER", text: "STATUS KS-102", time: "09:15 AM" },
      { sender: "SYSTEM", text: "किसानसेतु: टोकन KS-102 (सीता देवी) तोल कांटे पर है। इंतज़ार ~15 मिनट। अलवर मंडी।", time: "09:15 AM" }
    ],
    pb: [
      { sender: "SYSTEM", text: "ਕਿਸਾਨਸੇਤੂ SMS ਸੇਵਾ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਸਥਿਤੀ ਜਾਣਨ ਲਈ 'STATUS <ਟੋਕਨ>' ਜਾਂ 'BOOK JAIPUR WHEAT' 56161 'ਤੇ ਭੇਜੋ।", time: "08:00 AM" },
      { sender: "FARMER", text: "STATUS KS-102", time: "09:15 AM" },
      { sender: "SYSTEM", text: "ਕਿਸਾਨਸੇਤੂ: ਟੋਕਨ KS-102 (ਸੀਤਾ ਦੇਵੀ) ਤੁਲਾਈ 'ਤੇ ਹੈ। ਅੰਦਾਜ਼ਨ ਇੰਤਜ਼ਾਰ ~15 ਮਿੰਟ। ਅਲਵਰ ਮੰਡੀ।", time: "09:15 AM" }
    ]
  },
  smsInput: "",

  getSMSMessages() {
    const currentLang = window.I18N ? window.I18N.currentLang : "en";
    if (!this.smsMessagesByLang[currentLang]) {
      this.smsMessagesByLang[currentLang] = [...this.smsMessagesByLang.en];
    }
    return this.smsMessagesByLang[currentLang];
  },

  render() {
    const t = window.I18N.t;

    return `
      <div class="space-y-6">
        <!-- Top Simulator Banner -->
        <div class="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>${t('simTitle')}</span>
            </div>
            <h2 class="text-2xl font-bold mt-1 text-white">${t('telephonyHeader')}</h2>
            <p class="text-slate-300 text-xs mt-0.5">${t('telephonySub')}</p>
          </div>

          <!-- Mode Toggle: IVR Phone vs SMS Messenger -->
          <div class="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            <button 
              onclick="TelephonySimComponent.setMode('IVR')" 
              class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${this.activeMode === 'IVR' ? 'bg-amber-400 text-slate-900 shadow' : 'text-white hover:text-amber-300'}">
              <i class="fa-solid fa-phone"></i>
              <span>${t('tabIvr')}</span>
            </button>
            <button 
              onclick="TelephonySimComponent.setMode('SMS')" 
              class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${this.activeMode === 'SMS' ? 'bg-amber-400 text-slate-900 shadow' : 'text-white hover:text-amber-300'}">
              <i class="fa-solid fa-comment-sms"></i>
              <span>${t('tabSms')}</span>
            </button>
          </div>
        </div>

        ${this.activeMode === 'IVR' ? this.renderIVRPhoneView() : this.renderSMSView()}
      </div>
    `;
  },

  renderIVRPhoneView() {
    const t = window.I18N.t;
    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Feature Phone Mockup UI (Left 5 cols) -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="w-80 bg-slate-900 rounded-[44px] p-5 shadow-2xl border-4 border-slate-700 space-y-4 text-white">
            <!-- Earpiece & Status -->
            <div class="flex justify-between items-center px-4 text-[10px] text-slate-400 font-mono-code">
              <span>AIRTEL 4G</span>
              <div class="w-10 h-1 bg-slate-700 rounded-full mx-auto"></div>
              <span>100%</span>
            </div>

            <!-- Feature Phone Screen Display -->
            <div class="bg-gradient-to-b from-sky-950 to-slate-900 rounded-2xl p-4 border-2 border-sky-800/40 min-h-[160px] flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center text-[10px] text-sky-400 font-bold border-b border-sky-800/50 pb-1">
                  <span>${t('ivrHelpTitle')}</span>
                  <span>${this.ivrCallActive ? '🔴 00:' + (this.dialedDigits ? '12' : '05') : 'OFFLINE'}</span>
                </div>

                <div class="mt-2 text-xs font-semibold text-sky-100 leading-relaxed min-h-[70px]">
                  ${this.ivrCallActive ? this.ivrSpokenText : t('ivrCallPrompt')}
                </div>
              </div>

              ${this.dialedDigits ? `
                <div class="text-right font-mono-code text-amber-300 text-xs font-bold bg-slate-950/60 px-2 py-0.5 rounded">
                  ${t('dialedDigitsLabel')} ${this.dialedDigits}
                </div>
              ` : ''}
            </div>

            <!-- DTMF Dialpad Grid -->
            <div class="grid grid-cols-3 gap-2.5 pt-1">
              ${[
                { k: '1', sub: '.,' }, { k: '2', sub: 'ABC' }, { k: '3', sub: 'DEF' },
                { k: '4', sub: 'GHI' }, { k: '5', sub: 'JKL' }, { k: '6', sub: 'MNO' },
                { k: '7', sub: 'PQRS' }, { k: '8', sub: 'TUV' }, { k: '9', sub: 'WXYZ' },
                { k: '*', sub: 'PWR' }, { k: '0', sub: '+' }, { k: '#', sub: 'ACK' }
              ].map(d => `
                <button 
                  onclick="TelephonySimComponent.pressDTMF('${d.k}')" 
                  class="dtmf-key h-12 rounded-2xl flex flex-col items-center justify-center text-slate-800 active:scale-95 font-bold">
                  <span class="text-sm">${d.k}</span>
                  <span class="text-[8px] text-slate-500 font-medium tracking-tighter">${d.sub}</span>
                </button>
              `).join('')}
            </div>

            <!-- Call / End Call Buttons -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <button 
                onclick="TelephonySimComponent.startCall()" 
                class="py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg active:scale-95">
                <i class="fa-solid fa-phone"></i>
                <span>${t('callBtn')}</span>
              </button>
              <button 
                onclick="TelephonySimComponent.endCall()" 
                class="py-3 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg active:scale-95">
                <i class="fa-solid fa-phone-slash"></i>
                <span>${t('endCallBtn')}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- IVR Flow Explanation & Stage Guides (Right 7 cols) -->
        <div class="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div class="flex items-center justify-between border-b pb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-base">${t('ivrFlowTitle')}</h3>
              <p class="text-xs text-slate-500">${t('ivrFlowSub')}</p>
            </div>
            <span class="text-xs font-mono-code bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-xl">
              ${t('tollFree')}
            </span>
          </div>

          <!-- Step-by-Step Script -->
          <div class="space-y-3 text-xs">
            <div class="p-3.5 rounded-2xl border ${this.ivrState === 'LANG_MENU' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20' : 'bg-slate-50 border-slate-200'}">
              <strong class="text-slate-900 block font-bold mb-1">${t('ivrStep1Title')}</strong>
              <p class="text-slate-600">${t('ivrStep1Desc')}</p>
            </div>

            <div class="p-3.5 rounded-2xl border ${this.ivrState === 'MAIN_MENU' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20' : 'bg-slate-50 border-slate-200'}">
              <strong class="text-slate-900 block font-bold mb-1">${t('ivrStep2Title')}</strong>
              <ul class="text-slate-600 space-y-1 mt-1 pl-4 list-disc">
                <li><strong>${t('ivrStep2Opt1')}</strong></li>
                <li><strong>${t('ivrStep2Opt2')}</strong></li>
                <li><strong>${t('ivrStep2Opt3')}</strong></li>
                <li><strong>${t('ivrStep2Opt4')}</strong></li>
              </ul>
            </div>

            <div class="p-3.5 rounded-2xl border ${this.ivrState === 'STATUS_INPUT' || this.ivrState === 'SPEAKING' ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20' : 'bg-slate-50 border-slate-200'}">
              <strong class="text-slate-900 block font-bold mb-1">${t('ivrStep3Title')}</strong>
              <p class="text-slate-600">${t('ivrStep3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderSMSView() {
    const t = window.I18N.t;
    const messages = this.getSMSMessages();

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- 2-Way SMS Messenger Terminal (Left 6 cols) -->
        <div class="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div class="flex items-center justify-between border-b pb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                <i class="fa-solid fa-tower-broadcast"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">${t('smsGatewayTitle')}</h3>
                <p class="text-[11px] text-slate-500">${t('smsGatewaySub')}</p>
              </div>
            </div>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <!-- SMS Conversation Feed -->
          <div class="h-80 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            ${messages.map(msg => {
              const isSystem = msg.sender === "SYSTEM";
              return `
                <div class="flex flex-col ${isSystem ? 'items-start' : 'items-end'}">
                  <div class="max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${isSystem ? 'bg-white border border-slate-200 text-slate-800 shadow-sm' : 'bg-emerald-700 text-white font-medium'}">
                    ${msg.text}
                  </div>
                  <span class="text-[10px] text-slate-400 mt-1 px-1">${msg.time}</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- SMS Sender Input Bar -->
          <div class="flex space-x-2">
            <input 
              type="text" 
              placeholder="${t('smsInputPlaceholder')}" 
              id="sms_sim_input"
              value="${this.smsInput}"
              onkeydown="if(event.key==='Enter') TelephonySimComponent.sendSMS()"
              class="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button 
              onclick="TelephonySimComponent.sendSMS()" 
              class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow transition active:scale-95">
              ${t('sendBtn')} &rarr;
            </button>
          </div>
        </div>

        <!-- SMS Keyword Reference Guide (Right 6 cols) -->
        <div class="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div class="border-b pb-4">
            <h3 class="font-bold text-slate-900 text-base">${t('smsGuideTitle')}</h3>
            <p class="text-xs text-slate-500">${t('smsGuideSub')}</p>
          </div>

          <div class="space-y-3 text-xs">
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span class="font-mono-code font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${t('smsGuideStatusLabel')}</span>
                <p class="text-slate-600 text-[11px] mt-1">${t('smsGuideStatusDesc')}</p>
              </div>
              <button onclick="TelephonySimComponent.fillSMS('STATUS KS-101')" class="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-[10px] font-bold">
                ${t('tryBtn')}
              </button>
            </div>

            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span class="font-mono-code font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${t('smsGuideBookLabel')}</span>
                <p class="text-slate-600 text-[11px] mt-1">${t('smsGuideBookDesc')}</p>
              </div>
              <button onclick="TelephonySimComponent.fillSMS('BOOK JAIPUR WHEAT 30')" class="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-[10px] font-bold">
                ${t('tryBtn')}
              </button>
            </div>

            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span class="font-mono-code font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${t('smsGuidePriceLabel')}</span>
                <p class="text-slate-600 text-[11px] mt-1">${t('smsGuidePriceDesc')}</p>
              </div>
              <button onclick="TelephonySimComponent.fillSMS('PRICE MUSTARD')" class="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-[10px] font-bold">
                ${t('tryBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  setMode(mode) {
    this.activeMode = mode;
    window.App.render();
  },

  // Audio DTMF Synthesizer
  playDTMFTone(key) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const dtmfFrequencies = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
      };

      const freqs = dtmfFrequencies[key] || [700, 1200];
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];
      gain.gain.value = 0.15;

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        ctx.close();
      }, 150);
    } catch(e) {
      console.log("DTMF Audio not active:", e);
    }
  },

  startCall() {
    this.ivrCallActive = true;
    this.ivrState = "LANG_MENU";
    this.dialedDigits = "";
    const currentLang = window.I18N ? window.I18N.currentLang : "en";
    this.ivrLang = currentLang;

    if (currentLang === "en") {
      this.ivrSpokenText = "Welcome to KisanSetu Helpline. For English press 1, हिंदी के लिए 2 दबाएं, राजस्थानी सारु 3 दबाओ.";
      window.Voice.speak(this.ivrSpokenText, "en-IN");
    } else if (currentLang === "raj") {
      this.ivrSpokenText = "किसानसेतु में थांरो स्वागत है। राजस्थानी सारु 1 दबाओ, हिंदी के लिए 2 दबाएं, For English press 3.";
      window.Voice.speak(this.ivrSpokenText, "hi-IN");
    } else if (currentLang === "pb") {
      this.ivrSpokenText = "ਕਿਸਾਨਸੇਤੂ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਪੰਜਾਬੀ ਲਈ 1 ਦਬਾਓ, हिंदी के लिए 2 दबाएं, For English press 3.";
      window.Voice.speak(this.ivrSpokenText, "hi-IN");
    } else {
      this.ivrSpokenText = "किसानसेतु में आपका स्वागत है। हिंदी के लिए 1 दबाएं, For English press 2, राजस्थानी सारु 3 दबाओ।";
      window.Voice.speak(this.ivrSpokenText, "hi-IN");
    }
    
    window.App.render();
  },

  endCall() {
    this.ivrCallActive = false;
    this.ivrState = "IDLE";
    this.dialedDigits = "";
    const isEn = (this.ivrLang === "en" || (window.I18N && window.I18N.currentLang === "en"));
    const isPb = (this.ivrLang === "pb" || (window.I18N && window.I18N.currentLang === "pb"));
    const isRaj = (this.ivrLang === "raj" || (window.I18N && window.I18N.currentLang === "raj"));

    if (isEn) {
      this.ivrSpokenText = "Call has ended. Thank you for using KisanSetu Helpline.";
    } else if (isPb) {
      this.ivrSpokenText = "ਕਾਲ ਸਮਾਪਤ ਹੋ ਗਈ ਹੈ। ਕਿਸਾਨਸੇਤੂ ਨਾਲ ਜੁੜਨ ਲਈ ਧੰਨਵਾਦ।";
    } else if (isRaj) {
      this.ivrSpokenText = "कॉल पूरी व्हैगी। किसानसेतु सारु घणी खम्मा।";
    } else {
      this.ivrSpokenText = "कॉल समाप्त हो गई है। किसानसेतु हेल्पलाइन पर संपर्क करने के लिए धन्यवाद।";
    }

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    window.App.render();
  },

  pressDTMF(key) {
    this.playDTMFTone(key);
    this.dialedDigits += key;

    if (!this.ivrCallActive) return;
    const currentLang = window.I18N ? window.I18N.currentLang : "en";

    if (this.ivrState === "LANG_MENU") {
      if (currentLang === "en") {
        if (key === "1") this.ivrLang = "en";
        else if (key === "2") this.ivrLang = "hi";
        else if (key === "3") this.ivrLang = "raj";
      } else {
        if (key === "1") this.ivrLang = "hi";
        else if (key === "2") this.ivrLang = "en";
        else if (key === "3") this.ivrLang = "raj";
      }

      this.ivrState = "MAIN_MENU";
      if (this.ivrLang === "en") {
        this.ivrSpokenText = "Main Menu: Press 1 for Active Token Status, Press 2 for Mandi Rates, Press 3 for Village Dealer, Press 4 for Callback.";
        window.Voice.speak(this.ivrSpokenText, "en-IN");
      } else if (this.ivrLang === "pb") {
        this.ivrSpokenText = "ਮੁੱਖ ਮੀਨੂ: ਟੋਕਨ ਸਥਿਤੀ ਲਈ 1 ਦਬਾਓ, ਮੰਡੀ ਭਾਅ ਲਈ 2 ਦਬਾਓ, ਡੀਲਰ ਲਈ 3 ਦਬਾਓ, ਕਾਲ-ਬੈਕ ਲਈ 4 ਦਬਾਓ।";
        window.Voice.speak(this.ivrSpokenText, "hi-IN");
      } else if (this.ivrLang === "raj") {
        this.ivrSpokenText = "मुख्य मेनू: टोकन स्थिति सारु 1 दबाओ, मंडी भाव सारु 2 दबाओ, ग्राम सहायक सारु 3 दबाओ, कॉल-बैक सारु 4 दबाओ।";
        window.Voice.speak(this.ivrSpokenText, "hi-IN");
      } else {
        this.ivrSpokenText = "मुख्य मेनू: टोकन स्थिति जानने के लिए 1 दबाएं, भाव जानने के लिए 2 दबाएं, ग्राम सहायक से जुड़ने के लिए 3 दबाएं, कॉल-बैक के लिए 4 दबाएं।";
        window.Voice.speak(this.ivrSpokenText, "hi-IN");
      }
    } 
    else if (this.ivrState === "MAIN_MENU") {
      const isEn = (this.ivrLang === "en");
      const isPb = (this.ivrLang === "pb");
      const isRaj = (this.ivrLang === "raj");

      if (key === "1") {
        this.ivrState = "STATUS_INPUT";
        if (isEn) {
          this.ivrSpokenText = "Please enter your token number digits and press # (e.g. 101#).";
        } else if (isPb) {
          this.ivrSpokenText = "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਟੋਕਨ ਨੰਬਰ ਦੇ ਅੰਕ ਦਰਜ ਕਰੋ ਅਤੇ # ਦਬਾਓ (ਉਦਾ. 101#)।";
        } else if (isRaj) {
          this.ivrSpokenText = "टोकन नंबर रो अंक डायल कर # दबाओ (उदा. 101#)।";
        } else {
          this.ivrSpokenText = "कृपया अपने टोकन नंबर के अंक दर्ज करें और # दबाएं (उदा. 101#)।";
        }
        window.Voice.speak(this.ivrSpokenText, isEn ? "en-IN" : "hi-IN");
      } 
      else if (key === "2") {
        if (isEn) {
          this.ivrSpokenText = "Today's live market rate in Jaipur Mandi is ₹2,340 for Wheat and ₹5,780 per quintal for Mustard.";
        } else if (isPb) {
          this.ivrSpokenText = "ਅੱਜ ਜੈਪੁਰ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ਦਾ ਭਾਅ ₹2,340 ਅਤੇ ਸਰ੍ਹੋਂ ਦਾ ਭਾਅ ₹5,780 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ।";
        } else if (isRaj) {
          this.ivrSpokenText = "आज जयपुर मंडी में कणक रो भाव ₹2,340 अर रायड़ो रो भाव ₹5,780 प्रति क्विंटल है।";
        } else {
          this.ivrSpokenText = "आज जयपुर मंडी में गेहूं का भाव ₹2,340 और सरसों का भाव ₹5,780 प्रति क्विंटल है।";
        }
        window.Voice.speak(this.ivrSpokenText, isEn ? "en-IN" : "hi-IN");
      } 
      else if (key === "3") {
        if (isEn) {
          this.ivrSpokenText = "Your nearest authorized village agent is Dinesh Kumawat, Chaksu. Phone: 9829099881.";
        } else if (isPb) {
          this.ivrSpokenText = "ਤੁਹਾਡੇ ਨੇੜਲੇ ਅਧਿਕਾਰਤ ਪਿੰਡ ਸਹਾਇਕ ਦਿਨੇਸ਼ ਕੁਮਾਵਤ, ਚਾਕਸੂ ਹਨ। ਫ਼ੋਨ: 9829099881।";
        } else if (isRaj) {
          this.ivrSpokenText = "थांरो धोरै वालो ग्राम सहायक दिनेश कुमावत, चाकसू है। फ़ोन: 9829099881।";
        } else {
          this.ivrSpokenText = "आपके निकटतम अधिकृत ग्राम सहायक दिनेश कुमावत, चाकसू हैं। संपर्क: 9829099881।";
        }
        window.Voice.speak(this.ivrSpokenText, isEn ? "en-IN" : "hi-IN");
      }
      else if (key === "4") {
        if (isEn) {
          this.ivrSpokenText = "Automated callback reminder confirmed. You will receive a voice update 30 minutes prior to gate arrival.";
        } else if (isPb) {
          this.ivrSpokenText = "ਤੁਹਾਡੇ ਨੰਬਰ 'ਤੇ ਕਾਲ-ਬੈਕ ਰੀਮਾਈਂਡਰ ਦਰਜ ਕਰ ਲਿਆ ਗਿਆ ਹੈ।";
        } else if (isRaj) {
          this.ivrSpokenText = "थांरे नंबर पर कॉल-बैक रिमाइंडर दर्ज व्हैगो।";
        } else {
          this.ivrSpokenText = "आपके नंबर पर ऑटोमेटेड कॉल-बैक रिमाइंडर दर्ज कर लिया गया है। गेट आगमन से 30 मिनट पूर्व आपको कॉल प्राप्त होगी।";
        }
        window.Voice.speak(this.ivrSpokenText, isEn ? "en-IN" : "hi-IN");
      }
    } 
    else if (this.ivrState === "STATUS_INPUT") {
      if (key === "#" || this.dialedDigits.length >= 5) {
        const token = window.State.tokens[0];
        const center = window.State.centers.find(c => c.id === token.centerId) || { name: token.centerId };
        const isEn = (this.ivrLang === "en");
        const isPb = (this.ivrLang === "pb");
        const isRaj = (this.ivrLang === "raj");

        if (isEn) {
          this.ivrSpokenText = `Hello Sita Devi, your token ${token.id} is currently in status ${token.status}. Estimated wait time is ~${token.predictedWaitMin} minutes at ${center.name}.`;
        } else if (isPb) {
          this.ivrSpokenText = `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਸੀਤਾ ਦੇਵੀ, ਤੁਹਾਡਾ ਟੋਕਨ ${token.id} ਇਸ ਵੇਲੇ ${token.status} ਹੈ। ${center.name} ਵਿੱਚ ਅੰਦਾਜ਼ਨ ਇੰਤਜ਼ਾਰ ਲਗਭਗ ${token.predictedWaitMin} ਮਿੰਟ ਹੈ।`;
        } else if (isRaj) {
          this.ivrSpokenText = `खम्मा घणी सीता देवी, थांरो टोकन ${token.id} अबे ${token.status} है। ${center.name} में इंतज़ार लगभग ${token.predictedWaitMin} मिनट है।`;
        } else {
          this.ivrSpokenText = `नमस्ते सीता देवी, आपका टोकन नंबर ${token.id} वर्तमान में ${token.status} है। ${center.name} में अनुमानित इंतज़ार लगभग ${token.predictedWaitMin} मिनट है।`;
        }

        this.ivrState = "SPEAKING";
        window.Voice.speak(this.ivrSpokenText, isEn ? "en-IN" : "hi-IN");
      }
    }

    window.App.render();
  },

  fillSMS(cmd) {
    const input = document.getElementById("sms_sim_input");
    if (input) {
      input.value = cmd;
      input.focus();
    }
  },

  sendSMS() {
    const input = document.getElementById("sms_sim_input");
    const text = input?.value?.trim();
    if (!text) return;

    const currentLang = window.I18N ? window.I18N.currentLang : "en";
    const messages = this.getSMSMessages();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messages.push({ sender: "FARMER", text, time: timeStr });
    input.value = "";
    window.App.render();

    // Process Keyword Command
    setTimeout(() => {
      let reply = "";
      const upper = text.toUpperCase();
      const isEn = (currentLang === "en");
      const isPb = (currentLang === "pb");
      const isRaj = (currentLang === "raj");

      if (upper.startsWith("STATUS")) {
        const parts = upper.split(" ");
        const targetId = parts[1] || "KS-101";
        const token = window.State.tokens.find(t => t.id === targetId) || window.State.tokens[0];
        const center = window.State.centers.find(c => c.id === token.centerId) || { name: "Mandi" };

        if (isEn) {
          reply = `KisanSetu: Token ${token.id} (${token.farmerName}) status: ${token.status}. Mandi: ${center.name}. Estimated wait ~${token.predictedWaitMin} min.`;
        } else if (isPb) {
          reply = `ਕਿਸਾਨਸੇਤੂ: ਟੋਕਨ ${token.id} (${token.farmerName}) ਸਥਿਤੀ: ${token.status}। ਮੰਡੀ: ${center.name}। ਇੰਤਜ਼ਾਰ ~${token.predictedWaitMin} ਮਿੰਟ।`;
        } else if (isRaj) {
          reply = `किसानसेतु: टोकन ${token.id} (${token.farmerName}) स्थिति: ${token.status}। मंडी: ${center.name}। इंतज़ार ~${token.predictedWaitMin} मिनट।`;
        } else {
          reply = `किसानसेतु: टोकन ${token.id} (${token.farmerName}) स्थिति: ${token.status}। मंडी: ${center.name}। इंतज़ार ~${token.predictedWaitMin} मिनट।`;
        }
      } 
      else if (upper.startsWith("BOOK")) {
        const token = window.State.bookToken({
          farmerName: isEn ? "Sita Devi (SMS)" : "सीता देवी (SMS)",
          farmerPhone: "9414098765",
          village: "Bassi, Jaipur",
          centerId: "CTR-ALW-02",
          produce: isEn ? "Wheat" : "गेहूं",
          produceCode: "WHEAT",
          estimatedQuantityKg: 3000,
          bookedVia: "SMS"
        });

        if (isEn) {
          reply = `KisanSetu: Token ${token.id} confirmed! Produce: Wheat. Center: Alwar. Arrival Window: ${token.arrivalWindow}. Show this code at gate.`;
        } else if (isPb) {
          reply = `ਕਿਸਾਨਸੇਤੂ: ਟੋਕਨ ${token.id} ਬੁੱਕ ਹੋਇਆ! ਫਸਲ: ਕਣਕ। ਮੰਡੀ: ਅਲਵਰ। ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ: ${token.arrivalWindow}। ਗੇਟ 'ਤੇ ਇਹ ਕੋਡ ਦਿਖਾਓ।`;
        } else if (isRaj) {
          reply = `किसानसेतु: टोकन ${token.id} बुक व्ह्यो! फसल: कणक। मंडी: अलवर। पूगण रो टैम: ${token.arrivalWindow}। गेट पर कोड दिखाओ।`;
        } else {
          reply = `किसानसेतु: टोकन ${token.id} बुक हुआ! फसल: गेहूं। मंडी: अलवर। पहुंचने का समय: ${token.arrivalWindow}। गेट पर यह कोड दिखाएं।`;
        }
      } 
      else if (upper.startsWith("PRICE")) {
        const p = window.State.prices.find(x => upper.includes(x.code)) || window.State.prices[0];
        if (isEn) {
          reply = `KisanSetu Rate: ${p.produce} Govt MSP ₹${p.mspRate}/qtl. Jaipur Mandi live rate ₹${p.rates['CTR-JPR-01']}/qtl.`;
        } else if (isPb) {
          reply = `ਕਿਸਾਨਸੇਤੂ ਭਾਅ: ${p.produce} ਸਰਕਾਰੀ MSP ₹${p.mspRate}/qtl। ਜੈਪੁਰ ਮੰਡੀ ਭਾਅ ₹${p.rates['CTR-JPR-01']}/qtl।`;
        } else if (isRaj) {
          reply = `किसानसेतु भाव: ${p.produce} सरकारी MSP ₹${p.mspRate}/qtl। जयपुर मंडी भाव ₹${p.rates['CTR-JPR-01']}/qtl।`;
        } else {
          reply = `किसानसेतु भाव: ${p.produce} सरकारी MSP ₹${p.mspRate}/qtl। जयपुर मंडी भाव ₹${p.rates['CTR-JPR-01']}/qtl।`;
        }
      } 
      else {
        if (isEn) {
          reply = "KisanSetu: Invalid command. Send 'STATUS <Token ID>' or 'BOOK JAIPUR WHEAT 30'. Helpline: 1800-SETU-AGRI.";
        } else if (isPb) {
          reply = "ਕਿਸਾਨਸੇਤੂ: ਅਵੈਧ ਸੁਨੇਹਾ। 'STATUS <ਟੋਕਨ>' ਜਾਂ 'BOOK JAIPUR WHEAT' ਲਿਖ ਕੇ ਭੇਜੋ। ਹੈਲਪਲਾਈਨ: 1800-SETU-AGRI।";
        } else if (isRaj) {
          reply = "किसानसेतु: अमान्य संदेश। 'STATUS <टोकन>' या 'BOOK JAIPUR WHEAT' लिखर भेजो। हेल्पलाइन: 1800-SETU-AGRI।";
        } else {
          reply = "किसानसेतु: अमान्य आदेश। 'STATUS <टोकन>' या 'BOOK JAIPUR WHEAT' लिखकर भेजें। हेल्पलाइन: 1800-SETU-AGRI।";
        }
      }

      messages.push({ sender: "SYSTEM", text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      window.App.render();
    }, 600);
  }
};

window.TelephonySimComponent = TelephonySimComponent;

