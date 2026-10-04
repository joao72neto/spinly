# Plano: Permitir Giro da Roleta com Apenas 1 Item Ativo

## 1. Visão Geral do Problema e Objetivo

Atualmente, o sistema impõe uma regra de negócio que impede o usuário de girar a roleta caso ela não tenha pelo menos 2 itens ativos (habilitados e não ocultos).
O objetivo desta alteração é **simplificar a experiência do usuário**, permitindo que a roleta seja girada mesmo quando houver **apenas 1 item criado e ativo** (probabilidade de 100% para este item).

---

## 2. Mapeamento de Todas as Ocorrências no Sistema

Após a varredura em todo o código-fonte e documentos de especificação, foram mapeadas as seguintes ocorrências:

### 2.1. Lógica Matemática e Sorteio (`src/utils/math.ts`)

1. **`weightedRandomSelect` (Linha 203):**
   - **Código atual:** `if (active.length < 2) return null;`
   - **Impacto:** Se houver apenas 1 item ativo, a função retorna `null`, fazendo com que `useRouletteSpin` aborte o giro imediatamente.
   - **Ação:** Alterar para `if (active.length < 1) return null;`. Quando houver 1 item ativo, o sorteio ponderado selecionará esse único item com 100% de probabilidade.

2. **Renderização de Fatia Única / 360° no SVG (`describeArc` em `src/utils/math.ts`):**
   - **Comportamento atual:** A função `describeArc` gera um comando SVG `A` (arco elíptico). Quando há apenas 1 item, a fatia possui 360° (`startAngle = 0` e `endAngle = 360`). Pela especificação do SVG (W3C), quando o ponto inicial `(x1, y1)` coincide com o ponto final `(x2, y2)`, o arco é tratado como degenerado e **não é renderizado**, deixando a roleta em branco/invisível.
   - **Ação:** Tratar o caso de `endAngle - startAngle >= 360` em `describeArc` para desenhar um círculo completo através de dois arcos de 180° (`M cx cy-r A r r 0 1 1 cx cy+r A r r 0 1 1 cx cy-r Z`).

### 2.2. Tela da Roleta (`src/app/roulette/[id].tsx`)

1. **Verificação de Permissão de Giro (Linha 85):**
   - **Código atual:** `const canSpin = activeItems.length >= 2;`
   - **Ação:** Alterar para `const canSpin = activeItems.length >= 1;`.
2. **Aviso Visual em Tela (Linhas 107–111):**
   - **Código atual:** `⚠️ Ative pelo menos 2 itens para girar`
   - **Ação:** Alterar para `⚠️ Ative pelo menos 1 item para girar` (exibido apenas se houver itens cadastrados, mas todos estiverem desabilitados ou ocultos).
3. **Alerta de Fallback no Botão (Linhas 53–57):**
   - **Código atual:** `Alert.alert("Itens insuficientes", "Ative pelo menos 2 itens para girar a roleta.");`
   - **Ação:** Atualizar mensagem para `"Ative pelo menos 1 item para girar a roleta."`.

### 2.3. Hook de Giro (`src/hooks/useRouletteSpin.ts`)

1. **Comentários de Documentação (Linhas 26 e 37):**
   - Atualizar a documentação para refletir que o giro agora só retorna `false` caso não haja nenhum item ativo (`active.length === 0`).
   - A implementação em si já delega a seleção para `weightedRandomSelect(items)`.

---

## 3. Detalhamento das Alterações de Código

```
src/
├── utils/
│   └── math.ts               # Ajuste em weightedRandomSelect (< 1) e suporte a 360° em describeArc
├── app/
│   └── roulette/[id].tsx     # canSpin >= 1 e textos de aviso atualizados
├── hooks/
    └── useRouletteSpin.ts    # Atualização de comentários e JSDoc

```

### 3.1. `src/utils/math.ts`

```diff
 export function describeArc(
   cx: number,
   cy: number,
   radius: number,
   startAngle: number,
   endAngle: number
 ): string {
+  // Quando a fatia ocupa 360°, início e fim coincidem e o SVG ignora o arco.
+  // Desenhamos um círculo completo usando dois arcos de 180°.
+  if (endAngle - startAngle >= 360) {
+    return [
+      `M ${cx} ${cy - radius}`,
+      `A ${radius} ${radius} 0 1 1 ${cx} ${cy + radius}`,
+      `A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius}`,
+      'Z',
+    ].join(' ');
+  }
+
   const startRad = degreesToRadians(startAngle - 90); // Rotate so 0° = top
   const endRad = degreesToRadians(endAngle - 90);
...
 export function weightedRandomSelect(
   items: RouletteItem[]
 ): { item: RouletteItem; activeIndex: number } | null {
   const active = getActiveItems(items);
-  if (active.length < 2) return null;
+  if (active.length < 1) return null;

   const totalWeight = active.reduce((sum, item) => sum + item.weight, 0);
```

### 3.2. `src/app/roulette/[id].tsx`

```diff
   const handleSpin = () => {
     if (!roulette) return;
     const success = spin(roulette.items);
     if (!success) {
       Alert.alert(
         "Itens insuficientes",
-        "Ative pelo menos 2 itens para girar a roleta.",
+        "Ative pelo menos 1 item para girar a roleta.",
       );
     }
   };
...
   const activeItems = getActiveItems(roulette.items);
-  const canSpin = activeItems.length >= 2;
+  const canSpin = activeItems.length >= 1;
   const hasHiddenItems = roulette.items.some((i) => i.isHidden);
...
-          {!canSpin && roulette.items.length > 0 && (
-            <Text style={styles.warningText}>
-              ⚠️ Ative pelo menos 2 itens para girar
-            </Text>
-          )}
+          {!canSpin && roulette.items.length > 0 && (
+            <Text style={styles.warningText}>
+              ⚠️ Ative pelo menos 1 item para girar
+            </Text>
+          )}
```

---

## 4. Plano de Verificação

### 4.1. Verificação Automática

- Executar `npx tsc --noEmit` para garantir conformidade total de tipos TypeScript.
- Executar `npm run lint` para garantir padrões de linting do projeto Expo.

### 4.2. Verificação Manual / Comportamental

1. **Roleta com 1 Item Ativo:**
   - Criar uma roleta com apenas 1 item.
   - Verificar se o círculo da roleta renderiza preenchido com a cor do item e o nome visível.
   - Verificar se o botão "Girar!" está habilitado e não há aviso de "Ative pelo menos 2 itens".
   - Tocar em "Girar!": a roleta deve rodar normalmente com a animação de desaceleração e abrir o modal de resultado com o item selecionado.
2. **Desabilitação do Único Item:**
   - Tocar na fatia para desabilitá-la: a fatia fica cinza.
   - O botão "Girar!" deve ficar desabilitado e exibir o aviso `"⚠️ Ative pelo menos 1 item para girar"`.
   - Tocar novamente para reabilitar: botão volta a ficar ativo.
3. **Ocultação do Item no Resultado ("Esconder"):**
   - Girar com 1 item e selecionar "Esconder Item" no modal.
   - O item torna-se oculto, o botão de girar fica desabilitado e o botão "Restaurar Todos" é exibido.
   - Clicar em "Restaurar Todos": o item volta a ficar visível e ativo.
4. **Roletas com Múltiplos Itens (Regressão):**
   - Garantir que roletas com 2 ou mais itens continuam funcionando exatamente como antes (pesos relativos, sorteio aleatório, alternância de fatias).
