// KisanSetu Multilingual Voice Assistant (F5)
// Built using Web Speech API with Hindi (hi-IN) and English (en-IN) Speech Recognition & Synthesis

class VoiceAssistant {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.synth = window.speechSynthesis || null;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.emit("voice_start");
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        this.handleTranscript(transcript, confidence);
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isListening = false;
        this.emit("voice_error", { error: event.error });
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.emit("voice_end");
      };
    }
  }

  startListening(lang) {
    if (!this.recognition) {
      this.emit("voice_unsupported");
      return;
    }
    const currentLang = window.I18N ? window.I18N.currentLang : 'hi';
    const targetLang = lang || (currentLang === 'en' ? 'en-IN' : 'hi-IN');
    try {
      this.recognition.lang = targetLang;
      this.recognition.start();
    } catch (e) {
      console.warn("Recognition already active or failed:", e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Parse Voice Intent & Formulate Spoken Response
  handleTranscript(text, confidence) {
    const isEn = window.I18N && window.I18N.currentLang === 'en';
    const lower = text.toLowerCase().trim();
    let intent = "UNKNOWN";
    let responseText = "";
    let action = null;

    // 1. Status Check Intent
    if (lower.includes("status") || lower.includes("स्थिति") || lower.includes("टोकन") || lower.includes("कहाँ पहुँचा") || lower.includes("नंबर") || lower.includes("token")) {
      intent = "CHECK_STATUS";
      const token = window.State.tokens.find(t => t.id === window.State.activeFarmerTokenId) || window.State.tokens[0];
      if (token) {
        if (isEn) {
          responseText = `Hello friend, your token ${token.id} is currently in ${token.status}. Estimated wait time is ~${token.predictedWaitMin} minutes.`;
        } else {
          const statusMap = {
            BOOKED: "बुक हो चुका है",
            ARRIVED: "गेट पर आगमन दर्ज है",
            IN_QUEUE: "कतार में है",
            WEIGHING: "कांटे पर तौलाई हो रही है",
            GRADED: "ग्रेडिंग पूरी हो चुकी है",
            PAID: "भुगतान खाते में भेज दिया गया है"
          };
          const statusText = statusMap[token.status] || token.status;
          responseText = `किसान भाई, आपका टोकन नंबर ${token.id} वर्तमान में ${statusText}। अनुमानित इंतज़ार लगभग ${token.predictedWaitMin} मिनट है।`;
        }
      } else {
        responseText = isEn ? "No active token found. Would you like to book a new token?" : "आपका कोई सक्रिय टोकन नहीं मिला। क्या आप नया टोकन बुक करना चाहते हैं?";
      }
    }
    // 2. Best Mandi Recommendation Intent
    else if (lower.includes("मंडी") || lower.includes("mandi") || lower.includes("center") || lower.includes("कहाँ जाऊं") || lower.includes("नज़दीक") || lower.includes("भीड़") || lower.includes("best")) {
      intent = "RECOMMEND_CENTER";
      const ranked = window.State.getRankedCenters("WHEAT", "BEST_OVERALL");
      const best = ranked[0];
      if (isEn) {
        responseText = `The best recommendation is ${best.name}, where wait time is only ${best.predictedWaitMin} minutes and wheat price is ₹${best.currentMandiRate} per quintal.`;
      } else {
        responseText = `आपके लिए सबसे बढ़िया विकल्प ${best.name} है, जहाँ इंतज़ार सिर्फ ${best.predictedWaitMin} मिनट है और गेहूं का भाव ₹${best.currentMandiRate} प्रति क्विंटल है।`;
      }
      action = { type: "HIGHLIGHT_CENTER", centerId: best.id };
    }
    // 3. Price Inquiry Intent
    else if (lower.includes("भाव") || lower.includes("दाम") || lower.includes("rate") || lower.includes("price") || lower.includes("msp") || lower.includes("गेहूं") || lower.includes("wheat") || lower.includes("mustard") || lower.includes("सरसों")) {
      intent = "CHECK_PRICE";
      const wheatPrice = window.State.prices.find(p => p.code === "WHEAT");
      const mustardPrice = window.State.prices.find(p => p.code === "MUSTARD");
      if (isEn) {
        responseText = `Today in Jaipur Mandi, Wheat is ₹${wheatPrice?.rates["CTR-JPR-01"] || 2340} and Mustard is ₹${mustardPrice?.rates["CTR-JPR-01"] || 5780} per quintal.`;
      } else {
        responseText = `आज जयपुर मंडी में गेहूं का भाव ₹${wheatPrice?.rates["CTR-JPR-01"] || 2340} और सरसों का भाव ₹${mustardPrice?.rates["CTR-JPR-01"] || 5780} प्रति क्विंटल चल रहा है।`;
      }
    }
    // 4. Booking Intent
    else if (lower.includes("बुक") || lower.includes("book") || lower.includes("पर्ची") || lower.includes("token")) {
      intent = "BOOK_TOKEN";
      responseText = isEn ? "Opening token booking form. Please confirm your crop and quantity." : "टोकन बुकिंग फॉर्म खोल दिया गया है। कृपया अपनी फसल और अनुमानित वजन की पुष्टि करें।";
      action = { type: "OPEN_BOOKING_MODAL" };
    }
    // Default fallback
    else {
      responseText = isEn ? `I heard: "${text}". You can ask about token status, mandi prices, or best center recommendations.` : `मैंने सुना: "${text}"। आप टोकन स्टेटस, आज का भाव, या सबसे अच्छी मंडी के बारे में पूछ सकते हैं।`;
    }

    this.emit("voice_response", {
      transcript: text,
      intent,
      responseText,
      action
    });

    this.speak(responseText, isEn ? "en-IN" : "hi-IN");
  }

  speak(text, lang) {
    if (!this.synth) return;
    this.synth.cancel(); // Stop prior speech

    const isEn = window.I18N && window.I18N.currentLang === 'en';
    const targetLang = lang || (isEn ? 'en-IN' : 'hi-IN');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.95; // Clear pace for clarity

    // Select Hindi/Indian English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => (targetLang.startsWith('en') ? v.lang.includes("en-IN") || v.lang.includes("en") : v.lang.includes("hi")) || v.name.includes("India"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.synth.speak(utterance);
  }

  emit(eventName, detail = {}) {
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent(`kisansetu_${eventName}`, { detail }));
    }
  }
}

window.Voice = new VoiceAssistant();

