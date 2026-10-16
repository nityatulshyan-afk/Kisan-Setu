// KisanSetu Central Reactive State Store
// Single Source of Truth for Tokens, Centers, Market Prices, Farmers, and Notifications

const DEFAULT_CENTERS = [
  {
    id: "CTR-JPR-01",
    name: "Jaipur APMC Grain Mandi (Muhana)",
    location: "Jaipur, Rajasthan",
    distanceKm: 8.5,
    capacityMax: 80,
    currentQueue: 38,
    avgProcessingMin: 6.5,
    isThrottled: false,
    status: "OPEN",
    contactPhone: "+91 141 2781000",
    operatingHours: "08:00 AM - 06:00 PM"
  },
  {
    id: "CTR-ALW-02",
    name: "Alwar Mustard & Wheat Terminal",
    location: "Alwar, Rajasthan",
    distanceKm: 24.0,
    capacityMax: 60,
    currentQueue: 14,
    avgProcessingMin: 5.0,
    isThrottled: false,
    status: "OPEN",
    contactPhone: "+91 144 2334500",
    operatingHours: "07:30 AM - 05:30 PM"
  },
  {
    id: "CTR-KTA-03",
    name: "Kota Central Krishi Upaj Mandi",
    location: "Kota, Rajasthan",
    distanceKm: 42.0,
    capacityMax: 100,
    currentQueue: 92,
    avgProcessingMin: 8.0,
    isThrottled: true,
    status: "CONGESTED",
    contactPhone: "+91 744 2456700",
    operatingHours: "08:00 AM - 07:00 PM"
  },
  {
    id: "CTR-BKN-04",
    name: "Bikaner Rural Procurement Hub",
    location: "Bikaner, Rajasthan",
    distanceKm: 31.5,
    capacityMax: 50,
    currentQueue: 9,
    avgProcessingMin: 5.5,
    isThrottled: false,
    status: "OPEN",
    contactPhone: "+91 151 2209800",
    operatingHours: "08:30 AM - 05:00 PM"
  }
];

const DEFAULT_PRICES = [
  {
    produce: "Wheat (गेहूं)",
    code: "WHEAT",
    mspRate: 2275,
    rates: {
      "CTR-JPR-01": 2340,
      "CTR-ALW-02": 2385,
      "CTR-KTA-03": 2310,
      "CTR-BKN-04": 2360
    },
    updatedAt: "Today, 08:30 AM",
    source: "APMC / Agmarknet Live"
  },
  {
    produce: "Mustard (सरसों)",
    code: "MUSTARD",
    mspRate: 5650,
    rates: {
      "CTR-JPR-01": 5780,
      "CTR-ALW-02": 5890,
      "CTR-KTA-03": 5710,
      "CTR-BKN-04": 5820
    },
    updatedAt: "Today, 08:30 AM",
    source: "APMC / Agmarknet Live"
  },
  {
    produce: "Gram / Chana (चना)",
    code: "GRAM",
    mspRate: 5440,
    rates: {
      "CTR-JPR-01": 5510,
      "CTR-ALW-02": 5590,
      "CTR-KTA-03": 5480,
      "CTR-BKN-04": 5540
    },
    updatedAt: "Today, 08:30 AM",
    source: "APMC / Agmarknet Live"
  },
  {
    produce: "Bajra (बाजरा)",
    code: "BAJRA",
    mspRate: 2500,
    rates: {
      "CTR-JPR-01": 2580,
      "CTR-ALW-02": 2610,
      "CTR-KTA-03": 2520,
      "CTR-BKN-04": 2630
    },
    updatedAt: "Today, 08:30 AM",
    source: "APMC / Agmarknet Live"
  },
  {
    produce: "Soybean (सोयाबीन)",
    code: "SOYBEAN",
    mspRate: 4600,
    rates: {
      "CTR-JPR-01": 4720,
      "CTR-ALW-02": 4690,
      "CTR-KTA-03": 4780,
      "CTR-BKN-04": 4650
    },
    updatedAt: "Today, 08:30 AM",
    source: "APMC / Agmarknet Live"
  }
];

const DEFAULT_FARMERS = [
  {
    id: "FARMER-01",
    name: "Ramesh Meena (रमेश मीणा)",
    phone: "9829012345",
    village: "Chaksu, Jaipur",
    hasPhone: true,
    persona: "Smartphone App User",
    defaultCenter: "CTR-JPR-01"
  },
  {
    id: "FARMER-02",
    name: "Sita Devi (सीता देवी)",
    phone: "9414098765",
    village: "Bassi, Jaipur",
    hasPhone: true,
    persona: "Feature Phone (IVR & SMS User)",
    defaultCenter: "CTR-ALW-02"
  },
  {
    id: "FARMER-03",
    name: "Bhanwar Lal (भंवर लाल)",
    phone: null,
    village: "Dudu, Jaipur",
    hasPhone: false,
    persona: "No-Phone Offline Farmer (Dealer Proxy)",
    defaultCenter: "CTR-JPR-01"
  },
  {
    id: "FARMER-04",
    name: "Harishankar Jat (हरिशंकर जाट)",
    phone: "9928045678",
    village: "Kotputli, Jaipur",
    hasPhone: true,
    persona: "Smartphone App User",
    defaultCenter: "CTR-ALW-02"
  }
];

const DEFAULT_TOKENS = [
  {
    id: "KS-101",
    farmerId: "FARMER-01",
    farmerName: "Ramesh Meena",
    farmerPhone: "9829012345",
    village: "Chaksu, Jaipur",
    centerId: "CTR-JPR-01",
    produce: "Wheat (गेहूं)",
    produceCode: "WHEAT",
    estimatedQuantityKg: 4000,
    actualWeighedKg: null,
    status: "BOOKED", // 'BOOKED', 'ARRIVED', 'IN_QUEUE', 'WEIGHING', 'GRADED', 'PAID', 'CANCELLED'
    bookedVia: "APP", // 'APP', 'IVR', 'SMS', 'DEALER'
    slotTime: "10:30 AM - 11:30 AM",
    arrivalWindow: "Today, 10:15 AM - 10:45 AM",
    suggestedGrade: null,
    finalGrade: null,
    rateAppliedPerQtl: 2340,
    totalPayoutRupees: null,
    predictedWaitMin: 32,
    createdAt: "Today, 08:45 AM",
    stateHistory: [
      { status: "BOOKED", time: "08:45 AM", by: "Farmer Mobile App" }
    ]
  },
  {
    id: "KS-102",
    farmerId: "FARMER-02",
    farmerName: "Sita Devi",
    farmerPhone: "9414098765",
    village: "Bassi, Jaipur",
    centerId: "CTR-ALW-02",
    produce: "Mustard (सरसों)",
    produceCode: "MUSTARD",
    estimatedQuantityKg: 2500,
    actualWeighedKg: 2480,
    status: "WEIGHING",
    bookedVia: "IVR",
    slotTime: "09:30 AM - 10:30 AM",
    arrivalWindow: "Today, 09:15 AM - 09:45 AM",
    suggestedGrade: "A",
    finalGrade: null,
    rateAppliedPerQtl: 5890,
    totalPayoutRupees: null,
    predictedWaitMin: 12,
    createdAt: "Today, 07:30 AM",
    stateHistory: [
      { status: "BOOKED", time: "07:30 AM", by: "Toll-Free IVR (1800-SETU)" },
      { status: "ARRIVED", time: "09:10 AM", by: "Gate Operator Scanner" },
      { status: "IN_QUEUE", time: "09:15 AM", by: "Queue Management System" },
      { status: "WEIGHING", time: "09:40 AM", by: "Weighbridge Operator" }
    ]
  },
  {
    id: "KS-103",
    farmerId: "FARMER-03",
    farmerName: "Bhanwar Lal",
    farmerPhone: null,
    village: "Dudu, Jaipur",
    centerId: "CTR-JPR-01",
    produce: "Wheat (गेहूं)",
    produceCode: "WHEAT",
    estimatedQuantityKg: 5000,
    actualWeighedKg: 5120,
    status: "PAID",
    bookedVia: "DEALER",
    slotTime: "08:00 AM - 09:00 AM",
    arrivalWindow: "Today, 07:45 AM - 08:15 AM",
    suggestedGrade: "A",
    finalGrade: "A",
    rateAppliedPerQtl: 2340,
    totalPayoutRupees: 119808,
    predictedWaitMin: 0,
    createdAt: "Today, 06:30 AM",
    registeredByDealer: "DLR-JPR-489",
    stateHistory: [
      { status: "BOOKED", time: "06:30 AM", by: "Dealer: Dinesh Kumawat (Chaksu)" },
      { status: "ARRIVED", time: "07:50 AM", by: "Gate Operator Scanner" },
      { status: "IN_QUEUE", time: "07:55 AM", by: "Queue Management System" },
      { status: "WEIGHING", time: "08:20 AM", by: "Weighbridge Scale STF-902" },
      { status: "GRADED", time: "08:40 AM", by: "Produce Optical Scanner" },
      { status: "PAID", time: "09:20 AM", by: "Direct Bank Transfer System" }
    ]
  }
];

class StateManager {
  constructor() {
    this.centers = this.load("kisansetu_centers", DEFAULT_CENTERS);
    this.prices = this.load("kisansetu_prices", DEFAULT_PRICES);
    this.farmers = this.load("kisansetu_farmers", DEFAULT_FARMERS);
    this.tokens = this.load("kisansetu_tokens", DEFAULT_TOKENS);
    this.activeFarmerTokenId = "KS-101";
    this.priceAlerts = this.load("kisansetu_price_alerts", []);
    this.auditLogs = this.load("kisansetu_audit_logs", [
      { id: "LOG-1", timestamp: "08:45 AM", event: "TOKEN_GENERATED", tokenId: "KS-101", centerId: "CTR-JPR-01", details: "Farmer Ramesh Meena booked 40 qtl Wheat" },
      { id: "LOG-2", timestamp: "09:10 AM", event: "GATE_ENTRY", tokenId: "KS-102", centerId: "CTR-ALW-02", details: "Farmer Sita Devi verified at Gate 1" },
      { id: "LOG-3", timestamp: "09:20 AM", event: "PAYMENT_DISBURSED", tokenId: "KS-103", centerId: "CTR-JPR-01", details: "₹1,19,808 sent via DBT to Bhanwar Lal" }
    ]);
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : JSON.parse(JSON.stringify(fallback));
    } catch(e) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {
      console.warn("Storage save error:", e);
    }
  }

  resetToDefaults() {
    this.centers = JSON.parse(JSON.stringify(DEFAULT_CENTERS));
    this.prices = JSON.parse(JSON.stringify(DEFAULT_PRICES));
    this.farmers = JSON.parse(JSON.stringify(DEFAULT_FARMERS));
    this.tokens = JSON.parse(JSON.stringify(DEFAULT_TOKENS));
    this.activeFarmerTokenId = "KS-101";
    this.save("kisansetu_centers", this.centers);
    this.save("kisansetu_prices", this.prices);
    this.save("kisansetu_farmers", this.farmers);
    this.save("kisansetu_tokens", this.tokens);
    this.emitChange();
  }

  emitChange() {
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("kisansetu_state_updated"));
    }
  }

  // F1: Dynamic Wait-Time Prediction Logic
  computePredictedWaitMin(centerId) {
    const center = this.centers.find(c => c.id === centerId);
    if (!center) return 30;
    
    // Formula: (Current Queue * Avg Processing Time per farmer) * Capacity Load Factor
    const loadFactor = center.isThrottled ? 1.8 : (center.currentQueue / center.capacityMax) > 0.8 ? 1.4 : 1.0;
    const baseWait = Math.round(center.currentQueue * center.avgProcessingMin * loadFactor);
    return Math.max(5, baseWait);
  }

  // F2: Smart Center Allocation & Ranking Algorithm
  getRankedCenters(produceCode = "WHEAT", sortCriteria = "BEST_OVERALL") {
    const priceObj = this.prices.find(p => p.code === produceCode) || this.prices[0];

    const scored = this.centers.map(center => {
      const waitMin = this.computePredictedWaitMin(center.id);
      const rate = priceObj.rates[center.id] || priceObj.mspRate;
      const dist = center.distanceKm;

      // Blended Multi-Factor Score: Higher is better
      // Price Benefit Weight: +40, Wait Time Penalty: -35, Distance Penalty: -25
      const priceScore = ((rate - priceObj.mspRate) / 200) * 40;
      const waitScore = Math.max(0, (100 - waitMin)) * 0.35;
      const distScore = Math.max(0, (50 - dist)) * 0.25;
      const throttlePenalty = center.isThrottled ? -100 : 0;

      const totalScore = Math.round(priceScore + waitScore + distScore + throttlePenalty);

      return {
        ...center,
        currentMandiRate: rate,
        predictedWaitMin: waitMin,
        capacityPct: Math.round((center.currentQueue / center.capacityMax) * 100),
        blendedScore: totalScore
      };
    });

    if (sortCriteria === "LEAST_WAIT") {
      return scored.sort((a, b) => a.predictedWaitMin - b.predictedWaitMin);
    }
    if (sortCriteria === "BEST_PRICE") {
      return scored.sort((a, b) => b.currentMandiRate - a.currentMandiRate);
    }
    if (sortCriteria === "NEAREST") {
      return scored.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    // Default: BEST_OVERALL
    return scored.sort((a, b) => b.blendedScore - a.blendedScore);
  }

  // F3: Digital Token Booking
  bookToken(tokenData) {
    const nextNum = this.tokens.length + 101;
    const tokenId = `KS-${nextNum}`;
    const waitMin = this.computePredictedWaitMin(tokenData.centerId);
    
    // Arrival window is computed 30 mins before predicted service
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + (waitMin * 60000));
    const arrivalWindowStr = `Today, ${arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newToken = {
      id: tokenId,
      farmerId: tokenData.farmerId || `FARMER-AUTO-${Date.now().toString().slice(-4)}`,
      farmerName: tokenData.farmerName || "Registered Farmer",
      farmerPhone: tokenData.farmerPhone || null,
      village: tokenData.village || "Local Village",
      centerId: tokenData.centerId,
      produce: tokenData.produce,
      produceCode: tokenData.produceCode || "WHEAT",
      estimatedQuantityKg: Number(tokenData.estimatedQuantityKg) || 3000,
      actualWeighedKg: null,
      status: "BOOKED",
      bookedVia: tokenData.bookedVia || "APP",
      slotTime: arrivalWindowStr,
      arrivalWindow: arrivalWindowStr,
      suggestedGrade: tokenData.suggestedGrade || null,
      finalGrade: null,
      rateAppliedPerQtl: tokenData.rateAppliedPerQtl || 2340,
      totalPayoutRupees: null,
      predictedWaitMin: waitMin,
      createdAt: "Just now",
      registeredByDealer: tokenData.registeredByDealer || null,
      stateHistory: [
        { status: "BOOKED", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), by: tokenData.bookedVia === "DEALER" ? "Village Dealer" : "Farmer Self-Booking" }
      ]
    };

    this.tokens.unshift(newToken);
    this.activeFarmerTokenId = tokenId;

    // Increment center queue
    const center = this.centers.find(c => c.id === tokenData.centerId);
    if (center) {
      center.currentQueue += 1;
    }

    this.auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: "TOKEN_BOOKED",
      tokenId,
      centerId: tokenData.centerId,
      details: `${newToken.farmerName} booked ${newToken.produce} via ${newToken.bookedVia}`
    });

    this.save("kisansetu_tokens", this.tokens);
    this.save("kisansetu_centers", this.centers);
    this.save("kisansetu_audit_logs", this.auditLogs);
    this.emitChange();
    return newToken;
  }

  // F4 & F11: State Machine Transition Engine
  updateTokenStatus(tokenId, newStatus, extraData = {}) {
    const token = this.tokens.find(t => t.id === tokenId);
    if (!token) return false;

    const validTransitions = {
      BOOKED: ["ARRIVED", "CANCELLED"],
      ARRIVED: ["IN_QUEUE", "CANCELLED"],
      IN_QUEUE: ["WEIGHING", "CANCELLED"],
      WEIGHING: ["GRADED", "CANCELLED"],
      GRADED: ["PAID"],
      PAID: [],
      CANCELLED: []
    };

    if (!validTransitions[token.status]?.includes(newStatus)) {
      console.warn(`Invalid state transition from ${token.status} to ${newStatus}`);
    }

    token.status = newStatus;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (extraData.actualWeightKg) token.actualWeighedKg = extraData.actualWeightKg;
    if (extraData.suggestedGrade) token.suggestedGrade = extraData.suggestedGrade;
    if (extraData.finalGrade) token.finalGrade = extraData.finalGrade;
    if (extraData.overrideReason) token.overrideReason = extraData.overrideReason;

    // Calculate payment if GRADED or PAID
    if (newStatus === "PAID" || newStatus === "GRADED") {
      const weight = token.actualWeighedKg || token.estimatedQuantityKg;
      const rate = token.rateAppliedPerQtl;
      let gradeMultiplier = 1.0;
      if (token.finalGrade === "B") gradeMultiplier = 0.98;
      if (token.finalGrade === "C") gradeMultiplier = 0.94;
      
      token.totalPayoutRupees = Math.round((weight / 100) * rate * gradeMultiplier);
    }

    token.stateHistory.push({
      status: newStatus,
      time: timeStr,
      by: extraData.staffId || "Staff Console Operator",
      reason: extraData.overrideReason || null
    });

    // Update center queues if complete or cancelled
    if (newStatus === "PAID" || newStatus === "CANCELLED") {
      const center = this.centers.find(c => c.id === token.centerId);
      if (center && center.currentQueue > 0) {
        center.currentQueue -= 1;
      }
    }

    this.auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      event: `STATUS_${newStatus}`,
      tokenId: token.id,
      centerId: token.centerId,
      details: `Token status transitioned to ${newStatus}`
    });

    this.save("kisansetu_tokens", this.tokens);
    this.save("kisansetu_centers", this.centers);
    this.save("kisansetu_audit_logs", this.auditLogs);
    this.emitChange();
    return true;
  }

  // F10: Officer Throttling Controls
  toggleCenterThrottle(centerId, isThrottled) {
    const center = this.centers.find(c => c.id === centerId);
    if (center) {
      center.isThrottled = isThrottled;
      center.status = isThrottled ? "CONGESTED" : "OPEN";
      this.save("kisansetu_centers", this.centers);
      this.emitChange();
    }
  }

  updatePrice(produceCode, centerId, newRate) {
    const p = this.prices.find(x => x.code === produceCode);
    if (p && p.rates) {
      p.rates[centerId] = Number(newRate);
      p.updatedAt = "Just now (Officer Update)";
      this.save("kisansetu_prices", this.prices);
      this.emitChange();
    }
  }

  subscribePriceAlert(phone, produceCode, targetPrice) {
    this.priceAlerts.push({ phone, produceCode, targetPrice, time: "Just now" });
    this.save("kisansetu_price_alerts", this.priceAlerts);
  }
}

window.State = new StateManager();

