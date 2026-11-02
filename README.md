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
