// Janaseva AI — Homepage Sections: Category Tiles, Deadlines, Updates, How-It-Works
import { t } from '../i18n.js';
import { SCHEMES_DATA } from '../data/schemes.js';
import { GOVT_UPDATES } from '../data/updates.js';

export function renderHomeSections(state) {
  const lang = state.language || 'te';
  const isTe = lang === 'te';

  // 10 Amazon-style quick access category tiles
  const categoryTiles = [
    { title: isTe ? 'రైతు రుణాలు' : 'Farmer Loans', desc: 'KCC 4% Subvention', icon: '🏛️', view: 'farmer-hub' },
    { title: isTe ? 'వ్యవసాయ సబ్సిడీలు' : 'Agri Subsidies', desc: 'Solar & Machinery', icon: '🌱', view: 'schemes', cat: 'agriculture' },
    { title: isTe ? 'విద్యార్థి స్కాలర్‌షిప్‌లు' : 'Scholarships', desc: '100% Tuition Fee', icon: '🎓', view: 'scholarships-hub' },
    { title: isTe ? 'పంట బీమా' : 'Crop Insurance', desc: 'PMFBY 1.5% Premium', icon: '🛡️', view: 'schemes', cat: 'agriculture' },
    { title: isTe ? 'మహిళా సంక్షేమం' : 'Women Welfare', desc: 'Sukanya 8.2% & Loans', icon: '🤝', view: 'schemes', cat: 'women-family' },
    { title: isTe ? 'గృహ నిర్మాణం' : 'Housing Schemes', desc: 'PMAY-G ₹1.3 Lakh', icon: '🏠', view: 'schemes', cat: 'housing' },
    { title: isTe ? 'ఆరోగ్యశ్రీ & వైద్యం' : 'Health & Medicine', desc: '₹5L Cashless Cover', icon: '🏥', view: 'schemes', cat: 'health' },
    { title: isTe ? 'చిరు వ్యాపార రుణాలు' : 'Micro Credit', desc: 'SVANidhi & MSME', icon: '💼', view: 'schemes', cat: 'skill-employment' },
    { title: isTe ? 'పత్రాల గైడ్' : 'Document Guide', desc: 'Aadhaar, RoR, MeeSeva', icon: '📋', view: 'document-guide' },
    { title: isTe ? 'అర్హత పరీక్ష' : 'Eligibility Wizard', desc: '6-Step Instant Match', icon: '⚡', view: 'eligibility' }
  ];

  // Recommended schemes (top 4 schemes based on location)
  const recommended = SCHEMES_DATA.slice(0, 4);

  // Verified updates
  const updates = GOVT_UPDATES.slice(0, 3);

  return `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-10">
      
      <!-- Section 1: Quick Access Amazon-Style Category Tiles -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg sm:text-xl font-bold text-[#0F1111] flex items-center gap-2">
            <span class="w-2 h-5 bg-[#FF9900] rounded-sm"></span>
            ${isTe ? 'ప్రముఖ విభాగాలు & సేవలు' : 'Quick Access Categories & Services'}
          </h2>
          <button onclick="window.appRouter.navigate('schemes')" class="text-xs text-[#007185] hover:underline font-semibold">
            ${t('seeAll', lang)} →
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          ${categoryTiles.map(tile => `
            <div 
              onclick="${tile.cat ? `window.appRouter.navigate('${tile.view}', { category: '${tile.cat}' })` : `window.appRouter.navigate('${tile.view}')`}"
              class="amazon-card hover:border-[#FF9900] cursor-pointer flex flex-col justify-between p-3.5 transition group">
              <div>
                <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">${tile.icon}</div>
                <h3 class="text-xs sm:text-sm font-bold text-[#0F1111] group-hover:text-[#007185] leading-snug">
                  ${tile.title}
                </h3>
              </div>
              <div class="text-[11px] text-[#565959] mt-1 font-medium truncate">
                ${tile.desc}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 2: Application Deadlines & Important Updates -->
      <div class="amazon-card border-[#D5D9D9]">
        <div class="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-[#0F1111] flex items-center gap-2">
              <span class="w-2 h-5 bg-[#E47911] rounded-sm"></span>
              ${t('deadlinesTitle', lang)}
            </h2>
            <p class="text-xs text-[#565959]">
              ${isTe ? 'అధికారికంగా ధ్రువీకరించబడిన దరఖాస్తు గడువులు మాత్రమే ప్రదర్శించబడతాయి' : 'Only officially confirmed government notification dates are displayed'}
            </p>
          </div>
          <span class="badge-amazon-verified text-[11px] font-bold hidden sm:inline">
            Official Portals Verified
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Deadline Card 1: NSP -->
          <div class="border border-yellow-300 bg-yellow-50/50 rounded-lg p-3.5 flex flex-col justify-between text-xs">
            <div>
              <div class="flex items-center justify-between text-[11px] font-bold text-yellow-800 mb-1">
                <span>Central Portal</span>
                <span class="bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded">Nov 30, 2026</span>
              </div>
              <h4 class="font-bold text-gray-900 text-sm mb-1">National Scholarship Portal (NSP)</h4>
              <p class="text-gray-600 mb-2">OTR Face RD biometric registration for Post-Matric scholarships.</p>
            </div>
            <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" class="btn-amazon-primary text-xs py-1.5 text-center w-full">
              Open scholarships.gov.in ↗
            </a>
          </div>

          <!-- Deadline Card 2: PM-KISAN -->
          <div class="border border-green-300 bg-green-50/50 rounded-lg p-3.5 flex flex-col justify-between text-xs">
            <div>
              <div class="flex items-center justify-between text-[11px] font-bold text-green-800 mb-1">
                <span>Central DBT</span>
                <span class="bg-green-200 text-green-900 px-2 py-0.5 rounded">Always Open</span>
              </div>
              <h4 class="font-bold text-gray-900 text-sm mb-1">PM-KISAN New Registration & e-KYC</h4>
              <p class="text-gray-600 mb-2">Aadhaar e-KYC and farmer registration open round the year.</p>
            </div>
            <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" class="btn-amazon-primary text-xs py-1.5 text-center w-full">
              Open pmkisan.gov.in ↗
            </a>
          </div>

          <!-- Deadline Card 3: Telangana ePASS -->
          <div class="border border-blue-300 bg-blue-50/50 rounded-lg p-3.5 flex flex-col justify-between text-xs">
            <div>
              <div class="flex items-center justify-between text-[11px] font-bold text-blue-800 mb-1">
                <span>Telangana State</span>
                <span class="bg-blue-200 text-blue-900 px-2 py-0.5 rounded">Dec 31, 2026</span>
              </div>
              <h4 class="font-bold text-gray-900 text-sm mb-1">Telangana ePASS Post-Matric</h4>
              <p class="text-gray-600 mb-2">Fresh & renewal applications for college fee reimbursement.</p>
            </div>
            <a href="https://telanganaepass.cgg.gov.in" target="_blank" rel="noopener noreferrer" class="btn-amazon-primary text-xs py-1.5 text-center w-full">
              Open telanganaepass.cgg.gov.in ↗
            </a>
          </div>
        </div>
      </div>

      <!-- Section 3: Recommended Schemes for You -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-[#0F1111] flex items-center gap-2">
              <span class="w-2 h-5 bg-[#007185] rounded-sm"></span>
              ${t('recommendedTitle', lang)}
            </h2>
            <p class="text-xs text-[#565959]">
              ${t('recommendedSub', lang)}
            </p>
          </div>
          <button onclick="window.appRouter.navigate('schemes')" class="text-xs text-[#007185] hover:underline font-semibold">
            ${t('seeAll', lang)} →
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${recommended.map(s => `
            <div class="amazon-card flex flex-col justify-between h-full">
              <div>
                <span class="badge-amazon-verified text-[10px] mb-2 inline-block">${s.badge}</span>
                <h3 class="text-sm font-bold text-[#0F1111] hover:text-[#007185] cursor-pointer mb-1 line-clamp-2" onclick="window.appHandlers.openSchemeDetails('${s.id}')">
                  ${isTe ? s.nameTe : s.nameEn}
                </h3>
                <div class="text-[11px] text-[#067D62] font-bold bg-[#E7F4F5] p-2 rounded mb-2">
                  ${isTe ? s.benefitTe : s.benefitEn}
                </div>
                <p class="text-xs text-gray-600 line-clamp-2 mb-3">
                  ${isTe ? s.shortDescTe : s.shortDescEn}
                </p>
              </div>

              <div class="pt-2 border-t grid grid-cols-2 gap-2">
                <button onclick="window.appHandlers.openSchemeDetails('${s.id}')" class="btn-amazon-outline text-xs py-1.5 w-full">
                  ${t('viewDetails', lang)}
                </button>
                <button onclick="window.appHandlers.checkSchemeEligibility('${s.id}')" class="btn-amazon-primary text-xs py-1.5 w-full">
                  ${t('checkEligibility', lang)}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 4: Latest Verified Government News & Notifications -->
      <div class="amazon-card border-[#D5D9D9]">
        <div class="pb-3 border-b mb-4 flex items-center justify-between">
          <h2 class="text-base sm:text-lg font-bold text-[#0F1111] flex items-center gap-2">
            <span class="w-2 h-5 bg-[#067D62] rounded-sm"></span>
            ${isTe ? 'తాజా ప్రభుత్వ ప్రకటనలు & నోటిఫికేషన్‌లు' : 'Verified Government Announcements & Updates'}
          </h2>
          <span class="text-xs text-[#067D62] font-semibold flex items-center gap-1">
            ● 100% Sourced from Official Portals
          </span>
        </div>

        <div class="space-y-3">
          ${updates.map(upd => `
            <div class="border border-gray-200 rounded-lg p-3.5 flex flex-col sm:flex-row justify-between gap-3 text-xs bg-gray-50/50 hover:bg-white transition">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="bg-[#131921] text-white text-[10px] font-bold px-2 py-0.5 rounded">${upd.scope}</span>
                  <span class="text-gray-500 text-[11px]">${upd.date}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 mb-1">${isTe ? upd.titleTe : upd.titleEn}</h4>
                <p class="text-gray-600 leading-relaxed">${isTe ? upd.summaryTe : upd.summaryEn}</p>
              </div>
              <div class="self-end sm:self-center flex-shrink-0">
                <a href="${upd.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn-amazon-outline text-xs py-1.5 px-3">
                  ${isTe ? 'అధికారిక మూలం' : 'Source'} ↗
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 5: How Janaseva AI Works (4-Step Explainer) -->
      <div class="bg-white border border-[#D5D9D9] rounded-xl p-6 shadow-sm">
        <div class="text-center max-w-xl mx-auto mb-6">
          <h2 class="text-xl font-bold text-[#0F1111]">
            ${t('howItWorksTitle', lang)}
          </h2>
          <p class="text-xs text-gray-500 mt-1">
            ${isTe ? 'ప్రభుత్వ పథకాల సమాచారాన్ని సులభంగా పొందేందుకు 4 సులభమైన దశలు' : 'A transparent 4-step workflow to discover, verify and apply for government schemes'}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div class="border border-gray-200 rounded-lg p-4 text-center bg-gray-50/50">
            <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-[#E7F4F5] text-[#007185] flex items-center justify-center font-bold text-lg">1</div>
            <h3 class="font-bold text-xs sm:text-sm text-gray-900 mb-1">${t('step1Title', lang)}</h3>
            <p class="text-[11px] text-gray-600">${t('step1Desc', lang)}</p>
          </div>

          <div class="border border-gray-200 rounded-lg p-4 text-center bg-gray-50/50">
            <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-100 text-[#E47911] flex items-center justify-center font-bold text-lg">2</div>
            <h3 class="font-bold text-xs sm:text-sm text-gray-900 mb-1">${t('step2Title', lang)}</h3>
            <p class="text-[11px] text-gray-600">${t('step2Desc', lang)}</p>
          </div>

          <div class="border border-gray-200 rounded-lg p-4 text-center bg-gray-50/50">
            <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-100 text-[#067D62] flex items-center justify-center font-bold text-lg">3</div>
            <h3 class="font-bold text-xs sm:text-sm text-gray-900 mb-1">${t('step3Title', lang)}</h3>
            <p class="text-[11px] text-gray-600">${t('step3Desc', lang)}</p>
          </div>

          <div class="border border-gray-200 rounded-lg p-4 text-center bg-gray-50/50">
            <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 text-[#007185] flex items-center justify-center font-bold text-lg">4</div>
            <h3 class="font-bold text-xs sm:text-sm text-gray-900 mb-1">${t('step4Title', lang)}</h3>
            <p class="text-[11px] text-gray-600">${t('step4Desc', lang)}</p>
          </div>
        </div>

        <!-- Prominent AI Assistant Banner Shortcut -->
        <div class="mt-6 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#E7F4F5] rounded-lg p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#067D62] text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
              AI
            </div>
            <div>
              <h4 class="font-bold text-sm text-[#0F1111]">
                ${isTe ? 'సందేహాలు ఉన్నాయా? జనసేవ AI తెలుగు సహాయకుడిని అడగండి' : 'Need Guidance? Ask Janaseva AI Assistant'}
              </h4>
              <p class="text-xs text-gray-600">
                ${isTe ? 'వాయిస్ లేదా టెక్స్ట్ ద్వారా తెలుగులో వెంటనే సమాధానాలు పొందండి.' : 'Get instant spoken & written answers in Telugu or English.'}
              </p>
            </div>
          </div>
          <button onclick="window.appRouter.navigate('ai-chat')" class="btn-amazon-primary text-xs py-2 px-5 whitespace-nowrap">
            ${isTe ? 'ఇప్పుడే మాట్లాడండి (AI Chat)' : 'Start Voice Chat →'}
          </button>
        </div>
      </div>

    </div>
  `;
}
