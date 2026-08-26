# Plano de Implementação: Aplicativo de Roleta (Spin & Decide)

Este documento detalha o planejamento arquitetural, estrutural e as etapas de implementação para o desenvolvimento do aplicativo de Roleta baseado na especificação descrita em `_specs/roulette.spec.md`.

---

## 1. Visão Geral e Arquitetura

O aplicativo visa ajudar na tomada de decisões por meio de roletas configuráveis com itens ponderados (pesos/probabilidades), permitindo alternância de visibilidade/ativação e persistência local.

### 1.1 Stack Tecnológica
- **Framework:** Expo SDK 57 (React Native 0.86, React 19)
- **Roteamento:** Expo Router (`src/app`)
- **Persistência Local:** `@react-native-async-storage/async-storage`
- **Animações & Física:** `react-native-reanimated` & `react-native-gesture-handler`
- **Renderização Gráfica da Roleta:** `react-native-svg` (para renderização vetorial precisa dos arcos/fatias da roleta e textos radiais)
- **Feedback Háptico:** `expo-haptics` (para tick / vibração da roleta)

---

## 2. Modelagem de Dados

### 2.1 Entidades Principais (`src/types/roulette.ts`)

```typescript
export interface RouletteItem {
  id: string;
  label: string;
  weight: number;      // Peso relativo (mínimo 1)
  isEnabled: boolean;  // Alternado por toque na fatia (desabilitado = acinzentado)
  isHidden: boolean;   // Oculto pós-sorteio ("Esconder" item da rodada)
  color: string;       // Cor da fatia
}

export interface Roulette {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  items: RouletteItem[];
}
```

---

## 3. Estrutura de Diretórios Proposta

```
src/
├── app/
│   ├── _layout.tsx                 # Stack layout global (cabeçalhos, temas)
│   ├── index.tsx                   # Listagem e Gerenciamento de Roletas (Home)
│   ├── roulette/
│   │   ├── [id].tsx                # Tela Principal da Roleta (Giro e Ações)
│   │   └── edit/[id].tsx           # Gerenciamento/Edição de Itens da Roleta
├── components/
│   ├── roulette/
│   │   ├── Wheel.tsx               # Componente SVG da Roleta com fatias
│   │   ├── WheelSlice.tsx          # Fatia individual SVG (suporte a tap e cor cinza se desabilitada)
│   │   ├── Pointer.tsx             # Ponteiro visual indicador do sorteio
│   │   └── ResultModal.tsx         # Modal com o resultado e opção de "Esconder"
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── TextInput.tsx
│   │   ├── Card.tsx
│   │   └── EmptyState.tsx
│   └── items/
│       ├── ItemList.tsx            # Lista de itens na tela de edição
│       └── ItemFormModal.tsx       # Modal para adicionar/editar item (label, peso, cor)
├── hooks/
│   ├── useRouletteStorage.ts       # Hook de persistência via AsyncStorage
│   └── useRouletteSpin.ts          # Hook com a lógica da física/animação Reanimated do giro
├── utils/
│   ├── math.ts                     # Cálculos trigonométricos (SVG paths, arcos, probabilidade)
│   ├── colors.ts                   # Gerador/paleta de cores para fatias
│   └── storage.ts                  # Helpers de serialização para AsyncStorage
└── types/
    └── roulette.ts
```

---

## 4. Algoritmos e Regras de Negócio

### 4.1 Cálculo de Probabilidade e Ângulos das Fatias
1. **Filtro de Itens Participantes do Sorteio:**
   - Itens ativos = `items.filter(item => item.isEnabled && !item.isHidden)`
   - Se `itensAtivos.length < 2`: desabilitar botão de girar e alertar usuário (EC01).
2. **Cálculo de Proporção:**
   - $\text{TotalWeight} = \sum \text{item.weight}$
   - Ângulo da fatia $i$: $\theta_i = \left(\frac{\text{item.weight}}{\text{TotalWeight}}\right) \times 360^\circ$
   - Tratamento de ângulo mínimo visual (EC05) para garantir tocabilidade e legibilidade de fatias pequenas.
3. **Determinação do Item Sorteado:**
   - Sortear número aleatório $R \in [0, \text{TotalWeight})$.
   - Encontrar item acumulado correspondente a $R$.
   - Calcular rotação final da roleta de forma que o centro do arco do item sorteado termine alinhado com o ponteiro (ex: topo $270^\circ$ ou $0^\circ$).
   - Adicionar voltas completas ($N \times 360^\circ$, onde $N \in [5, 8]$) com easing `Easing.out(Easing.cubic)` para uma desaceleração natural e fluida a 60 FPS (RNF02).

### 4.2 Estados Visuais das Fatias
- **Habilitada e Visível:** Cor temática viva, participa do sorteio e do peso total.
- **Desabilitada (Toque na fatia):** Cor acinzentada (`#9E9E9E` ou opacidade reduzida), peso desconsiderado no cálculo do sorteio, mas continua visível no círculo (conforme resposta do refinamento).
- **Oculta (Pós-sorteio "Esconder"):** Não é renderizada no círculo, não entra no peso total, mas permanece salva e acessível na tela de configuração/itens para restauração.

---

## 5. Fases de Implementação

### Fase 1: Setup e Dependências
- Instalar dependências necessárias:
  - `@react-native-async-storage/async-storage`
  - `react-native-svg`
  - `expo-haptics`
- Configurar tipos TypeScript (`src/types/roulette.ts`).
- Implementar utilitários matemáticos para geometria SVG e distribuição ponderada (`src/utils/math.ts`).

### Fase 2: Camada de Persistência e Estado
- Criar funções de persistência com `AsyncStorage` (`src/utils/storage.ts`).
- Criar o hook de gerenciamento de dados `useRouletteStorage` (CRUD de roletas, itens, alternar `isEnabled`, alternar `isHidden`, resetar rodada).

### Fase 3: Componente da Roleta e Animação
- Implementar componente SVG `Wheel` com arcos e rótulos radiais.
- Implementar suporte a toque individual em cada fatia (`WheelSlice`) para alternar `isEnabled` (com threshold para evitar disparo durante drag/spin - EC04).
- Criar hook `useRouletteSpin` usando `react-native-reanimated` para giro com desaceleração realista e disparo de vibrações hápticas leves.

### Fase 4: Telas e Navegação (Expo Router)
- **Tela 1: Home (`src/app/index.tsx`)**:
  - Listagem de roletas criadas, criação de nova roleta, botão de exclusão e navegação para a roleta selecionada.
- **Tela 2: Roleta em Ação (`src/app/roulette/[id].tsx`)**:
  - Exibição da Roleta interativa com ponteiro indicador.
  - Botão "Girar Roleta" (com validação de estado EC01).
  - Atalho para restaurar itens ocultos / resetar visibilidade da rodada.
  - Modal de resultado com botões: "Girar Novamente", "Esconder Item" e "Fechar".
- **Tela 3: Gerenciamento de Itens (`src/app/roulette/edit/[id].tsx`)**:
  - Adição de novos itens com peso customizado e seletor de cor.
  - Edição e exclusão permanente de itens.
  - Reativação em massa de itens ocultos/desabilitados.

### Fase 5: Tratamento de Edge Cases e Refinamento de UX
- Prevenção de divisão por zero (peso mínimo = 1).
- Tratamento de densidade excessiva e textos longos com truncamento inteligente.
- Testes de fluidez em animações (60 FPS).
- Validação em iOS e Android.

---

## 6. Critérios de Aceite e Verificação

- [ ] Usuário cria, edita o nome e deleta roletas na Home.
- [ ] Usuário adiciona itens com pesos variados e visualiza proporções corretas na roleta.
- [ ] Roleta gira fluidamente e para exatamente no item sorteado segundo a probabilidade de pesos.
- [ ] Tocar em uma fatia desabilita o item (deixando-o acinzentado) e recalcula os pesos dos itens restantes.
- [ ] Opção "Esconder" no modal de resultado oculta o item para os próximos giros mantendo-o no banco de dados.
- [ ] Todos os dados permanecem salvos após fechar e reabrir o app.
