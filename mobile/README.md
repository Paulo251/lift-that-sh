# Lift That Sh — mobile

Aplicativo Android local-first em Expo/React Native. O vault contém `exercises.md`, `workouts/*.md`, `.trash/` e `.lts/backups/`; nenhum dado de treino é enviado ou armazenado em banco.

```sh
npm install
npm test
npm run typecheck
npx expo run:android --variant release
```

A versão release bloqueia `android.permission.INTERNET` e as atualizações OTA. A seleção via Storage Access Framework, validação, backups e conflitos ficam isolados atrás de `VaultRepository`.
