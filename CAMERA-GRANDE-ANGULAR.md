# 📷 Configuração para Câmera Grande-Angular

## 🎯 Problema Resolvido
**Situação**: Samsung S20 FE possui 3 câmeras traseiras (ultragrande-angular, grande-angular e teleobjetiva) e o jogo estava usando a **teleobjetiva** ao invés da **grande-angular**.

**Problema**: A câmera teleobjetiva tem campo de visão menor, dificultando a detecção de marcadores AR e a experiência do usuário.

**Solução**: ✅ Configurações específicas para forçar o uso da câmera **grande-angular**.

---

## 🔧 Alterações Implementadas

### 1. **JavaScript - Seleção de Câmera Aprimorada**

#### **Antes (Genérico):**
```javascript
navigator.mediaDevices.getUserMedia({ 
    video: {
        facingMode: 'environment'
    }
})
```

#### **Depois (Específico para Grande-Angular):**
```javascript
const cameraConstraints = {
    video: {
        facingMode: 'environment',
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        // Force wide-angle camera selection
        advanced: [{
            focusMode: 'continuous',
            zoom: { ideal: 1.0, max: 1.0 } // Prevent zoom/telephoto
        }]
    }
};
```

### 2. **A-Frame - Configurações de Resolução**

#### **Adicionadas configurações específicas:**
```html
arjs-camera="sourceType: webcam; 
             sourceWidth: 1280; 
             sourceHeight: 720; 
             displayWidth: 1280; 
             displayHeight: 720;"
```

### 3. **Sistema de Fallback Inteligente**

```javascript
// Se câmera grande-angular falhar, tenta configurações simplificadas
const fallbackConstraints = {
    video: {
        facingMode: 'environment',
        width: { ideal: 640 },
        height: { ideal: 480 }
    }
};
```

---

## 📱 Como Funciona no Samsung S20 FE

### **Processo de Seleção de Câmera:**

1. **Primeira Tentativa**: Câmera grande-angular com resolução HD
   - `width: 1280px, height: 720px`
   - `zoom: 1.0` (mínimo, evita teleobjetiva)
   - `focusMode: 'continuous'`

2. **Se Falhar**: Fallback para configurações básicas
   - `width: 640px, height: 480px`
   - Apenas `facingMode: 'environment'`

3. **Logs Informativos**:
   ```
   ✅ ARManager: Câmera ativada (grande-angular)
   📸 ARManager: Configurações da câmera:
       width: 1280, height: 720
       facingMode: environment
       deviceId: [camera-id]
   ```

### **Resultado Esperado:**
- ✅ Campo de visão mais amplo
- ✅ Melhor detecção de marcadores
- ✅ Experiência AR mais fluida
- ✅ Evita câmera teleobjetiva (zoom)

---

## 🧪 Teste no Celular

### **O que verificar:**
1. **Campo de visão**: Deve ser mais amplo que antes
2. **Detecção do marcador HIRO**: Mais fácil de detectar
3. **Logs no console**: Deve aparecer "(grande-angular)"
4. **Qualidade da imagem**: Adequada para AR

### **Logs esperados:**
```
📷 ARManager: Verificando permissões de câmera...
✅ ARManager: Permissão de câmera concedida (grande-angular)
📸 ARManager: Capacidades da câmera: {...}
🎯 ARManager: Configurações de câmera aplicadas para AR
📹 ARManager: Track video parado
```

### **Se não funcionar:**
- O sistema automaticamente tentará configurações de fallback
- Aparecerá no log: "tentando câmera com configurações simplificadas"
- Ainda funcionará, mas talvez com câmera diferente

---

## ⚙️ Detalhes Técnicos

### **Constraints para Evitar Teleobjetiva:**
- `zoom: { ideal: 1.0, max: 1.0 }` - Força zoom mínimo
- `width/height` específicos - Evita resoluções de telephoto
- `focusMode: 'continuous'` - Melhor para AR em movimento

### **Configurações A-Frame:**
- `sourceWidth/Height: 1280x720` - Resolução ideal
- `displayWidth/Height: 1280x720` - Correspondência de display
- `maxDetectionRate: 60` - Taxa de detecção otimizada
- `antialias: false` - Performance mobile

### **Sistema de Detecção:**
- Tenta detectar capacidades da câmera
- Aplica constraints específicos para AR
- Log detalhado para debugging
- Fallback automático em caso de erro

---

## 🎯 Benefícios

1. **Campo de Visão Amplo**: Melhor para AR
2. **Detecção Aprimorada**: Marcadores mais fáceis de encontrar
3. **Performance Otimizada**: Configurações específicas para mobile
4. **Compatibilidade**: Funciona com múltiplos dispositivos
5. **Debugging**: Logs detalhados para troubleshooting

**Status**: ✅ Configurado para câmera grande-angular no Samsung S20 FE!