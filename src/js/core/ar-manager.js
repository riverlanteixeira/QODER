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
            // Don't hide loading screen here, wait for camera
        });
        
        // Camera ready
        this.scene.addEventListener('camera-init', () => {
            console.log('📹 ARManager: Câmera inicializada');
        });
        
        // Video stream ready
        this.scene.addEventListener('arjs-video-loaded', () => {
            console.log('🎥 ARManager: Vídeo AR carregado');
            this.hideLoadingScreen();
        });
        
        // Add error handling
        this.scene.addEventListener('error', (event) => {
            console.error('❌ ARManager: Erro na cena:', event);
        });
        
        // Monitor AR system status
        setTimeout(() => {
            this.checkARStatus();
        }, 5000);
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
        // Hide loading screen after a longer delay to ensure AR is ready
        setTimeout(() => {
            console.log('⏰ ARManager: Timeout de inicialização - verificando status');
            this.checkARStatus();
        }, 3000);
    }
    
    checkARStatus() {
        console.log('🔍 ARManager: Verificando status do AR...');
        
        // Check if scene is visible
        const canvas = this.scene.querySelector('canvas') || document.querySelector('canvas');
        if (canvas) {
            console.log('🖼️ ARManager: Canvas encontrado:', {
                width: canvas.width,
                height: canvas.height,
                style: canvas.style.display
            });
        } else {
            console.warn('⚠️ ARManager: Canvas não encontrado');
        }
        
        // Check for video element
        const video = document.querySelector('video');
        if (video) {
            console.log('📹 ARManager: Vídeo encontrado:', {
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                readyState: video.readyState
            });
        } else {
            console.warn('⚠️ ARManager: Elemento de vídeo não encontrado');
        }
        
        // Force hide loading screen if still visible
        this.hideLoadingScreen();
        
        // Show debug message
        this.updateDebugInfo('AR inicializado - aponte para marcador HIRO', 'info');
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
        
        // Simplified camera constraints (compatible with Samsung S20 FE)
        const cameraConstraints = {
            video: {
                facingMode: 'environment', // Use back camera
                width: { ideal: 640, min: 480, max: 1280 },
                height: { ideal: 480, min: 360, max: 720 }
            }
        };
        
        navigator.mediaDevices.getUserMedia(cameraConstraints)
        .then(stream => {
            console.log('✅ ARManager: Permissão de câmera concedida');
            
            // Check camera capabilities
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                const settings = videoTrack.getSettings();
                console.log('📸 ARManager: Configurações da câmera:', {
                    width: settings.width,
                    height: settings.height,
                    facingMode: settings.facingMode,
                    deviceId: settings.deviceId?.substring(0, 8) + '...'
                });
            }
            
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
            this.handleCameraError(error);
        });
    }
    
    handleCameraError(error) {
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
            // Simple constraints that work reliably on Samsung S20 FE
            const cameraConstraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            };
            
            navigator.mediaDevices.getUserMedia(cameraConstraints)
            .then(stream => {
                console.log('✅ ARManager: Câmera ativada pelo usuário');
                
                // Log camera info
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack) {
                    const settings = videoTrack.getSettings();
                    console.log('📸 ARManager: Configurações da câmera:', {
                        width: settings.width,
                        height: settings.height,
                        facingMode: settings.facingMode
                    });
                }
                
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