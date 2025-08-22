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
        this.videoSearchAttempts = 0;
        this.initTime = Date.now(); // Track initialization time for telephoto detection
        
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
        
        // Start layout monitoring
        this.startLayoutMonitoring();
        
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
            });
            
            // Marker lost
            marker.addEventListener('markerLost', () => {
                console.log(`📱 Marcador perdido: ${markerId}`);
                this.onMarkerLost(markerId, marker);
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
            
            // Try to control zoom when video is ready
            if (video.readyState >= 2) {
                setTimeout(() => {
                    this.attemptZoomControl();
                }, 1000);
            }
        } else {
            console.warn('⚠️ ARManager: Elemento de vídeo não encontrado');
            
            // Try to find video element with different selectors
            const videoAlternatives = [
                'video',
                'a-scene video',
                'canvas + video',
                '[src*="blob:"]'
            ];
            
            let foundVideo = false;
            for (const selector of videoAlternatives) {
                const altVideo = document.querySelector(selector);
                if (altVideo && altVideo.tagName === 'VIDEO') {
                    console.log(`✅ ARManager: Vídeo encontrado com seletor alternativo: ${selector}`);
                    foundVideo = true;
                    
                    setTimeout(() => {
                        this.attemptZoomControl();
                    }, 2000);
                    break;
                }
            }
            
            if (!foundVideo) {
                // Keep trying to find video element but limit attempts
                const currentAttempts = this.videoSearchAttempts || 0;
                if (currentAttempts < 3) {
                    this.videoSearchAttempts = currentAttempts + 1;
                    console.log(`🔍 ARManager: Tentando encontrar vídeo novamente em 3s... (tentativa ${this.videoSearchAttempts}/3)`);
                    setTimeout(() => {
                        this.checkARStatus();
                    }, 3000);
                } else {
                    console.log('⚠️ ARManager: Limite de tentativas de busca por vídeo atingido');
                    console.log('🎯 ARManager: AR pode estar funcionando mesmo sem encontrar vídeo element');
                }
            }
        }
        
        // Force hide loading screen if still visible
        this.hideLoadingScreen();
        
        // Force full screen layout
        this.forceFullScreenLayout();
        
        // Show debug message
        this.updateDebugInfo('AR inicializado - aponte para marcador HIRO', 'info');
    }
    
    onMarkerFound(markerId, markerElement) {
        // Add to active markers set
        this.activeMarkers.add(markerId);
        console.log('🎓 ARManager: Marcador ativo adicionado:', markerId);
        console.log('📈 ARManager: Total de marcadores ativos:', this.activeMarkers.size);
        
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
        // Remove from active markers set
        this.activeMarkers.delete(markerId);
        console.log('🗋 ARManager: Marcador ativo removido:', markerId);
        console.log('📈 ARManager: Total de marcadores ativos:', this.activeMarkers.size);
        
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
        // Add simple scale effect without problematic easing
        const objects = markerElement.querySelectorAll('a-box, a-sphere, a-cylinder, a-gltf-model');
        objects.forEach(obj => {
            // Use simple CSS-based animation instead of A-Frame animation
            obj.setAttribute('scale', '0.8 0.8 0.8');
            setTimeout(() => {
                obj.setAttribute('scale', '1 1 1');
            }, 100);
            
            // Add pulsing effect for better visibility
            obj.setAttribute('animation__pulse', {
                property: 'rotation',
                from: '0 0 0',
                to: '0 360 0',
                dur: 3000,
                easing: 'linear',
                loop: true
            });
        });
    }
    
    removeMarkerFeedback(markerElement) {
        // Remove feedback animations
        const objects = markerElement.querySelectorAll('a-box, a-sphere, a-cylinder, a-gltf-model');
        objects.forEach(obj => {
            obj.removeAttribute('animation__scale');
            obj.removeAttribute('animation__pulse');
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
            
            // Check camera capabilities and try to control zoom
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                const settings = videoTrack.getSettings();
                console.log('📸 ARManager: Configurações da câmera:', {
                    width: settings.width,
                    height: settings.height,
                    facingMode: settings.facingMode,
                    deviceId: settings.deviceId?.substring(0, 8) + '...'
                });
                
                // Try to get capabilities and control zoom
                const capabilities = videoTrack.getCapabilities();
                if (capabilities) {
                    console.log('🔧 ARManager: Capacidades da câmera:', {
                        zoom: capabilities.zoom,
                        focusMode: capabilities.focusMode,
                        width: capabilities.width,
                        height: capabilities.height
                    });
                    
                    // Try to apply zoom constraints
                    if (capabilities.zoom) {
                        const constraints = {
                            advanced: [{
                                zoom: { min: capabilities.zoom.min, max: capabilities.zoom.min }
                            }]
                        };
                        
                        videoTrack.applyConstraints(constraints)
                        .then(() => {
                            console.log('✅ ARManager: Zoom mínimo aplicado com sucesso');
                        })
                        .catch(error => {
                            console.log('⚠️ ARManager: Não foi possível aplicar zoom constraints:', error);
                        });
                    }
                }
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
                // More flexible filtering - exclude only obvious front cameras
                const isFrontCamera = label.includes('front') || 
                                    label.includes('selfie') ||
                                    label.includes('user') ||
                                    label.includes('face');
                
                // Include cameras without specific labels as potential back cameras
                const hasValidLabel = device.label && device.label.trim() !== '' && !label.includes('camera 0');
                
                // For Samsung S20 FE specifically, include even unnamed cameras
                const isPotentialBackCamera = !isFrontCamera;
                
                return isPotentialBackCamera;
            });
            
            console.log('📱 ARManager: Câmeras candidatas (incluindo sem rótulo):', backCameras.length);
            backCameras.forEach((device, index) => {
                const displayLabel = device.label || `Câmera ${index} (sem rótulo)`;
                console.log(`📷 Câmera candidata ${index}:`, displayLabel);
            });
            
            // Strategy 1: Enhanced Samsung S20 FE detection with flexible scoring
            if (videoDevices.length >= 1) {
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
                    const label = device.label ? device.label.toLowerCase() : '';
                    let score = 100; // Base score
                    
                    // Penalize telephoto indicators heavily
                    telephotoIndicators.forEach(indicator => {
                        if (label.includes(indicator)) {
                            score -= 50;
                            console.log(`⬇️ Penalizando ${device.label || 'Câmera sem rótulo'} por '${indicator}': -50 pontos`);
                        }
                    });
                    
                    // Penalize ultrawide moderately  
                    ultraWideIndicators.forEach(indicator => {
                        if (label.includes(indicator)) {
                            score -= 30;
                            console.log(`⬇️ Penalizando ${device.label || 'Câmera sem rótulo'} por '${indicator}': -30 pontos`);
                        }
                    });
                    
                    // Bonus for main/wide/primary indicators
                    if (label.includes('main') || label.includes('wide') || 
                        label.includes('primary') || label.includes('principal')) {
                        score += 20;
                        console.log(`⬆️ Bonificando ${device.label || 'Câmera sem rótulo'} por palavra-chave principal: +20 pontos`);
                    }
                    
                    // For cameras without labels, give slight preference to first ones
                    if (!device.label || device.label.trim() === '' || device.label.toLowerCase().includes('camera')) {
                        if (index === 0) {
                            score += 10;
                            console.log(`⬆️ Bonificando câmera sem rótulo (posição 0): +10 pontos`);
                        }
                    }
                    
                    // Samsung S20 FE specific: First camera often wide, last often telephoto
                    if (backCameras.length >= 2) {
                        if (index === 0) {
                            score += 15;
                            console.log(`⬆️ Bonificando primeira câmera: +15 pontos`);
                        }
                        
                        // Avoid last camera (often telephoto) only if we have multiple options
                        if (index === backCameras.length - 1 && backCameras.length >= 3) {
                            score -= 25;
                            console.log(`⬇️ Penalizando última câmera: -25 pontos`);
                        }
                    }
                    
                    return { device, score, index };
                });
                
                // Sort by score (highest first)
                cameraScores.sort((a, b) => b.score - a.score);
                
                console.log('📊 ARManager: Pontuação das câmeras:');
                cameraScores.forEach(({ device, score, index }) => {
                    const displayLabel = device.label || `Câmera ${index} (sem rótulo)`;
                    console.log(`📷 ${displayLabel}: ${score} pontos`);
                });
                
                // Select camera with highest score
                if (cameraScores[0] && cameraScores[0].score > 0) {
                    selectedDeviceId = cameraScores[0].device.deviceId;
                    selectedStrategy = 'enhanced-scoring';
                    const displayLabel = cameraScores[0].device.label || `Câmera ${cameraScores[0].index} (sem rótulo)`;
                    console.log('🎯 ARManager: Câmera selecionada por pontuação:', 
                               displayLabel, 
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
            
            // Strategy 3: Force use first available camera if nothing else works
            if (!selectedDeviceId && videoDevices.length > 0) {
                // Try any camera that's not obviously front-facing
                const anyBackCamera = videoDevices.find(device => {
                    const label = device.label.toLowerCase();
                    return !label.includes('front') && !label.includes('selfie');
                }) || videoDevices[0]; // Use first camera as last resort
                
                selectedDeviceId = anyBackCamera.deviceId;
                selectedStrategy = 'fallback-any-camera';
                console.log('🎯 ARManager: Usando fallback - qualquer câmera disponível:', 
                           anyBackCamera.label || 'Câmera sem rótulo');
            }
            
            // Build constraints with simplified camera forcing
            const constraints = {
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
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
                                
                                // Check if AR is already working properly before switching cameras
                                if (this.isARWorkingProperly()) {
                                    console.log('✅ ARManager: AR já funcionando corretamente, mantendo câmera atual');
                                    console.log('📱 ARManager: Usuário pode ajustar zoom manualmente se necessário');
                                } else {
                                    console.warn('🔄 ARManager: AR não está funcionando, tentando forçar câmera wide...');
                                    this.forceCameraSelection();
                                }
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
    
    attemptZoomControl() {
        console.log('🔍 ARManager: Tentando controlar zoom da câmera...');
        
        // Multiple attempts to find and control camera
        let attempt = 0;
        const maxAttempts = 5;
        
        const controlZoom = () => {
            attempt++;
            console.log(`🔄 ARManager: Tentativa ${attempt}/${maxAttempts} de controlar zoom`);
            
            // Try to find video element created by AR.js
            const video = document.querySelector('video');
            
            if (video && video.srcObject) {
                const stream = video.srcObject;
                const videoTrack = stream.getVideoTracks()[0];
                
                if (videoTrack) {
                    const capabilities = videoTrack.getCapabilities();
                    const settings = videoTrack.getSettings();
                    
                    console.log('📹 ARManager: Settings atuais:', {
                        zoom: settings.zoom,
                        width: settings.width,
                        height: settings.height,
                        focusMode: settings.focusMode,
                        aspectRatio: settings.aspectRatio,
                        frameRate: settings.frameRate
                    });
                    
                    if (capabilities) {
                        console.log('🔧 ARManager: Capabilities:', capabilities);
                        
                        // Check if zoom is already at maximum (indicating telephoto issue)
                        if (capabilities.zoom && settings.zoom) {
                            const zoomRange = capabilities.zoom.max - capabilities.zoom.min;
                            const currentZoomPercent = ((settings.zoom - capabilities.zoom.min) / zoomRange) * 100;
                            
                            console.log(`📊 ARManager: Zoom atual: ${settings.zoom} (${currentZoomPercent.toFixed(1)}% do máximo)`);
                            console.log(`🔍 ARManager: Zoom range: ${capabilities.zoom.min} - ${capabilities.zoom.max}`);
                            
                            // Even if zoom is at minimum, try to widen the field of view
                            if (currentZoomPercent <= 50) {
                                console.log('🎯 ARManager: Zoom OK, mas tentando melhorar campo de visão...');
                                
                                // Try to apply additional constraints for wider FOV
                                const fovConstraints = {
                                    width: { ideal: 640, max: 640 },
                                    height: { ideal: 480, max: 480 },
                                    zoom: capabilities.zoom.min,
                                    aspectRatio: { ideal: 4/3 }
                                };
                                
                                if (capabilities.focusDistance) {
                                    fovConstraints.focusDistance = capabilities.focusDistance.max; // Focus far for wider view
                                }
                                
                                videoTrack.applyConstraints({ advanced: [fovConstraints] })
                                .then(() => {
                                    console.log('✅ ARManager: Campo de visão otimizado');
                                    this.showZoomInstruction('✅ Campo de visão otimizado para AR!', 'success');
                                })
                                .catch(error => {
                                    console.log('⚠️ ARManager: Não foi possível otimizar FOV:', error);
                                    console.log('❓ ARManager: Pode ser câmera teleobjetiva simulando wide-angle');
                                    this.showZoomInstruction('📱 Imagem muito ampliada? Use dois dedos para diminuir zoom', 'warning');
                                    
                                    // Remove automatic camera switching - only suggest manual adjustment
                                    // User can manually adjust zoom if needed
                                });
                            } else {
                                // Zoom is too high, try to reduce it
                                console.log('⚠️ ARManager: ZOOM ALTO DETECTADO! Tentando corrigir...');
                                
                                const minZoom = capabilities.zoom.min;
                                const constraints = {
                                    advanced: [{ zoom: minZoom }]
                                };
                                
                                videoTrack.applyConstraints(constraints)
                                .then(() => {
                                    console.log('✅ ARManager: Zoom resetado para mínimo:', minZoom);
                                    this.showZoomInstruction('✅ Zoom corrigido automaticamente!', 'success');
                                })
                                .catch(error => {
                                    console.log('❌ ARManager: Falha ao resetar zoom:', error);
                                    this.showZoomInstruction('📱 Use dois dedos para diminuir o zoom e detectar o marcador', 'warning');
                                });
                            }
                        } else {
                            console.log('❓ ARManager: Zoom capabilities não disponíveis');
                            this.showZoomInstruction('📱 Se elementos AR estão pequenos, use dois dedos para ajustar zoom', 'info');
                        }
                    }
                    return; // Found video track, stop trying
                }
            }
            
            // Video not ready yet, try again
            if (attempt < maxAttempts) {
                console.log('⏳ ARManager: Vídeo não encontrado, tentando novamente em 1s...');
                setTimeout(controlZoom, 1000);
            } else {
                console.log('❌ ARManager: Não foi possível encontrar vídeo element após múltiplas tentativas');
                this.showZoomInstruction('📱 Use dois dedos na tela para ajustar zoom se necessário', 'warning');
            }
        };
        
        // Start first attempt
        controlZoom();
    }
    
    showZoomInstruction(message, type = 'info') {
        // Remove any existing zoom instruction
        const existing = document.querySelector('.zoom-instructions');
        if (existing) {
            existing.remove();
        }
        
        // Create new instruction
        const instruction = document.createElement('div');
        instruction.className = 'zoom-instructions';
        instruction.textContent = message;
        
        // Add type-specific styling
        if (type === 'success') {
            instruction.style.background = 'rgba(16, 185, 129, 0.9)';
        } else if (type === 'warning') {
            instruction.style.background = 'rgba(245, 158, 11, 0.9)';
        } else {
            instruction.style.background = 'rgba(59, 130, 246, 0.9)';
        }
        
        document.body.appendChild(instruction);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (instruction.parentNode) {
                instruction.remove();
            }
        }, 5000);
        
        console.log(`📱 ARManager: Instrução mostrada - ${message}`);
    }
    
    // Add function to try forcing a different camera if current one seems to be telephoto
    async tryAlternativeCamera() {
        console.log('🔄 ARManager: Tentando câmera alternativa...');
        
        try {
            // Get all video devices again
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            if (videoDevices.length > 1) {
                console.log('📷 ARManager: Múltiplas câmeras detectadas, tentando alternativa...');
                
                // Try to get current deviceId
                const video = document.querySelector('video');
                let currentDeviceId = null;
                
                if (video && video.srcObject) {
                    const track = video.srcObject.getVideoTracks()[0];
                    if (track) {
                        currentDeviceId = track.getSettings().deviceId;
                    }
                }
                
                // Find a different camera
                const alternativeCamera = videoDevices.find(device => 
                    device.deviceId !== currentDeviceId && 
                    !device.label.toLowerCase().includes('front') &&
                    !device.label.toLowerCase().includes('selfie')
                );
                
                if (alternativeCamera) {
                    console.log('🎯 ARManager: Câmera alternativa encontrada:', alternativeCamera.label);
                    
                    // Store preference and reload
                    localStorage.setItem('qoder-preferred-camera', alternativeCamera.deviceId);
                    
                    this.showZoomInstruction('🔄 Tentando câmera alternativa...', 'info');
                    
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    console.log('⚠️ ARManager: Nenhuma câmera alternativa encontrada');
                }
            }
        } catch (error) {
            console.error('❌ ARManager: Erro ao tentar câmera alternativa:', error);
        }
    }
    
    // Force full screen layout regardless of zoom
    forceFullScreenLayout() {
        console.log('📺 ARManager: Forçando layout full screen...');
        
        // Get viewport dimensions including safe areas
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Force canvas to fill screen
        const canvas = document.querySelector('canvas.a-canvas');
        if (canvas) {
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.right = '0';
            canvas.style.bottom = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.maxWidth = '100vw';
            canvas.style.maxHeight = '100vh';
            canvas.style.objectFit = 'cover';
            canvas.style.objectPosition = 'center';
            canvas.style.zIndex = '2';
            canvas.style.background = 'transparent'; // Transparent to show video
            
            // Force canvas dimensions directly
            if (canvas.width !== viewportWidth || canvas.height !== viewportHeight) {
                console.log('🔧 ARManager: Ajustando dimensões do canvas:', viewportWidth, 'x', viewportHeight);
            }
            
            console.log('✅ ARManager: Canvas forçado para full screen');
        }
        
        // Force video to fill screen
        const video = document.querySelector('video');
        if (video) {
            video.style.position = 'fixed';
            video.style.top = '0';
            video.style.left = '0';
            video.style.right = '0';
            video.style.bottom = '0';
            video.style.width = '100vw';
            video.style.height = '100vh';
            video.style.maxWidth = '100vw';
            video.style.maxHeight = '100vh';
            video.style.objectFit = 'cover';
            video.style.objectPosition = 'center';
            video.style.zIndex = '1'; // Behind canvas but visible
            video.style.background = '#000';
            console.log('✅ ARManager: Vídeo forçado para full screen');
        }
        
        // Force A-Frame scene
        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.style.position = 'fixed';
            scene.style.top = '0';
            scene.style.left = '0';
            scene.style.right = '0';
            scene.style.bottom = '0';
            scene.style.width = '100vw';
            scene.style.height = '100vh';
            scene.style.maxWidth = '100vw';
            scene.style.maxHeight = '100vh';
            scene.style.zIndex = '0'; // Behind video and canvas
            scene.style.overflow = 'hidden';
            scene.style.background = 'transparent';
            console.log('✅ ARManager: A-Frame scene forçado para full screen');
        }
        
        // Force body and html to prevent scrolling/overflow issues
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.documentElement.style.overflow = 'hidden';
        
        // Ensure video is visible and playing
        this.ensureVideoVisibility();
    }
    
    // Ensure camera video is visible
    ensureVideoVisibility() {
        const video = document.querySelector('video');
        if (video) {
            // Check if video is actually showing content
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                console.log('✅ ARManager: Vídeo da câmera está ativo:', {
                    width: video.videoWidth,
                    height: video.videoHeight,
                    readyState: video.readyState
                });
                
                // Make sure it's visible
                video.style.visibility = 'visible';
                video.style.opacity = '1';
                video.style.display = 'block';
            } else {
                console.log('⚠️ ARManager: Vídeo da câmera sem conteúdo, tentando reativar...');
                
                // Try to restart video if it has no content
                if (video.srcObject) {
                    video.load();
                    video.play().catch(e => console.log('Erro ao reproduzir vídeo:', e));
                }
            }
        } else {
            console.log('⚠️ ARManager: Elemento de vídeo não encontrado');
        }
    }
    
    // Monitor layout to prevent shrinking
    startLayoutMonitoring() {
        console.log('👁️ ARManager: Iniciando monitoramento de layout...');
        
        setInterval(() => {
            const canvas = document.querySelector('canvas.a-canvas');
            const video = document.querySelector('video');
            const scene = document.querySelector('a-scene');
            
            let needsCorrection = false;
            
            // Check canvas dimensions
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const expectedWidth = window.innerWidth;
                const expectedHeight = window.innerHeight;
                
                // Check if canvas is smaller than expected or has black bars
                if (rect.width < expectedWidth * 0.9 || 
                    rect.height < expectedHeight * 0.9 ||
                    rect.left > 5 || rect.top > 5) {
                    
                    console.log('⚠️ ARManager: Layout problem detectado:', {
                        canvasWidth: rect.width,
                        canvasHeight: rect.height,
                        canvasLeft: rect.left,
                        canvasTop: rect.top,
                        expectedWidth,
                        expectedHeight
                    });
                    
                    needsCorrection = true;
                }
            }
            
            // Check video dimensions and visibility
            if (video) {
                const videoRect = video.getBoundingClientRect();
                if (videoRect.width < window.innerWidth * 0.9 || 
                    videoRect.height < window.innerHeight * 0.9) {
                    needsCorrection = true;
                }
                
                // Check if video has content but isn't visible
                if (video.videoWidth > 0 && video.videoHeight > 0) {
                    if (video.style.visibility === 'hidden' || 
                        video.style.opacity === '0' || 
                        video.style.display === 'none') {
                        console.log('🔧 ARManager: Vídeo com conteúdo mas não visível, corrigindo...');
                        this.ensureVideoVisibility();
                    }
                } else if (video.srcObject) {
                    console.log('⚠️ ARManager: Vídeo sem conteúdo mas com stream, verificando...');
                    this.ensureVideoVisibility();
                }
            }
            
            // Check scene dimensions
            if (scene) {
                const sceneRect = scene.getBoundingClientRect();
                if (sceneRect.width < window.innerWidth * 0.9 || 
                    sceneRect.height < window.innerHeight * 0.9) {
                    needsCorrection = true;
                }
            }
            
            if (needsCorrection) {
                console.log('🔧 ARManager: Corrigindo layout...');
                this.forceFullScreenLayout();
                
                // Show instruction to user
                this.showZoomInstruction('📺 Layout corrigido automaticamente', 'success');
            }
        }, 1500); // Check every 1.5 seconds for faster response
    }
    
    // Check if AR is working properly even without finding video element
    isARWorkingProperly() {
        // Check if markers are being detected
        if (this.activeMarkers.size > 0) {
            console.log('✅ ARManager: AR funcionando - marcadores sendo detectados');
            console.log('📈 ARManager: Marcadores ativos:', Array.from(this.activeMarkers));
            return true;
        }
        
        // Check if canvas is rendering and scene is active
        const canvas = document.querySelector('canvas.a-canvas');
        const scene = document.querySelector('a-scene');
        
        if (canvas && canvas.width > 0 && canvas.height > 0 && scene) {
            // Additional check: has AR been running for at least 10 seconds?
            // This prevents camera switching too early when AR is still initializing
            const arRunTime = Date.now() - (this.initTime || Date.now());
            if (arRunTime > 10000) { // 10 seconds
                console.log('✅ ARManager: AR funcionando - canvas ativo e tempo suficiente');
                return true;
            } else {
                console.log('⏳ ARManager: AR ainda inicializando, aguardando...', Math.round(arRunTime/1000), 'segundos');
                return true; // Consider it working during initialization period
            }
        }
        
        console.log('⚠️ ARManager: AR não está funcionando adequadamente');
        return false;
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