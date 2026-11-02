# Plano: Atualização do README.md

## Visão Geral e Objetivo

Substituir o template padrão inicial gerado pelo Expo no [`README.md`](file:///home/savior/coding/spinly/README.md) por uma documentação estruturada, moderna e concisa do projeto **Spinly**.

O objetivo é fornecer uma visão clara e direta do aplicativo para novos desenvolvedores e usuários, cobrindo:

1. **Descrição inicial do projeto** (propósito do Spinly e principais funcionalidades).
2. **Tecnologias utilizadas** (React Native, Expo SDK 58, Expo Router, TypeScript, etc.).
3. **Passos para rodar localmente** (instalação de dependências e execução no Android, iOS e Web).
4. **Download do APK (Release Android)**: Link direto para o arquivo gerado em [`android/app/build/outputs/apk/release/app-release.apk`](file:///home/savior/coding/spinly/android/app/build/outputs/apk/release/app-release.apk) com orientações práticas para instalação local no dispositivo.

---

## User Review Required

> [!NOTE]
> **Localização e Acesso ao APK:**
> O arquivo `android/app/build/outputs/apk/release/app-release.apk` encontra-se na pasta `android/`, que é ignorada pelo Git (`.gitignore`).
> No README, incluiremos:
>
> - O link relativo direto para o arquivo local (`./android/app/build/outputs/apk/release/app-release.apk`).
> - Instruções de instalação via comando ADB (`adb install ...`).
> - Instruções para transferência manual para o smartphone.
> - O comando para recompilar o APK caso o usuário queira gerar uma nova versão localmente (`cd android && ./gradlew assembleRelease`).

---

## Estrutura do Novo README.md

A documentação será concisa e dividida nas seguintes seções:

```markdown
# Spinly 🎯

Descrição curta e objetiva do aplicativo de roletas e tomada de decisões.

---

## ✨ Funcionalidades

- Principais destaques: Roletas customizadas, pesos de probabilidade, feedback tátil, persistência local e animações fluidas a 60 FPS.

---

## 🛠️ Tecnologias

- React Native 0.88 & React 19
- Expo SDK 58 & Expo Router (File-based routing)
- TypeScript
- React Native Reanimated & React Native SVG
- AsyncStorage & Expo Haptics

---

## 📥 Download do APK (Android)

- Link direto: `./android/app/build/outputs/apk/release/app-release.apk`
- Passo a passo de instalação via ADB e transferência direta para o celular.

---

## 🚀 Como Rodar Localmente

- Pré-requisitos (Node.js LTS, npm/yarn)
- Clonar o repositório
- Instalar dependências (`npm install`)
- Iniciar o servidor Metro (`npm start`)
- Rodar no emulador/aparelho (`npm run android`, `npm run ios`, `npm run web`)

---

## 📦 Gerando um Novo APK Release

- Passo a passo para compilar novamente a release Android (`cd android && ./gradlew assembleRelease`).
```

---

## Proposed Changes

### Documentação

#### [MODIFY] [README.md](file:///home/savior/coding/spinly/README.md)

Substituição integral do conteúdo do arquivo pelo texto formatado abaixo:

````markdown
# Spinly 🎯

O **Spinly** é um aplicativo móvel para tomada de decisões aleatórias de forma dinâmica e interativa através de roletas personalizáveis. O usuário pode definir pesos de probabilidade por item, alternar estados de ativação e gerenciar múltiplas roletas temáticas.

---

## ✨ Funcionalidades

- **Roletas Personalizadas:** Crie, edite e organize roletas temáticas (ex.: "O que comer hoje?", "Quem lava a louça?").
- **Pesos de Probabilidade:** Configure pesos individuais para influenciar a chance de sorteio de cada fatia.
- **Interação Dinâmica:** Toque para ativar/desativar fatias na roleta ou ocultar temporariamente itens sorteados.
- **Animações Fluidas:** Rotação suave da roleta renderizada via SVG e animada com Reanimated a 60 FPS.
- **Feedback Tátil:** Efeitos hápticos durante o giro e ao parar na opção vencedora.
- **Persistência Local:** Todas as roletas e itens salvos localmente no dispositivo via AsyncStorage.

---

## 🛠️ Tecnologias

- [React Native](https://reactnative.dev/) (v0.88) & [React](https://react.dev/) (v19)
- [Expo](https://expo.dev/) (SDK 58) & [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- [TypeScript](https://www.typescriptlang.org/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

---

## 📥 Download do APK (Android)

Você pode baixar a versão de release diretamente pelo link abaixo:

👉 **[Download APK Release (app-release.apk)](./android/app/build/outputs/apk/release/app-release.apk)**

### Como instalar no Android:

1. **Pelo Computador (via ADB):**
   ```bash
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```
````

2. **Direto no Smartphone:**
   - Transfira o arquivo `app-release.apk` para o seu aparelho (via cabo USB, nuvem ou mensageiro).
   - Abra o arquivo no gerenciador de arquivos do celular e autorize a instalação de fontes desconhecidas caso solicitado.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada: 18 ou superior)
- Gerenciador de pacotes `npm` ou `yarn`
- Ambiente configurado com Android Studio (para emulador/dispositivo Android) ou app **Expo Go**

### Passos:

1. **Clone o repositório:**

   ```bash
   git clone git@github.com:joao72neto/spinly.git
   cd spinly
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento Expo:**

   ```bash
   npm start
   ```

4. **Execute no dispositivo ou emulador:**
   - Para Android:
     ```bash
     npm run android
     ```
   - Para iOS (apenas macOS):
     ```bash
     npm run ios
     ```
   - Para Web:
     ```bash
     npm run web
     ```

---

## 📦 Gerando um Novo APK Release

Caso precise compilar novamente o executável Android localmente:

```bash
cd android
./gradlew assembleRelease
```

O arquivo gerado estará disponível em `android/app/build/outputs/apk/release/app-release.apk`.

```

---

## Verification Plan

### Manual Verification
- Verificar se a formatação em Markdown do [`README.md`](file:///home/savior/coding/spinly/README.md) está íntegra e sem tags corrompidas.
- Confirmar se o link relativo aponta corretamente para `android/app/build/outputs/apk/release/app-release.apk`.
- Checar se os comandos correspondem aos scripts do [`package.json`](file:///home/savior/coding/spinly/package.json).
```
