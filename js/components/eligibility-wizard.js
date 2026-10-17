// Janaseva AI — 6-Step Eligibility Evaluation Wizard Component
import { t } from '../i18n.js';
import { SCHEMES_DATA } from '../data/schemes.js';

const TOTAL_STEPS = 6;

/* ------------------------------------------------------------------ *
 * Defaults
 * ------------------------------------------------------------------ */

export const DEFAULT_WIZARD_ANSWERS = {
  state: 'andhra-pradesh',
  occupation: 'farmer',
  ageGroup: '18-35',            // was '18-50' -> matched no <option>
  annualIncome: 'under-2.5-lakh',
  education: 'degree',
  landOwnership: 'yes',
  landAcres: '3',
  socialCategory: 'bc',
  hasRationCard: 'yes'          // was missing from the default object
};

/* ------------------------------------------------------------------ *
 * Safe string helpers (answers are user input — always escape)
 * ------------------------------------------------------------------ */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const escapeAttr = escapeHtml;

function clampStep(rawStep) {
  const parsed = Number.parseInt(rawStep, 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(Math.max(parsed, 1), TOTAL_STEPS);
}

/* ------------------------------------------------------------------ *
 * Scheme field accessors (defensive — data may be partial)
 * ------------------------------------------------------------------ */

function schemeName(scheme, isTe) {
  return (isTe ? scheme.nameTe || scheme.nameEn : scheme.nameEn || scheme.nameTe) || scheme.id;
}

function schemeBenefit(scheme, isTe) {
  return (isTe ? scheme.benefitTe || scheme.benefitEn : scheme.benefitEn || scheme.benefitTe) || '';
}

/* ------------------------------------------------------------------ *
 * Bilingual copy for machine-generated evaluation output
 * ------------------------------------------------------------------ */

const REASONS = {
  landOwner: {
    te: 'పట్టాదారు పాస్ పుస్తకంతో భూమి యాజమాన్యం నిర్ధారించబడింది',
    en: 'Land ownership with Pattadar Passbook verified'
  },
  smallMarginal: {
    te: 'చిన్న & సన్నకారు రైతు (5 ఎకరాల లోపు)',
    en: 'Small & marginal landholding (up to 5 acres)'
  },
  apResident: {
    te: 'ఆంధ్రప్రదేశ్ నివాసి',
    en: 'Andhra Pradesh resident'
  },
  ownerOrTenant: {
    te: 'సొంత భూమి రైతు లేదా CCRC కౌలు రైతు',
    en: 'Owner cultivator or CCRC tenant farmer'
  },
  apNoLand: {
    te: 'ఆంధ్రప్రదేశ్‌లో సాగు భూమి నమోదు కావాలి',
    en: 'Requires registered cultivable land in Andhra Pradesh'
  },
  tgResident: {
    te: 'తెలంగాణ నివాసి',
    en: 'Telangana resident'
  },
  dharaniLand: {
    te: 'ధరణి నమోదిత పట్టాదారు భూమి',
    en: 'Dharani-registered Pattadar land'
  },
  tgNoLand: {
    te: 'తెలంగాణలో ధరణి నమోదిత భూమి అవసరం',
    en: 'Requires Dharani-registered land in Telangana'
  },
  cultivator: {
    te: 'సాగుదారు ప్రొఫైల్',
    en: 'Cultivator profile'
  },
  interestSubvention: {
    te: '4% వడ్డీ రాయితీకి అర్హత',
    en: 'Eligible for 4% interest subvention'
  },
  artisanTrade: {
    te: 'చేతివృత్తి / కళాకారుడు వృత్తి ప్రొఫైల్',
    en: 'Artisan / craftsperson trade profile'
  },
  adult: {
    te: '18 సంవత్సరాలు పైబడిన వయస్సు',
    en: 'Above 18 years of age'
  },
  notArtisan: {
    te: 'వృత్తి చేతివృత్తి లేదా వీధి వ్యాపారి కాదు',
    en: 'Occupation is not artisan / street vendor'
  },
  bplIncome: {
    te: 'BPL ఆదాయ విభాగం (₹1.5 లక్ష లోపు)',
    en: 'BPL income bracket (below ₹1.5 lakh)'
  },
  ruralHousing: {
    te: 'గ్రామీణ గృహ సహాయానికి అర్హత',
    en: 'Rural housing assistance eligible'
  },
  studentNotEligible: {
    te: 'విద్యార్థులకు ఈ పథకం వర్తించదు',
    en: 'Students are not covered under this scheme'
  },
  incomeAboveBpl: {
    te: 'ఆదాయం BPL పరిమితి కంటే ఎక్కువ',
    en: 'Household income exceeds the BPL ceiling'
  },
  notStudent: {
    te: 'ప్రస్తుతం చదువుతున్న విద్యార్థి కాదు / వయస్సు పరిమితి వెలుపల',
    en: 'Not a currently enrolled student within the eligible age band'
  },
  incomeAboveCeiling: {
    te: 'కుటుంబ ఆదాయం పథకం పరిమితి (₹5 లక్ష) కంటే ఎక్కువ',
    en: 'Family income exceeds the scheme ceiling of ₹5,00,000'
  },
  student: {
    te: 'ప్రస్తుతం చదువుతున్న విద్యార్థి',
    en: 'Currently enrolled student'
  },
  incomeCeiling: {
    te: 'కుటుంబ ఆదాయం పథకం పరిమితిలో ఉంది',
    en: 'Family income within the scheme ceiling'
  },
  rationCard: {
    te: 'తెల్ల రేషన్ కార్డు లేదా 70+ సీనియర్ అర్హత',
    en: 'White Ration Card holder, or 70+ senior eligibility'
  },
  bplHealth: {
    te: 'BPL ఆరోగ్య పరిమితిలో ఉంది',
    en: 'Within the BPL health assistance ceiling'
  }
};

const NOTES = {
  pmKisanLand: {
    te: 'అర్జీదారు పేరిట సాగు భూమి నమోదై ఉండాలి. కౌలు రైతులు ఈ పథకం పరిధిలో లేరు.',
    en: 'Requires cultivable agricultural land registered in the applicant’s name. Tenant farmers are not covered.'
  },
  kccProfile: {
    te: 'సాగుదారు హోదా నిర్ధారణ కోసం బ్యాంకు శాఖను సంప్రదించండి. కౌలు ఒప్పంద పత్రాలు అవసరం కావచ్చు.',
    en: 'Visit your bank branch to confirm cultivator status. A tenancy agreement / CCRC may be required.'
  },
  healthVerify: {
    te: 'SECC / PM-JAY అర్హత జాబితాలో మీ కుటుంబం ఉందో లేదో అధికారిక పోర్టల్‌లో ధృవీకరించుకోండి.',
    en: 'Verify whether your household appears in the SECC / PM-JAY eligibility list on the official portal.'
  },
  genericVerify: {
    te: 'మీ ప్రొఫైల్ ఆధారంగా స్వయంచాలకంగా ధృవీకరించలేకపోయాము. అధికారిక పోర్టల్‌లో నిబంధనలు సరిచూసుకోండి.',
    en: 'We could not auto-verify this scheme against your profile. Please confirm the criteria on the official portal.'
  }
};

function reasonLabel(code, isTe) {
  const entry = REASONS[code];
  if (!entry) return code;
  return isTe ? entry.te : entry.en;
}

function noteLabel(code, isTe) {
  const entry = NOTES[code];
  if (!entry) return code;
  return isTe ? entry.te : entry.en;
}

/* ------------------------------------------------------------------ *
 * Main renderer
 * ------------------------------------------------------------------ */

export function renderEligibilityWizard(state = {}) {
  const lang = state.language || 'te';
  const isTe = lang === 'te';
  const step = clampStep(state.wizardStep);
  const answers = { ...DEFAULT_WIZARD_ANSWERS, ...(state.wizardAnswers || {}) };

  return `
    <div class="max-w-4xl mx-auto px-3 sm:px-6 py-6">
      <!-- Wizard Card Header -->
      <div class="bg-white border border-[#D5D9D9] rounded-xl shadow-sm p-4 sm:p-6 mb-6">
        <div class="flex items-center justify-between border-b pb-3 mb-4 gap-3">
          <div class="min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-[#0F1111] flex items-center gap-2">
              <span class="w-2.5 h-6 bg-[#FF9900] rounded-sm"></span>
              ${escapeHtml(t('eligibilityChecker', lang))}
            </h2>
            <p class="text-xs text-[#565959] mt-0.5">
              ${isTe
                ? 'మీ వివరాలు నమోదు చేసి మీకు వర్తించే ప్రభుత్వ పథకాలను క్షణాల్లో తెలుసుకోండి'
                : 'Answer a few quick questions to discover your verified welfare scheme matches'}
            </p>
          </div>

          <div class="text-right flex-shrink-0">
            <span class="text-xs font-bold text-[#007185]">
              ${isTe ? `దశ ${step} / ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}
            </span>
          </div>
        </div>

        <!-- Progress Bar Stepper -->
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden"
             role="progressbar"
             aria-valuemin="1"
             aria-valuemax="${TOTAL_STEPS}"
             aria-valuenow="${step}">
          <div class="bg-[#FF9900] h-2.5 rounded-full transition-all duration-300"
               style="width: ${(step / TOTAL_STEPS) * 100}%"></div>
        </div>

        <!-- Wizard Step Contents -->
        <div>
          ${renderStepContent(step, answers, lang)}
        </div>

        <!-- Wizard Navigation Footer -->
        <div class="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between gap-3">
          ${step > 1
            ? `<button type="button" onclick="window.appHandlers.prevWizardStep()" class="btn-amazon-outline text-xs py-2 px-4">
                 ← ${isTe ? 'వెనుకకు' : 'Previous'}
               </button>`
            : `<div></div>`}

          ${step < TOTAL_STEPS
            ? `<button type="button" onclick="window.appHandlers.nextWizardStep()" class="btn-amazon-primary text-xs py-2 px-6">
                 ${isTe ? 'తరువాత →' : 'Continue →'}
               </button>`
            : `<div class="flex items-center gap-2">
                 <button type="button" onclick="window.appHandlers.resetWizard()" class="btn-amazon-outline text-xs py-2 px-4">
                   ${isTe ? 'మళ్లీ ప్రారంభించండి' : 'Start Again'}
                 </button>
                 <button type="button" onclick="window.appHandlers.saveWizardResults()" class="btn-amazon-secondary text-xs py-2 px-4">
                   ${isTe ? 'ఫలితాలు భద్రపరచండి' : 'Save Results'}
                 </button>
               </div>`}
        </div>
      </div>
    </div>
  `;
}

/* ------------------------------------------------------------------ *
 * Step router
 * ------------------------------------------------------------------ */

function renderStepContent(step, answers, lang) {
  const isTe = lang === 'te';

  switch (step) {
    case 1: return renderStepState(answers, isTe);
    case 2: return renderStepOccupation(answers, isTe);
    case 3: return renderStepIncome(answers, isTe);
    case 4: return renderStepLand(answers, isTe);
    case 5: return renderStepCategory(answers, isTe);
    case 6: return renderStepResults(answers, isTe, lang);
    default: return '';
  }
}

/* -------------------------- Step 1 --------------------------------- */

function renderStepState(answers, isTe) {
  const options = [
    {
      id: 'andhra-pradesh',
      name: isTe ? 'ఆంధ్రప్రదేశ్' : 'Andhra Pradesh',
      desc: isTe ? 'రైతు భరోసా, విద్యా దీవెన, ఆరోగ్యశ్రీ' : 'Rythu Bharosa, Vidya Deevena'
    },
    {
      id: 'telangana',
      name: isTe ? 'తెలంగాణ' : 'Telangana',
      desc: isTe ? 'రైతు బంధు, ఈ-పాస్, ఆరోగ్యశ్రీ' : 'Rythu Bandhu, TG ePASS'
    },
    {
      id: 'other',
      name: isTe ? 'ఇతర రాష్ట్రాలు' : 'Other Indian States',
      desc: isTe ? 'కేంద్ర ప్రభుత్వ పథకాలు వర్తిస్తాయి' : 'Central Government Schemes'
    }
  ];

  return `
    <div>
      <h3 class="text-base font-bold text-gray-900 mb-2">
        ${isTe ? 'దశ 1: మీ రాష్ట్రాన్ని ఎంచుకోండి' : 'Step 1: Select Your State'}
      </h3>
      <p class="text-xs text-gray-500 mb-4">
        ${isTe ? 'పథకాల అర్హత మీ నివాస రాష్ట్రంపై ఆధారపడి ఉంటుంది.' : 'Welfare scheme benefits vary based on state jurisdiction.'}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        ${options.map(opt => {
          const checked = answers.state === opt.id;
          return `
            <label class="cursor-pointer border rounded-lg p-4 flex flex-col justify-between transition ${
              checked
                ? 'border-[#FF9900] bg-orange-50/40 ring-2 ring-[#FF9900]/40'
                : 'border-gray-300 hover:bg-gray-50'
            }">
              <div class="flex items-center justify-between mb-2 gap-2">
                <span class="font-bold text-sm text-gray-900">${escapeHtml(opt.name)}</span>
                <input type="radio"
                       name="wizard-state"
                       value="${escapeAttr(opt.id)}"
                       ${checked ? 'checked' : ''}
                       onchange="window.appHandlers.updateWizardAnswer('state', this.value)"
                       class="text-[#FF9900] focus:ring-[#FF9900]" />
              </div>
              <span class="text-xs text-gray-500">${escapeHtml(opt.desc)}</span>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* -------------------------- Step 2 --------------------------------- */

function renderStepOccupation(answers, isTe) {
  const options = [
    { id: 'farmer', title: isTe ? 'రైతు (సొంత భూమి)' : 'Farmer (Landowner)' },
    { id: 'tenant-farmer', title: isTe ? 'కౌలు రైతు' : 'Tenant Farmer' },
    { id: 'student', title: isTe ? 'విద్యార్థి' : 'Student' },
    { id: 'artisan', title: isTe ? 'చేతివృత్తుల కళాకారుడు' : 'Artisan / Craftsperson' },
    { id: 'street-vendor', title: isTe ? 'వీధి వ్యాపారి' : 'Street Vendor' },
    { id: 'woman-entrepreneur', title: isTe ? 'మహిళా వ్యాపారవేత్త' : 'Woman Entrepreneur' },
    { id: 'senior-citizen', title: isTe ? 'వృద్ధుడు (60+)' : 'Senior Citizen (60+)' },
    { id: 'labourer', title: isTe ? 'వ్యవసాయ కూలి / ఇతర' : 'Labourer / Other' }
  ];

  return `
    <div>
      <h3 class="text-base font-bold text-gray-900 mb-2">
        ${isTe ? 'దశ 2: మీ ప్రధాన వృత్తిని ఎంచుకోండి' : 'Step 2: Select Your Occupation'}
      </h3>
      <p class="text-xs text-gray-500 mb-4">
        ${isTe ? 'మీ జీవనోపాధి ఆధారంగా అర్హత పథకాలు ఫిల్టర్ చేయబడతాయి.' : 'Schemes are customized based on your primary source of livelihood.'}
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        ${options.map(occ => {
          const checked = answers.occupation === occ.id;
          return `
            <label class="cursor-pointer border rounded-lg p-3 text-center transition ${
              checked
                ? 'border-[#FF9900] bg-orange-50 font-bold text-gray-900 ring-2 ring-[#FF9900]/40'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }">
              <input type="radio"
                     name="wizard-occupation"
                     value="${escapeAttr(occ.id)}"
                     ${checked ? 'checked' : ''}
                     onchange="window.appHandlers.updateWizardAnswer('occupation', this.value)"
                     class="sr-only" />
              <span>${escapeHtml(occ.title)}</span>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* -------------------------- Step 3 --------------------------------- */

function renderStepIncome(answers, isTe) {
  const incomeOptions = [
    { id: 'under-1.5-lakh', te: '₹1,50,000 లోపు (BPL / నిరుపేద)', en: 'Below ₹1,50,000 (BPL)' },
    { id: 'under-2.5-lakh', te: '₹1,50,000 నుండి ₹2,50,000 లోపు', en: '₹1,50,000 to ₹2,50,000' },
    { id: 'under-5-lakh', te: '₹2,50,000 నుండి ₹5,00,000 లోపు', en: '₹2,50,000 to ₹5,00,000' },
    { id: 'above-5-lakh', te: '₹5,00,000 కంటే ఎక్కువ', en: 'Above ₹5,00,000' }
  ];

  const ageOptions = [
    { id: 'under-18', te: '18 సంవత్సరాల లోపు', en: 'Below 18 years' },
    { id: '18-35', te: '18 నుండి 35 సంవత్సరాలు', en: '18 to 35 years' },
    { id: '36-59', te: '36 నుండి 59 సంవత్సరాలు', en: '36 to 59 years' },
    { id: '60-plus', te: '60 సంవత్సరాలు పైబడిన వారు (సీనియర్)', en: '60+ years (Senior Citizen)' },
    { id: '70-plus', te: '70 సంవత్సరాలు పైబడిన వారు (ఆయుష్మాన్ ఉచితం)', en: '70+ years (Ayushman Vay Vandana)' }
  ];

  return `
    <div>
      <h3 class="text-base font-bold text-gray-900 mb-2">
        ${isTe ? 'దశ 3: ప్రాథమిక వివరాలు & వార్షిక ఆదాయం' : 'Step 3: Age & Family Annual Income'}
      </h3>
      <p class="text-xs text-gray-500 mb-4">
        ${isTe ? 'ఆర్థిక పరిమితులు చాలా ప్రభుత్వ పథకాలకు ప్రధాన ప్రమాణం.' : 'Income threshold is a primary criterion for social welfare and scholarships.'}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5" for="wizard-annual-income">
            ${isTe ? 'కుటుంబ వార్షిక ఆదాయం (రూపాయల్లో)' : 'Annual Household Income'}
          </label>
          <select id="wizard-annual-income"
                  onchange="window.appHandlers.updateWizardAnswer('annualIncome', this.value)"
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-[#FF9900]">
            ${incomeOptions.map(o => `
              <option value="${escapeAttr(o.id)}" ${answers.annualIncome === o.id ? 'selected' : ''}>
                ${escapeHtml(isTe ? o.te : o.en)}
              </option>
            `).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5" for="wizard-age-group">
            ${isTe ? 'వయస్సు వర్గం' : 'Age Group'}
          </label>
          <select id="wizard-age-group"
                  onchange="window.appHandlers.updateWizardAnswer('ageGroup', this.value)"
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-[#FF9900]">
            ${ageOptions.map(o => `
              <option value="${escapeAttr(o.id)}" ${answers.ageGroup === o.id ? 'selected' : ''}>
                ${escapeHtml(isTe ? o.te : o.en)}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    </div>
  `;
}

/* -------------------------- Step 4 --------------------------------- */

function renderStepLand(answers, isTe) {
  const hasLand = answers.landOwnership !== 'no';
  const safeAcres = /^\d{0,3}(\.\d{0,2})?$/.test(String(answers.landAcres ?? ''))
    ? String(answers.landAcres)
    : '';

  return `
    <div>
      <h3 class="text-base font-bold text-gray-900 mb-2">
        ${isTe ? 'దశ 4: వ్యవసాయ & భూమి వివరాలు' : 'Step 4: Agricultural Land Details'}
      </h3>
      <p class="text-xs text-gray-500 mb-4">
        ${isTe
          ? 'రైతు సంక్షేమ పథకాలు, ఇన్‌పుట్ సబ్సిడీలు మరియు సోలార్ పంపుల కోసం అవసరం.'
          : 'Required for PM-KISAN, Rythu Bharosa, KCC loans, and PM-KUSUM.'}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5" for="wizard-land-ownership">
            ${isTe ? 'భూమి యాజమాన్యం' : 'Land Ownership'}
          </label>
          <select id="wizard-land-ownership"
                  onchange="window.appHandlers.updateWizardAnswer('landOwnership', this.value)"
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-[#FF9900]">
            <option value="yes" ${answers.landOwnership === 'yes' ? 'selected' : ''}>
              ${isTe ? 'అవును, పట్టాదారు పాస్ పుస్తకం ఉంది' : 'Yes, Own Land with Pattadar Passbook'}
            </option>
            <option value="tenant" ${answers.landOwnership === 'tenant' ? 'selected' : ''}>
              ${isTe ? 'కౌలు రైతు (CCRC ఒప్పందం)' : 'Tenant Farmer (CCRC / Agreement)'}
            </option>
            <option value="no" ${answers.landOwnership === 'no' ? 'selected' : ''}>
              ${isTe ? 'భూమి లేదు / వ్యవసాయేతర' : 'No Agricultural Land'}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5" for="wizard-land-acres">
            ${isTe ? 'సుమారు భూమి విస్తీర్ణం (ఎకరాలలో)' : 'Land Area in Acres'}
          </label>
          <input id="wizard-land-acres"
                 type="number"
                 inputmode="decimal"
                 min="0"
                 max="100"
                 step="0.5"
                 value="${escapeAttr(safeAcres)}"
                 ${hasLand ? '' : 'disabled'}
                 oninput="window.appHandlers.updateWizardAnswer('landAcres', this.value)"
                 class="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-[#FF9900] disabled:bg-gray-100 disabled:text-gray-400"
                 placeholder="e.g. 2.5" />
          ${hasLand
            ? ''
            : `<p class="text-[11px] text-gray-500 mt-1">${isTe ? 'భూమి లేని వారికి ఈ వివరాలు అవసరం లేదు.' : 'Not required if you do not hold agricultural land.'}</p>`}
        </div>
      </div>
    </div>
  `;
}

/* -------------------------- Step 5 --------------------------------- */

function renderStepCategory(answers, isTe) {
  const categories = [
    { id: 'bc', label: 'BC / OBC (వెనుకబడిన తరగతులు)' },
    { id: 'sc', label: 'SC (షెడ్యూల్డ్ కులాలు)' },
    { id: 'st', label: 'ST (షెడ్యూల్డ్ తెగలు)' },
    { id: 'minority', label: 'Minority (మైనారిటీ)' },
    { id: 'general', label: 'General / EBC' }
  ];

  return `
    <div>
      <h3 class="text-base font-bold text-gray-900 mb-2">
        ${isTe ? 'దశ 5: సామాజిక వర్గం & రేషన్ కార్డు' : 'Step 5: Social Category & Ration Card'}
      </h3>
      <p class="text-xs text-gray-500 mb-4">
        ${isTe
          ? 'రిజర్వేషన్ ఆధారిత సబ్సిడీలు మరియు ఆరోగ్య కార్డుల కోసం.'
          : 'Determines special subventions, fee waivers, and cashless health card benefits.'}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5" for="wizard-social-category">
            ${isTe ? 'సామాజిక వర్గం (రిజర్వేషన్ కేటగిరీ)' : 'Social Category'}
          </label>
          <select id="wizard-social-category"
                  onchange="window.appHandlers.updateWizardAnswer('socialCategory', this.value)"
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-[#FF9900]">
            ${categories.map(c => `
              <option value="${escapeAttr(c.id)}" ${answers.socialCategory === c.id ? 'selected' : ''}>
                ${escapeHtml(c.label)}
              </option>
            `).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5" for="wizard-ration-card">
            ${isTe ? 'తెల్ల రేషన్ కార్డు / రైస్ కార్డు ఉందా?' : 'Do you have a White / Rice Ration Card?'}
          </label>
          <select id="wizard-ration-card"
                  onchange="window.appHandlers.updateWizardAnswer('hasRationCard', this.value)"
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs bg-white focus:ring-2 focus:ring-[#FF9900]">
            <option value="yes" ${answers.hasRationCard === 'yes' ? 'selected' : ''}>
              ${isTe ? 'అవును, రైస్ కార్డు ఉంది' : 'Yes, have a Rice Card'}
            </option>
            <option value="no" ${answers.hasRationCard === 'no' ? 'selected' : ''}>
              ${isTe ? 'లేదు' : 'No'}
            </option>
          </select>
        </div>
      </div>
    </div>
  `;
}

/* -------------------------- Step 6 --------------------------------- */

function renderStepResults(answers, isTe, lang) {
  const { eligible, conditional, notEligible } = evaluateSchemes(answers);

  return `
    <div>
      <div class="bg-[#E7F4F5] border border-[#B8E4E8] rounded-lg p-4 mb-6">
        <h3 class="text-base font-bold text-[#007185] mb-1 flex items-center gap-1.5">
          <svg class="w-5 h-5 text-[#067D62]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          ${isTe ? 'మీ అర్హత పరిశీలన పూర్తయింది!' : 'Eligibility Evaluation Completed!'}
        </h3>
        <p class="text-xs text-gray-700">
          ${isTe
            ? `మీరు నమోదు చేసిన వివరాల ప్రకారం <strong>${eligible.length}</strong> పథకాలు సూటిగా సరిపోలాయి. దయచేసి అధికారిక పోర్టల్‌లో తుది నియమాలను సరిచూసుకోండి.`
            : `Based on your responses, <strong>${eligible.length}</strong> schemes appear to be a potential match. Confirm exact criteria on the official government portals.`}
        </p>
      </div>

      ${eligible.length === 0
        ? `<div class="border border-gray-300 bg-gray-50 rounded-lg p-4 mb-6 text-xs text-gray-700">
             ${isTe
               ? 'ప్రస్తుత వివరాల ప్రకారం ఎటువంటి పథకం నేరుగా సరిపోలలేదు. క్రింద ధ్రువీకరణ అవసరమైన పథకాలను చూడండి.'
               : 'No scheme matched directly with the details provided. Review the schemes that need verification below.'}
           </div>`
        : ''}

      <!-- Eligible Section (Green) -->
      <div class="mb-6">
        <h4 class="font-bold text-sm text-[#067D62] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span>●</span>
          ${isTe ? 'అర్హత కలిగిన పథకాలు' : 'Potentially Eligible Schemes'} (${eligible.length})
        </h4>
        <div class="space-y-3">
          ${eligible.map(match => {
            const scheme = match.scheme;
            const reasons = (match.reasonCodes || [])
              .map(code => escapeHtml(reasonLabel(code, isTe)))
              .join(', ');
            const portalUrl = scheme.officialPortalUrl || '';

            return `
              <div class="border border-green-300 bg-green-50/40 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="badge-amazon-verified text-[10px] font-bold">
                      ${isTe ? 'సరిపోలిన ప్రమాణం' : 'Matching Criteria'}
                    </span>
                    ${scheme.badge ? `<span class="text-xs text-gray-600">${escapeHtml(scheme.badge)}</span>` : ''}
                  </div>
                  <h5 class="font-bold text-sm text-gray-900">${escapeHtml(schemeName(scheme, isTe))}</h5>
                  <p class="text-xs text-green-900 font-semibold mt-0.5">${escapeHtml(schemeBenefit(scheme, isTe))}</p>
                  ${reasons
                    ? `<div class="text-[11px] text-gray-600 mt-2">
                         <strong>${isTe ? 'సరిపోలిన అంశాలు:' : 'Matched rules:'}</strong> ${reasons}
                       </div>`
                    : ''}
                </div>
                <div class="flex sm:flex-col items-stretch sm:items-center justify-end gap-2 flex-shrink-0">
                  <button type="button"
                          onclick="window.appHandlers.openSchemeDetails('${escapeAttr(scheme.id)}')"
                          class="btn-amazon-outline text-xs py-1.5 px-3 w-full">
                    ${escapeHtml(t('viewDetails', lang))}
                  </button>
                  ${portalUrl
                    ? `<a href="${escapeAttr(portalUrl)}" target="_blank" rel="noopener noreferrer"
                          class="btn-amazon-primary text-xs py-1.5 px-3 w-full text-center">
                         ${escapeHtml(t('officialPortal', lang))} ↗
                       </a>`
                    : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Pending Verification Section (Amber) -->
      ${conditional.length > 0
        ? `<div class="mb-6">
             <h4 class="font-bold text-sm text-[#E47911] uppercase tracking-wider mb-3 flex items-center gap-1.5">
               <span>●</span>
               ${isTe ? 'మరింత ధ్రువీకరణ అవసరం' : 'Needs Official Verification'} (${conditional.length})
             </h4>
             <div class="space-y-3">
               ${conditional.map(cond => {
                 const scheme = cond.scheme;
                 return `
                   <div class="border border-orange-200 bg-orange-50/30 rounded-lg p-3.5 flex flex-col sm:flex-row justify-between gap-3 text-xs">
                     <div class="min-w-0">
                       <h5 class="font-bold text-gray-900">${escapeHtml(schemeName(scheme, isTe))}</h5>
                       <p class="text-gray-600 mt-1">${escapeHtml(noteLabel(cond.noteCode, isTe))}</p>
                     </div>
                     <button type="button"
                             onclick="window.appHandlers.openSchemeDetails('${escapeAttr(scheme.id)}')"
                             class="btn-amazon-outline text-xs py-1.5 px-3 self-end sm:self-center flex-shrink-0">
                       ${escapeHtml(t('viewDetails', lang))}
                     </button>
                   </div>
                 `;
               }).join('')}
             </div>
           </div>`
        : ''}

      <!-- Not Eligible Section (Collapsed, Grey) -->
      ${notEligible.length > 0
        ? `<details class="border border-gray-200 rounded-lg bg-gray-50/60">
             <summary class="cursor-pointer select-none px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
               ${isTe ? 'అర్హత లేని పథకాలు' : 'Not Eligible'} (${notEligible.length})
             </summary>
             <div class="px-4 pb-4 space-y-2">
               ${notEligible.map(item => {
                 const scheme = item.scheme;
                 const reasons = (item.reasonCodes || [])
                   .map(code => escapeHtml(reasonLabel(code, isTe)))
                   .join(', ');
                 return `
                   <div class="border border-gray-200 bg-white rounded-lg p-3 text-xs">
                     <h5 class="font-bold text-gray-700">${escapeHtml(schemeName(scheme, isTe))}</h5>
                     ${reasons ? `<p class="text-gray-500 mt-1">${reasons}</p>` : ''}
                   </div>
                 `;
               }).join('')}
             </div>
           </details>`
        : ''}
    </div>
  `;
}

/* ------------------------------------------------------------------ *
 * Evaluation engine
 * ------------------------------------------------------------------ */

export function evaluateSchemes(answers = {}) {
  const a = { ...DEFAULT_WIZARD_ANSWERS, ...answers };

  const eligible = [];
  const conditional = [];
  const notEligible = [];

  const addTo = (list, scheme, payload) => {
    if (!list.some(entry => entry.scheme.id === scheme.id)) {
      list.push({ scheme, ...payload });
    }
  };

  const acres = Number.parseFloat(a.landAcres);
  const isSmallLandholder = Number.isFinite(acres) && acres > 0 && acres <= 5;

  const isCultivator =
    a.occupation === 'farmer' ||
    a.occupation === 'tenant-farmer' ||
    a.landOwnership === 'yes' ||
    a.landOwnership === 'tenant';

  SCHEMES_DATA.forEach(scheme => {
    /* ---------- Scheme-specific rules ---------- */

    if (scheme.id === 'pm-kisan') {
      if (a.landOwnership === 'yes') {
        addTo(eligible, scheme, {
          reasonCodes: isSmallLandholder ? ['landOwner', 'smallMarginal'] : ['landOwner']
        });
      } else {
        addTo(conditional, scheme, { noteCode: 'pmKisanLand' });
      }
      return;
    }

    if (scheme.id === 'rythu-bharosa-ap') {
      if (a.state !== 'andhra-pradesh') return; // state scheme — irrelevant elsewhere
      if (a.landOwnership === 'yes' || (a.landOwnership === 'tenant' && a.socialCategory !== 'general')) {
        addTo(eligible, scheme, { reasonCodes: ['apResident', 'ownerOrTenant'] });
      } else {
        addTo(notEligible, scheme, { reasonCodes: ['apNoLand'] });
      }
      return;
    }

    if (scheme.id === 'rythu-bandhu-tg') {
      if (a.state !== 'telangana') return;
      if (a.landOwnership === 'yes') {
        addTo(eligible, scheme, { reasonCodes: ['tgResident', 'dharaniLand'] });
      } else {
        addTo(notEligible, scheme, { reasonCodes: ['tgNoLand'] });
      }
      return;
    }

    if (scheme.id === 'kcc-farmer-loan') {
      if (isCultivator) {
        addTo(eligible, scheme, { reasonCodes: ['cultivator', 'interestSubvention'] });
      } else {
        addTo(conditional, scheme, { noteCode: 'kccProfile' });
      }
      return;
    }

    if (scheme.id === 'pm-vishwakarma') {
      if (a.occupation === 'artisan' || a.occupation === 'street-vendor') {
        addTo(eligible, scheme, { reasonCodes: ['artisanTrade', 'adult'] });
      } else {
        addTo(notEligible, scheme, { reasonCodes: ['notArtisan'] });
      }
      return;
    }

    if (scheme.id === 'pm-awas-gramin') {
      if (a.annualIncome === 'under-1.5-lakh' && a.occupation !== 'student') {
        addTo(eligible, scheme, { reasonCodes: ['bplIncome', 'ruralHousing'] });
      } else if (a.occupation === 'student') {
        addTo(notEligible, scheme, { reasonCodes: ['studentNotEligible'] });
      } else {
        addTo(notEligible, scheme, { reasonCodes: ['incomeAboveBpl'] });
      }
      return;
    }

    /* ---------- Category-wide rules ---------- */

    if (scheme.category === 'scholarships') {
      const isStudentAge = a.ageGroup === 'under-18' || a.ageGroup === '18-35';

      if (a.occupation !== 'student' || !isStudentAge) {
        addTo(notEligible, scheme, { reasonCodes: ['notStudent'] });
      } else if (a.annualIncome === 'above-5-lakh') {
        addTo(notEligible, scheme, { reasonCodes: ['incomeAboveCeiling'] });
      } else {
        addTo(eligible, scheme, { reasonCodes: ['student', 'incomeCeiling'] });
      }
      return;
    }

    if (scheme.category === 'health') {
      // Fixed: was `hasRationCard !== 'no'`, which also passed for `undefined`
      const healthEligible =
        a.hasRationCard === 'yes' ||
        a.ageGroup === '70-plus' ||
        a.annualIncome === 'under-1.5-lakh';

      if (healthEligible) {
        addTo(eligible, scheme, { reasonCodes: ['rationCard', 'bplHealth'] });
      } else {
        addTo(conditional, scheme, { noteCode: 'healthVerify' });
      }
      return;
    }

    /* ---------- Anything we cannot auto-verify ---------- */
    addTo(conditional, scheme, { noteCode: 'genericVerify' });
  });

  return { eligible, conditional, notEligible };
}