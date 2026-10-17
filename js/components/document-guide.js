// Janaseva AI — Document Guide & Interactive Preparation Checklist
import { t } from '../i18n.js';
import { DOCUMENTS_GUIDE } from '../data/documents.js';

export function renderDocumentGuide(state) {
  const lang = state.language || 'te';
  const isTe = lang === 'te';
  const checklist = state.docChecklist || {};

  // Calculate readiness
  const total = DOCUMENTS_GUIDE.length;
  const readyCount = Object.values(checklist).filter(v => v === 'ready').length;
  const progressPercent = Math.round((readyCount / total) * 100);

  return `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      <!-- Header Banner & Progress Bar -->
      <div class="amazon-card border-[#D5D9D9]">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-[#0F1111] flex items-center gap-2">
              <span class="w-2.5 h-6 bg-[#FF9900] rounded-sm"></span>
              ${t('documentGuide', lang)} & ${t('docChecklistTitle', lang)}
            </h2>
            <p class="text-xs text-[#565959] mt-0.5">
              ${isTe 
                ? 'ప్రభుత్వ పథకాలకు అవసరమైన ధ్రువపత్రాలను సిద్ధం చేసుకుని తిరస్కరణకు గురికాకుండా చూసుకోండి' 
                : 'Prepare your official certificates and verify requirements to prevent application rejection'}
            </p>
          </div>

          <!-- Progress Badge -->
          <div class="flex items-center gap-3 self-end sm:self-center">
            <div class="text-right">
              <div class="text-xs font-bold text-gray-700">
                ${readyCount} of ${total} ${isTe ? 'పత్రాలు సిద్ధం' : 'Ready'}
              </div>
              <div class="text-[11px] font-semibold text-[#067D62]">
                ${progressPercent}% Complete
              </div>
            </div>
            <button onclick="window.appHandlers.resetDocChecklist()" class="btn-amazon-outline text-xs py-1 px-3">
              ${isTe ? 'రీసెట్' : 'Reset'}
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="pt-4">
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div class="bg-[#067D62] h-3 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>
      </div>

      <!-- Document Guides & Checkboxes -->
      <div class="space-y-4">
        ${DOCUMENTS_GUIDE.map(doc => {
          const currentStatus = checklist[doc.id] || 'pending';
          const name = isTe ? doc.nameTe : doc.nameEn;
          const authority = isTe ? doc.authorityTe : doc.authorityEn;
          const purpose = isTe ? doc.purposeTe : doc.purposeEn;
          const where = isTe ? doc.whereToApplyTe : doc.whereToApplyEn;
          const mistakes = isTe ? doc.commonMistakesTe : doc.commonMistakesEn;

          return `
            <div class="amazon-card border-[#D5D9D9] transition ${currentStatus === 'ready' ? 'border-l-4 border-l-[#067D62] bg-green-50/20' : ''}">
              
              <!-- Document Header & Interactive Toggle -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-[#E7F4F5] text-[#007185] flex items-center justify-center font-bold">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                      ${name}
                    </h3>
                    <span class="text-[11px] text-gray-500 font-medium">
                      ${isTe ? 'జారీ చేసే సంస్థ:' : 'Issuing Authority:'} ${authority}
                    </span>
                  </div>
                </div>

                <!-- 3-State Radio Toggle (Ready / Pending / NA) -->
                <div class="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-semibold self-start sm:self-center border border-gray-200">
                  <button 
                    onclick="window.appHandlers.setDocStatus('${doc.id}', 'ready')"
                    class="px-2.5 py-1 rounded transition ${currentStatus === 'ready' ? 'bg-[#067D62] text-white shadow' : 'text-gray-600 hover:text-gray-900'}">
                    ✓ ${t('docReady', lang)}
                  </button>
                  <button 
                    onclick="window.appHandlers.setDocStatus('${doc.id}', 'pending')"
                    class="px-2.5 py-1 rounded transition ${currentStatus === 'pending' ? 'bg-[#E47911] text-white shadow' : 'text-gray-600 hover:text-gray-900'}">
                    ⏱ ${t('docPending', lang)}
                  </button>
                  <button 
                    onclick="window.appHandlers.setDocStatus('${doc.id}', 'na')"
                    class="px-2.5 py-1 rounded transition ${currentStatus === 'na' ? 'bg-gray-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'}">
                    ✕ ${t('docNA', lang)}
                  </button>
                </div>
              </div>

              <!-- Document Details Grid -->
              <div class="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div class="mb-2">
                    <strong class="text-gray-800">${isTe ? 'ఎందుకు అవసరం?' : 'Why is it required?'}</strong>
                    <p class="text-gray-600 mt-0.5 leading-relaxed">${purpose}</p>
                  </div>
                  <div>
                    <strong class="text-gray-800">${isTe ? 'ఎక్కడ దరఖాస్తు చేసుకోవాలి?' : 'Where to apply?'}</strong>
                    <p class="text-[#007185] font-medium mt-0.5">${where}</p>
                  </div>
                </div>

                <div>
                  <div class="mb-2">
                    <strong class="text-[#B12704]">${isTe ? 'సాధారణ తప్పులు (తిరస్కరణ కారణాలు):' : 'Common Rejection Mistakes:'}</strong>
                    <ul class="text-gray-600 list-disc list-inside mt-0.5 space-y-0.5">
                      ${mistakes.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <strong class="text-gray-800">${isTe ? 'వర్తించే ముఖ్య పథకాలు:' : 'Applicable Schemes:'}</strong>
                    <div class="flex flex-wrap gap-1 mt-1">
                      ${doc.schemesRequired.map(sch => `
                        <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] border border-gray-200">
                          ${sch}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
