// Janaseva AI — Schemes Explorer Grid & Filter Component
import { t } from '../i18n.js';
import { SCHEMES_DATA, CATEGORIES_CONFIG, JURISDICTIONS_CONFIG } from '../data/schemes.js';

export function renderSchemesExplorer(state) {
  const lang = state.language || 'te';
  const filterCat = state.filterCategory || 'all';
  const filterJur = state.filterJurisdiction || 'all';
  const query = (state.searchQuery || '').trim().toLowerCase();

  // Filter schemes
  const filtered = SCHEMES_DATA.filter(s => {
    // Category match
    if (filterCat !== 'all' && s.category !== filterCat) return false;
    // Jurisdiction match
    if (filterJur !== 'all' && s.jurisdiction !== filterJur) return false;
    // Search query match (bilingual)
    if (query) {
      const matchNameEn = s.nameEn.toLowerCase().includes(query);
      const matchNameTe = s.nameTe.toLowerCase().includes(query);
      const matchDescEn = s.shortDescEn.toLowerCase().includes(query);
      const matchDescTe = s.shortDescTe.toLowerCase().includes(query);
      const matchDept = s.department.toLowerCase().includes(query);
      const matchTags = s.tags && s.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchNameEn && !matchNameTe && !matchDescEn && !matchDescTe && !matchDept && !matchTags) {
        return false;
      }
    }
    return true;
  });

  return `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      <!-- Section Title & Filter Bar -->
      <div class="bg-white border border-[#D5D9D9] rounded-lg p-4 mb-6 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-200">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-[#0F1111] flex items-center gap-2">
              <span class="w-2.5 h-6 bg-[#FF9900] rounded-sm"></span>
              ${t('schemes', lang)}
              <span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-300 font-semibold">
                ${filtered.length} ${lang === 'te' ? 'పథకాలు అందుబాటులో ఉన్నాయి' : 'Schemes Found'}
              </span>
            </h2>
            <p class="text-xs text-[#565959] mt-0.5">
              ${lang === 'te' ? 'అధికారిక భారత ప్రభుత్వ మరియు రాష్ట్ర ప్రభుత్వ పథకాల జాబితా' : 'Verified Central & State Government Welfare Schemes Catalogue'}
            </p>
          </div>

          <!-- Quick Filters: Jurisdiction -->
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
            ${JURISDICTIONS_CONFIG.map(j => `
              <button 
                onclick="window.appHandlers.setJurisdictionFilter('${j.id}')"
                class="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${filterJur === j.id ? 'bg-[#232F3E] text-white border-[#232F3E]' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}">
                ${lang === 'te' ? j.nameTe : j.nameEn}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Category Pills Filter Bar -->
        <div class="pt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          ${CATEGORIES_CONFIG.map(c => `
            <button 
              onclick="window.appHandlers.setCategoryFilter('${c.id}')"
              class="px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${filterCat === c.id ? 'bg-[#FF9900] text-[#131921] border-[#E47911] font-bold shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}">
              <span>${lang === 'te' ? c.nameTe : c.nameEn}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Schemes Grid: 2-column on mobile, 3-column on desktop -->
      ${filtered.length === 0 ? `
        <div class="bg-white border border-[#D5D9D9] rounded-lg p-12 text-center my-6">
          <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-[#0F1111] mb-1">
            ${lang === 'te' ? 'ఎటువంటి పథకాలు కనుగొనబడలేదు' : 'No Matching Schemes Found'}
          </h3>
          <p class="text-xs text-gray-500 mb-4">
            ${lang === 'te' ? 'దయచేసి మీ సెర్చ్ పదం లేదా ఫిల్టర్‌లను మార్చి మళ్లీ ప్రయత్నించండి.' : 'Try adjusting your search query or reset the filters.'}
          </p>
          <button onclick="window.appHandlers.resetFilters()" class="btn-amazon-primary text-xs py-1.5 px-4">
            ${lang === 'te' ? 'ఫిల్టర్‌లను రీసెట్ చేయండి' : 'Reset All Filters'}
          </button>
        </div>
      ` : `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${filtered.map(s => renderSchemeCard(s, state)).join('')}
        </div>
      `}
    </div>
  `;
}

export function renderSchemeCard(scheme, state) {
  const lang = state.language || 'te';
  const isSaved = state.savedSchemes && state.savedSchemes.includes(scheme.id);
  const name = lang === 'te' ? scheme.nameTe : scheme.nameEn;
  const desc = lang === 'te' ? scheme.shortDescTe : scheme.shortDescEn;
  const benefit = lang === 'te' ? scheme.benefitTe : scheme.benefitEn;

  return `
    <div class="amazon-card flex flex-col justify-between h-full relative group">
      <!-- Top Row: Badge & Save Button -->
      <div>
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="badge-amazon-verified text-[10px] font-semibold flex items-center gap-1">
            <svg class="w-3 h-3 text-[#007185]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            ${scheme.badge || t('verifiedGovt', lang)}
          </span>

          <button 
            onclick="window.appHandlers.toggleSaveScheme('${scheme.id}')"
            class="p-1.5 rounded-full hover:bg-gray-100 transition ${isSaved ? 'text-[#E47911]' : 'text-gray-400 hover:text-gray-600'}"
            title="${isSaved ? 'Remove from Saved' : 'Save Scheme'}">
            <svg class="w-5 h-5" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        <!-- Scheme Title -->
        <h3 
          onclick="window.appHandlers.openSchemeDetails('${scheme.id}')"
          class="text-sm sm:text-base font-bold text-[#0F1111] hover:text-[#007185] cursor-pointer line-clamp-2 leading-snug mb-1">
          ${name}
        </h3>

        <!-- Department Tag -->
        <div class="text-[11px] text-[#565959] font-medium truncate mb-2.5">
          ${scheme.department}
        </div>

        <!-- Benefit Highlight (Amazon Price-Style) -->
        <div class="bg-[#E7F4F5] border border-[#B8E4E8] rounded-md p-2 mb-3">
          <div class="text-[10px] uppercase font-bold text-[#007185] tracking-wider mb-0.5">
            ${lang === 'te' ? 'ఆర్థిక సాయం / ప్రయోజనం' : 'Financial Benefit'}
          </div>
          <div class="text-xs font-bold text-[#067D62] leading-tight">
            ${benefit}
          </div>
        </div>

        <!-- Description -->
        <p class="text-xs text-[#333333] line-clamp-3 leading-relaxed mb-3">
          ${desc}
        </p>
      </div>

      <!-- Bottom Actions -->
      <div class="pt-2 border-t border-gray-100">
        <div class="flex items-center justify-between text-[11px] text-gray-500 mb-2">
          <span>${lang === 'te' ? 'ధ్రువీకరణ:' : 'Verified:'} <strong class="text-gray-700">${scheme.lastVerified}</strong></span>
          <span class="text-[#067D62] font-semibold">${scheme.status === 'open' ? '● Open' : '● Verified'}</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button 
            onclick="window.appHandlers.openSchemeDetails('${scheme.id}')" 
            class="btn-amazon-outline text-xs py-1.5 w-full">
            ${t('viewDetails', lang)}
          </button>
          
          <button 
            onclick="window.appHandlers.checkSchemeEligibility('${scheme.id}')" 
            class="btn-amazon-primary text-xs py-1.5 w-full">
            ${t('checkEligibility', lang)}
          </button>
        </div>
      </div>
    </div>
  `;
}
