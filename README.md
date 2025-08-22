# 📄 PRD – Jogo de Realidade Aumentada: **Caça ao Ladrão da Joia**

## 1. Visão Geral
O jogo é uma experiência educativa em **Realidade Aumentada (AR)** desenvolvida para crianças em eventos da **Polícia Civil de Santa Catarina**.  
O objetivo é ensinar noções básicas de investigação policial de forma lúdica, usando o navegador do celular para explorar pistas em AR e deduzir o culpado entre três suspeitos.

---

## 2. Objetivos
- Criar uma experiência **divertida e educativa** para crianças.  
- Ensinar a lógica de investigação: **coleta de pistas → análise → dedução**.  
- Promover a aproximação da **Polícia Civil de SC** com a comunidade.  

---

## 3. Público-Alvo
- Crianças entre **7 e 12 anos**.  
- Famílias em eventos comunitários da Polícia Civil.  
- Acessível em celulares Android modernos (Chrome/Edge).  

---

## 4. Fluxo do Jogo e Assets

1. **Cena do Crime (marcador no chão)**  
   - Ao mirar → aparece a **pegada em PNG**.  
   - Arquivo: `assets/img/pegada.png`  
   - Ao clicar → pista coletada.  
   - Informação coletada: **Sapato nº 42**  

---

2. **Testemunha 1 (marcador na parede)**  
   - Aparece personagem 3D (homem).  
   - Arquivo modelo: `assets/models/homem.glb`  
   - Arquivo áudio: `assets/audio/testemunha1.mp3`  
   - Ao clicar → áudio toca:  
     > “Vi alguém correndo com algo dourado na mão. Ele tinha **1,90m de altura**!”  
   - Informação coletada: **Altura 1,90m**  

---

3. **Testemunha 2 (marcador na parede)**  
   - Aparece personagem 3D (mulher).  
   - Arquivo modelo: `assets/models/mulher.glb`  
   - Arquivo áudio: `assets/audio/testemunha2.mp3`  
   - Ao clicar → áudio toca:  
     > “Vi alguém usando **luvas**! Ele jogou uma delas no chão.”  
   - Informação coletada: **Luva**  

---

4. **Câmera de Segurança (marcador na parede)**  
   - Aparece uma câmera de vigilância em 3D.  
   - Arquivo modelo: `assets/models/camera.glb`  
   - Ao clicar → aparece monitor em AR exibindo imagem dos três suspeitos.  
   - Arquivo imagem: `assets/img/suspeitos.png`  
   - Informação coletada: **Três suspeitos estiveram no local do crime**  

---

5. **Delegacia (marcador final)**  
   - Aparecem os três suspeitos em 3D:  
     - **Drácula** → `assets/models/dracula.glb`  
     - **Frankenstein** → `assets/models/frankenstein.glb`  
     - **Lobisomem** → `assets/models/lobisomem.glb`  
   - Ao mirar → aparece painel flutuante com informações:  
     - **Frankenstein** → Altura: 1,90m / Sapato: 42  
     - **Drácula** → Altura: 1,70m / Sapato: 42  
     - **Lobisomem** → Altura: 1,90m / Sapato: 39  
   - Jogador deve **clicar em um suspeito** para acusá-lo.  
   - Resultado:  
     - Se acusar **Frankenstein** → vitória.  
     - Se acusar outro → erro, com sugestão de revisar pistas.  

---

## 5. Inventário (ícone 🎒)
O jogador pode abrir a mochila para ver as pistas coletadas:  
1. 👣 Pegada – Sapato nº 42  
2. 📏 Altura: 1,90m  
3. 🧤 Luva  
4. 📹 Câmera de segurança – “Três suspeitos estiveram no local”  

---

## 6. Regras de Lógica
- **Drácula** → sapato nº 42 (igual Frankenstein).  
- **Lobisomem** → altura 1,90m (igual Frankenstein).  
- **Todos os três suspeitos** → confirmados pela câmera de segurança.  
- **Frankenstein** → único com **luva faltando** → culpado.  

---

## 7. Requisitos Técnicos
- **Plataforma:** Web (HTML5, JavaScript, A-Frame, AR.js).  
- **Dispositivo:** Smartphones Android com suporte a ARCore.  
- **Navegador:** Chrome 79+ ou Edge.  
- **Conexão:** HTTPS obrigatório para WebXR.  
- **Assets:**  
  - Modelos 3D GLB → personagens, testemunhas, câmera.  
  - Imagens PNG → pegada, suspeitos, **emblema da Polícia Civil** (`assets/img/emblema.png`).  
  - Áudios MP3 → testemunhas.  

---

## 8. Interface do Usuário
- **Tela inicial**  
  - Mostra o **emblema da Polícia Civil** (`assets/img/emblema.png`).  
  - Botão: *Entrar na Investigação*.  
- **Inventário**  
  - Ícone da mochila 🎒 no canto superior direito.  
  - Mostra todas as pistas coletadas.  
- **Notificações**  
  - Sistema de *toast* para feedback (ex: “Pista coletada!”).  
- **Painéis flutuantes em AR**  
  - Mostram altura e sapato dos suspeitos na delegacia.  
- **Tela final**  
  - Mostra **resultado da investigação** (vitória ou erro).  
  - Inclui novamente o **emblema da Polícia Civil** como marca d’água.  

---

## 9. Melhorias Propostas

### 9.1. Experiência do Usuário (UX/UI)
- [ ] **Tutorial interativo**: Fase tutorial onde a criança aprende a usar o AR
- [ ] **Indicadores visuais**: Setas flutuantes em AR mostrando onde mirar
- [ ] **Feedback háptico**: Vibração do celular quando pista é encontrada
- [ ] **Sistema de progresso**: Barra mostrando quantas pistas faltam
- [ ] **Mapa de progresso**: Mini-mapa dos locais já visitados
- [ ] **Contador de pistas**: "3/4 pistas coletadas"
- [ ] **Botão de ajuda**: Dicas contextuais quando perdido

### 9.2. Melhorias Técnicas de AR
- [ ] **Marcadores híbridos**: Combinar marker-based + markerless AR
- [ ] **Múltiplos marcadores**: Backup markers para cada cena
- [ ] **Calibração automática**: Ajuste de sensibilidade por device
- [ ] **LOD (Level of Detail)**: Modelos 3D com qualidades variadas
- [ ] **Lazy loading**: Carregar assets quando necessário
- [ ] **Compressão Draco**: Modelos GLB menores
- [ ] **Preloading inteligente**: Cache das próximas cenas

### 9.3. Gameplay Avançado
- [ ] **Notebook do detetive**: Interface para anotar descobertas
- [ ] **Pistas falsas**: Red herrings para aumentar dificuldade
- [ ] **Múltiplas soluções**: Diferentes finais baseados nas pistas
- [ ] **Sistema de pontuação**: Pontos por tempo, acertos e pistas
- [ ] **Interrogatório**: Perguntas múltipla escolha para testemunhas
- [ ] **Análise forense**: Mini-games para "analisar" pistas
- [ ] **Evidências físicas**: DNA, impressões digitais, etc.

### 9.4. Acessibilidade e Inclusão
- [ ] **Legendas**: Todas as falas com legendas opcionais
- [ ] **Contraste**: Modo alto contraste
- [ ] **Tamanhos de fonte**: Interface escalável
- [ ] **Níveis de dificuldade**: Fácil, Normal, Difícil
- [ ] **Modo cooperativo**: Pais podem ajudar
- [ ] **Múltiplos idiomas**: Português, inglês, espanhol

### 9.5. Conteúdo Expandido
- [ ] **Backstory**: História mais rica sobre o roubo
- [ ] **Personagens**: Nomes e personalidades às testemunhas
- [ ] **Motivação**: Por que cada suspeito cometeria o crime
- [ ] **Easter eggs**: Finais secretos para replay
- [ ] **Casos adicionais**: Roubo de banco, desaparecimento, vandalismo
- [ ] **Sazonalidade**: Casos temáticos (Natal, Halloween, Festa Junina)
- [ ] **Dificuldade progressiva**: Casos mais complexos

### 9.6. Funcionalidades Sociais
- [ ] **Foto de vitória**: Selfie em AR com emblema da PC
- [ ] **Compartilhamento**: Conquistas (com permissão dos pais)
- [ ] **Ranking local**: Leaderboard apenas do evento
- [ ] **Certificado digital**: "Detetive Júnior" para imprimir
- [ ] **Glossário**: Termos policiais de forma didática
- [ ] **Profissões**: Carreiras na área de segurança
- [ ] **Cidadania**: Direitos, deveres e como pedir ajuda
- [ ] **Prevenção**: Dicas de segurança pessoal

### 9.7. PWA e Funcionalidades Offline
- [ ] **Service Worker**: Cache inteligente dos assets
- [ ] **Modo offline**: Funcionalidade básica sem internet
- [ ] **Install prompt**: "Instalar" o jogo no celular
- [ ] **Background sync**: Sincronizar progresso quando online

### 9.8. Monitoramento e Analytics
- [ ] **Error tracking**: Logs de erros para debugging
- [ ] **Performance metrics**: FPS, tempo de carregamento
- [ ] **User journey**: Onde as crianças têm dificuldade
- [ ] **A/B testing**: Testar diferentes versões

## 10. Roadmap de Implementação

### Fase 1 (Curto Prazo)
1. Tutorial interativo
2. Feedback visual das interações
3. Sistema de progresso
4. Otimização dos modelos 3D

### Fase 2 (Médio Prazo)
1. PWA implementation
2. Modo offline
3. Sistema de dificuldades
4. Segundo caso investigativo

### Fase 3 (Longo Prazo)
1. Modo multiplayer local
2. Analytics detalhado
3. Dashboard para organizadores
4. Versão para tablets  

---

## 11. Arquitetura Técnica Sugerida

### 11.1. Sistema Modular
```javascript
const GameModules = {
  ARManager: {},      // Detecção de markers e renderização 3D
  StateManager: {},   // Estado do jogo e progresso
  UIManager: {},      // Interface e feedback visual
  AudioManager: {},   // Controle de áudio com fallbacks
  AnalyticsManager: {} // Coleta dados (anonimizado)
};
```

### 11.2. Estrutura de Diretórios Expandida
```
c:\Projetos\QODER\
├── README.md
├── index.html                    # Página principal
├── src/
│   ├── js/
│   │   ├── core/
│   │   │   ├── game-manager.js   # Controle principal do jogo
│   │   │   ├── ar-manager.js     # Gerenciamento AR
│   │   │   └── state-manager.js  # Estados e progresso
│   │   ├── ui/
│   │   │   ├── inventory.js      # Sistema de inventário
│   │   │   ├── tutorial.js       # Tutorial interativo
│   │   │   └── notifications.js  # Sistema de notificações
│   │   └── utils/
│   │       ├── audio-player.js   # Reprodução de áudio
│   │       └── analytics.js      # Coleta de dados
│   └── css/
│       ├── main.css             # Estilos principais
│       ├── ar-ui.css            # Interface AR
│       └── responsive.css       # Design responsivo
├── assets/
│   ├── img/
│   │   ├── pegada.png
│   │   ├── suspeitos.png
│   │   ├── emblema.png
│   │   ├── markers/             # Marcadores AR
│   │   │   ├── crime-scene.png
│   │   │   ├── witness1.png
│   │   │   ├── witness2.png
│   │   │   ├── camera.png
│   │   │   └── police-station.png
│   │   └── ui/                  # Elementos de interface
│   │       ├── progress-bar.png
│   │       ├── backpack-icon.png
│   │       └── help-button.png
│   ├── models/
│   │   ├── compressed/          # Modelos otimizados
│   │   │   ├── homem-lod1.glb
│   │   │   ├── homem-lod2.glb
│   │   │   └── homem-lod3.glb
│   │   ├── homem.glb
│   │   ├── mulher.glb
│   │   ├── camera.glb
│   │   ├── dracula.glb
│   │   ├── frankenstein.glb
│   │   └── lobisomem.glb
│   └── audio/
│       ├── testemunha1.mp3
│       ├── testemunha2.mp3
│       ├── sfx/                 # Efeitos sonoros
│       │   ├── clue-found.mp3
│       │   ├── success.mp3
│       │   └── error.mp3
│       └── ambient/
│           └── investigation-theme.mp3
├── manifest.json                # PWA manifest
├── service-worker.js           # Service worker para cache
└── docs/
    ├── SETUP.md               # Instruções de instalação
    ├── DEPLOYMENT.md          # Guia de deploy
    └── API.md                 # Documentação da API
```

### 11.3. Considerações de Segurança e Privacidade
- **Zero tracking**: Nenhum dado pessoal coletado
- **Consentimento parental**: Interface clara sobre funcionalidades
- **Dados locais**: Progresso salvo apenas no dispositivo
- **Conteúdo moderado**: Sempre apropriado e educativo
- **HTTPS obrigatório**: Segurança e compatibilidade WebXR

## 12. Licenciamento e Uso
- Uso **educativo e institucional** pela Polícia Civil de SC.  
- Modelos 3D → free/CC0 ou licenciados para uso não comercial.  
- Áudios → gravados com vozes originais.  

---

✍️ **Elaborado por:** Riverlan Kaufmann Teixeira  
👮 **Projeto:** Polícia Civil de Santa Catarina – Jogo Educativo em AR
