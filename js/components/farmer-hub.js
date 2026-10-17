// Janaseva AI — Farmer Loan & Agricultural Benefits Hub with Working EMI Calculator
import { t } from '../i18n.js';
import { SCHEMES_DATA } from '../data/schemes.js';

export function renderFarmerHub(state) {
  const lang = state.language || 'te';
  const isTe = lang === 'te';

  // Get agricultural and loan schemes
  const farmerSchemes = SCHEMES_DATA.filter(s => 
    s.category === 'farmer-welfare' || 
    s.category === 'farmer-loans' || 
    s.category === 'agriculture'
  );

  const emiState = state.emiCalculator || {
    amount: 100000,
    rate: 4.0,
    tenure: 12
  };

  const { monthlyEmi, totalInterest, totalPayment } = calculateEMI(
    emiState.amount,
    emiState.rate,
    emiState.tenure
  );

  return `
    <div class="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8">
      
      <!-- Page Header -->
      <div class="bg-gradient-to-r from-[#004B49] to-[#007185] rounded-xl text-white p-6 shadow-md">
        <div class="max-w-3xl">
          <span class="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-white/20">
            ${isTe ? 'రైతు సంక్షేమ కేంద్రం' : 'Farmer Welfare & Agricultural Hub'}
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ${isTe ? 'రైతు రుణాలు, సబ్సిడీలు & సాగునీటి పథకాలు' : 'Farmer Loans, Agricultural Subsidies & Benefits'}
          </h1>
          <p class="text-sm text-white/90 mt-2 leading-relaxed">
            ${isTe 
              ? 'కిసాన్ క్రెడిట్ కార్డ్ (KCC) 4% వడ్డీ రుణాలు, పీఎం కుసుమ్ 60% సోలార్ సబ్సిడీ, పంట బీమా మరియు ఆధునిక ట్రాక్టర్ రాయితీల పూర్తి సమాచారం.' 
              : 'Discover Kisan Credit Card (KCC) at 4% interest subvention, PM-KUSUM 60% solar pump subsidies, crop insurance, and equipment grants.'}
          </p>
        </div>
      </div>

      <!-- Interactive Reducing-Balance EMI Calculator -->
      <div class="amazon-card border-[#D5D9D9] shadow-sm">
        <div class="border-b pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-[#0F1111] flex items-center gap-2">
              <span class="w-2 h-5 bg-[#FF9900] rounded-sm"></span>
              ${t('emiCalculatorTitle', lang)}
            </h2>
            <p class="text-xs text-[#565959]">
              ${isTe ? 'సబ్సిడీతో కూడిన కిసాన్ క్రెడిట్ కార్డ్ మరియు వ్యవసాయ రుణాల నెలవారీ వాయిదాను లెక్కించండి' : 'Calculate monthly installments for subsidized KCC and agricultural loans'}
            </p>
          </div>
          <span class="badge-amazon-verified text-[11px] font-bold">
            Standard Reducing Balance
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <!-- Input Sliders (7 cols) -->
          <div class="lg:col-span-7 space-y-4">
            
            <!-- Loan Amount -->
            <div>
              <div class="flex justify-between items-center text-xs font-bold text-gray-800 mb-1">
                <span>${t('loanAmount', lang)}</span>
                <span class="text-base text-[#007185] font-extrabold">₹${Number(emiState.amount).toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="500000" 
                step="5000" 
                value="${emiState.amount}"
                oninput="window.appHandlers.updateEmiInput('amount', this.value)"
                class="w-full accent-[#FF9900] cursor-pointer" />
              <div class="flex justify-between text-[10px] text-gray-500">
                <span>₹10,000</span>
                <span>₹3,00,000 (KCC Limit)</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            <!-- Interest Rate -->
            <div>
              <div class="flex justify-between items-center text-xs font-bold text-gray-800 mb-1">
                <span>${t('interestRate', lang)}</span>
                <span class="text-base text-[#067D62] font-extrabold">${emiState.rate}% ${emiState.rate <= 4 ? '(Govt Subsidized)' : ''}</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="14" 
                step="0.5" 
                value="${emiState.rate}"
                oninput="window.appHandlers.updateEmiInput('rate', this.value)"
                class="w-full accent-[#FF9900] cursor-pointer" />
              <div class="flex justify-between text-[10px] text-gray-500">
                <span>2%</span>
                <span class="text-[#067D62] font-bold">4% (KCC Prompt Repayment)</span>
                <span>14%</span>
              </div>
            </div>

            <!-- Loan Tenure -->
            <div>
              <div class="flex justify-between items-center text-xs font-bold text-gray-800 mb-1">
                <span>${t('tenureMonths', lang)}</span>
                <span class="text-base text-gray-900 font-extrabold">${emiState.tenure} ${isTe ? 'నెలలు' : 'Months'} (${(emiState.tenure/12).toFixed(1)} ${isTe ? 'సం.' : 'Yrs'})</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="60" 
                step="3" 
                value="${emiState.tenure}"
                oninput="window.appHandlers.updateEmiInput('tenure', this.value)"
                class="w-full accent-[#FF9900] cursor-pointer" />
              <div class="flex justify-between text-[10px] text-gray-500">
                <span>6 Months</span>
                <span>12 Months (1 Year)</span>
                <span>60 Months (5 Years)</span>
              </div>
            </div>

          </div>

          <!-- Calculation Summary Output Box (5 cols) -->
          <div class="lg:col-span-5 bg-[#E7F4F5] border border-[#B8E4E8] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div class="text-xs uppercase font-bold text-[#007185] tracking-wider mb-1">
                ${t('monthlyEmi', lang)}
              </div>
              <div class="text-3xl font-black text-[#0F1111] mb-4">
                ₹${monthlyEmi.toLocaleString('en-IN')}
                <span class="text-xs font-normal text-gray-600">/${isTe ? 'నెలకు' : 'month'}</span>
              </div>

              <div class="space-y-2 text-xs border-t border-gray-200/80 pt-3">
                <div class="flex justify-between text-gray-700">
                  <span>${isTe ? 'అసలు మొత్తం:' : 'Principal Amount:'}</span>
                  <span class="font-bold">₹${Number(emiState.amount).toLocaleString('en-IN')}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                  <span>${t('totalInterest', lang)}:</span>
                  <span class="font-bold text-[#B12704]">₹${totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div class="flex justify-between text-base font-extrabold text-[#067D62] border-t pt-2">
                  <span>${t('totalRepayment', lang)}:</span>
                  <span>₹${totalPayment.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <!-- Disclaimer -->
            <div class="mt-4 pt-3 border-t border-gray-200/60 text-[10px] text-gray-500 leading-tight">
              ${t('emiDisclaimer', lang)}
            </div>
          </div>
        </div>
      </div>

      <!-- Farmer Schemes Catalog -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-[#0F1111]">
            ${isTe ? 'రైతు పథకాలు & వ్యవసాయ సబ్సిడీలు' : 'Agricultural Welfare & Loan Schemes'}
          </h2>
          <button onclick="window.appRouter.navigate('schemes')" class="text-xs text-[#007185] hover:underline font-semibold">
            ${t('seeAll', lang)} →
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${farmerSchemes.map(s => `
            <div class="amazon-card flex flex-col justify-between h-full">
              <div>
                <div class="flex items-center justify-between gap-1 mb-2">
                  <span class="badge-amazon-verified text-[10px]">${s.badge}</span>
                  <span class="text-[10px] text-gray-500">Verified ${s.lastVerified}</span>
                </div>
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

              <div class="pt-2 border-t flex items-center gap-2">
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

function calculateEMI(principal, annualRate, tenureMonths) {
  const p = Number(principal);
  const r = (Number(annualRate) / 12) / 100;
  const n = Number(tenureMonths);

  if (p <= 0 || n <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0 };
  }

  if (r === 0) {
    const monthly = Math.round(p / n);
    return { monthlyEmi: monthly, totalInterest: 0, totalPayment: p };
  }

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const roundedEmi = Math.round(emi);
  const totalPayment = Math.round(roundedEmi * n);
  const totalInterest = Math.max(0, totalPayment - p);

  return {
    monthlyEmi: roundedEmi,
    totalInterest,
    totalPayment
  };
}
