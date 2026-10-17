// Janaseva AI — Sticky Bottom Navigation Bar (Mobile App Target: 360-430px)
import { t } from '../i18n.js';

export function renderBottomNav(state) {
  const lang = state.language || 'te';
  const active = state.activeView || 'home';

  const items = [
    {
      id: 'home',
      label: t('home', lang),
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      `
    },
    {
      id: 'schemes',
      label: t('schemes', lang),
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      `
    },
    {
      id: 'eligibility',
      label: t('eligibilityChecker', lang),
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `
    },
    {
      id: 'tracker',
      label: t('applicationStatus', lang),
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      `
    },
    {
      id: 'ai-chat',
      label: t('aiAssistant', lang),
      isSpecial: true,
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      `
    }
  ];

  return `
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#D5D9D9] shadow-lg px-2 py-1 flex items-center justify-around select-none">
      ${items.map(item => {
        const isActive = active === item.id;
        return `
          <button 
            onclick="window.appRouter.navigate('${item.id}')"
            class="flex flex-col items-center justify-center py-1 px-1.5 min-w-[58px] transition relative ${isActive ? 'text-[#E47911] font-bold' : 'text-gray-600 hover:text-gray-900'}">
            
            ${item.isSpecial ? `
              <span class="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            ` : ''}

            <div class="${isActive ? 'scale-110 text-[#FF9900]' : ''}">
              ${item.icon}
            </div>

            <span class="text-[10px] mt-0.5 truncate max-w-[65px] ${isActive ? 'font-bold text-[#0F1111]' : ''}">
              ${item.label}
            </span>

            ${isActive ? `
              <span class="w-6 h-0.5 bg-[#FF9900] rounded-full mt-0.5"></span>
            ` : ''}
          </button>
        `;
      }).join('')}
    </nav>
  `;
}
