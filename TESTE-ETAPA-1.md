# 🧪 ETAPA 1 - Teste de AR Básico

## 📱 Como Testar no Samsung S20 FE

### 1. 📋 Pré-requisitos
- ✅ Acesso ao GitHub Pages do projeto via HTTPS
- ✅ Chrome ou Edge instalado no celular  
- ✅ Permissão para usar câmera
- ✅ Marcador HIRO impresso ou na tela do computador

### 2. 🎯 Marcador HIRO para Teste

O AR.js usa o marcador HIRO padrão. Você pode:

**Opção A - Imprimir:**
- Baixe o marcador: https://ar-js-org.github.io/AR.js/data/images/hiro.png
- Imprima em papel A4 ou maior

**Opção B - Tela do Computador:**
- Abra a imagem do marcador HIRO numa tela separada
- Deixe a imagem ocupando boa parte da tela
- Aponte o celular para a tela

### 3. 🔍 Processo de Teste

1. **Abrir o jogo**:
   - Acesse: `https://[seu-usuario].github.io/[nome-repo]/`
   - Aguarde carregar (tela azul com logo)
   - Permita acesso à câmera quando solicitado

2. **Testar AR**:
   - Aponte a câmera para o marcador HIRO
   - Deve aparecer um **cubo laranja girando**
   - Deve aparecer o texto **"AR Funcionando!"**

3. **Verificar funcionalidades**:
   - ✅ Loading screen aparece e desaparece
   - ✅ Câmera ativa corretamente
   - ✅ Marcador é detectado
   - ✅ Cubo 3D aparece sobre o marcador
   - ✅ Animação de rotação funciona
   - ✅ Debug info no canto superior esquerdo
   - ✅ Toast notification aparece ("AR funcionando!")

### 4. 🐛 Possíveis Problemas

**Câmera não ativa:**
- Verifique se permitiu acesso à câmera
- Clique no botão "📷 Ativar Câmera AR" se aparecer
- Recarregue a página

**Marcador não detecta:**
- Certifique-se que há boa iluminação
- Mantenha o marcador plano e visível
- Tente afastar/aproximar o celular
- Verifique se a imagem do marcador está nítida

**Performance ruim:**
- Feche outros apps no celular
- Verifique a conexão de internet
- Teste em ambiente com boa iluminação

### 5. ✅ Critérios de Sucesso

A ETAPA 1 está completa quando:
- [x] Site carrega via HTTPS
- [x] Câmera ativa automaticamente
- [x] Marcador HIRO é detectado
- [x] Cubo 3D aparece e gira
- [x] Debug info é exibido
- [x] Performance é aceitável (não trava)
- [x] Toast notifications funcionam

### 6. 📊 Debug Info

No canto superior esquerdo você verá:
```
🎯 ETAPA 1 - Teste de AR Básico
📱 Aponte para o marcador HIRO  
🔍 Pistas: 0/4 | Pontos: 0
⏱️ Fase: test
```

### 7. 🔄 Próxima Etapa

Quando tudo estiver funcionando perfeitamente, avançaremos para a **ETAPA 2** com:
- Tela inicial com emblema da Polícia Civil
- Sistema de navegação
- Inventário básico

---

## 🛠️ Para Desenvolvedores

### Deploy Automático
O projeto está configurado para deploy automático no GitHub Pages a cada push na branch `main`.

### Estrutura Atual
```
c:\Projetos\QODER\
├── index.html              # Página principal com A-Frame
├── manifest.json           # PWA manifest
├── src/
│   ├── css/main.css         # Estilos principais
│   └── js/core/
│       ├── ar-manager.js    # Gerenciador AR
│       └── game-manager.js  # Lógica do jogo
└── assets/                  # Assets (a serem criados)
```

### Tecnologias
- **A-Frame 1.4.0**: Framework WebXR
- **AR.js 3.4.5**: Realidade Aumentada no browser
- **Vanilla JS**: Lógica do jogo
- **PWA**: Instalação como app