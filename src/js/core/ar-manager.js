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
        
        // Try to get camera devices first to select the right one
        this.selectBestCamera()
        .then(selectedConstraints => {
            return navigator.mediaDevices.getUserMedia(selectedConstraints);
        })
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
    
    async selectBestCamera() {
        console.log('🔍 ARManager: Buscando melhor câmera para AR...');
        
        try {
            // Check if we have a preferred camera from previous telephoto detection
            const preferredCameraId = localStorage.getItem('qoder-preferred-camera');
            if (preferredCameraId) {
                console.log('💾 ARManager: Câmera preferida encontrada no localStorage');
                
                // Verify the camera still exists
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                const preferredCamera = videoDevices.find(device => device.deviceId === preferredCameraId);
                
                if (preferredCamera) {
                    console.log('🎯 ARManager: Usando câmera preferida:', preferredCamera.label);
                    return {
                        video: {
                            deviceId: { exact: preferredCameraId },
                            width: { ideal: 640, min: 480, max: 1280 },
                            height: { ideal: 480, min: 360, max: 720 }
                        }
                    };
                } else {
                    console.log('⚠️ ARManager: Câmera preferida não encontrada, removendo do localStorage');
                    localStorage.removeItem('qoder-preferred-camera');
                }
            }
            
            // Get all video input devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            console.log('📱 ARManager: Câmeras encontradas:', videoDevices.length);
            videoDevices.forEach((device, index) => {
                console.log(`📷 Câmera ${index}:`, device.label || `Camera ${index}`, 
                    '| DeviceId:', device.deviceId.substring(0, 12) + '...');
            });
            
            let selectedDeviceId = null;
            let selectedStrategy = 'default';
            
            // Filter only back cameras first
            const backCameras = videoDevices.filter(device => {
                const label = device.label.toLowerCase();
                return !label.includes('front') && 
                       !label.includes('selfie') &&
                       !label.includes('user') &&
                       device.label.trim() !== ''; // Ensure we have a label
            });
            
            console.log('📱 ARManager: Câmeras traseiras encontradas:', backCameras.length);
            backCameras.forEach((device, index) => {
                console.log(`📷 Câmera traseira ${index}:`, device.label);
            });
            
            // Strategy 1: Enhanced Samsung S20 FE detection
            // Look for specific patterns that indicate telephoto vs wide
            if (backCameras.length >= 2) {
                // Try to identify telephoto cameras more aggressively
                const telephotoIndicators = [
                    'telephoto', 'tele', 'zoom', 'periscope',
                    '3x', '5x', '10x', '2x', '64mp', '108mp'
                ];
                
                const ultraWideIndicators = [
                    'ultrawide', 'ultra wide', 'ultra-wide', 'uw', '0.5x'
                ];
                
                // Score each camera based on likelihood of being the main wide camera
                const cameraScores = backCameras.map((device, index) => {
                    const label = device.label.toLowerCase();
                    let score = 100; // Base score
                    
                    // Penalize telephoto indicators heavily
                    telephotoIndicators.forEach(indicator => {
                        if (label.includes(indicator)) {
                            score -= 50;
                            console.log(`⬇️ Penalizando ${device.label} por '${indicator}': -50 pontos`);
                        }
                    });
                    
                    // Penalize ultrawide moderately  
                    ultraWideIndicators.forEach(indicator => {
                        if (label.includes(indicator)) {
                            score -= 30;
                            console.log(`⬇️ Penalizando ${device.label} por '${indicator}': -30 pontos`);
                        }
                    });
                    
                    // Bonus for main/wide/primary indicators
                    if (label.includes('main') || label.includes('wide') || 
                        label.includes('primary') || label.includes('principal')) {
                        score += 20;
                        console.log(`⬆️ Bonificando ${device.label} por palavra-chave principal: +20 pontos`);
                    }
                    
                    // Samsung S20 FE specific: First camera is often wide
                    if (index === 0 && backCameras.length >= 3) {
                        score += 15;
                        console.log(`⬆️ Bonificando ${device.label} por ser primeira câmera: +15 pontos`);
                    }
                    
                    // Avoid last camera (often telephoto)
                    if (index === backCameras.length - 1 && backCameras.length >= 3) {
                        score -= 25;
                        console.log(`⬇️ Penalizando ${device.label} por ser última câmera: -25 pontos`);
                    }
                    
                    return { device, score, index };
                });
                
                // Sort by score (highest first)
                cameraScores.sort((a, b) => b.score - a.score);
                
                console.log('📊 ARManager: Pontuação das câmeras:');
                cameraScores.forEach(({ device, score, index }) => {
                    console.log(`📷 ${device.label}: ${score} pontos`);
                });
                
                // Select camera with highest score
                if (cameraScores[0] && cameraScores[0].score > 0) {
                    selectedDeviceId = cameraScores[0].device.deviceId;
                    selectedStrategy = 'enhanced-scoring';
                    console.log('🎯 ARManager: Câmera selecionada por pontuação:', 
                               cameraScores[0].device.label, 
                               '(', cameraScores[0].score, 'pontos)');
                }
            }
            
            // Strategy 2: Fallback - avoid obvious telephoto names
            if (!selectedDeviceId && backCameras.length > 0) {
                const nonTelephotoCamera = backCameras.find(device => {
                    const label = device.label.toLowerCase();
                    return !label.includes('telephoto') &&
                           !label.includes('tele') &&
                           !label.includes('zoom') &&
                           !label.includes('3x') &&
                           !label.includes('5x') &&
                           !label.includes('64mp') &&
                           !label.includes('108mp');
                });
                
                if (nonTelephotoCamera) {
                    selectedDeviceId = nonTelephotoCamera.deviceId;
                    selectedStrategy = 'avoid-telephoto-keywords';
                    console.log('🎯 ARManager: Câmera selecionada evitando telefoto:', nonTelephotoCamera.label);
                }
            }
            
            // Strategy 3: Force use first back camera if nothing else works
            if (!selectedDeviceId && backCameras.length > 0) {
                selectedDeviceId = backCameras[0].deviceId;
                selectedStrategy = 'force-first-back';
                console.log('🎯 ARManager: Forçando primeira câmera traseira:', backCameras[0].label);
            }
            
            // Build constraints with aggressive camera forcing
            const constraints = {
                video: {
                    width: { ideal: 640, min: 480, max: 1280 },
                    height: { ideal: 480, min: 360, max: 720 },
                    facingMode: 'environment'
                }
            };
            
            // Add specific device ID if found
            if (selectedDeviceId) {
                constraints.video.deviceId = { exact: selectedDeviceId };
                // Remove facingMode when using specific deviceId to avoid conflicts
                delete constraints.video.facingMode;
                console.log(`📷 ARManager: Usando deviceId específico (${selectedStrategy})`);
                console.log('🔧 ARManager: Removendo facingMode para evitar conflitos');
            } else {
                console.log('⚠️ ARManager: Nenhuma câmera específica encontrada, usando configuração padrão');
            }
            
            return constraints;
            
        } catch (error) {
            console.warn('⚠️ ARManager: Erro ao enumerar câmeras, usando configuração padrão:', error);
            
            // Fallback to basic constraints
            return {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            };
        }
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
            // Use the same camera selection logic
            this.selectBestCamera()
            .then(selectedConstraints => {
                console.log('🎯 ARManager: Configurações selecionadas:', selectedConstraints);
                return navigator.mediaDevices.getUserMedia(selectedConstraints);
            })
            .then(stream => {
                console.log('✅ ARManager: Câmera ativada pelo usuário');
                
                // Log camera info with enhanced details
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack) {
                    const settings = videoTrack.getSettings();
                    console.log('📸 ARManager: Configurações da câmera:', {
                        width: settings.width,
                        height: settings.height,
                        facingMode: settings.facingMode,
                        deviceId: settings.deviceId
                    });
                    
                    // Try to get device label and determine camera type
                    navigator.mediaDevices.enumerateDevices()
                    .then(devices => {
                        const device = devices.find(d => d.deviceId === settings.deviceId);
                        if (device) {
                            console.log('🏷️ ARManager: Câmera selecionada:', device.label);
                            
                            // Analyze if this looks like telephoto or wide camera
                            const label = device.label.toLowerCase();
                            const isTelephoto = label.includes('telephoto') || 
                                              label.includes('tele') || 
                                              label.includes('zoom') ||
                                              label.includes('3x') ||
                                              label.includes('5x');
                            
                            const isUltrawide = label.includes('ultrawide') || 
                                              label.includes('ultra wide') ||
                                              label.includes('uw');
                            
                            const isMainWide = label.includes('main') || 
                                             label.includes('wide') && !isUltrawide ||
                                             label.includes('primary');
                            
                            if (isTelephoto) {
                                console.warn('⚠️ ARManager: ATENÇÃO - Câmera TELEOBJETIVA detectada!');
                                console.warn('🔄 ARManager: Tentando forçar câmera wide...');
                                this.forceCameraSelection();
                            } else if (isMainWide) {
                                console.log('✅ ARManager: Câmera GRANDE-ANGULAR confirmada!');
                            } else if (isUltrawide) {
                                console.log('📷 ARManager: Câmera ultra-wide detectada (aceitável)');
                            } else {
                                console.log('🤔 ARManager: Tipo de câmera não identificado:', label);
                            }
                        }
                    })
                    .catch(err => console.log('⚠️ ARManager: Não foi possível obter label da câmera'));
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
                this.updateDebugInfo('Câmera wide selecionada! Recarregando...', 'success');
                
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
    
    async forceCameraSelection() {
        console.log('🔄 ARManager: Forçando seleção de câmera wide...');
        
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            const backCameras = videoDevices.filter(device => {
                const label = device.label.toLowerCase();
                return !label.includes('front') && 
                       !label.includes('selfie') &&
                       !label.includes('user');
            });
            
            // Find the best non-telephoto camera
            const wideCamera = backCameras.find(device => {
                const label = device.label.toLowerCase();
                const isWide = (label.includes('main') || 
                               (label.includes('wide') && !label.includes('ultra'))) &&
                               !label.includes('telephoto') &&
                               !label.includes('tele') &&
                               !label.includes('zoom') &&
                               !label.includes('3x');
                return isWide;
            });
            
            if (wideCamera) {
                console.log('🎯 ARManager: Câmera wide encontrada para forçar:', wideCamera.label);
                
                // Show message to user
                this.updateDebugInfo('Detectada câmera teleobjetiva. Recarregando com câmera wide...', 'warning');
                
                // Store the preferred camera in localStorage
                localStorage.setItem('qoder-preferred-camera', wideCamera.deviceId);
                
                // Reload after delay
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                console.warn('⚠️ ARManager: Não foi possível encontrar câmera wide alternativa');
            }
            
        } catch (error) {
            console.error('❌ ARManager: Erro ao forçar seleção de câmera:', error);
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