import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header & Nav
    appName: "RAKSHAK",
    tagline: "Protect. Connect. Respond.",
    navHome: "Home",
    navHowItWorks: "How It Works",
    navResources: "Safety Resources",
    navTrack: "Track Report",
    btnReportConcern: "Report a Concern",
    btnResponderDashboard: "Responder Dashboard",
    btnAdminDashboard: "Admin Analytics",
    
    // Landing Page Hero
    heroTitle: "Turn a moment of concern into a moment of protection.",
    heroSubhead: "Rakshak connects people who notice vulnerable children with a coordinated response ecosystem — quickly, safely and anonymously.",
    heroPrimaryCTA: "Report a Child Safety Concern",
    heroSecondaryCTA: "See How It Works",
    privacyBanner: "Privacy-first • Anonymous reporting available",
    emergencyCardTitle: "Is a child in immediate danger?",
    emergencyCardText: "Seek immediate assistance through local emergency services.",
    
    // Process Steps
    stepSpot: "SPOT",
    stepSpotDesc: "Notice something that doesn't feel right.",
    stepReport: "REPORT",
    stepReportDesc: "Submit a quick report without creating an account.",
    stepTriage: "TRIAGE",
    stepTriageDesc: "AI assists in classifying and prioritizing the report.",
    stepConnect: "CONNECT",
    stepConnectDesc: "Route the case to the appropriate response category.",
    stepRespond: "RESPOND",
    stepRespondDesc: "Authorized responders verify and act.",
    aiHumanMotto: "AI assists. Humans decide.",
    disclaimerMotto: "Designed to complement existing child-protection systems, not replace them.",

    // Reporting Wizard
    reportHeadline: "See something? You can help.",
    reportSubhead: "You don't need to know exactly what's happening to report a concern.",
    step1Title: "What did you notice?",
    step2Title: "Where did you notice it?",
    step3Title: "What did you see?",
    btnUseLocation: "Use my current location",
    locationTypeRailway: "Railway Station",
    locationTypeBus: "Bus Terminal",
    locationTypeMetro: "Metro Station",
    locationTypeHub: "Transit Hub",
    locationTypePublic: "Public Place",
    locationTypeOther: "Other",
    descPlaceholder: "Example: A child who appears around 12 years old was alone near platform 4 and seemed distressed.",
    optAge: "Approximate Age",
    optGender: "Apparent Gender",
    optClothing: "Clothing Description",
    optDirection: "Direction of Travel",
    optPlatform: "Platform / Gate / Stand",
    optTime: "Approximate Time",
    photoTitle: "Upload a photo if safe and appropriate",
    photoWarning: "Do not put yourself or the child in danger to collect evidence.",
    faceBlurLabel: "Blur faces automatically for privacy",
    anonymousToggle: "Submit anonymously",
    btnNext: "Next Step",
    btnBack: "Back",
    btnSubmitSecurely: "Submit Securely",
    btnEdit: "Edit Details",
    
    // Types of Incident
    incLost: "Child appears lost",
    incDistressed: "Child appears distressed",
    incSolo: "Child travelling alone",
    incTrafficking: "Possible trafficking concern",
    incAbuse: "Possible abuse/exploitation",
    incBullying: "Bullying or harassment",
    incOther: "Other concern",

    // Tracking
    trackTitle: "Track Case Status",
    trackSubtitle: "Enter your unique Case ID to view high-level resolution progress.",
    trackPlaceholder: "Enter Case ID (e.g. RB-2026-10482)",
    trackBtn: "Track Report",
    
    // Status Labels
    statusNew: "Report Received",
    statusTriaged: "AI Triage Completed",
    statusReview: "Human Review Initiated",
    statusRouted: "Routed to Responders",
    statusAssigned: "Responder Assigned",
    statusIntervention: "Ground Intervention",
    statusResolved: "Case Resolved"
  },
  hi: {
    // Header & Nav
    appName: "रक्षक",
    tagline: "सुरक्षा। संपर्क। कार्रवाई।",
    navHome: "होम",
    navHowItWorks: "कार्यप्रणाली",
    navResources: "सुरक्षा संसाधन",
    navTrack: "रिपोर्ट ट्रैक करें",
    btnReportConcern: "चिंता की रिपोर्ट करें",
    btnResponderDashboard: "रिस्पॉन्डर डैशबोर्ड",
    btnAdminDashboard: "एडमिन एनालिटिक्स",
    
    // Landing Page Hero
    heroTitle: "चिंता के एक पल को सुरक्षा के अवसर में बदलें।",
    heroSubhead: "रक्षक संकटग्रस्त बच्चों को देखने वाले नागरिकों को एक समन्वित सुरक्षा नेटवर्क से जोड़ता है - त्वरित, सुरक्षित और गुमनाम रूप से।",
    heroPrimaryCTA: "बाल सुरक्षा चिंता की रिपोर्ट करें",
    heroSecondaryCTA: "देखें यह कैसे काम करता है",
    privacyBanner: "गोपनीयता प्रथम • गुमनाम रिपोर्टिंग उपलब्ध",
    emergencyCardTitle: "क्या बच्चा तत्काल खतरे में है?",
    emergencyCardText: "स्थानीय आपातकालीन सेवाओं के माध्यम से तत्काल सहायता प्राप्त करें।",

    // Process Steps
    stepSpot: "पहचानें",
    stepSpotDesc: "यदि कुछ संदिग्ध या अनुचित लगे तो ध्यान दें।",
    stepReport: "रिपोर्ट करें",
    stepReportDesc: "बिना अकाउंट बनाए त्वरित रिपोर्ट जमा करें।",
    stepTriage: "वर्गीकरण",
    stepTriageDesc: "एआई रिपोर्ट को वर्गीकृत और प्राथमिकता देने में मदद करता है।",
    stepConnect: "जोड़ें",
    stepConnectDesc: "मामले को उपयुक्त प्रतिक्रिया टीम तक पहुंचाएं।",
    stepRespond: "कार्रवाई",
    stepRespondDesc: "अधिकृत रिस्पॉन्डर सत्यापित करते हैं और कार्रवाई करते हैं।",
    aiHumanMotto: "AI सहायता करता है। इंसान फैसला लेते हैं।",
    disclaimerMotto: "मौजूदा बाल संरक्षण प्रणालियों का पूरक बनने के लिए डिज़ाइन किया गया है, उन्हें बदलने के लिए नहीं।",

    // Reporting Wizard
    reportHeadline: "कुछ देखा? आप मदद कर सकते हैं।",
    reportSubhead: "रिपोर्ट करने के लिए आपको पूरी बात जानना आवश्यक नहीं है।",
    step1Title: "आपने क्या देखा?",
    step2Title: "आपने इसे कहां देखा?",
    step3Title: "विवरण प्रदान करें",
    btnUseLocation: "मेरे वर्तमान स्थान का उपयोग करें",
    locationTypeRailway: "रेलवे स्टेशन",
    locationTypeBus: "बस टर्मिनल",
    locationTypeMetro: "मेट्रो स्टेशन",
    locationTypeHub: "ट्रांजिट हब",
    locationTypePublic: "सार्वजनिक स्थान",
    locationTypeOther: "अन्य",
    descPlaceholder: "उदाहरण: प्लेटफ़ॉर्म 4 के पास लगभग 12 साल का बच्चा अकेला और परेशान दिख रहा था।",
    optAge: "अनुमानित उम्र",
    optGender: "संभावित लिंग",
    optClothing: "कपड़ों का विवरण",
    optDirection: "यात्रा की दिशा",
    optPlatform: "प्लेटफ़ॉर्म / गेट नंबर",
    optTime: "अनुमानित समय",
    photoTitle: "यदि सुरक्षित हो तो फोटो अपलोड करें",
    photoWarning: "साक्ष्य जुटाने के लिए खुद को या बच्चे को खतरे में न डालें।",
    faceBlurLabel: "गोपनीयता के लिए चेहरों को स्वचालित रूप से धुंधला करें",
    anonymousToggle: "गुमनाम रूप से सबमिट करें",
    btnNext: "आगे बढ़ें",
    btnBack: "पीछे जाएं",
    btnSubmitSecurely: "सुरक्षित रूप से सबमिट करें",
    btnEdit: "विवरण संपादित करें",

    // Types of Incident
    incLost: "बच्चा खोया हुआ प्रतीत होता है",
    incDistressed: "बच्चा परेशान या डरा हुआ दिख रहा है",
    incSolo: "बच्चा अकेला यात्रा कर रहा है",
    incTrafficking: "संभावित तस्करी की चिंता",
    incAbuse: "संभावित शोषण / दुर्व्यवहार",
    incBullying: "धमकाना या उत्पीड़न",
    incOther: "अन्य चिंता",

    // Tracking
    trackTitle: "रिपोर्ट स्थिति ट्रैक करें",
    trackSubtitle: "प्रगति देखने के लिए अपनी अनूठी केस आईडी दर्ज करें।",
    trackPlaceholder: "केस आईडी दर्ज करें (जैसे RB-2026-10482)",
    trackBtn: "रिपोर्ट खोजें",

    // Status Labels
    statusNew: "रिपोर्ट प्राप्त हुई",
    statusTriaged: "AI समीक्षा पूर्ण",
    statusReview: "मानव समीक्षा शुरू",
    statusRouted: "टीम को भेजा गया",
    statusAssigned: "रिस्पॉन्डर नियुक्त",
    statusIntervention: "स्थल पर कार्रवाई",
    statusResolved: "मामला हल हुआ"
  },
  mr: {
    // Header & Nav
    appName: "रक्षक",
    tagline: "सुरक्षित करा. जोडा. प्रतिसाद द्या.",
    navHome: "मुख्य पृष्ठ",
    navHowItWorks: "हे कसे कार्य करते",
    navResources: "सुरक्षा संसाधने",
    navTrack: "रिपोर्ट ट्रॅक करा",
    btnReportConcern: "घटनेची नोंद करा",
    btnResponderDashboard: "प्रतिसादकर्ता डैशबोर्ड",
    btnAdminDashboard: "अ‍ॅडमिन विश्लेषणात्मक",
    
    // Landing Page Hero
    heroTitle: "काळजीच्या एका क्षणाला सुरक्षेच्या क्षणात बदला.",
    heroSubhead: "रक्षक अडचणीतील मुलांना पाहणाऱ्या नागरिकांना जलद, सुरक्षित आणि अनामितपणे प्रतिसाद यंत्रणेशी जोडतो.",
    heroPrimaryCTA: "बाल सुरक्षेची नोंद करा",
    heroSecondaryCTA: "हे कसे कार्य करते ते पहा",
    privacyBanner: "गोपनीयता प्रथम • अनामित नोंदणी उपलब्ध",
    emergencyCardTitle: "मूल तत्काळ धोक्यात आहे का?",
    emergencyCardText: "स्थानिक आणीबाणी सेवांद्वारे त्वरित मदत घ्या.",

    // Process Steps
    stepSpot: "ओळखा",
    stepSpotDesc: "काहीतरी चुकीचे वाटल्यास लक्ष द्या.",
    stepReport: "नोंद करा",
    stepReportDesc: "खाते न उघडता त्वरित माहिती द्या.",
    stepTriage: "वर्गीकरण",
    stepTriageDesc: "AI अहवाल वर्गीकृत करण्यास मदत करते.",
    stepConnect: "जोडा",
    stepConnectDesc: "योग्य प्रतिसाद टीमकडे प्रकरण वर्ग करा.",
    stepRespond: "प्रतिसाद",
    stepRespondDesc: "अधिकृत प्रतिसादक पडताळणी करतात आणि कारवाई करतात.",
    aiHumanMotto: "AI मदत करते. मानवाचा निर्णय.",
    disclaimerMotto: "विद्यमान बाल संरक्षण प्रणालींना पूरक म्हणून डिझाइन केलेले.",

    // Reporting Wizard
    reportHeadline: "काही पाहिले? तुम्ही मदत करू शकता.",
    reportSubhead: "माहिती देण्यासाठी सर्व काही माहित असणे आवश्यक नाही.",
    step1Title: "तुम्ही काय पाहिले?",
    step2Title: "तुम्ही कुठे पाहिले?",
    step3Title: "तपशील द्या",
    btnUseLocation: "माझे वर्तमान स्थान वापरा",
    locationTypeRailway: "रेल्वे स्टेशन",
    locationTypeBus: "बस टर्मिनल",
    locationTypeMetro: "मेट्रो स्टेशन",
    locationTypeHub: "वाहतूक हब",
    locationTypePublic: "सार्वजनिक ठिकाण",
    locationTypeOther: "इतर",
    descPlaceholder: "उदाहरण: प्लॅटफॉर्म ४ जवळ सुमारे १२ वर्षांचे मूल एकटे आणि घाबरलेले दिसले.",
    optAge: "अंदाजे वय",
    optGender: "संभाव्य लिंग",
    optClothing: "कपड्यांचे वर्णन",
    optDirection: "प्रवासाची दिशा",
    optPlatform: "प्लॅटफॉर्म / गेट क्रमांक",
    optTime: "अंदाजे वेळ",
    photoTitle: "सुरक्षित असल्यास फोटो अपलोड करा",
    photoWarning: "पुरावे गोळा करण्यासाठी स्वतःला किंवा मुलाला धोक्यात घालू नका.",
    faceBlurLabel: "गोपनीयतेसाठी चेहरे स्वयंचलितपणे अस्पष्ट करा",
    anonymousToggle: "अनामितपणे सबमिट करा",
    btnNext: "पुढील पायरी",
    btnBack: "मागे जा",
    btnSubmitSecurely: "सुरक्षितपणे सबमिट करा",
    btnEdit: "तपशील संपादन करा",

    // Types of Incident
    incLost: "मूल हरवलेले दिसते",
    incDistressed: "मूल घाबरलेले किंवा अस्वस्थ दिसते",
    incSolo: "मूल एकटे प्रवास करत आहे",
    incTrafficking: "संभाव्य तस्करीची शंका",
    incAbuse: "संभाव्य शोषण",
    incBullying: "छळ किंवा त्रास देणे",
    incOther: "इतर काळजी",

    // Tracking
    trackTitle: "अहवाल स्थिती ट्रॅक करा",
    trackSubtitle: "प्रगती पाहण्यासाठी तुमची केस आयडी प्रविष्ट करा.",
    trackPlaceholder: "केस आयडी प्रविष्ट करा (उदा. RB-2026-10482)",
    trackBtn: "शोध घ्या",

    // Status Labels
    statusNew: "अहवाल प्राप्त झाला",
    statusTriaged: "AI वर्गीकरण पूर्ण",
    statusReview: "समीक्षा सुरू झाली",
    statusRouted: "टीम कडे पाठवले",
    statusAssigned: "प्रतिसादक नियुक्त",
    statusIntervention: "घटनास्थळी कारवाई",
    statusResolved: "प्रकरण सोडवले"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('rakshak_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rakshak_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
