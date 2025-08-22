/**
 * AR Manager - Gerencia funcionalidades de Realidade Aumentada
 * Controla detecção de marcadores, carregamento de modelos 3D e interações AR
 */

class ARManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.isARReady = false;
        this.activeMarkers = new Set();
        this.loadedModels = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🎯 ARManager: Inicializando...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAR());
        } else {
            this.setupAR();
        }
    }
    
    setupAR() {
        // Get A-Frame scene
        this.scene = document.querySelector('a-scene');
        this.camera = document.querySelector('#camera');
        
        if (!this.scene) {
            console.error('❌ ARManager: A-Frame scene não encontrada');
            return;
        }
        
        // Setup scene event listeners
        this.setupSceneEvents();
        
        // Setup marker events
        this.setupMarkerEvents();
        
        // Check camera permissions
        this.checkCameraPermissions();
        
        console.log('✅ ARManager: Configurado com sucesso');
    }
    
    setupSceneEvents() {
        // Scene loaded
        this.scene.addEventListener('loaded', () => {
            console.log('📱 ARManager: Cena A-Frame carregada');
            this.onSceneLoaded();
        });
        
        // AR ready
        this.scene.addEventListener('arjs-ready', () => {
            console.log('🎯 ARManager: AR.js pronto');
            this.isARReady = true;
            this.hideLoadingScreen();
        });
        
        // Camera ready
        this.scene.addEventListener('camera-init', () => {
            console.log('📹 ARManager: Câmera inicializada');
        });
    }
    
    setupMarkerEvents() {
        // Find all markers
        const markers = document.querySelectorAll('a-marker');
        
        markers.forEach(marker => {
            const markerId = marker.id || marker.getAttribute('preset');
            
            // Marker found
            marker.addEventListener('markerFound', () => {
                console.log(`🎯 Marcador encontrado: ${markerId}`);
                this.onMarkerFound(markerId, marker);
                this.activeMarkers.add(markerId);
            });
            
            // Marker lost
            marker.addEventListener('markerLost', () => {
                console.log(`📱 Marcador perdido: ${markerId}`);
                this.onMarkerLost(markerId, marker);
                this.activeMarkers.delete(markerId);
            });
        });
    }
    
    onSceneLoaded() {
        // Hide loading screen after a short delay
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }
    
    onMarkerFound(markerId, markerElement) {
        // Update debug info
        this.updateDebugInfo(`Marcador ${markerId} detectado!`, 'success');
        
        // Add visual feedback
        this.addMarkerFeedback(markerElement);
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('marker-detected', {
            detail: { markerId, markerElement }
        }));
    }
    
    onMarkerLost(markerId, markerElement) {
        // Update debug info
        this.updateDebugInfo(`Procurando marcadores...`, 'info');
        
        // Remove visual feedback
        this.removeMarkerFeedback(markerElement);
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('marker-lost', {
            detail: { markerId, markerElement }
        }));
    }
    
    addMarkerFeedback(markerElement) {
        // Add glow effect or animation to indicate marker detection
        const objects = markerElement.querySelectorAll('a-box, a-sphere, a-cylinder, a-gltf-model');
        objects.forEach(obj => {
            obj.setAttribute('animation__scale', {
                property: 'scale',
                from: '0.8 0.8 0.8',
                to: '1 1 1',
                dur: 500,
                easing: 'easeOutBounce'
            });
        });
    }
    
    removeMarkerFeedback(markerElement) {
        // Remove feedback animations
        const objects = markerElement.querySelectorAll('a-box, a-sphere, a-cylinder, a-gltf-model');
        objects.forEach(obj => {
            obj.removeAttribute('animation__scale');
        });
    }
    
    updateDebugInfo(message, type = 'info') {
        const debugElement = document.getElementById('debug-info');
        if (!debugElement) return;
        
        const emoji = {
            'success': '✅',
            'error': '❌',
            'info': '🔍',
            'warning': '⚠️'
        };
        
        const lastP = debugElement.querySelector('p:last-child');
        if (lastP) {
            lastP.innerHTML = `${emoji[type]} ${message}`;
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    checkCameraPermissions() {
        console.log('📷 ARManager: Verificando permissões de câmera...');
        
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('⚠️ ARManager: getUserMedia não suportado');
            this.showCameraButton();
            return;
        }
        
        // Check for camera permission
        navigator.mediaDevices.getUserMedia({ 
            video: {
                facingMode: 'environment' // Use back camera for AR
            }
        })
        .then(stream => {
            console.log('✅ ARManager: Permissão de câmera concedida');
            // Stop the stream as we just needed to check permissions
            stream.getTracks().forEach(track => {
                track.stop();
                console.log(`📹 ARManager: Track ${track.kind} parado`);
            });
            
            // Hide loading screen after camera check
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1000);
        })
        .catch(error => {
            console.warn('⚠️ ARManager: Erro ao acessar câmera:', error.name, error.message);
            
            if (error.name === 'NotAllowedError') {
                console.log('🚫 ARManager: Permissão de câmera negada pelo usuário');
                this.showCameraButton();
            } else if (error.name === 'NotFoundError') {
                console.log('📷 ARManager: Nenhuma câmera encontrada');
                this.showCameraButton();
            } else {
                console.log('⚠️ ARManager: Erro desconhecido de câmera');
                this.showCameraButton();
            }
        });
    }
    
    showCameraButton() {
        const cameraBtn = document.getElementById('enable-camera');
        if (cameraBtn) {
            cameraBtn.style.display = 'flex';
            cameraBtn.addEventListener('click', () => {
                this.requestCameraPermission();
            });
        }
    }
    
    requestCameraPermission() {
        console.log('📷 ARManager: Solicitando permissão de câmera...');
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ 
                video: {
                    facingMode: 'environment' // Prefer back camera
                }
            })
            .then(stream => {
                console.log('✅ ARManager: Câmera ativada pelo usuário');
                stream.getTracks().forEach(track => {
                    track.stop();
                    console.log(`📹 ARManager: Track ${track.kind} parado após ativação`);
                });
                
                // Hide camera button
                const cameraBtn = document.getElementById('enable-camera');
                if (cameraBtn) {
                    cameraBtn.style.display = 'none';
                }
                
                // Show success message
                this.updateDebugInfo('Câmera ativada! Recarregando...', 'success');
                
                // Reload the page to initialize AR properly
                setTimeout(() => {
                    location.reload();
                }, 1500);
            })
            .catch(error => {
                console.error('❌ ARManager: Erro ao ativar câmera:', error.name, error.message);
                
                let message = 'Erro ao ativar câmera';
                if (error.name === 'NotAllowedError') {
                    message = 'Permissão de câmera negada';
                } else if (error.name === 'NotFoundError') {
                    message = 'Nenhuma câmera encontrada';
                }
                
                this.updateDebugInfo(message, 'error');
                alert(`${message}. Para usar o jogo AR, é necessário permitir o acesso à câmera.`);
            });
        } else {
            alert('Seu navegador não suporta acesso à câmera.');
        }
    }
    
    // Utility methods
    getActiveMarkers() {
        return Array.from(this.activeMarkers);
    }
    
    isMarkerActive(markerId) {
        return this.activeMarkers.has(markerId);
    }
    
    // Performance monitoring
    getPerformanceInfo() {
        const scene = this.scene;
        if (!scene || !scene.renderer) return null;
        
        const renderer = scene.renderer;
        return {
            fps: Math.round(1000 / scene.time),
            geometries: renderer.info.memory.geometries,
            textures: renderer.info.memory.textures,
            drawCalls: renderer.info.render.calls
        };
    }
}

// Initialize AR Manager when script loads
let arManager;

// Wait for page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        arManager = new ARManager();
    });
} else {
    arManager = new ARManager();
}

// Export for use in other modules
window.ARManager = ARManager;
window.arManager = arManager;