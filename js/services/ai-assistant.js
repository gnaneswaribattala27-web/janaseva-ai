// Janaseva AI — Bilingual Telugu & English AI Assistant Engine
import { SCHEMES_DATA } from '../data/schemes.js';
import { DOCUMENTS_GUIDE } from '../data/documents.js';
import { GOVT_UPDATES } from '../data/updates.js';

export class JanasevaAssistant {
  constructor() {
    this.apiKey = localStorage.getItem('janaseva_ai_api_key') || '';
    this.apiProvider = localStorage.getItem('janaseva_ai_provider') || 'gemini';
  }

  setApiKey(key, provider = 'gemini') {
    this.apiKey = key;
    this.apiProvider = provider;
    localStorage.setItem('janaseva_ai_api_key', key);
    localStorage.setItem('janaseva_ai_provider', provider);
  }

  async getResponse(userQuery, lang = 'te') {
    const q = userQuery.trim().toLowerCase();

    // If an external API key is configured, try live AI request with local fallback
    if (this.apiKey) {
      try {
        const liveResponse = await this.callExternalAI(userQuery, lang);
        if (liveResponse) return liveResponse;
      } catch (err) {
        console.warn('External AI call failed, falling back to local engine:', err);
      }
    }

    // Local Verified Domain Intelligence Engine
    return this.processLocalQuery(q, userQuery, lang);
  }

  processLocalQuery(q, originalQuery, lang) {
    const isTe = lang === 'te' || /[\u0C00-\u0C7F]/.test(originalQuery);

    // 1. Check for specific schemes
    const matchedScheme = SCHEMES_DATA.find(s => {
      const nameEn = s.nameEn.toLowerCase();
      const nameTe = s.nameTe.toLowerCase();
      const id = s.id.toLowerCase();
      return q.includes(id) || 
             nameEn.split(' ').some(w => w.length > 3 && q.includes(w)) ||
             (s.tags && s.tags.some(t => q.includes(t.toLowerCase())));
    });

    if (matchedScheme) {
      return this.formatSchemeResponse(matchedScheme, q, isTe);
    }

    // 2. Questions about farmer loans / KCC / interest rates
    if (q.includes('loan') || q.includes('రుణం') || q.includes('kcc') || q.includes('వడ్డీ') || q.includes('క్రెడిట్')) {
      const kcc = SCHEMES_DATA.find(s => s.id === 'kcc-farmer-loan');
      return {
        text: isTe
          ? 'రైతుల కోసం కిసాన్ క్రెడిట్ కార్డ్ (KCC) ద్వారా 4% సబ్సిడీ వడ్డీతో ₹3,00,000 వరకు పంట రుణాలు లభిస్తాయి. సకాలంలో చెల్లించే రైతులకు 3% కేంద్ర ప్రభుత్వ వడ్డీ రాయితీ వర్తిస్తుంది. సమీపంలోని బ్యాంక్ లేదా సొసైటీలో పట్టాదారు పాస్ పుస్తకం, ఆధార్ కార్డుతో దరఖాస్తు చేసుకోవచ్చు.'
          : 'Under the Kisan Credit Card (KCC) scheme, farmers can access short-term crop loans up to ₹3,00,000 at an effective subsidized interest rate of 4% per annum upon prompt repayment. You can apply at any commercial or rural bank with your Pattadar Passbook and Aadhaar.',
        matchedSchemes: kcc ? [kcc] : [],
        quickAction: {
          label: isTe ? 'ఈఎంఐ కాలిక్యులేటర్ చూడండి' : 'Open EMI Calculator',
          view: 'farmer-hub'
        }
      };
    }

    // 3. Questions about scholarships / fee reimbursement
    if (q.includes('scholarship') || q.includes('స్కాలర్షిప్') || q.includes('ఫీజు') || q.includes('చదువు') || q.includes('student') || q.includes('college')) {
      const scholarships = SCHEMES_DATA.filter(s => s.category === 'scholarships');
      return {
        text: isTe
          ? 'విద్యార్థుల కోసం నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (NSP), ఆంధ్రప్రదేశ్ జగనన్న విద్యా దీవెన, మరియు తెలంగాణ ఈ-పాస్ (ePASS) పథకాలు అందుబాటులో ఉన్నాయి. వీటి ద్వారా డిగ్రీ, ఇంజనీరింగ్, పాలిటెక్నిక్ విద్యార్థులకు 100% ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ మరియు మెయింటెనెన్స్ అలవెన్స్ లభిస్తుంది.'
          : 'For students, the National Scholarship Portal (NSP), AP Jagananna Vidya Deevena, and Telangana ePASS provide full tuition fee reimbursement and maintenance allowances for Intermediate, Degree, Polytechnic, and Engineering courses.',
        matchedSchemes: scholarships,
        quickAction: {
          label: isTe ? 'స్కాలర్‌షిప్‌లు పరిశీలించండి' : 'Explore Scholarships',
          view: 'scholarships-hub'
        }
      };
    }

    // 4. Questions about documents needed
    if (q.includes('document') || q.includes('పత్రాలు') || q.includes('కాగితాలు') || q.includes('సర్టిఫికేట్') || q.includes('aadhaar') || q.includes('ఆధార్')) {
      return {
        text: isTe
          ? 'ప్రభుత్వ పథకాలకు దరఖాస్తు చేసుకోవడానికి ముఖ్యంగా అవసరమైన పత్రాలు:\n1. ఆధార్ కార్డు (మొబైల్ మరియు NPCI బ్యాంక్ సీడింగ్)\n2. పట్టాదారు పాస్ పుస్తకం / RoR 1-B (రైతులకు)\n3. మీసేవ తాజా ఆదాయ ధ్రువీకరణ పత్రం\n4. కుల ధ్రువీకరణ పత్రం\n5. రేషన్ / రైస్ కార్డు\n6. బ్యాంక్ పాస్ పుస్తకం\n\nమా ఇంటరాక్టివ్ డాక్యుమెంట్ చెక్‌లిస్ట్‌ను ఉపయోగించి మీ పత్రాలను సరిచూసుకోండి.'
          : 'Essential documents required across most Indian welfare schemes include:\n1. Aadhaar Card (with active mobile & NPCI bank seeding)\n2. Pattadar Passbook / 1-B (for farmers)\n3. Income Certificate from Revenue authority\n4. Caste Certificate\n5. Ration / Rice Card\n6. Bank Passbook\n\nUse our interactive Document Preparation Guide to verify yours.',
        matchedSchemes: [],
        quickAction: {
          label: isTe ? 'పత్రాల గైడ్ తెరవండి' : 'Open Document Guide',
          view: 'document-guide'
        }
      };
    }

    // 5. Questions about status check
    if (q.includes('status') || q.includes('స్థితి') || q.includes('చెక్') || q.includes('డబ్బులు రాలేదు') || q.includes('రాలేదు') || q.includes('track')) {
      return {
        text: isTe
          ? 'మీ దరఖాస్తు స్థితిని తనిఖీ చేయడానికి అధికారిక ప్రభుత్వ పోర్టల్ మాత్రమే ఉపయోగించండి:\n- పీఎం కిసాన్: pmkisan.gov.in/BeneficiaryStatus_New.aspx\n- ఏపీ రైతు భరోసా: navasakam.ap.gov.in\n- తెలంగాణ రైతు బంధు: dharani.telangana.gov.in\n- స్కాలర్‌షిప్: scholarships.gov.in\n\nఎట్టి పరిస్థితుల్లోనూ ఓటీపీలు లేదా బ్యాంక్ పిన్‌లు ఎవరితోనూ పంచుకోవద్దు.'
          : 'To check your beneficiary payment status, always use verified government portals:\n- PM-KISAN: pmkisan.gov.in (Beneficiary Status)\n- AP Rythu Bharosa: navasakam.ap.gov.in\n- Telangana: dharani.telangana.gov.in\n- National Scholarships: scholarships.gov.in\n\nNever share OTPs or bank passwords with unauthorized websites.',
        matchedSchemes: [],
        quickAction: {
          label: isTe ? 'అప్లికేషన్ ట్రాకర్ చూడండి' : 'Open Application Tracker',
          view: 'tracker'
        }
      };
    }

    // Default intelligent greeting & suggestions
    const topSchemes = SCHEMES_DATA.slice(0, 3);
    return {
      text: isTe
        ? 'జనసేవ AI లో స్వాగతం! నేను కేంద్ర, ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ప్రభుత్వ పథకాలు, రైతు రుణాలు, పంట బీమా మరియు స్కాలర్‌షిప్‌ల వివరాలను అందించగలను. మీకు ఏ అంశంపై సమాచారం కావాలో కింద ఎంచుకోండి లేదా నేరుగా ప్రశ్న అడగండి.'
        : 'Welcome to Janaseva AI! I can assist you with Central, AP, and Telangana government schemes, farmer loans, crop insurance, and student scholarships. Please ask a specific question or choose from the recommended options below.',
      matchedSchemes: topSchemes,
      suggestions: isTe ? [
        'PM-KISAN అర్హత ఎలా తనిఖీ చేయాలి?',
        'రైతు రుణం పొందడానికి ఏ పత్రాలు అవసరం?',
        'విద్యార్థులకు అందుబాటులో ఉన్న స్కాలర్‌షిప్‌లు ఏమిటి?',
        'నా దరఖాస్తు స్థితిని ఎలా తనిఖీ చేయాలి?'
      ] : [
        'What are the eligibility criteria for PM-KISAN?',
        'Which documents are required for Kisan Credit Card?',
        'What scholarships are available for college students?',
        'How to verify genuine government portals?'
      ]
    };
  }

  formatSchemeResponse(scheme, q, isTe) {
    const isDocQuery = q.includes('document') || q.includes('పత్రాలు') || q.includes('కాగితాలు');
    const isEligQuery = q.includes('eligib') || q.includes('అర్హత') || q.includes('ఎవరు');

    let text = '';
    if (isDocQuery) {
      const docs = isTe ? scheme.requiredDocumentsTe : scheme.requiredDocumentsEn;
      text = isTe
        ? `${scheme.nameTe} కోసం అవసరమైన పత్రాలు:\n` + docs.map(d => `• ${d}`).join('\n')
        : `Required documents for ${scheme.nameEn}:\n` + docs.map(d => `• ${d}`).join('\n');
    } else if (isEligQuery) {
      const criteria = isTe ? scheme.eligibilityCriteriaTe : scheme.eligibilityCriteriaEn;
      const nonElig = isTe ? scheme.whoIsNotEligibleTe : scheme.whoIsNotEligibleEn;
      text = isTe
        ? `${scheme.nameTe} ముఖ్య అర్హతలు:\n` + criteria.map(c => `✓ ${c}`).join('\n') +
          `\n\nఎవరు అర్హులు కారు:\n` + nonElig.slice(0, 3).map(n => `✗ ${n}`).join('\n')
        : `Eligibility criteria for ${scheme.nameEn}:\n` + criteria.map(c => `✓ ${c}`).join('\n') +
          `\n\nWho is NOT eligible:\n` + nonElig.slice(0, 3).map(n => `✗ ${n}`).join('\n');
    } else {
      text = isTe
        ? `**${scheme.nameTe}**\n\n${scheme.shortDescTe}\n\n**ప్రయోజనం:** ${scheme.benefitTe}\n\n**అధికారిక వెబ్‌సైట్:** ${scheme.officialPortalUrl}\n**హెల్ప్‌లైన్:** ${scheme.helpline}`
        : `**${scheme.nameEn}**\n\n${scheme.shortDescEn}\n\n**Benefit:** ${scheme.benefitEn}\n\n**Official Portal:** ${scheme.officialPortalUrl}\n**Helpline:** ${scheme.helpline}`;
    }

    return {
      text,
      matchedSchemes: [scheme],
      officialUrl: scheme.officialPortalUrl
    };
  }

  async callExternalAI(prompt, lang) {
    if (!this.apiKey) return null;
    const isTe = lang === 'te';
    const systemPrompt = `You are Janaseva AI, an authentic assistant for Indian government schemes, farmer welfare, and scholarships. Answer concisely in ${isTe ? 'Telugu' : 'English'}. Never invent government rules or fake URLs. Always cite verified .gov.in sources.`;

    if (this.apiProvider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }] }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return { text: candidate, matchedSchemes: [] };
        }
      }
    }
    return null;
  }
}

export const assistantEngine = new JanasevaAssistant();
