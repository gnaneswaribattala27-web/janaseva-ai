// Janaseva AI — Amazon-Style Hero Banners Carousel
import { t } from '../i18n.js';

export function renderHeroBanners(state) {
  const lang = state.language || 'te';
  const activeIndex = state.bannerIndex || 0;

  const banners = [
    {
      id: 0,
      title: t('hero1Title', lang),
      sub: t('hero1Sub', lang),
      badge: lang === 'te' ? 'రైతు సంక్షేమం 2026' : 'Farmer Welfare 2026',
      btn1Text: t('hero1Btn1', lang),
      btn1Action: "window.appRouter.navigate('farmer-hub')",
      btn2Text: t('hero1Btn2', lang),
      btn2Action: "window.appRouter.navigate('eligibility')",
      bgGradient: 'from-[#004B49] via-[#007185] to-[#2E8B57]',
      accentColor: '#FF9900',
      iconSvg: `
        <svg class="w-16 h-16 sm:w-24 sm:h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      `
    },
    {
      id: 1,
      title: t('hero2Title', lang),
      sub: t('hero2Sub', lang),
      badge: lang === 'te' ? 'విద్యా సంక్షేమం' : 'Education Assistance',
      btn1Text: t('hero2Btn1', lang),
      btn1Action: "window.appRouter.navigate('scholarships-hub')",
      btn2Text: t('hero2Btn2', lang),
      btn2Action: "window.appRouter.navigate('eligibility')",
      bgGradient: 'from-[#1A365D] via-[#2B6CB0] to-[#3182CE]',
      accentColor: '#FFD814',
      iconSvg: `
        <svg class="w-16 h-16 sm:w-24 sm:h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      `
    },
    {
      id: 2,
      title: t('hero3Title', lang),
      sub: t('hero3Sub', lang),
      badge: lang === 'te' ? 'ప్రజా సేవ AI' : 'Verified Public Services',
      btn1Text: t('hero3Btn1', lang),
      btn1Action: "window.appRouter.navigate('schemes')",
      btn2Text: t('hero3Btn2', lang),
      btn2Action: "window.appRouter.navigate('ai-chat')",
      bgGradient: 'from-[#702459] via-[#97266D] to-[#D53F8C]',
      accentColor: '#FF9900',
      iconSvg: `
        <svg class="w-16 h-16 sm:w-24 sm:h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      `
    }
  ];

  const current = banners[activeIndex] || banners[0];

  return `
    <div class="relative w-full overflow-hidden bg-gradient-to-r ${current.bgGradient} text-white shadow-inner transition-all duration-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <!-- Text & CTAs -->
        <div class="max-w-2xl text-center md:text-left">
          <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-white/20">
            ${current.badge}
          </span>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2">
            ${current.title}
          </h1>
          <p class="text-sm sm:text-base text-white/90 mb-6 leading-relaxed font-normal">
            ${current.sub}
          </p>
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button onclick="${current.btn1Action}" class="btn-amazon-primary text-sm py-2 px-5">
              ${current.btn1Text}
            </button>
            <button onclick="${current.btn2Action}" class="btn-amazon-outline text-sm py-2 px-5 bg-white/90 hover:bg-white text-[#0F1111] font-bold">
              ${current.btn2Text}
            </button>
          </div>
        </div>

        <!-- Visual Decorative Area -->
        <div class="hidden sm:flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10">
          ${current.iconSvg}
          <div class="mt-2 text-center text-xs font-semibold text-white/80">
            100% Verified Government Data
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button 
        onclick="window.appHandlers.prevBanner()"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition z-20"
        title="Previous">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onclick="window.appHandlers.nextBanner()"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition z-20"
        title="Next">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Carousel Indicators Dots -->
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        ${banners.map((b, i) => `
          <button 
            onclick="window.appHandlers.setBanner(${i})"
            class="w-2.5 h-2.5 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-[#FF9900]' : 'bg-white/50 hover:bg-white'}"
            aria-label="Slide ${i + 1}">
          </button>
        `).join('')}
      </div>
    </div>
  `;
}
