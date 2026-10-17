// Janaseva AI — Bilingual Telugu Voice Assistant & AI Chatbot Component
import { t } from '../i18n.js';

export function renderChatModal(state) {
  const lang = state.language || 'te';
  const isTe = lang === 'te';
  const messages = state.chatMessages || [
    {
      id: 'welcome',
      sender: 'assistant',
      text: t('chatWelcome', lang),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      matchedSchemes: []
    }
  ];

  const suggestedQuestions = isTe ? [
    'రైతులకు అందుబాటులో ఉన్న ప్రభుత్వ పథకాలు ఏమిటి?',
    'PM-KISAN అర్హత ఎలా తనిఖీ చేయాలి?',
    'రైతు రుణం పొందడానికి ఏ పత్రాలు అవసరం?',
    'విద్యార్థులకు అందుబాటులో ఉన్న స్కాలర్షిప్లు ఏమిటి?',
    'నా దరఖాస్తు స్థితిని ఎలా తనిఖీ చేయాలి?'
  ] : [
    'What government schemes are available for farmers?',
    'How to check PM-KISAN eligibility criteria?',
    'Which documents are needed for Kisan Credit Card?',
    'What scholarships are available for college students?',
    'How do I check my beneficiary payment status?'
  ];

  return `
    <div class="max-w-4xl mx-auto px-2 sm:px-6 py-4 flex flex-col h-[calc(100vh-160px)]">
      
      <!-- Chat Header -->
      <div class="bg-[#131921] text-white rounded-t-xl px-4 py-3 flex items-center justify-between shadow border-b border-gray-700">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-full bg-[#067D62] text-white flex items-center justify-center font-bold relative shadow">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#131921]"></span>
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-bold leading-tight flex items-center gap-1.5">
              ${isTe ? 'జనసేవ AI సహాయకుడు' : 'Janaseva AI Assistant'}
              <span class="text-[10px] bg-[#FF9900] text-[#131921] font-bold px-1.5 rounded">Voice & Text</span>
            </h2>
            <p class="text-[11px] text-gray-300">
              ${isTe ? 'ప్రభుత్వ పథకాలు & అర్హత సమాధానాలు' : 'Government Schemes & Eligibility Specialist'}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Clear Chat -->
          <button 
            onclick="window.appHandlers.clearChatMessages()" 
            class="text-xs text-gray-300 hover:text-white px-2 py-1 rounded bg-white/10 transition"
            title="${t('clearChat', lang)}">
            ${t('clearChat', lang)}
          </button>
        </div>
      </div>

      <!-- Chat Messages Container -->
      <div id="chat-messages-container" class="flex-1 bg-white border-x border-[#D5D9D9] p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
        
        ${messages.map(msg => renderMessageBubble(msg, lang)).join('')}

        <!-- Live Typing Indicator -->
        ${state.isAiThinking ? `
          <div class="flex items-start gap-2 max-w-[80%]">
            <div class="w-7 h-7 rounded-full bg-[#067D62] text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">AI</div>
            <div class="bg-gray-100 rounded-xl rounded-tl-none p-3 shadow-sm border border-gray-200">
              <div class="flex items-center gap-1.5 text-gray-500 text-xs">
                <span class="w-2 h-2 rounded-full bg-[#FF9900] animate-bounce"></span>
                <span class="w-2 h-2 rounded-full bg-[#FF9900] animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-2 h-2 rounded-full bg-[#FF9900] animate-bounce" style="animation-delay: 0.4s"></span>
                <span class="ml-1">${isTe ? 'పరిశీలిస్తున్నాము...' : 'Searching verified database...'}</span>
              </div>
            </div>
          </div>
        ` : ''}

      </div>

      <!-- Suggested Quick Prompts Horizontal Pills -->
      <div class="bg-[#EAEDED] px-3 py-2 border-x border-[#D5D9D9] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span class="text-[11px] font-bold text-gray-600 whitespace-nowrap">${isTe ? 'సూచనలు:' : 'Suggestions:'}</span>
        ${suggestedQuestions.map(q => `
          <button 
            onclick="window.appHandlers.sendSuggestedQuestion('${q.replace(/'/g, "\\'")}')" 
            class="bg-white hover:bg-orange-50 border border-gray-300 hover:border-[#FF9900] text-gray-800 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm transition">
            ${q}
          </button>
        `).join('')}
      </div>

      <!-- Chat Input Area -->
      <div class="bg-white rounded-b-xl border border-[#D5D9D9] p-2.5 sm:p-3 shadow-md flex items-center gap-2">
        
        <!-- Microphone Button (Speech to Text) -->
        <button 
          id="chat-mic-btn"
          onclick="window.appHandlers.toggleChatVoiceInput()" 
          title="${t('voiceSearchTitle', lang)}"
          class="p-2.5 rounded-full border border-gray-300 hover:bg-gray-100 transition flex-shrink-0 ${state.isListening ? 'bg-red-50 text-red-600 border-red-400 animate-pulse' : 'text-gray-700'}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <!-- Message Input Field -->
        <input 
          id="chat-user-input"
          type="text" 
          placeholder="${t('chatInputPlaceholder', lang)}"
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
          onkeydown="if(event.key === 'Enter') window.appHandlers.sendChatMessage(this.value)"
        />

        <!-- Send Button (Amazon Yellow Button) -->
        <button 
          onclick="window.appHandlers.sendChatMessage(document.getElementById('chat-user-input').value)" 
          class="btn-amazon-primary text-xs sm:text-sm py-2 px-4 shadow-none flex-shrink-0">
          <span>${isTe ? 'పంపండి' : 'Send'}</span>
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

    </div>
  `;
}

function renderMessageBubble(msg, lang) {
  const isUser = msg.sender === 'user';
  const isTe = lang === 'te';

  if (isUser) {
    return `
      <div class="flex justify-end">
        <div class="bg-[#007185] text-white rounded-xl rounded-tr-none p-3 max-w-[85%] sm:max-w-[70%] shadow-sm">
          <div class="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">${msg.text}</div>
          <div class="text-[10px] text-white/70 text-right mt-1">${msg.timestamp || ''}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="flex items-start gap-2 max-w-[95%] sm:max-w-[85%]">
      <!-- AI Avatar -->
      <div class="w-7 h-7 rounded-full bg-[#067D62] text-white flex items-center justify-center font-bold flex-shrink-0 text-xs shadow-sm">
        AI
      </div>

      <!-- AI Bubble -->
      <div class="bg-gray-50 border border-gray-200 rounded-xl rounded-tl-none p-3 shadow-sm text-gray-900 space-y-2">
        <div class="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">${formatMarkdownText(msg.text)}</div>

        <!-- Optional Attached Scheme Cards -->
        ${msg.matchedSchemes && msg.matchedSchemes.length > 0 ? `
          <div class="pt-2 border-t border-gray-200 space-y-2">
            ${msg.matchedSchemes.map(sch => `
              <div class="bg-white border border-[#D5D9D9] rounded-lg p-2.5 shadow-sm text-xs flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <div class="font-bold text-[#0F1111]">${isTe ? sch.nameTe : sch.nameEn}</div>
                  <div class="text-[11px] text-[#067D62] font-semibold">${isTe ? sch.benefitTe : sch.benefitEn}</div>
                </div>
                <div class="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
                  <button onclick="window.appHandlers.openSchemeDetails('${sch.id}')" class="btn-amazon-outline text-[11px] py-1 px-2.5">
                    ${t('viewDetails', lang)}
                  </button>
                  <a href="${sch.officialPortalUrl}" target="_blank" rel="noopener noreferrer" class="btn-amazon-primary text-[11px] py-1 px-2.5">
                    Portal ↗
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Audio Speak Icon & Timestamp -->
        <div class="flex items-center justify-between pt-1 text-[10px] text-gray-400">
          <button 
            onclick="window.appHandlers.speakText('${msg.text.replace(/'/g, "\\'")}', '${lang}')"
            class="text-[#007185] hover:text-[#005B6B] flex items-center gap-1 font-semibold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            ${t('speakResponse', lang)}
          </button>
          <span>${msg.timestamp || ''}</span>
        </div>
      </div>
    </div>
  `;
}

function formatMarkdownText(text) {
  // Convert simple bold **text** to <strong>
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}
