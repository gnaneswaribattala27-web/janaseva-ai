// Janaseva AI — Portal Verification & Personal Application Tracker
import { t } from '../i18n.js';

export function renderTracker(state) {
  const lang = state.language || 'te';
  const isTe = lang === 'te';
  const trackedItems = state.trackedApplications || [];

  return `
    <div class="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-8">
      
      <!-- Section 1: Official Portal Domain Verification Guide -->
      <div class="bg-gradient-to-r from-[#232F3E] to-[#131921] rounded-xl text-white p-5 sm:p-6 shadow-md">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-[#FF9900] text-[#131921] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold leading-tight mb-1">
              ${isTe ? 'అధికారిక ప్రభుత్వ పోర్టల్ భద్రతా గైడ్ (.gov.in / .nic.in)' : 'Official Government Portal Verification & Cyber Safety'}
            </h2>
            <p class="text-xs text-gray-300 leading-relaxed mb-3">
              ${t('verifyNotice', lang)}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div class="bg-white/10 rounded p-2.5 border border-white/10">
                <span class="text-[#067D62] font-bold">✓ Genuine:</span>
                <span class="text-gray-200 ml-1">Must end with <strong>.gov.in</strong> or <strong>.nic.in</strong></span>
              </div>
              <div class="bg-white/10 rounded p-2.5 border border-white/10">
                <span class="text-[#B12704] font-bold">✗ Fake Websites:</span>
                <span class="text-gray-200 ml-1">Avoid .com, .xyz, or unofficial payment links</span>
              </div>
              <div class="bg-white/10 rounded p-2.5 border border-white/10">
                <span class="text-[#FF9900] font-bold">🔒 Privacy Rule:</span>
                <span class="text-gray-200 ml-1">Never share OTPs, ATM PINs, or bank passwords</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Personal Application Tracker -->
      <div class="amazon-card border-[#D5D9D9]">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
          <div>
            <h2 class="text-lg font-bold text-[#0F1111] flex items-center gap-2">
              <span class="w-2 h-5 bg-[#FF9900] rounded-sm"></span>
              ${isTe ? 'నా దరఖాస్తు ట్రాకర్' : 'Personal Application Tracker'}
              <span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
                ${trackedItems.length} ${isTe ? 'నమోదు చేయబడ్డాయి' : 'Logged'}
              </span>
            </h2>
            <p class="text-xs text-[#565959]">
              ${isTe ? 'మీరు దరఖాస్తు చేసుకున్న ప్రభుత్వ పథకాల వివరాలు, రిఫరెన్స్ నంబర్ మరియు స్థితిని నమోదు చేసుకోండి' : 'Keep track of your applied schemes, submission dates, and application acknowledgement numbers'}
            </p>
          </div>

          <button onclick="window.appHandlers.openAddTrackerModal()" class="btn-amazon-primary text-xs py-2 px-4 self-start sm:self-center">
            + ${isTe ? 'కొత్త దరఖాస్తును జోడించండి' : 'Add New Application'}
          </button>
        </div>

        <!-- Tracked List / Empty State -->
        <div class="pt-4">
          ${trackedItems.length === 0 ? `
            <div class="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div class="w-12 h-12 mx-auto mb-2 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p class="text-xs text-gray-600 font-medium mb-3">
                ${isTe ? 'ఇంకా ఎటువంటి దరఖాస్తులు నమోదు చేయలేదు.' : 'No applications logged yet.'}
              </p>
              <button onclick="window.appHandlers.openAddTrackerModal()" class="btn-amazon-outline text-xs py-1.5 px-4">
                + ${isTe ? 'మొదటి దరఖాస్తును నమోదు చేయండి' : 'Log Your First Application'}
              </button>
            </div>
          ` : `
            <div class="space-y-3">
              ${trackedItems.map((item, idx) => `
                <div class="border border-[#D5D9D9] rounded-lg p-3.5 flex flex-col sm:flex-row justify-between gap-3 text-xs bg-white hover:bg-gray-50/50 transition">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-bold text-sm text-[#0F1111]">${item.schemeName}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${getStatusClass(item.status)}">
                        ${item.status}
                      </span>
                    </div>
                    <div class="text-gray-600 space-x-3 text-[11px]">
                      <span><strong>Ref:</strong> ${item.refNumber || 'N/A'}</span>
                      <span>●</span>
                      <span><strong>Date:</strong> ${item.applyDate || 'Recent'}</span>
                    </div>
                    ${item.notes ? `
                      <p class="text-gray-500 text-[11px] mt-1 bg-gray-50 p-1.5 rounded border border-gray-200">
                        ${item.notes}
                      </p>
                    ` : ''}
                  </div>

                  <div class="flex items-center gap-2 self-end sm:self-center">
                    <button onclick="window.appHandlers.deleteTrackedItem(${idx})" class="text-red-600 hover:text-red-800 text-xs p-1" title="Delete">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="mt-4 pt-3 border-t text-[11px] text-gray-500 italic">
          * Application records are stored locally in your browser session for personal tracking and privacy.
        </div>
      </div>

    </div>
  `;
}

function getStatusClass(status) {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800 border border-green-300';
    case 'Under Review':
    case 'Applied':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'Documents Pending':
    case 'Action Required':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'Rejected':
      return 'bg-red-100 text-red-800 border border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
}
