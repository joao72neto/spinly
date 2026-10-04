# Instruções para Geração de Especificações (Spec Prompt)

Quando o usuário solicitar a criação de uma especificação (spec) para uma nova funcionalidade, siga rigorosamente o fluxo e o template abaixo.

## Diretrizes de Comportamento

1. **NÃO escreva código** na etapa de spec.
2. **Mantenha o foco no "O QUE" e não no "COMO":** A spec deve descrever comportamentos, regras, contratos e casos de borda — não a implementação técnica dos arquivos (isso pertence ao `plan.md`).
3. **Crie o arquivo:** Salve o resultado final em `_specs/[nome-da-feature].spec.md`.

---

## Template Padrão de Spec

Substitua os trechos entre colchetes pelo conteúdo do projeto:

# Spec: [nome-da-feature]

## 1. Visão Geral

- **Objetivo:** [Descreva em 2-3 frases o problema que esta feature resolve].
- **Público/Atores:** [Quem interage com essa feature? Ex: Usuário autenticado, Admin, Sistema externo].

## 2. Requisitos Funcionais (RF)

- **RF-01:** O sistema deve permitir que [ator] faça [ação].
- **RF-02:** Quando [evento acontecer], o sistema deve [comportamento esperado].
- **RF-03:** O sistema deve validar [condição] antes de prosseguir.

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio

- **RN-01:** [Ex: O limite máximo de upload é de 5MB].
- **RN-02:** [Ex: Apenas usuários com plano Pro podem acessar esta área].

### Casos de Borda & Tratamento de Erros

- **EC-01:** [O que a interface exibe e como o sistema se comporta].
- **EC-02:** [Como deve ser o feedback de validação].
- **EC-03:** [Ex: Desabilitar o botão enquanto a requisição carrega].

## 4. Critérios de Aceite (Definition of Done)

- [CA-01 - Ex: Formulário valida e-mail em tempo real].
- [CA-02 - Ex: Feedback de erro amigável ao atingir timeout].
- [CA-03 - Ex: Funciona perfeitamente em telas mobile e desktop].

## 5. Perguntas Adicionais / Pontos em Aberto

- [Aponte questões relevantes que o usuário pode ter esquecido de mencionar].
- [Ex: A funcionalidade precisa manter compatibilidade com alguma implementação existente?]
- [Ex: O comportamento precisa ser diferente entre desktop, tablet e mobile?]
- [Ex: Os dados precisam ser persistidos, sincronizados ou funcionar offline?]
