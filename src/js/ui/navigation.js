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
        
        // Force welcome screen if AR fails to load
        setTimeout(() => {
            if (this.currentScreen === 'loading') {
                console.log('⚠️ NavigationManager: Forçando tela de boas-vindas após timeout');
                this.showWelcomeScreen();
            }
        }, 8000);
        
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
        
        // Reset game
        if (this.elements.resetGameBtn) {
            this.elements.resetGameBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }
        
        // Listen for game events
        document.addEventListener('clue-collected', (event) => {
            this.updateProgress();
        });
        
        document.addEventListener('game-phase-changed', (event) => {
            this.onPhaseChanged(event.detail);
        });
        
        // Close inventory when clicking outside
        document.addEventListener('click', (event) => {
            if (this.elements.inventoryPanel && !this.elements.inventoryPanel.classList.contains('hidden')) {
                if (!this.elements.inventoryPanel.contains(event.target) && 
                    !this.elements.inventoryToggle.contains(event.target)) {
                    this.closeInventory();
                }
            }
        });
    }
    
    showWelcomeScreen() {
        console.log('🏠 NavigationManager: Mostrando tela de boas-vindas');
        
        this.currentScreen = this.screens.WELCOME;
        
        // Hide loading, show welcome
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.elements.loadingScreen.classList.add('hidden');
            }, 500);
        }
        
        if (this.elements.welcomeScreen) {
            this.elements.welcomeScreen.classList.remove('hidden');
            setTimeout(() => {
                this.elements.welcomeScreen.classList.add('fade-in');
            }, 100);
        }
    }
    
    startInvestigation() {
        console.log('🔍 NavigationManager: Iniciando investigação');
        
        this.currentScreen = this.screens.AR_GAME;
        this.gameStarted = true;
        
        // Hide welcome screen
        if (this.elements.welcomeScreen) {
            this.elements.welcomeScreen.classList.add('fade-out');
            setTimeout(() => {
                this.elements.welcomeScreen.classList.add('hidden');
            }, 500);
        }
        
        // Show AR interface
        if (this.elements.uiOverlay) {
            this.elements.uiOverlay.classList.remove('hidden');
            setTimeout(() => {
                this.elements.uiOverlay.classList.add('fade-in');
            }, 100);
        }
        
        // Show navigation buttons
        if (this.elements.navButtons) {
            setTimeout(() => {
                this.elements.navButtons.classList.remove('hidden');
            }, 1000);
        }
        
        // Update game state
        if (window.gameManager) {
            window.gameManager.gameState.currentPhase = 'ar-active';
            window.gameManager.gameState.startTime = Date.now();
            window.gameManager.saveGameState();
            window.gameManager.updateDebugDisplay();
        }
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('investigation-started'));
    }
    
    toggleInventory() {
        if (!this.elements.inventoryPanel) return;
        
        const isHidden = this.elements.inventoryPanel.classList.contains('hidden');
        
        if (isHidden) {
            this.openInventory();
        } else {
            this.closeInventory();
        }
    }
    
    openInventory() {
        console.log('🎒 NavigationManager: Abrindo inventário');
        
        if (this.elements.inventoryPanel) {
            this.elements.inventoryPanel.classList.remove('hidden');
            setTimeout(() => {
                this.elements.inventoryPanel.classList.add('fade-in');
            }, 100);
        }
        
        // Update inventory content
        this.updateInventoryContent();
        
        // Add active state to toggle button
        if (this.elements.inventoryToggle) {
            this.elements.inventoryToggle.classList.add('active');
        }
    }
    
    closeInventory() {
        console.log('🎒 NavigationManager: Fechando inventário');
        
        if (this.elements.inventoryPanel) {
            this.elements.inventoryPanel.classList.add('fade-out');
            this.elements.inventoryPanel.classList.remove('fade-in');
            setTimeout(() => {
                this.elements.inventoryPanel.classList.add('hidden');
                this.elements.inventoryPanel.classList.remove('fade-out');
            }, 300);
        }
        
        // Remove active state from toggle button
        if (this.elements.inventoryToggle) {
            this.elements.inventoryToggle.classList.remove('active');
        }
    }
    
    updateInventoryContent() {
        const contentEl = document.getElementById('inventory-content');
        if (!contentEl || !window.gameManager) return;
        
        const clues = window.gameManager.getCollectedClues();
        
        if (clues.length === 0) {
            contentEl.innerHTML = `
                <div class="no-clues">
                    <p>🔍 Nenhuma pista coletada ainda</p>
                    <p>Explore os marcadores AR para encontrar evidências!</p>
                </div>
            `;
        } else {
            const clueHTML = clues.map(clue => `
                <div class="clue-item">
                    <div class="clue-icon">${clue.icon}</div>
                    <div class="clue-info">
                        <h4>${clue.name}</h4>
                        <p>${clue.description}</p>
                    </div>
                </div>
            `).join('');
            
            contentEl.innerHTML = `
                <div class="clues-list">
                    ${clueHTML}
                </div>
            `;
        }
    }
    
    updateProgress() {
        if (!window.gameManager) return;
        
        const clueCount = window.gameManager.gameState.collectedClues.length;
        const totalClues = Object.keys(window.gameManager.clueTypes).length;
        const percentage = (clueCount / totalClues) * 100;
        
        // Update progress bar
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${percentage}%`;
        }
        
        // Update progress text
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `${clueCount}/${totalClues} pistas`;
        }
        
        console.log(`📊 NavigationManager: Progresso atualizado - ${clueCount}/${totalClues}`);
    }
    
    backToMenu() {
        console.log('🏠 NavigationManager: Voltando ao menu');
        
        this.currentScreen = this.screens.WELCOME;
        this.gameStarted = false;
        
        // Hide AR interface
        if (this.elements.uiOverlay) {
            this.elements.uiOverlay.classList.add('fade-out');
            setTimeout(() => {
                this.elements.uiOverlay.classList.add('hidden');
                this.elements.uiOverlay.classList.remove('fade-out');
            }, 500);
        }
        
        // Show welcome screen
        if (this.elements.welcomeScreen) {
            this.elements.welcomeScreen.classList.remove('hidden');
            setTimeout(() => {
                this.elements.welcomeScreen.classList.add('fade-in');
            }, 600);
        }
        
        // Close inventory if open
        this.closeInventory();
        
        // Update game state
        if (window.gameManager) {
            window.gameManager.gameState.currentPhase = 'welcome';
            window.gameManager.saveGameState();
        }
    }
    
    resetGame() {
        console.log('🔄 NavigationManager: Resetando jogo');
        
        // Reset game manager state
        if (window.gameManager) {
            window.gameManager.resetGame();
        }
        
        // Reset progress
        this.updateProgress();
        
        // Update inventory
        this.updateInventoryContent();
        
        // Show confirmation
        if (window.gameManager) {
            window.gameManager.showToast('🔄 Jogo resetado! Boa investigação!', 'info');
        }
    }
    
    onPhaseChanged(phase) {
        console.log(`🎮 NavigationManager: Fase alterada para ${phase}`);
        
        // Update debug info based on phase
        const debugEl = document.getElementById('debug-info');
        if (debugEl) {
            const phaseNames = {
                'welcome': 'Tela Inicial',
                'ar-active': 'Investigação Ativa',
                'crime-scene': 'Cena do Crime',
                'witness1': 'Testemunha 1',
                'witness2': 'Testemunha 2',
                'camera': 'Câmera de Segurança',
                'police-station': 'Delegacia'
            };
            
            const phaseName = phaseNames[phase] || phase;
            
            debugEl.innerHTML = `
                <p>🎯 ETAPA 2 - Interface e Navegação</p>
                <p>📱 ${phaseName}</p>
                <p>🔍 Pistas: ${window.gameManager?.gameState.collectedClues.length || 0}/4</p>
                <p>⏱️ Fase: ${phase}</p>
            `;
        }
    }
    
    // Utility methods
    getCurrentScreen() {
        return this.currentScreen;
    }
    
    isGameStarted() {
        return this.gameStarted;
    }
    
    showScreen(screenName) {
        console.log(`📱 NavigationManager: Mostrando tela ${screenName}`);
        
        // Hide all screens
        Object.values(this.elements).forEach(el => {
            if (el && el.classList) {
                el.classList.add('hidden');
            }
        });
        
        // Show specific screen
        const screenElement = this.elements[screenName + 'Screen'];
        if (screenElement) {
            screenElement.classList.remove('hidden');
            this.currentScreen = screenName;
        }
    }
}\n\n// Initialize Navigation Manager\nlet navigationManager;\n\nif (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n        navigationManager = new NavigationManager();\n    });\n} else {\n    navigationManager = new NavigationManager();\n}\n\n// Export for use in other modules\nwindow.NavigationManager = NavigationManager;\nwindow.navigationManager = navigationManager;