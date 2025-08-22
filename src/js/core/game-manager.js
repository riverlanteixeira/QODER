/**
 * Game Manager - Controla o estado do jogo e lógica principal
 * Gerencia progresso, pistas coletadas e navegação entre cenas
 */

class GameManager {
    constructor() {
        this.gameState = {
            currentPhase: 'test', // test, crime-scene, witness1, witness2, camera, police-station
            collectedClues: [],
            score: 0,
            startTime: null,
            isGameCompleted: false
        };
        
        this.clueTypes = {
            FOOTPRINT: { id: 'footprint', name: 'Pegada', description: 'Sapato nº 42', icon: '👣' },
            HEIGHT: { id: 'height', name: 'Altura', description: '1,90m', icon: '📏' },
            GLOVE: { id: 'glove', name: 'Luva', description: 'Luva encontrada', icon: '🧤' },
            CAMERA: { id: 'camera', name: 'Câmera', description: 'Três suspeitos', icon: '📹' }
        };
        
        this.suspects = {
            DRACULA: { id: 'dracula', name: 'Drácula', height: '1,70m', shoe: '42', hasGlove: true },
            FRANKENSTEIN: { id: 'frankenstein', name: 'Frankenstein', height: '1,90m', shoe: '42', hasGlove: false },
            WEREWOLF: { id: 'lobisomem', name: 'Lobisomem', height: '1,90m', shoe: '39', hasGlove: true }
        };
        
        this.init();
    }
    
    init() {
        console.log('🎮 GameManager: Inicializando...');
        
        // Load saved game state
        this.loadGameState();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize UI
        this.setupUI();
        
        console.log('✅ GameManager: Inicializado com sucesso');
        console.log('📊 Estado atual:', this.gameState);
    }
    
    setupEventListeners() {
        // Listen for marker detection events
        document.addEventListener('marker-detected', (event) => {
            this.onMarkerDetected(event.detail);
        });
        
        document.addEventListener('marker-lost', (event) => {
            this.onMarkerLost(event.detail);
        });
        
        // Listen for clue collection events
        document.addEventListener('clue-collected', (event) => {
            this.collectClue(event.detail);
        });
        
        // Listen for suspect selection events
        document.addEventListener('suspect-selected', (event) => {
            this.selectSuspect(event.detail);
        });
    }
    
    setupUI() {
        // Initialize debug display
        this.updateDebugDisplay();
        
        // Setup performance monitoring
        this.startPerformanceMonitoring();
    }
    
    onMarkerDetected(detail) {
        const { markerId } = detail;
        console.log(`🎯 GameManager: Marcador detectado - ${markerId}`);
        
        // Update game state based on marker
        switch(markerId) {
            case 'test-marker-hiro':
                this.handleTestMarker();
                break;
            case 'crime-scene':
                this.handleCrimeScene();
                break;
            case 'witness1':
                this.handleWitness1();
                break;
            case 'witness2':
                this.handleWitness2();
                break;
            case 'security-camera':
                this.handleSecurityCamera();
                break;
            case 'police-station':
                this.handlePoliceStation();
                break;
            default:
                console.log(`🔍 Marcador desconhecido: ${markerId}`);
        }
    }
    
    onMarkerLost(detail) {
        const { markerId } = detail;
        console.log(`📱 GameManager: Marcador perdido - ${markerId}`);
    }
    
    handleTestMarker() {
        console.log('🧪 Teste de AR básico ativo');
        this.showToast('✅ AR funcionando! Cubo detectado.', 'success');
    }
    
    handleCrimeScene() {
        if (this.gameState.currentPhase === 'test') {
            this.gameState.currentPhase = 'crime-scene';
            this.saveGameState();
        }
        console.log('🔍 Cena do crime detectada');
    }
    
    handleWitness1() {
        console.log('👨 Testemunha 1 detectada');
    }
    
    handleWitness2() {
        console.log('👩 Testemunha 2 detectada');
    }
    
    handleSecurityCamera() {
        console.log('📹 Câmera de segurança detectada');
    }
    
    handlePoliceStation() {
        console.log('🏛️ Delegacia detectada');
    }
    
    collectClue(clueData) {
        const { clueType, details } = clueData;
        
        // Check if clue already collected
        const alreadyCollected = this.gameState.collectedClues.find(clue => clue.type === clueType);
        if (alreadyCollected) {
            this.showToast('⚠️ Pista já coletada!', 'warning');
            return;
        }
        
        // Add clue to collection
        const clue = {
            type: clueType,
            ...this.clueTypes[clueType],
            collectedAt: Date.now(),
            details: details || {}
        };
        
        this.gameState.collectedClues.push(clue);
        this.gameState.score += 10;
        
        // Save state
        this.saveGameState();
        
        // Show feedback
        this.showToast(`${clue.icon} Pista coletada: ${clue.name}`, 'success');
        
        // Update UI
        this.updateDebugDisplay();
        
        console.log('🎯 Pista coletada:', clue);
        
        // Check if all clues collected
        this.checkGameProgress();
    }
    
    selectSuspect(suspectData) {
        const { suspectId } = suspectData;
        const suspect = this.suspects[suspectId.toUpperCase()];
        
        if (!suspect) {
            console.error('❌ Suspeito inválido:', suspectId);
            return;
        }
        
        // Check if selection is correct
        const isCorrect = this.checkSolution(suspect);
        
        if (isCorrect) {
            this.gameState.isGameCompleted = true;
            this.gameState.score += 50;
            this.showToast(`🎉 Parabéns! ${suspect.name} é o culpado!`, 'success');
        } else {
            this.gameState.score -= 10;
            this.showToast(`❌ Incorreto. Revise as pistas!`, 'error');
        }
        
        this.saveGameState();
        this.updateDebugDisplay();
        
        console.log(`⚖️ Suspeito selecionado: ${suspect.name}, Correto: ${isCorrect}`);
    }
    
    checkSolution(suspect) {
        // Frankenstein is the correct answer based on clues:
        // - Height: 1,90m ✓
        // - Shoe: 42 ✓  
        // - Missing glove (hasGlove: false) ✓
        return suspect.id === 'frankenstein';
    }
    
    checkGameProgress() {
        const totalClues = Object.keys(this.clueTypes).length;
        const collectedClues = this.gameState.collectedClues.length;
        
        console.log(`📊 Progresso: ${collectedClues}/${totalClues} pistas coletadas`);
        
        if (collectedClues === totalClues) {
            this.showToast('🎯 Todas as pistas coletadas! Vá para a delegacia.', 'info');
        }
    }
    
    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add styles
        Object.assign(toast.style, {
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: type === 'success' ? '#10b981' : 
                       type === 'error' ? '#ef4444' : 
                       type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: '1000',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            opacity: '0',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    updateDebugDisplay() {
        const debugElement = document.getElementById('debug-info');
        if (!debugElement) return;
        
        const clueCount = this.gameState.collectedClues.length;
        const totalClues = Object.keys(this.clueTypes).length;
        
        debugElement.innerHTML = `
            <p>🎯 ETAPA 1 - Teste de AR Básico</p>
            <p>📱 Aponte para o marcador HIRO</p>
            <p>🔍 Pistas: ${clueCount}/${totalClues} | Pontos: ${this.gameState.score}</p>
            <p>⏱️ Fase: ${this.gameState.currentPhase}</p>
        `;
    }
    
    startPerformanceMonitoring() {
        // Monitor performance every 5 seconds
        setInterval(() => {
            if (window.arManager && window.arManager.getPerformanceInfo) {
                const perfInfo = window.arManager.getPerformanceInfo();
                if (perfInfo) {
                    console.log(`📊 Performance - FPS: ${perfInfo.fps}, Draw Calls: ${perfInfo.drawCalls}`);
                }
            }
        }, 5000);
    }
    
    // Save/Load game state
    saveGameState() {
        try {
            localStorage.setItem('qoder-gamestate', JSON.stringify(this.gameState));
            console.log('💾 Estado do jogo salvo');
        } catch (error) {
            console.warn('⚠️ Erro ao salvar estado do jogo:', error);
        }
    }
    
    loadGameState() {
        try {
            const saved = localStorage.getItem('qoder-gamestate');
            if (saved) {
                const savedState = JSON.parse(saved);
                this.gameState = { ...this.gameState, ...savedState };
                console.log('📁 Estado do jogo carregado');
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar estado do jogo:', error);
        }
    }
    
    resetGame() {
        this.gameState = {
            currentPhase: 'test',
            collectedClues: [],
            score: 0,
            startTime: Date.now(),
            isGameCompleted: false
        };
        this.saveGameState();
        this.updateDebugDisplay();
        console.log('🔄 Jogo resetado');
    }
    
    // Utility methods
    getGameState() {
        return { ...this.gameState };
    }
    
    getCollectedClues() {
        return [...this.gameState.collectedClues];
    }
    
    hasClue(clueType) {
        return this.gameState.collectedClues.some(clue => clue.type === clueType);
    }
}

// Initialize Game Manager
let gameManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gameManager = new GameManager();
    });
} else {
    gameManager = new GameManager();
}

// Export for use in other modules
window.GameManager = GameManager;
window.gameManager = gameManager;