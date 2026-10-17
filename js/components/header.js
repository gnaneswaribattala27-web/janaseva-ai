// Janaseva AI — Amazon-Style Multi-Row Header Component
import { t } from '../i18n.js';
import { CATEGORIES_CONFIG } from '../data/schemes.js';

export function renderHeader(state, handlers) {
  const lang = state.language || 'te';
  const savedCount = state.savedSchemes ? state.savedSchemes.length : 0;

  return `
    <header class="sticky top-0 z-40 w-full shadow-md select-none">
      <!-- Row 1: Brand & Shortcuts (Amazon Dark Slate / Warm Banner) -->
      <div class="bg-[#131921] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-sm">
        <!-- Logo & Brand Name -->
        <div class="flex items-center gap-2 cursor-pointer flex-shrink-0" onclick="window.appRouter.navigate('home')">
          <div class="w-8 h-8 rounded-full bg-[#FF9900] flex items-center justify-center text-[#131921] font-bold shadow">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="font-black text-lg tracking-tight text-white leading-tight flex items-center gap-1">
              ${t('brandName', lang)}
              <span class="text-[#FF9900] text-xs font-bold uppercase tracking-wider bg-[#232F3E] px-1.5 py-0.5 rounded border border-[#FF9900]/40">Gov</span>
            </span>
            <span class="text-[11px] text-[#FFD8A8] hidden sm:inline leading-none font-medium">
              ${t('brandSubtitle', lang)}
            </span>
          </div>
        </div>

        <!-- Location Shortcut (State & District) -->
        <button onclick="window.appHandlers.openLocationModal()" class="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:border hover:border-white/40 text-left transition">
          <svg class="w-4 h-4 text-[#FF9900] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div class="flex flex-col text-xs leading-tight">
            <span class="text-gray-300 text-[10px]">${t('locationStrip', lang)}</span>
            <span class="font-bold text-white truncate max-w-[140px]">${state.userLocation ? state.userLocation.stateName : 'All India'}</span>
          </div>
        </button>

        <!-- Right Shortcuts: Language Toggle & Saved / Profile -->
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <!-- Bilingual Language Switcher -->
          <div class="flex items-center bg-[#232F3E] border border-gray-600 rounded-md p-0.5 text-xs font-medium">
            <button onclick="window.appHandlers.setLanguage('te')" class="px-2 py-1 rounded transition ${lang === 'te' ? 'bg-[#FF9900] text-[#131921] font-bold shadow' : 'text-gray-300 hover:text-white'}">
              తెలుగు
            </button>
            <button onclick="window.appHandlers.setLanguage('en')" class="px-2 py-1 rounded transition ${lang === 'en' ? 'bg-[#FF9900] text-[#131921] font-bold shadow' : 'text-gray-300 hover:text-white'}">
              English
            </button>
          </div>

          <!-- Saved Schemes Shortcut -->
          <button onclick="window.appRouter.navigate('saved')" class="flex items-center gap-1.5 px-2 py-1.5 rounded hover:border hover:border-white/40 text-white relative transition">
            <svg class="w-5 h-5 text-[#FF9900]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.125L5 18V4z" />
            </svg>
            <span class="text-xs font-bold hidden sm:inline">${t('saved', lang)}</span>
            <span class="bg-[#FF9900] text-[#131921] text-[11px] font-black rounded-full px-1.5 py-0.2 min-w-[18px] text-center">
              ${savedCount}
            </span>
          </button>
        </div>
      </div>

      <!-- Row 2: Full-Width Search Bar with Voice Input -->
      <div class="bg-[#232F3E] px-3 sm:px-6 py-2">
        <div class="relative max-w-4xl mx-auto flex items-center">
          <!-- Search Input Form -->
          <div class="relative flex-1 flex items-center bg-white rounded-lg shadow-inner overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-[#FF9900]">
            <!-- Search Icon -->
            <div class="pl-3 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Text Input -->
            <input 
              id="global-search-input"
              type="text"
              value="${state.searchQuery || ''}"
              placeholder="${t('searchPlaceholder', lang)}"
              class="w-full py-2.5 pl-2.5 pr-20 text-sm text-[#0F1111] focus:outline-none placeholder-gray-500"
              oninput="window.appHandlers.onSearchInput(this.value)"
              onkeydown="if(event.key === 'Enter') window.appHandlers.executeSearch(this.value)"
            />

            <!-- Clear Button (when text exists) -->
            ${state.searchQuery ? `
              <button onclick="window.appHandlers.clearSearch()" class="p-1 text-gray-400 hover:text-gray-600 mr-1" title="Clear">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ` : ''}

            <!-- Voice Search Button (Mic) -->
            <button 
              id="mic-search-btn"
              onclick="window.appHandlers.toggleVoiceSearch()" 
              title="${t('voiceSearchTitle', lang)}"
              class="p-2 text-gray-600 hover:text-[#007185] transition rounded-full ${state.isListening ? 'animate-pulse text-red-600 bg-red-50' : ''}">
              <svg class="w-5 h-5 ${state.isListening ? 'text-red-600' : 'text-gray-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            <!-- Submit Button (Amazon Yellow Button) -->
            <button 
              onclick="window.appHandlers.executeSearch(document.getElementById('global-search-input').value)" 
              class="amazon-search-btn px-4 py-2.5 text-[#131921] font-bold text-sm hidden sm:flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <!-- Instant Search Suggestions Dropdown -->
          <div id="search-suggestions-dropdown" class="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-[#D5D9D9] rounded-lg shadow-xl z-50 overflow-hidden text-sm max-h-80 overflow-y-auto">
            <!-- Dynamically populated by appHandlers -->
          </div>
        </div>
      </div>

      <!-- Row 3: Horizontally Scrollable Category Navigation -->
      <div class="bg-[#232F3E] border-t border-gray-700/60 px-2 sm:px-6 py-1.5 overflow-x-auto no-scrollbar">
        <div class="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-max text-xs font-semibold text-white">
          <button onclick="window.appRouter.navigate('home')" class="px-3 py-1.5 rounded transition ${state.activeView === 'home' ? 'bg-[#FF9900] text-[#131921] font-bold' : 'hover:bg-white/10'}">
            ${t('home', lang)}
          </button>
          <button onclick="window.appRouter.navigate('schemes')" class="px-3 py-1.5 rounded transition ${state.activeView === 'schemes' ? 'bg-[#FF9900] text-[#131921] font-bold' : 'hover:bg-white/10'}">
            ${t('schemes', lang)}
          </button>
          <button onclick="window.appRouter.navigate('farmer-hub')" class="px-3 py-1.5 rounded transition ${state.activeView === 'farmer-hub' ? 'bg-[#FF9900] text-[#131921] font-bold' : 'hover:bg-white/10'}">
            ${t('farmerLoans', lang)}
          </button>
          <button onclick="window.appRouter.navigate('scholarships-hub')" class="px-3 py-1.5 rounded transition ${state.activeView === 'scholarships-hub' ? 'bg-[#FF9900] text-[#131921] font-bold' : 'hover:bg-white/10'}">
            ${t('scholarships', lang)}
          </button>
          <button onclick="window.appRouter.navigate('schemes', { category: 'agriculture' })" class="px-3 py-1.5 rounded hover:bg-white/10 transition">
            ${t('agriculture', lang)}
          </button>
          <button onclick="window.appRouter.navigate('schemes', { category: 'women-family' })" class="px-3 py-1.5 rounded hover:bg-white/10 transition">
            ${t('womenFamily', lang)}
          </button>
          <button onclick="window.appRouter.navigate('document-guide')" class="px-3 py-1.5 rounded transition ${state.activeView === 'document-guide' ? 'bg-[#FF9900] text-[#131921] font-bold' : 'hover:bg-white/10'}">
            ${t('documentGuide', lang)}
          </button>
          <button onclick="window.appRouter.navigate('eligibility')" class="px-3 py-1.5 rounded transition ${state.activeView === 'eligibility' ? 'bg-[#FF9900] text-[#131921] font-bold' : 'hover:bg-white/10'}">
            ${t('eligibilityChecker', lang)}
          </button>
          <button onclick="window.appRouter.navigate('tracker')" class="px-3 py-1.5 rounded transition ${state.activeView === 'tracker' ? 'bg-[#FF9900] text-[#131921] font-bold' : 'hover:bg-white/10'}">
            ${t('applicationStatus', lang)}
          </button>
          <button onclick="window.appRouter.navigate('ai-chat')" class="px-3 py-1.5 rounded bg-emerald-600/90 text-white font-bold hover:bg-emerald-600 transition flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
            ${t('aiAssistant', lang)}
          </button>
        </div>
      </div>

      <!-- Row 4: Soft Blue Location & Eligibility Strip -->
      <div class="bg-[#E7F4F5] border-b border-[#B8E4E8] px-3 sm:px-6 py-2 flex items-center justify-between text-xs text-[#0F1111]">
        <div class="flex items-center gap-2 truncate">
          <svg class="w-4 h-4 text-[#007185] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span class="font-medium text-gray-700">${t('locationStrip', lang)}</span>
          <span class="font-bold text-[#007185] cursor-pointer hover:underline" onclick="window.appHandlers.openLocationModal()">
            ${state.userLocation ? `${state.userLocation.stateName} • ${state.userLocation.district || 'All Districts'}` : 'Andhra Pradesh & Telangana'}
          </span>
          <span class="text-gray-400 hidden sm:inline">|</span>
          <span class="text-[11px] text-[#067D62] font-semibold hidden md:inline flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            ${t('verifiedUpdate', lang)}
          </span>
        </div>

        <button onclick="window.appRouter.navigate('eligibility')" class="btn-amazon-primary text-xs py-1 px-3 shadow-none flex-shrink-0">
          ${t('checkEligibility', lang)}
        </button>
      </div>
    </header>
  `;
}
