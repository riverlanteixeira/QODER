# 🚀 Deploy da ETAPA 1 no GitHub Pages

## 📋 Passos para Deploy

### 1. 🔧 Preparar Repositório GitHub

1. **Criar repositório no GitHub**:
   ```
   Nome: qoder-ar-game (ou nome de sua escolha)
   Descrição: Jogo AR educativo da Polícia Civil SC
   Visibilidade: Public (necessário para GitHub Pages gratuito)
   ```

2. **Configurar repositório local**:
   ```bash
   cd c:\Projetos\QODER
   git init
   git add .
   git commit -m "ETAPA 1: Estrutura base e AR básico"
   git branch -M main
   git remote add origin https://github.com/[SEU-USUARIO]/qoder-ar-game.git
   git push -u origin main
   ```

### 2. ⚙️ Configurar GitHub Pages

1. **Acessar configurações**:
   - Vá para o repositório no GitHub
   - Clique em "Settings" (configurações)
   - Role até a seção "Pages"

2. **Configurar source**:
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
   - Clique "Save"

3. **Aguardar deploy**:
   - GitHub Pages levará 1-5 minutos para fazer o deploy
   - URL será: `https://[SEU-USUARIO].github.io/qoder-ar-game/`

### 3. 🎯 Testar Deploy

1. **Verificar URL**:
   - Acesse a URL do GitHub Pages
   - Deve ver a tela de loading azul
   - Aguarde a inicialização do AR

2. **Preparar marcador HIRO**:
   - Baixe: https://ar-js-org.github.io/AR.js/data/images/hiro.png
   - Imprima ou exiba numa tela grande

### 4. 📱 Teste no Samsung S20 FE

#### **Checklist de Teste:**

**🔧 Pré-teste:**
- [ ] Site carrega via HTTPS
- [ ] Não há erros no console (F12)
- [ ] Loading screen aparece

**📷 Câmera AR:**
- [ ] Permissão de câmera solicitada
- [ ] Câmera ativa automaticamente
- [ ] Visualização da câmera é clara

**🎯 Marcador HIRO:**
- [ ] Marcador é detectado rapidamente
- [ ] Cubo laranja aparece sobre o marcador
- [ ] Animação de rotação funciona
- [ ] Texto "AR Funcionando!" é visível

**🎮 Interface:**
- [ ] Debug info no canto superior esquerdo
- [ ] Toast "AR funcionando!" aparece
- [ ] Interface responsiva no mobile

**⚡ Performance:**
- [ ] Sem travamentos ou lentidão
- [ ] Transições suaves
- [ ] Detecção de marcador estável

### 5. 🐛 Possíveis Problemas e Soluções

#### **Site não carrega:**
```
Causa: GitHub Pages ainda processando
Solução: Aguardar 5-10 minutos e tentar novamente
```

#### **Câmera não funciona:**
```
Causa: Falta de permissão ou HTTP (não HTTPS)
Solução: Verificar se URL é HTTPS e conceder permissão
```

#### **Marcador não detecta:**
```
Causa: Pouca luz ou marcador muito pequeno
Solução: Melhorar iluminação e usar marcador maior
```

#### **Performance ruim:**
```
Causa: Muitos apps abertos ou hardware limitado
Solução: Fechar outros apps e testar em boa iluminação
```

### 6. ✅ Critérios de Aprovação

A ETAPA 1 está **APROVADA** quando:

- ✅ Deploy no GitHub Pages funciona
- ✅ Site carrega via HTTPS no S20 FE
- ✅ Câmera AR ativa automaticamente
- ✅ Marcador HIRO é detectado consistentemente
- ✅ Cubo 3D aparece e gira suavemente
- ✅ Debug info é exibido corretamente
- ✅ Performance é aceitável (30+ FPS)
- ✅ Sem erros críticos no console

### 7. 📊 Logs e Debug

**Para acompanhar o funcionamento:**

1. **No celular** - abra o Chrome DevTools:
   ```
   chrome://inspect/#devices
   ```

2. **Logs importantes para verificar:**
   ```
   ✅ ARManager: Inicializando...
   ✅ GameManager: Inicializado com sucesso
   📱 ARManager: Cena A-Frame carregada
   🎯 ARManager: AR.js pronto
   📹 ARManager: Câmera inicializada
   🎯 Marcador encontrado: test-marker-hiro
   ```

### 8. 🔄 Próximos Passos

Após aprovação da ETAPA 1:

1. **Documentar sucesso**: Anotar URL e resultados
2. **Backup**: Fazer commit do estado atual
3. **Avançar para ETAPA 2**: Interface base e navegação

---

## 📁 Estrutura Final da ETAPA 1

```
c:\Projetos\QODER\
├── index.html                  # ✅ Página principal AR
├── manifest.json               # ✅ PWA manifest
├── TESTE-ETAPA-1.md           # ✅ Instruções de teste
├── src/
│   ├── css/
│   │   └── main.css           # ✅ Estilos responsivos
│   └── js/core/
│       ├── ar-manager.js      # ✅ Gerenciador AR
│       └── game-manager.js    # ✅ Lógica do jogo
└── assets/
    └── img/
        └── emblema.svg        # ✅ Logo temporário
```

**URL de Teste**: `https://[SEU-USUARIO].github.io/qoder-ar-game/`

**Marcador**: HIRO padrão do AR.js

**Resultado Esperado**: Cubo laranja girando em AR! 🎯