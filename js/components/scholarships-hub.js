// Janaseva AI — Scholarships & Education Assistance Hub
import { t } from '../i18n.js';
import { SCHEMES_DATA } from '../data/schemes.js';

export function renderScholarshipsHub(state) {
  const lang = state.language || 'te';
  const isTe = lang === 'te';

  const scholarships = SCHEMES_DATA.filter(s => s.category === 'scholarships');

  return `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8">
      
      <!-- Hub Header Banner -->
      <div class="bg-gradient-to-r from-[#1A365D] via-[#2B6CB0] to-[#3182CE] rounded-xl text-white p-6 shadow-md">
        <div class="max-w-3xl">
          <span class="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-white/20">
            ${isTe ? 'విద్యా సంక్షేమం & స్కాలర్‌షిప్‌లు' : 'Student Welfare & Higher Education Assistance'}
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ${isTe ? 'పూర్తి కాలేజ్ ఫీజు రీయింబర్స్‌మెంట్ & విద్యార్థి స్కాలర్‌షిప్‌లు' : '100% College Fee Reimbursement & Meritorious Scholarships'}
          </h1>
          <p class="text-sm text-white/90 mt-2 leading-relaxed">
            ${isTe 
              ? 'నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (NSP), ఆంధ్రప్రదేశ్ జగనన్న విద్యా దీవెన, మరియు తెలంగాణ ఈ-పాస్ ద్వారా ఇంటర్, డిగ్రీ, ఇంజనీరింగ్, మెడిసిన్ చదివే పేద విద్యార్థులకు పూర్తి ఫీజు సహాయం.' 
              : 'Empowering students across India with direct institutional fee support, hostel allowances, and central merit assistance.'}
          </p>
        </div>
      </div>

      <!-- Quick Guidance Cards: NSP, AP Navasakam, TG ePASS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <!-- National Scholarship Portal -->
        <div class="amazon-card border-t-4 border-t-[#007185] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="badge-amazon-verified text-[10px]">Central Portal</span>
              <span class="text-xs font-bold text-gray-500">scholarships.gov.in</span>
            </div>
            <h3 class="font-bold text-base text-[#0F1111] mb-1">
              National Scholarship Portal (NSP)
            </h3>
            <p class="text-xs text-gray-600 mb-3">
              ${isTe ? 'కేంద్ర ప్రభుత్వ పోస్ట్-మెట్రిక్, మెరిట్ మరియు మైనారిటీ విద్యార్థుల స్కాలర్‌షిప్‌ల అధికారిక పోర్టల్. Face RD మరియు OTR తప్పనిసరి.' : 'Central gateway for post-matric, minority, and merit-based national scholarships. OTR registration required.'}
            </p>
          </div>
          <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" class="btn-amazon-primary text-xs py-2 text-center w-full">
            Open NSP Portal ↗
          </a>
        </div>

        <!-- Andhra Pradesh Navasakam -->
        <div class="amazon-card border-t-4 border-t-[#FF9900] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="badge-amazon-deal text-[10px]">AP State</span>
              <span class="text-xs font-bold text-gray-500">navasakam.ap.gov.in</span>
            </div>
            <h3 class="font-bold text-base text-[#0F1111] mb-1">
              AP Jagananna Vidya Deevena
            </h3>
            <p class="text-xs text-gray-600 mb-3">
              ${isTe ? 'ఐటీఐ, పాలిటెక్నిక్, డిగ్రీ, బీటెక్ విద్యార్థుల పూర్తి ట్యూషన్ ఫీజు నేరుగా తల్లి బ్యాంక్ ఖాతాలో జమ చేయబడుతుంది.' : '100% college tuition fee reimbursement for polytechnic, engineering, degree, and PG courses credited directly to mother.'}
            </p>
          </div>
          <a href="https://jaganannasmaran.ap.gov.in" target="_blank" rel="noopener noreferrer" class="btn-amazon-primary text-xs py-2 text-center w-full">
            Open AP Portal ↗
          </a>
        </div>

        <!-- Telangana ePASS -->
        <div class="amazon-card border-t-4 border-t-[#232F3E] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="badge-amazon-verified text-[10px]">Telangana</span>
              <span class="text-xs font-bold text-gray-500">telanganaepass.cgg.gov.in</span>
            </div>
            <h3 class="font-bold text-base text-[#0F1111] mb-1">
              Telangana ePASS Portal
            </h3>
            <p class="text-xs text-gray-600 mb-3">
              ${isTe ? 'తెలంగాణలో ఇంటర్, డిగ్రీ, ఇంజనీరింగ్ విద్యార్థులకు ఫీజు రీయింబర్స్‌మెంట్ (RTF) మరియు మెయింటెనెన్స్ ఫీజు (MTF).' : 'Fee reimbursement (RTF) paid directly to colleges and monthly maintenance fee (MTF) credited to student accounts.'}
            </p>
          </div>
          <a href="https://telanganaepass.cgg.gov.in" target="_blank" rel="noopener noreferrer" class="btn-amazon-primary text-xs py-2 text-center w-full">
            Open TG ePASS ↗
          </a>
        </div>

      </div>

      <!-- Schemes List -->
      <div>
        <h2 class="text-lg font-bold text-[#0F1111] mb-4">
          ${isTe ? 'అందుబాటులో ఉన్న విద్యా పథకాలు & స్కాలర్‌షిప్‌లు' : 'Available Scholarships & Fee Assistance Schemes'}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${scholarships.map(s => `
            <div class="amazon-card flex flex-col justify-between h-full">
              <div>
                <span class="badge-amazon-verified text-[10px] mb-2 inline-block">${s.badge}</span>
                <h3 class="text-sm font-bold text-[#0F1111] hover:text-[#007185] cursor-pointer mb-1" onclick="window.appHandlers.openSchemeDetails('${s.id}')">
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
                <a href="${s.officialPortalUrl}" target="_blank" rel="noopener noreferrer" class="btn-amazon-primary text-xs py-1.5 w-full text-center">
                  ${t('officialPortal', lang)} ↗
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
