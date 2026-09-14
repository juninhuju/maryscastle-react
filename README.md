# O Castelo das Marias

Site oficial do romance de fantasia de Junior Cristovam, migrado de Angular
para React com Vite.

## Executar localmente

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run lint
npm run build
npm run preview
```

## Integração de comentários

Copie `.env.example` para `.env` e preencha as variáveis do Back4App:

```bash
VITE_PARSE_APP_ID=
VITE_PARSE_JS_KEY=
```

O arquivo `.env` não deve ser versionado.

## Estrutura

- `src/pages`: páginas associadas às rotas.
- `src/components`: blocos reutilizáveis de interface.
- `src/data`: dados compartilhados dos reinos.
- `src/api`: cliente Axios do Back4App.
- `public`: imagens, áudio, PDF e demais assets públicos.
# maryscastle-react
