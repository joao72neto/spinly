# Especificação de Requisitos: Aplicativo de Roleta (Spin & Decide)

## Contexto Geral

O projeto consiste no desenvolvimento de um aplicativo móvel em React Native voltado para a tomada de decisões aleatórias. O núcleo do aplicativo é um sistema de "Roletas" (Spinners). O usuário poderá criar múltiplas roletas temáticas (ex: "O que comer hoje", "Quem lava a louça"), gerenciando os itens contidos em cada uma, atribuindo pesos de probabilidade e controlando a ativação/desativação dinâmica desses itens diretamente na interface visual.
---

## Requisitos

### Requisitos Funcionais (RF)

- **RF01 - Gerenciamento de Roletas:**
  - O usuário deve poder criar novas roletas atribuindo um nome a elas.
  - O usuário deve poder excluir roletas existentes.
  - O usuário deve poder listar todas as roletas cadastradas e selecionar uma para interagir.
- **RF02 - Gerenciamento de Itens:**
  - O usuário deve poder adicionar itens em texto a uma roleta.
  - O usuário deve poder remover itens permanentemente.
  - O usuário deve poder definir um "peso" numérico para cada item no momento da criação ou edição.
- **RF03 - Interação com a Roleta:**
  - O aplicativo deve sortear um item considerando o peso individual de cada um em relação ao peso total.
  - Após o sorteio, o aplicativo deve oferecer a opção de "Esconder" o item sorteado, removendo-o da próxima rodada sem excluí-lo do banco de dados daquela roleta.
  - Na visualização da roleta, o usuário deve poder tocar na fatia de um item para alternar seu estado entre "Habilitado" e "Desabilitado".

### Requisitos Não-Funcionais (RNF)

- **RNF01 - Plataforma:** O aplicativo deve ser desenvolvido em React Native (compatível com iOS e Android).
- **RNF02 - Performance:** A animação de giro da roleta deve ser fluida (60 FPS).
- **RNF03 - Persistência:** Os dados (roletas, itens, pesos e estados) devem ser persistidos localmente no dispositivo.

---

## Regras de Negócio (RN)

- **RN01 - Cálculo de Probabilidade:** A chance de um item ser sorteado é determinada pela fórmula de peso relativo:
  $$\text{Probabilidade}(Item) = \frac{\text{Peso do Item}}{\sum \text{Pesos dos Itens Ativos}}$$
  _(Exemplo: Se o item A tem peso 2 e o item B tem peso 1, o item A tem 66.6% de chance e o item B tem 33.3%)._

- **RN02 - Validação para Sorteio:** O sorteio só deve levar em consideração os itens cujo estado atual seja "Habilitado" e "Visível". O peso total da roleta é a soma exclusiva dos pesos dos itens ativos no momento do giro.

- **RN03 - Estado de Ocultação Pós-Sorteio:** Ao optar por "Esconder" um item após o sorteio, o status dele muda para "Invisível". Ele não participa do próximo cálculo de peso total e não renderiza uma fatia na tela, mas permanece salvo para reativação futura.

- **RN04 - Desabilitação por Toque:** Tocar em uma fatia desabilita o item. Itens desabilitados são desconsiderados do sorteio e recalculam o layout da roleta.

---

## Edge Cases (Casos Extremos)

- **EC01 - Roleta Vazia ou sem Itens Ativos:** Tentativa de girar uma roleta sem nenhum item ativo.
  - _Solução:_ O botão de girar deve ficar desabilitado e exibir um aviso orientando a reativar/adicionar itens ("⚠️ Ative pelo menos 1 item para girar").
- **EC02 - Soma dos Pesos Igual a Zero:** Definir peso 0 para todos os itens ativos causaria divisão por zero no cálculo de probabilidade.
  - _Solução:_ Tratar o peso mínimo de criação/edição como 1, ou interpretar peso 0 automaticamente como item desabilitado.
- **EC03 - Densidade Excessiva de Itens:** Cadastro de dezenas de itens tornando as fatias ilegíveis ou difíceis de clicar.
  - _Solução:_ Definir um limite máximo de itens ativos simultaneamente por roleta ou aplicar zoom/lista complementar para seleção.
- **EC04 - Gestos Conflitantes (Swipe vs Tap):** O movimento de arrastar a tela para girar a roleta pode ser interpretado como um toque (click) na fatia.
  - _Solução:_ Implementar uma tolerância de deslocamento (threshold) para diferenciar o gesto de arrastar/girar do toque estático.
- **EC05 - Fatias Improporcionais:** Diferenças discrepantes de peso (ex: item A com peso 1 e item B com peso 1000) tornam o item menor invisível/impossível de tocar.
  - _Solução:_ Estabelecer um ângulo mínimo de renderização visual para a fatia, independentemente da sua probabilidade real no cálculo.

---

## Perguntas Adicionais para Refinamento

1. **Persistência:** Qual biblioteca será utilizada para salvar os dados localmente (ex: AsyncStorage, SQLite, WatermelonDB, MMKV)? 
R: AsyncStorage para simplificação da aplicação.

2. **Feedback Visual de Desabilitação:** Quando uma fatia é desabilitada via toque, ela deve desaparecer da roleta imediatamente ou ficar acinzentada mantendo a posição?
R: Ela fica acinzentada e permanece visível, se eu clicar novamente ela voltará a ser visível e passas a ser contabilizada novamente no sorteio.

3. **Animação:** Qual abordagem/biblioteca será usada para a física do giro (ex: React Native Reanimated com Gesture Handler)?
R: Sim, pode utilizar React Native Reanimated com Gesture Handler.
