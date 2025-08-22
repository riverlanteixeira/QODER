/**
 * Navigation Manager - Controla navegação entre telas e estados do jogo
 * Gerencia transições, tela inicial, inventário e fluxo do usuário
 */

class NavigationManager {
    constructor() {
        this.currentScreen = 'loading';
        this.gameStarted = false;
        this.screens = {
            LOADING: 'loading',
            WELCOME: 'welcome',
            AR_GAME: 'ar-game'
        };
        
        this.elements = {};
        this.init();
    }
    
    init() {
        console.log('🧭 NavigationManager: Inicializando...');
        
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
    }
    
    setupNavigation() {
        // Get DOM elements
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            welcomeScreen: document.getElementById('welcome-screen'),
            uiOverlay: document.getElementById('ui-overlay'),
            startBtn: document.getElementById('start-investigation'),
            inventoryToggle: document.getElementById('inventory-toggle'),
            inventoryPanel: document.getElementById('inventory-panel'),
            inventoryClose: document.getElementById('inventory-close'),
            backToMenuBtn: document.getElementById('back-to-menu'),
            resetGameBtn: document.getElementById('reset-game'),
            navButtons: document.getElementById('nav-buttons'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text')
        };
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show welcome screen after loading
        setTimeout(() => {
            this.showWelcomeScreen();
        }, 3000);
        
        console.log('✅ NavigationManager: Configurado com sucesso');
    }
    
    setupEventListeners() {
        // Start Investigation button
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => {
                this.startInvestigation();
            });
        }
        
        // Inventory toggle
        if (this.elements.inventoryToggle) {
            this.elements.inventoryToggle.addEventListener('click', () => {
                this.toggleInventory();
            });
        }
        
        // Inventory close
        if (this.elements.inventoryClose) {
            this.elements.inventoryClose.addEventListener('click', () => {
                this.closeInventory();
            });
        }
        
        // Back to menu
        if (this.elements.backToMenuBtn) {
            this.elements.backToMenuBtn.addEventListener('click', () => {
                this.backToMenu();
            });
        }
        
        // Reset game\n        if (this.elements.resetGameBtn) {\n            this.elements.resetGameBtn.addEventListener('click', () => {\n                this.resetGame();\n            });\n        }\n        \n        // Listen for game events\n        document.addEventListener('clue-collected', (event) => {\n            this.updateProgress();\n        });\n        \n        document.addEventListener('game-phase-changed', (event) => {\n            this.onPhaseChanged(event.detail);\n        });\n        \n        // Close inventory when clicking outside\n        document.addEventListener('click', (event) => {\n            if (this.elements.inventoryPanel && !this.elements.inventoryPanel.classList.contains('hidden')) {\n                if (!this.elements.inventoryPanel.contains(event.target) && \n                    !this.elements.inventoryToggle.contains(event.target)) {\n                    this.closeInventory();\n                }\n            }\n        });\n    }\n    \n    showWelcomeScreen() {\n        console.log('🏠 NavigationManager: Mostrando tela de boas-vindas');\n        \n        this.currentScreen = this.screens.WELCOME;\n        \n        // Hide loading, show welcome\n        if (this.elements.loadingScreen) {\n            this.elements.loadingScreen.classList.add('fade-out');\n            setTimeout(() => {\n                this.elements.loadingScreen.classList.add('hidden');\n            }, 500);\n        }\n        \n        if (this.elements.welcomeScreen) {\n            this.elements.welcomeScreen.classList.remove('hidden');\n            setTimeout(() => {\n                this.elements.welcomeScreen.classList.add('fade-in');\n            }, 100);\n        }\n    }\n    \n    startInvestigation() {\n        console.log('🔍 NavigationManager: Iniciando investigação');\n        \n        this.currentScreen = this.screens.AR_GAME;\n        this.gameStarted = true;\n        \n        // Hide welcome screen\n        if (this.elements.welcomeScreen) {\n            this.elements.welcomeScreen.classList.add('fade-out');\n            setTimeout(() => {\n                this.elements.welcomeScreen.classList.add('hidden');\n            }, 500);\n        }\n        \n        // Show AR interface\n        if (this.elements.uiOverlay) {\n            this.elements.uiOverlay.classList.remove('hidden');\n            setTimeout(() => {\n                this.elements.uiOverlay.classList.add('fade-in');\n            }, 100);\n        }\n        \n        // Show navigation buttons\n        if (this.elements.navButtons) {\n            setTimeout(() => {\n                this.elements.navButtons.classList.remove('hidden');\n            }, 1000);\n        }\n        \n        // Update game state\n        if (window.gameManager) {\n            window.gameManager.gameState.currentPhase = 'ar-active';\n            window.gameManager.gameState.startTime = Date.now();\n            window.gameManager.saveGameState();\n            window.gameManager.updateDebugDisplay();\n        }\n        \n        // Trigger custom event\n        document.dispatchEvent(new CustomEvent('investigation-started'));\n    }\n    \n    toggleInventory() {\n        if (!this.elements.inventoryPanel) return;\n        \n        const isHidden = this.elements.inventoryPanel.classList.contains('hidden');\n        \n        if (isHidden) {\n            this.openInventory();\n        } else {\n            this.closeInventory();\n        }\n    }\n    \n    openInventory() {\n        console.log('🎒 NavigationManager: Abrindo inventário');\n        \n        if (this.elements.inventoryPanel) {\n            this.elements.inventoryPanel.classList.remove('hidden');\n            setTimeout(() => {\n                this.elements.inventoryPanel.classList.add('fade-in');\n            }, 100);\n        }\n        \n        // Update inventory content\n        this.updateInventoryContent();\n        \n        // Add active state to toggle button\n        if (this.elements.inventoryToggle) {\n            this.elements.inventoryToggle.classList.add('active');\n        }\n    }\n    \n    closeInventory() {\n        console.log('🎒 NavigationManager: Fechando inventário');\n        \n        if (this.elements.inventoryPanel) {\n            this.elements.inventoryPanel.classList.add('fade-out');\n            this.elements.inventoryPanel.classList.remove('fade-in');\n            setTimeout(() => {\n                this.elements.inventoryPanel.classList.add('hidden');\n                this.elements.inventoryPanel.classList.remove('fade-out');\n            }, 300);\n        }\n        \n        // Remove active state from toggle button\n        if (this.elements.inventoryToggle) {\n            this.elements.inventoryToggle.classList.remove('active');\n        }\n    }\n    \n    updateInventoryContent() {\n        const contentEl = document.getElementById('inventory-content');\n        if (!contentEl || !window.gameManager) return;\n        \n        const clues = window.gameManager.getCollectedClues();\n        \n        if (clues.length === 0) {\n            contentEl.innerHTML = `\n                <div class=\"no-clues\">\n                    <p>🔍 Nenhuma pista coletada ainda</p>\n                    <p>Explore os marcadores AR para encontrar evidências!</p>\n                </div>\n            `;\n        } else {\n            const clueHTML = clues.map(clue => `\n                <div class=\"clue-item\">\n                    <div class=\"clue-icon\">${clue.icon}</div>\n                    <div class=\"clue-info\">\n                        <h4>${clue.name}</h4>\n                        <p>${clue.description}</p>\n                    </div>\n                </div>\n            `).join('');\n            \n            contentEl.innerHTML = `\n                <div class=\"clues-list\">\n                    ${clueHTML}\n                </div>\n            `;\n        }\n    }\n    \n    updateProgress() {\n        if (!window.gameManager) return;\n        \n        const clueCount = window.gameManager.gameState.collectedClues.length;\n        const totalClues = Object.keys(window.gameManager.clueTypes).length;\n        const percentage = (clueCount / totalClues) * 100;\n        \n        // Update progress bar\n        if (this.elements.progressFill) {\n            this.elements.progressFill.style.width = `${percentage}%`;\n        }\n        \n        // Update progress text\n        if (this.elements.progressText) {\n            this.elements.progressText.textContent = `${clueCount}/${totalClues} pistas`;\n        }\n        \n        console.log(`📊 NavigationManager: Progresso atualizado - ${clueCount}/${totalClues}`);\n    }\n    \n    backToMenu() {\n        console.log('🏠 NavigationManager: Voltando ao menu');\n        \n        this.currentScreen = this.screens.WELCOME;\n        this.gameStarted = false;\n        \n        // Hide AR interface\n        if (this.elements.uiOverlay) {\n            this.elements.uiOverlay.classList.add('fade-out');\n            setTimeout(() => {\n                this.elements.uiOverlay.classList.add('hidden');\n                this.elements.uiOverlay.classList.remove('fade-out');\n            }, 500);\n        }\n        \n        // Show welcome screen\n        if (this.elements.welcomeScreen) {\n            this.elements.welcomeScreen.classList.remove('hidden');\n            setTimeout(() => {\n                this.elements.welcomeScreen.classList.add('fade-in');\n            }, 600);\n        }\n        \n        // Close inventory if open\n        this.closeInventory();\n        \n        // Update game state\n        if (window.gameManager) {\n            window.gameManager.gameState.currentPhase = 'welcome';\n            window.gameManager.saveGameState();\n        }\n    }\n    \n    resetGame() {\n        console.log('🔄 NavigationManager: Resetando jogo');\n        \n        // Reset game manager state\n        if (window.gameManager) {\n            window.gameManager.resetGame();\n        }\n        \n        // Reset progress\n        this.updateProgress();\n        \n        // Update inventory\n        this.updateInventoryContent();\n        \n        // Show confirmation\n        if (window.gameManager) {\n            window.gameManager.showToast('🔄 Jogo resetado! Boa investigação!', 'info');\n        }\n    }\n    \n    onPhaseChanged(phase) {\n        console.log(`🎮 NavigationManager: Fase alterada para ${phase}`);\n        \n        // Update debug info based on phase\n        const debugEl = document.getElementById('debug-info');\n        if (debugEl) {\n            const phaseNames = {\n                'welcome': 'Tela Inicial',\n                'ar-active': 'Investigação Ativa',\n                'crime-scene': 'Cena do Crime',\n                'witness1': 'Testemunha 1',\n                'witness2': 'Testemunha 2',\n                'camera': 'Câmera de Segurança',\n                'police-station': 'Delegacia'\n            };\n            \n            const phaseName = phaseNames[phase] || phase;\n            \n            debugEl.innerHTML = `\n                <p>🎯 ETAPA 2 - Interface e Navegação</p>\n                <p>📱 ${phaseName}</p>\n                <p>🔍 Pistas: ${window.gameManager?.gameState.collectedClues.length || 0}/4</p>\n                <p>⏱️ Fase: ${phase}</p>\n            `;\n        }\n    }\n    \n    // Utility methods\n    getCurrentScreen() {\n        return this.currentScreen;\n    }\n    \n    isGameStarted() {\n        return this.gameStarted;\n    }\n    \n    showScreen(screenName) {\n        console.log(`📱 NavigationManager: Mostrando tela ${screenName}`);\n        \n        // Hide all screens\n        Object.values(this.elements).forEach(el => {\n            if (el && el.classList) {\n                el.classList.add('hidden');\n            }\n        });\n        \n        // Show specific screen\n        const screenElement = this.elements[screenName + 'Screen'];\n        if (screenElement) {\n            screenElement.classList.remove('hidden');\n            this.currentScreen = screenName;\n        }\n    }\n}\n\n// Initialize Navigation Manager\nlet navigationManager;\n\nif (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n        navigationManager = new NavigationManager();\n    });\n} else {\n    navigationManager = new NavigationManager();\n}\n\n// Export for use in other modules\nwindow.NavigationManager = NavigationManager;\nwindow.navigationManager = navigationManager;