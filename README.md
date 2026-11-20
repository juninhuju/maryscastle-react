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

O build também pré-renderiza as páginas públicas em `dist/`, com HTML e
metadados específicos por rota. O sitemap e o `robots.txt` são publicados na
raiz junto com os arquivos do site.

## Integração com Back4App

Os comentários usam a função Netlify `/api/comments` para ler e publicar
comentários com as credenciais de servidor do Back4App. Configure
`PARSE_APP_ID` e `PARSE_MASTER_KEY` nas variáveis de ambiente do Netlify; não
exponha essas credenciais no navegador. Para desenvolvimento local, copie
`.env.example` para `.env` e preencha as variáveis. O arquivo `.env` não deve
ser versionado.

### Página de compra do livro

Compartilhe `/comprar` como página de venda do e-book em PDF na Kiwify. Ela
informa o formato, 223 páginas, tamanho Letter, tamanho aproximado do arquivo e
entrega por e-mail após confirmação do pagamento. O preço é R$ 19,90 (de
R$ 29,90), com pagamento à vista por Pix ou cartão de crédito, sem
parcelamento. A página também aponta para as opções da edição física na UICLAP
e na Amazon. O arquivo pago não fica hospedado publicamente no site. O checkout
e os dados da edição ficam centralizados em `src/data/bookStores.js`.

## Estrutura

- `src/pages`: páginas associadas às rotas.
- `src/components`: blocos reutilizáveis de interface.
- `src/data`: dados compartilhados dos reinos.
- `src/api`: cliente Axios do Back4App.
- `netlify/functions`: endpoint de comentários (`/api/comments`).
- `public`: imagens, áudio, PDF e demais assets públicos.
# maryscastle-react
