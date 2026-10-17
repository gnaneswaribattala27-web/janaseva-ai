// Janaseva AI — 18-Point Full Scheme Details View & Modal
import { t } from '../i18n.js';
import { SCHEMES_DATA } from '../data/schemes.js';

export function renderSchemeDetailsModal(schemeId, state) {
  const scheme = SCHEMES_DATA.find(s => s.id === schemeId);
  if (!scheme) return '';

  const lang = state.language || 'te';
  const isSaved = state.savedSchemes && state.savedSchemes.includes(scheme.id);
  const name = lang === 'te' ? scheme.nameTe : scheme.nameEn;
  const overview = lang === 'te' ? scheme.overviewTe : scheme.overviewEn;
  const benefit = lang === 'te' ? scheme.benefitTe : scheme.benefitEn;
  const eligibility = lang === 'te' ? scheme.eligibilityCriteriaTe : scheme.eligibilityCriteriaEn;
  const nonEligible = lang === 'te' ? scheme.whoIsNotEligibleTe : scheme.whoIsNotEligibleEn;
  const docs = lang === 'te' ? scheme.requiredDocumentsTe : scheme.requiredDocumentsEn;
  const procedure = lang === 'te' ? scheme.applicationProcedureTe : scheme.applicationProcedureEn;

  return `
    <div id="scheme-details-modal" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-300 animate-fadeIn">
        
        <!-- Modal Header -->
        <div class="bg-[#131921] text-white px-4 sm:px-6 py-3.5 flex items-start justify-between gap-4 border-b border-gray-700">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="badge-amazon-verified text-[10px] uppercase font-bold tracking-wider">
                ${scheme.jurisdiction === 'central' ? 'Central Govt' : scheme.jurisdiction.toUpperCase()}
              </span>
              <span class="text-xs text-gray-300 font-medium">● ${scheme.lastVerified} Verified</span>
            </div>
            <h2 class="text-lg sm:text-xl font-bold leading-tight text-white">
              ${name}
            </h2>
            <p class="text-xs text-[#FFD8A8] mt-0.5">
              ${scheme.department}
            </p>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <!-- Voice Audio Play Button -->
            <button 
              onclick="window.appHandlers.speakSchemeText('${scheme.id}')"
              class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FF9900] transition" 
              title="${t('speakResponse', lang)}">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>

            <!-- Save Scheme Button -->
            <button 
              onclick="window.appHandlers.toggleSaveScheme('${scheme.id}')"
              class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition ${isSaved ? 'text-[#FF9900]' : 'text-white'}" 
              title="${isSaved ? 'Saved' : 'Save Scheme'}">
              <svg class="w-5 h-5" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <!-- Close Modal -->
            <button 
              onclick="window.appHandlers.closeSchemeDetails()" 
              class="p-2 rounded-full bg-white/10 hover:bg-red-600 text-white transition"
              title="Close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body Content -->
        <div class="overflow-y-auto p-4 sm:p-6 space-y-6 text-sm text-[#0F1111]">
          
          <!-- Key Benefit Callout Box -->
          <div class="bg-[#E7F4F5] border-l-4 border-[#007185] p-4 rounded-r-lg shadow-sm">
            <h4 class="text-xs font-bold uppercase text-[#007185] tracking-wider mb-1">
              ${lang === 'te' ? 'ఆర్థిక సాయం & ప్రయోజనాలు' : 'Financial Benefits & Assistance'}
            </h4>
            <div class="text-base font-bold text-[#067D62]">
              ${benefit}
            </div>
            <div class="mt-2 text-xs text-gray-600">
              ${lang === 'te' ? 'డిజిటల్ బదిలీ (DBT) ద్వారా నేరుగా లబ్ధిదారుడి బ్యాంక్ ఖాతాలో జమ.' : 'Disbursed directly via Direct Benefit Transfer (DBT) into Aadhaar seeded bank account.'}
            </div>
          </div>

          <!-- Section: Overview & Purpose -->
          <div>
            <h3 class="font-bold text-base text-[#0F1111] mb-2 border-b pb-1">
              ${lang === 'te' ? 'పథకం ముఖ్య ఉద్దేశం & వివరణ' : 'Overview & Purpose'}
            </h3>
            <p class="text-gray-700 leading-relaxed">
              ${overview}
            </p>
          </div>

          <!-- Section: Two Columns (Eligibility vs Ineligible) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Who is Eligible -->
            <div class="border border-green-200 bg-green-50/50 rounded-lg p-3.5">
              <h4 class="font-bold text-green-900 text-sm mb-2 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                ${lang === 'te' ? 'ఎవరు అర్హులు?' : 'Who is Eligible?'}
              </h4>
              <ul class="space-y-1.5 text-xs text-green-950">
                ${eligibility.map(item => `<li class="flex items-start gap-1.5"><span>✓</span><span>${item}</span></li>`).join('')}
              </ul>
            </div>

            <!-- Who is NOT Eligible -->
            <div class="border border-red-200 bg-red-50/50 rounded-lg p-3.5">
              <h4 class="font-bold text-red-900 text-sm mb-2 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                ${lang === 'te' ? 'ఎవరు అర్హులు కారు?' : 'Who is NOT Eligible?'}
              </h4>
              <ul class="space-y-1.5 text-xs text-red-950">
                ${nonEligible.map(item => `<li class="flex items-start gap-1.5"><span>✗</span><span>${item}</span></li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Section: Required Documents -->
          <div>
            <h3 class="font-bold text-base text-[#0F1111] mb-2 border-b pb-1 flex items-center justify-between">
              <span>${lang === 'te' ? 'అవసరమైన పత్రాలు (డాక్యుమెంట్లు)' : 'Required Documents'}</span>
              <button onclick="window.appRouter.navigate('document-guide')" class="text-xs text-[#007185] hover:underline font-semibold">
                ${lang === 'te' ? 'పత్రాల గైడ్ తెరవండి →' : 'View Document Guide →'}
              </button>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${docs.map(d => `
                <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2 text-xs">
                  <svg class="w-4 h-4 text-[#FF9900] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-gray-800 font-medium">${d}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section: Application Procedure -->
          <div>
            <h3 class="font-bold text-base text-[#0F1111] mb-2 border-b pb-1">
              ${lang === 'te' ? 'దరఖాస్తు చేసుకునే విధానం (స్టెప్ బై స్టెప్)' : 'Step-by-Step Application Procedure'}
            </h3>
            <div class="space-y-2">
              ${procedure.map((step, idx) => `
                <div class="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3">
                  <div class="w-6 h-6 rounded-full bg-[#232F3E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    ${idx + 1}
                  </div>
                  <div class="text-xs text-gray-800 leading-relaxed">
                    ${step}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section: FAQs -->
          ${scheme.faqs && scheme.faqs.length > 0 ? `
            <div>
              <h3 class="font-bold text-base text-[#0F1111] mb-2 border-b pb-1">
                ${lang === 'te' ? 'తరచుగా అడిగే ప్రశ్నలు (FAQ)' : 'Frequently Asked Questions'}
              </h3>
              <div class="space-y-2">
                ${scheme.faqs.map(faq => `
                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
                    <div class="font-bold text-gray-900 mb-1">Q: ${lang === 'te' ? faq.qTe : faq.qEn}</div>
                    <div class="text-gray-700">A: ${lang === 'te' ? faq.aTe : faq.aEn}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Contact & Verification Footer -->
          <div class="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 flex flex-col sm:flex-row justify-between gap-2 border border-gray-300">
            <div>
              <strong>${lang === 'te' ? 'అధికారిక హెల్ప్‌లైన్:' : 'Official Helpline:'}</strong> ${scheme.helpline}
            </div>
            <div>
              <strong>${lang === 'te' ? 'చివరిగా ధ్రువీకరించిన తేదీ:' : 'Last Verified Date:'}</strong> ${scheme.lastVerified}
            </div>
          </div>

          <!-- Important Disclaimer -->
          <p class="text-[11px] text-gray-500 italic text-center">
            Information may change. Confirm current eligibility and application dates on the official government portal. Janaseva AI is an independent citizen assistance platform.
          </p>
        </div>

        <!-- Modal Bottom Actions Bar -->
        <div class="bg-gray-100 px-4 sm:px-6 py-3 border-t border-gray-300 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button 
              onclick="window.appHandlers.askAiAboutScheme('${scheme.id}')"
              class="btn-amazon-outline text-xs py-2 px-3 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              ${t('askAiAboutThis', lang)}
            </button>

            <button 
              onclick="window.appHandlers.checkSchemeEligibility('${scheme.id}')" 
              class="btn-amazon-primary text-xs py-2 px-4">
              ${t('checkEligibility', lang)}
            </button>
          </div>

          <div class="flex items-center gap-2">
            ${scheme.statusPortalUrl ? `
              <a 
                href="${scheme.statusPortalUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn-amazon-outline text-xs py-2 px-3">
                ${t('statusPortal', lang)} ↗
              </a>
            ` : ''}

            <a 
              href="${scheme.officialPortalUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-amazon-secondary text-xs py-2 px-4 flex items-center gap-1">
              ${t('officialPortal', lang)} (.gov.in) ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}
