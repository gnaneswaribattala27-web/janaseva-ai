// Janaseva AI — Main Application Controller & State Store
import { t } from './i18n.js';
import { SCHEMES_DATA } from './data/schemes.js';
import { speechService } from './services/speech.js';
import { assistantEngine } from './services/ai-assistant.js';
import { renderHeader } from './components/header.js';
import { renderHeroBanners } from './components/banners.js';
import { renderHomeSections } from './components/home-sections.js';
import { renderSchemesExplorer } from './components/schemes-explorer.js';
import { renderSchemeDetailsModal } from './components/scheme-details-modal.js';
import { renderEligibilityWizard } from './components/eligibility-wizard.js';
import { renderFarmerHub } from './components/farmer-hub.js';
import { renderScholarshipsHub } from './components/scholarships-hub.js';
import { renderDocumentGuide } from './components/document-guide.js';
import { renderTracker } from './components/tracker.js';
import { renderChatModal } from './components/chat-modal.js';
import { renderBottomNav } from './components/bottom-nav.js';

class JanasevaApp {
  constructor() {
    this.state = {
      language: localStorage.getItem('janaseva_lang') || 'te',
      activeView: 'home',
      searchQuery: '',
      filterCategory: 'all',
      filterJurisdiction: 'all',
      bannerIndex: 0,
      userLocation: JSON.parse(localStorage.getItem('janaseva_location') || '{"state": "andhra-pradesh", "stateName": "Andhra Pradesh", "district": "Guntur"}'),
      savedSchemes: JSON.parse(localStorage.getItem('janaseva_saved') || '["pm-kisan", "kcc-farmer-loan"]'),
      docChecklist: JSON.parse(localStorage.getItem('janaseva_checklist') || '{"aadhaar": "ready", "bank-passbook": "ready"}'),
      trackedApplications: JSON.parse(localStorage.getItem('janaseva_tracker') || '[]'),
      chatMessages: JSON.parse(localStorage.getItem('janaseva_chat') || '[]'),
      isListening: false,
      isAiThinking: false,
      activeSchemeModalId: null,
      isLocationModalOpen: false,
      isAddTrackerModalOpen: false,
      wizardStep: 1,
      wizardAnswers: {
        state: 'andhra-pradesh',
        occupation: 'farmer',
        ageGroup: '18-50',
        annualIncome: 'under-2.5-lakh',
        landOwnership: 'yes',
        landAcres: '3',
        socialCategory: 'bc',
        hasRationCard: 'yes'
      },
      emiCalculator: {
        amount: 100000,
        rate: 4.0,
        tenure: 12
      }
    };

    if (this.state.chatMessages.length === 0) {
      this.state.chatMessages.push({
        id: 'welcome',
        sender: 'assistant',
        text: t('chatWelcome', this.state.language),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedSchemes: []
      });
    }

    this.initHandlers();
    this.initRouter();
  }

  initRouter() {
    window.appRouter = {
      navigate: (view, params = {}) => {
        this.state.activeView = view;
        if (params.category) this.state.filterCategory = params.category;
        if (params.jurisdiction) this.state.filterJurisdiction = params.jurisdiction;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.render();
      }
    };
  }

  initHandlers() {
    window.appHandlers = {
      setLanguage: (lang) => {
        this.state.language = lang;
        localStorage.setItem('janaseva_lang', lang);
        this.showToast(lang === 'te' ? 'భాష తెలుగుకి మార్చబడింది' : 'Language set to English');
        this.render();
      },

      onSearchInput: (val) => {
        this.state.searchQuery = val;
        this.updateSearchSuggestions(val);
      },

      executeSearch: (val) => {
        this.state.searchQuery = val;
        this.closeSearchSuggestions();
        if (this.state.activeView !== 'schemes') {
          this.state.activeView = 'schemes';
        }
        this.render();
      },

      clearSearch: () => {
        this.state.searchQuery = '';
        this.closeSearchSuggestions();
        this.render();
      },

      toggleVoiceSearch: () => {
        if (!speechService.isSpeechSupported()) {
          this.showToast('Speech recognition is not supported in this browser.');
          return;
        }

        if (this.state.isListening) {
          speechService.stopListening();
          this.state.isListening = false;
          this.render();
          return;
        }

        speechService.startListening({
          lang: this.state.language,
          onStart: () => {
            this.state.isListening = true;
            this.showToast(t('listening', this.state.language));
            this.render();
          },
          onResult: (res) => {
            this.state.searchQuery = res.text;
            const input = document.getElementById('global-search-input');
            if (input) input.value = res.text;
            if (res.isFinal) {
              speechService.stopListening();
              this.state.isListening = false;
              window.appHandlers.executeSearch(res.text);
            }
          },
          onError: (err) => {
            this.state.isListening = false;
            this.showToast('Voice search error: ' + err);
            this.render();
          },
          onEnd: () => {
            this.state.isListening = false;
            this.render();
          }
        });
      },

      toggleChatVoiceInput: () => {
        if (!speechService.isSpeechSupported()) {
          this.showToast('Speech recognition is not supported in this browser.');
          return;
        }

        if (this.state.isListening) {
          speechService.stopListening();
          this.state.isListening = false;
          this.render();
          return;
        }

        speechService.startListening({
          lang: this.state.language,
          onStart: () => {
            this.state.isListening = true;
            this.render();
          },
          onResult: (res) => {
            const input = document.getElementById('chat-user-input');
            if (input) input.value = res.text;
            if (res.isFinal) {
              speechService.stopListening();
              this.state.isListening = false;
              window.appHandlers.sendChatMessage(res.text);
            }
          },
          onError: (err) => {
            this.state.isListening = false;
            this.render();
          },
          onEnd: () => {
            this.state.isListening = false;
            this.render();
          }
        });
      },

      prevBanner: () => {
        this.state.bannerIndex = (this.state.bannerIndex - 1 + 3) % 3;
        this.render();
      },

      nextBanner: () => {
        this.state.bannerIndex = (this.state.bannerIndex + 1) % 3;
        this.render();
      },

      setBanner: (idx) => {
        this.state.bannerIndex = idx;
        this.render();
      },

      setCategoryFilter: (cat) => {
        this.state.filterCategory = cat;
        if (this.state.activeView !== 'schemes') this.state.activeView = 'schemes';
        this.render();
      },

      setJurisdictionFilter: (jur) => {
        this.state.filterJurisdiction = jur;
        this.render();
      },

      resetFilters: () => {
        this.state.filterCategory = 'all';
        this.state.filterJurisdiction = 'all';
        this.state.searchQuery = '';
        this.render();
      },

      openSchemeDetails: (id) => {
        this.state.activeSchemeModalId = id;
        this.render();
      },

      closeSchemeDetails: () => {
        this.state.activeSchemeModalId = null;
        this.render();
      },

      speakSchemeText: (id) => {
        const scheme = SCHEMES_DATA.find(s => s.id === id);
        if (!scheme) return;
        const textToSpeak = this.state.language === 'te' 
          ? (scheme.nameTe + '. ' + scheme.shortDescTe + '. ప్రయోజనం: ' + scheme.benefitTe)
          : (scheme.nameEn + '. ' + scheme.shortDescEn + '. Benefit: ' + scheme.benefitEn);
        speechService.speak(textToSpeak, this.state.language);
      },

      speakText: (text, lang) => {
        speechService.speak(text, lang || this.state.language);
      },

      toggleSaveScheme: (id) => {
        const saved = this.state.savedSchemes;
        const idx = saved.indexOf(id);
        if (idx >= 0) {
          saved.splice(idx, 1);
          this.showToast(this.state.language === 'te' ? 'సేవ్ చేసిన జాబితా నుండి తీసివేయబడింది' : 'Removed from Saved Schemes');
        } else {
          saved.push(id);
          this.showToast(this.state.language === 'te' ? 'పథకం భద్రపరచబడింది (Saved)' : 'Scheme Saved to Bookmarks');
        }
        localStorage.setItem('janaseva_saved', JSON.stringify(saved));
        this.render();
      },

      checkSchemeEligibility: (id) => {
        this.state.activeSchemeModalId = null;
        this.state.activeView = 'eligibility';
        this.state.wizardStep = 1;
        this.render();
      },

      askAiAboutScheme: (id) => {
        const scheme = SCHEMES_DATA.find(s => s.id === id);
        this.state.activeSchemeModalId = null;
        this.state.activeView = 'ai-chat';
        if (scheme) {
          const query = this.state.language === 'te' 
            ? (scheme.nameTe + ' గురించి నాకు వివరించండి')
            : ('Tell me all about ' + scheme.nameEn);
          this.render();
          window.appHandlers.sendChatMessage(query);
        } else {
          this.render();
        }
      },

      nextWizardStep: () => {
        if (this.state.wizardStep < 6) {
          this.state.wizardStep++;
          window.scrollTo({ top: 100, behavior: 'smooth' });
          this.render();
        }
      },

      prevWizardStep: () => {
        if (this.state.wizardStep > 1) {
          this.state.wizardStep--;
          window.scrollTo({ top: 100, behavior: 'smooth' });
          this.render();
        }
      },

      resetWizard: () => {
        this.state.wizardStep = 1;
        this.render();
      },

      updateWizardAnswer: (key, value, shouldRender = true) => {
        this.state.wizardAnswers[key] = value;
        if (shouldRender) {
          this.render();
        }
      },

      saveWizardResults: () => {
        localStorage.setItem('janaseva_wizard_answers', JSON.stringify(this.state.wizardAnswers));
        this.showToast(this.state.language === 'te' ? 'మీ అర్హత ప్రొఫైల్ సేవ్ చేయబడింది' : 'Eligibility Profile Saved');
      },

      setDocStatus: (docId, status) => {
        this.state.docChecklist[docId] = status;
        localStorage.setItem('janaseva_checklist', JSON.stringify(this.state.docChecklist));
        this.render();
      },

      resetDocChecklist: () => {
        this.state.docChecklist = {};
        localStorage.removeItem('janaseva_checklist');
        this.render();
      },

      updateEmiInput: (field, val) => {
        this.state.emiCalculator[field] = Number(val);
        this.render();
      },

      openAddTrackerModal: () => {
        this.state.isAddTrackerModalOpen = true;
        this.render();
      },

      closeAddTrackerModal: () => {
        this.state.isAddTrackerModalOpen = false;
        this.render();
      },

      submitNewTrackedItem: (schemeName, refNumber, applyDate, status, notes) => {
        if (!schemeName) {
          this.showToast('Please enter a scheme name');
          return;
        }
        this.state.trackedApplications.unshift({
          schemeName,
          refNumber,
          applyDate,
          status,
          notes
        });
        localStorage.setItem('janaseva_tracker', JSON.stringify(this.state.trackedApplications));
        this.state.isAddTrackerModalOpen = false;
        this.showToast('Application logged successfully');
        this.render();
      },

      deleteTrackedItem: (idx) => {
        this.state.trackedApplications.splice(idx, 1);
        localStorage.setItem('janaseva_tracker', JSON.stringify(this.state.trackedApplications));
        this.showToast('Record deleted');
        this.render();
      },

      openLocationModal: () => {
        this.state.isLocationModalOpen = true;
        this.render();
      },

      closeLocationModal: () => {
        this.state.isLocationModalOpen = false;
        this.render();
      },

      saveUserLocation: (stateId, stateName, district) => {
        this.state.userLocation = { state: stateId, stateName, district };
        localStorage.setItem('janaseva_location', JSON.stringify(this.state.userLocation));
        this.state.isLocationModalOpen = false;
        this.showToast('Location set: ' + stateName + ' • ' + district);
        this.render();
      },

      sendChatMessage: async (text) => {
        if (!text || !text.trim()) return;
        const query = text.trim();
        const input = document.getElementById('chat-user-input');
        if (input) input.value = '';

        this.state.chatMessages.push({
          id: 'user-' + Date.now(),
          sender: 'user',
          text: query,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        this.state.isAiThinking = true;
        this.render();
        this.scrollChatToBottom();

        const res = await assistantEngine.getResponse(query, this.state.language);
        this.state.isAiThinking = false;

        this.state.chatMessages.push({
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: res.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matchedSchemes: res.matchedSchemes || []
        });

        localStorage.setItem('janaseva_chat', JSON.stringify(this.state.chatMessages));
        this.render();
        this.scrollChatToBottom();
      },

      sendSuggestedQuestion: (q) => {
        window.appHandlers.sendChatMessage(q);
      },

      clearChatMessages: () => {
        this.state.chatMessages = [
          {
            id: 'welcome',
            sender: 'assistant',
            text: t('chatWelcome', this.state.language),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            matchedSchemes: []
          }
        ];
        localStorage.removeItem('janaseva_chat');
        this.render();
      }
    };
  }

  updateSearchSuggestions(val) {
    const dropdown = document.getElementById('search-suggestions-dropdown');
    if (!dropdown) return;

    if (!val || val.length < 2) {
      dropdown.classList.add('hidden');
      return;
    }

    const q = val.toLowerCase();
    const matches = SCHEMES_DATA.filter(s => 
      s.nameEn.toLowerCase().includes(q) ||
      s.nameTe.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    ).slice(0, 5);

    if (matches.length === 0) {
      dropdown.innerHTML = '<div class="p-3 text-xs text-gray-500 text-center">No suggestions for "' + val + '". Press Enter to search all.</div>';
      dropdown.classList.remove('hidden');
      return;
    }

    const isTe = this.state.language === 'te';
    dropdown.innerHTML = matches.map(s => 
      '<div onclick="window.appHandlers.openSchemeDetails(\'' + s.id + '\')" class="px-3.5 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 flex items-center justify-between gap-2">' +
      '<div><div class="font-bold text-gray-900">' + (isTe ? s.nameTe : s.nameEn) + '</div><div class="text-[11px] text-gray-500">' + s.department + '</div></div>' +
      '<span class="text-[10px] text-[#007185] font-semibold whitespace-nowrap">View Details →</span></div>'
    ).join('');

    dropdown.classList.remove('hidden');
  }

  closeSearchSuggestions() {
    const dropdown = document.getElementById('search-suggestions-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
  }

  scrollChatToBottom() {
    setTimeout(() => {
      const container = document.getElementById('chat-messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-[#131921] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold border border-[#FF9900] flex items-center gap-2';
    toast.innerHTML = '<span>' + message + '</span>';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    let mainContent = '';
    const view = this.state.activeView;

    switch (view) {
      case 'home':
        mainContent = renderHeroBanners(this.state) + renderHomeSections(this.state);
        break;
      case 'schemes':
        mainContent = renderSchemesExplorer(this.state);
        break;
      case 'farmer-hub':
        mainContent = renderFarmerHub(this.state);
        break;
      case 'scholarships-hub':
        mainContent = renderScholarshipsHub(this.state);
        break;
      case 'document-guide':
        mainContent = renderDocumentGuide(this.state);
        break;
      case 'eligibility':
        mainContent = renderEligibilityWizard(this.state);
        break;
      case 'tracker':
        mainContent = renderTracker(this.state);
        break;
      case 'ai-chat':
        mainContent = renderChatModal(this.state);
        break;
      case 'saved':
        mainContent = this.renderSavedView();
        break;
      default:
        mainContent = renderHomeSections(this.state);
    }

    root.innerHTML = 
      '<div class="min-h-screen flex flex-col bottom-nav-safe">' +
        renderHeader(this.state) +
        '<main class="flex-1">' + mainContent + '</main>' +
        this.renderFooter() +
        renderBottomNav(this.state) +
        (this.state.activeSchemeModalId ? renderSchemeDetailsModal(this.state.activeSchemeModalId, this.state) : '') +
        (this.state.isLocationModalOpen ? this.renderLocationModal() : '') +
        (this.state.isAddTrackerModalOpen ? this.renderAddTrackerModal() : '') +
      '</div>';
  }

  renderSavedView() {
    const lang = this.state.language;
    const isTe = lang === 'te';
    const savedIds = this.state.savedSchemes || [];
    const saved = SCHEMES_DATA.filter(s => savedIds.includes(s.id));

    return '<div class="max-w-7xl mx-auto px-3 sm:px-6 py-6">' +
      '<div class="bg-white border border-[#D5D9D9] rounded-xl p-4 sm:p-6 mb-6">' +
        '<div class="flex items-center justify-between pb-3 border-b mb-4">' +
          '<div>' +
            '<h2 class="text-xl font-bold text-[#0F1111] flex items-center gap-2">' +
              '<span class="w-2.5 h-6 bg-[#FF9900] rounded-sm"></span>' +
              (isTe ? 'భద్రపరచుకున్న పథకాలు (Saved Schemes)' : 'Your Saved Schemes') +
              '<span class="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-bold">' + saved.length + '</span>' +
            '</h2>' +
          '</div>' +
          '<button onclick="window.appRouter.navigate(\'schemes\')" class="btn-amazon-primary text-xs py-1.5 px-3">+ ' + (isTe ? 'మరిన్ని పథకాలు' : 'Browse Schemes') + '</button>' +
        '</div>' +
        (saved.length === 0 ? 
          '<div class="text-center py-12"><p class="text-xs text-gray-500 mb-3">' + (isTe ? 'ఇంకా ఎటువంటి పథకాలు సేవ్ చేయలేదు.' : 'No saved schemes yet.') + '</p><button onclick="window.appRouter.navigate(\'schemes\')" class="btn-amazon-primary text-xs py-2 px-5">' + (isTe ? 'పథకాలను చూడండి' : 'Explore Schemes') + '</button></div>' :
          '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">' +
            saved.map(s => 
              '<div class="amazon-card flex flex-col justify-between h-full">' +
                '<div>' +
                  '<div class="flex items-center justify-between mb-2"><span class="badge-amazon-verified text-[10px]">' + s.badge + '</span><button onclick="window.appHandlers.toggleSaveScheme(\'' + s.id + '\')" class="text-[#E47911] text-xs font-bold hover:underline">✕ Remove</button></div>' +
                  '<h3 class="text-sm font-bold text-[#0F1111] hover:text-[#007185] cursor-pointer mb-1" onclick="window.appHandlers.openSchemeDetails(\'' + s.id + '\')">' + (isTe ? s.nameTe : s.nameEn) + '</h3>' +
                  '<div class="text-[11px] text-[#067D62] font-bold bg-[#E7F4F5] p-2 rounded mb-2">' + (isTe ? s.benefitTe : s.benefitEn) + '</div>' +
                  '<p class="text-xs text-gray-600 line-clamp-2 mb-3">' + (isTe ? s.shortDescTe : s.shortDescEn) + '</p>' +
                '</div>' +
                '<div class="pt-2 border-t grid grid-cols-2 gap-2">' +
                  '<button onclick="window.appHandlers.openSchemeDetails(\'' + s.id + '\')" class="btn-amazon-outline text-xs py-1.5 w-full">' + t('viewDetails', lang) + '</button>' +
                  '<a href="' + s.officialPortalUrl + '" target="_blank" rel="noopener noreferrer" class="btn-amazon-primary text-xs py-1.5 w-full text-center">' + t('officialPortal', lang) + ' ↗</a>' +
                '</div>' +
              '</div>'
            ).join('') +
          '</div>'
        ) +
      '</div></div>';
  }

  renderLocationModal() {
    const isTe = this.state.language === 'te';
    return '<div class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">' +
      '<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-5 border border-gray-300 animate-fadeIn">' +
        '<div class="flex justify-between items-center pb-3 border-b mb-4">' +
          '<h3 class="font-bold text-base text-gray-900">' + (isTe ? 'మీ ప్రాంతాన్ని ఎంచుకోండి' : 'Select Your State & District') + '</h3>' +
          '<button onclick="window.appHandlers.closeLocationModal()" class="text-gray-400 hover:text-gray-600 text-lg">✕</button>' +
        '</div>' +
        '<div class="space-y-4 text-xs">' +
          '<div><label class="block font-bold text-gray-700 mb-1">State</label>' +
            '<select id="loc-state-select" class="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-xs">' +
              '<option value="andhra-pradesh" ' + (this.state.userLocation.state === 'andhra-pradesh' ? 'selected' : '') + '>Andhra Pradesh (ఆంధ్రప్రదేశ్)</option>' +
              '<option value="telangana" ' + (this.state.userLocation.state === 'telangana' ? 'selected' : '') + '>Telangana (తెలంగాణ)</option>' +
              '<option value="all-india" ' + (this.state.userLocation.state === 'all-india' ? 'selected' : '') + '>All India (Central Schemes)</option>' +
            '</select></div>' +
          '<div><label class="block font-bold text-gray-700 mb-1">District / Mandal</label>' +
            '<input id="loc-dist-input" type="text" value="' + (this.state.userLocation.district || 'Guntur') + '" class="w-full border border-gray-300 rounded-lg p-2 text-xs" /></div>' +
          '<div class="pt-3 border-t flex justify-end gap-2">' +
            '<button onclick="window.appHandlers.closeLocationModal()" class="btn-amazon-outline text-xs py-2 px-4">Cancel</button>' +
            '<button onclick="const sel = document.getElementById(\'loc-state-select\'); const stateId = sel.value; const stateName = sel.options[sel.selectedIndex].text.split(\' (\')[0]; const dist = document.getElementById(\'loc-dist-input\').value; window.appHandlers.saveUserLocation(stateId, stateName, dist);" class="btn-amazon-primary text-xs py-2 px-5">Save Location</button>' +
          '</div></div></div></div>';
  }

  renderAddTrackerModal() {
    const isTe = this.state.language === 'te';
    return '<div class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">' +
      '<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-5 border border-gray-300 animate-fadeIn text-xs">' +
        '<div class="flex justify-between items-center pb-3 border-b mb-4">' +
          '<h3 class="font-bold text-base text-gray-900">' + (isTe ? 'దరఖాస్తు రికార్డు నమోదు' : 'Log New Application') + '</h3>' +
          '<button onclick="window.appHandlers.closeAddTrackerModal()" class="text-gray-400 hover:text-gray-600 text-lg">✕</button>' +
        '</div>' +
        '<div class="space-y-3">' +
          '<div><label class="block font-bold text-gray-700 mb-1">Scheme Name *</label><input id="track-name" type="text" class="w-full border border-gray-300 rounded-lg p-2" placeholder="e.g. PM-KISAN / Rythu Bharosa" /></div>' +
          '<div class="grid grid-cols-2 gap-2">' +
            '<div><label class="block font-bold text-gray-700 mb-1">Reference ID</label><input id="track-ref" type="text" class="w-full border border-gray-300 rounded-lg p-2" placeholder="e.g. REF12345" /></div>' +
            '<div><label class="block font-bold text-gray-700 mb-1">Date</label><input id="track-date" type="date" value="' + new Date().toISOString().split('T')[0] + '" class="w-full border border-gray-300 rounded-lg p-2" /></div>' +
          '</div>' +
          '<div><label class="block font-bold text-gray-700 mb-1">Status</label><select id="track-status" class="w-full border border-gray-300 rounded-lg p-2 bg-white"><option value="Applied">Applied</option><option value="Interested">Interested</option><option value="Documents Pending">Documents Pending</option><option value="Under Review">Under Review</option><option value="Approved">Approved</option></select></div>' +
          '<div><label class="block font-bold text-gray-700 mb-1">Notes</label><textarea id="track-notes" class="w-full border border-gray-300 rounded-lg p-2 h-16" placeholder="Notes..."></textarea></div>' +
          '<div class="pt-3 border-t flex justify-end gap-2">' +
            '<button onclick="window.appHandlers.closeAddTrackerModal()" class="btn-amazon-outline py-2 px-4">Cancel</button>' +
            '<button onclick="const name = document.getElementById(\'track-name\').value; const ref = document.getElementById(\'track-ref\').value; const date = document.getElementById(\'track-date\').value; const status = document.getElementById(\'track-status\').value; const notes = document.getElementById(\'track-notes\').value; window.appHandlers.submitNewTrackedItem(name, ref, date, status, notes);" class="btn-amazon-primary py-2 px-5">Save Record</button>' +
          '</div></div></div></div>';
  }

  renderFooter() {
    const isTe = this.state.language === 'te';
    return '<footer class="bg-[#131921] text-gray-300 border-t border-gray-800 text-xs py-8 px-4 sm:px-8 mt-12 select-none">' +
      '<div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-gray-800">' +
        '<div><div class="flex items-center gap-2 mb-2"><div class="w-6 h-6 rounded-full bg-[#FF9900] flex items-center justify-center text-[#131921] font-bold text-xs">J</div><span class="font-black text-white text-base">Janaseva AI</span></div>' +
          '<p class="text-gray-400 text-[11px] leading-relaxed">' + (isTe ? 'భారతీయ పౌరులు, రైతులు మరియు విద్యార్థుల కోసం ప్రభుత్వ సంక్షేమ పథకాలను సులభంగా అర్థం చేసుకునే ఉచిత సహాయక వేదిక.' : 'An independent digital platform empowering Indian citizens, farmers, and students.') + '</p></div>' +
        '<div><h4 class="font-bold text-white mb-2 uppercase text-[11px]">Quick Links</h4><ul class="space-y-1.5 text-gray-400"><li><a href="#" onclick="window.appRouter.navigate(\'home\')" class="hover:text-white">Home</a></li><li><a href="#" onclick="window.appRouter.navigate(\'schemes\')" class="hover:text-white">Government Schemes</a></li><li><a href="#" onclick="window.appRouter.navigate(\'farmer-hub\')" class="hover:text-white">Farmer Loans</a></li><li><a href="#" onclick="window.appRouter.navigate(\'scholarships-hub\')" class="hover:text-white">Scholarships</a></li></ul></div>' +
        '<div><h4 class="font-bold text-white mb-2 uppercase text-[11px]">Services</h4><ul class="space-y-1.5 text-gray-400"><li><a href="#" onclick="window.appRouter.navigate(\'eligibility\')" class="hover:text-white">Eligibility Wizard</a></li><li><a href="#" onclick="window.appRouter.navigate(\'document-guide\')" class="hover:text-white">Document Guide</a></li><li><a href="#" onclick="window.appRouter.navigate(\'tracker\')" class="hover:text-white">Application Tracker</a></li><li><a href="#" onclick="window.appRouter.navigate(\'ai-chat\')" class="hover:text-white">Telugu AI Assistant</a></li></ul></div>' +
        '<div><h4 class="font-bold text-white mb-2 uppercase text-[11px]">Official Portals</h4><ul class="space-y-1.5 text-gray-400 text-[11px]"><li><a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" class="hover:text-[#FF9900]">pmkisan.gov.in ↗</a></li><li><a href="https://myscheme.gov.in" target="_blank" rel="noopener noreferrer" class="hover:text-[#FF9900]">myscheme.gov.in ↗</a></li><li><a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" class="hover:text-[#FF9900]">scholarships.gov.in ↗</a></li><li><a href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer" class="hover:text-[#FF9900]">pmfby.gov.in ↗</a></li></ul></div>' +
      '</div>' +
      '<div class="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">' +
        '<p>© 2026 Janaseva AI. Independent citizen assistance platform. Not affiliated with any official government authority.</p>' +
        '<span class="text-green-400">● 100% Client-Side Privacy Protected</span>' +
      '</div>' +
    '</footer>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new JanasevaApp();
  window.janasevaApp = app;
  app.render();
});
