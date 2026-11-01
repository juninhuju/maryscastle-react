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

Copie `.env.example` para `.env` e preencha as variáveis do Back4App:

```bash
VITE_PARSE_APP_ID=
VITE_PARSE_JS_KEY=
```

O arquivo `.env` não deve ser versionado.

### Cadastro para comprar o livro

Compartilhe `/comprar` nos links de Reels e Stories para abrir diretamente o
formulário de e-mail. Os botões de compra do site abrem o mesmo cadastro em uma
janela curta. O formulário usa a função Netlify `POST /api/book-interest`, que
grava os dados no Back4App sem expor a Master Key no navegador.

Crie a classe `AvisoLancamento` no painel do Back4App (Database > Create a
Class). A função usa `PARSE_APP_ID` e `PARSE_MASTER_KEY`, configuradas como
variáveis de ambiente do servidor no Netlify; não habilite leitura pública.
Cada cadastro guarda `email` (normalizado em minúsculas), `consentimento` e
`origem`; o Back4App também registra a data de criação. Crie um índice único
para `email` para impedir duplicações simultâneas. Os cadastros ficam disponíveis
no painel do Back4App em Database > `AvisoLancamento`.

## Painel administrativo

O painel fica em `/junioradm`. Ele permite consultar e exportar os e-mails de
aviso de lançamento, enviar mensagens de teste ou campanhas para inscritos que
deram consentimento, revisar/remover comentários e atualizar/exportar as
respostas do formulário de pré-venda conectado a uma planilha do Google Sheets.
As respostas do formulário são lidas da planilha quando o administrador clica
em **Atualizar respostas**; elas não são copiadas para o Back4App.
Na seção de pré-venda, também é possível importar um CSV exportado do Google
Forms com as colunas de carimbo de data/hora, nome, e-mail, telefone, cidade,
endereço, quantidade e forma de pagamento. O arquivo é lido localmente no
navegador e fica disponível apenas durante a sessão; não é enviado ou salvo.
O importador aceita CSV separado por vírgula ou ponto e vírgula, confere o
formato dos e-mails e limita as cidades a Birigui - SP e Araçatuba - SP.
Importações e atualizações da planilha acrescentam apenas novos pedidos,
identificados por carimbo de data/hora e e-mail (ou pelos dados do pedido
quando não há carimbo). Registros repetidos são ignorados sem substituir os
dados já exibidos, inclusive situação e data de pagamento. Se o CSV não tiver
valor, o painel o calcula pelos pacotes de R$ 55,00 e mostra colunas de valor,
status e data de pagamento.

O painel usa Netlify Functions. Configure as variáveis abaixo em **Netlify >
Site configuration > Environment variables** e faça um novo deploy:

| Variável | Uso |
| --- | --- |
| `ADMIN_PASSWORD` | Senha de acesso ao painel; use uma senha exclusiva com pelo menos 16 caracteres. |
| `ADMIN_SESSION_SECRET` | Segredo aleatório de assinatura das sessões; use pelo menos 32 caracteres. |
| `PARSE_APP_ID` | Application ID da aplicação Back4App. |
| `PARSE_MASTER_KEY` | Master Key da aplicação Back4App; fica somente no servidor. |
| `GMAIL_APP_PASSWORD` | Senha de app do Gmail usado como remetente `ocastelodasmarias@gmail.com`; somente no servidor. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | E-mail da conta de serviço Google com acesso de leitura à planilha. |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Chave privada da conta de serviço; mantenha somente como variável segura no Netlify. |
| `GOOGLE_SHEET_ID` | ID da planilha vinculada às respostas do formulário. |
| `GOOGLE_SHEET_RANGE` | Opcional. Intervalo A1, por exemplo `'Respostas ao formulário 1'!A:Z`; sem ele, o painel lê A:Z da primeira aba. |

Para criar o segredo de sessão, gere um valor aleatório localmente, por exemplo:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Para habilitar as respostas do formulário:

1. No Google Cloud, crie uma conta de serviço e habilite a Google Sheets API.
2. Gere uma chave JSON para essa conta e copie o e-mail e a chave privada para
   as variáveis seguras correspondentes no Netlify. Não coloque o JSON no
   repositório, no navegador ou em mensagens públicas.
3. Na conta proprietária do formulário, abra a aba **Respostas** e vincule as
   respostas a uma planilha do Google Sheets.
4. Compartilhe essa planilha com o e-mail da conta de serviço como **Leitor**.
5. Copie o ID da planilha da URL
   `https://docs.google.com/spreadsheets/d/ID_DA_PLANILHA/edit` para
   `GOOGLE_SHEET_ID`.
6. Após salvar as variáveis, faça novo deploy e acesse `/junioradm`.

### Envio de e-mails pelo painel

O painel envia pelo endereço já exibido no rodapé: `ocastelodasmarias@gmail.com`.
Para habilitar o envio, ative a verificação em duas etapas nessa conta Google,
gere uma **senha de app** para e-mail e salve-a como `GMAIL_APP_PASSWORD` nas
variáveis seguras do Netlify. Não use a senha normal da conta e não coloque a
senha de app no navegador ou no repositório.

Na seção **Enviar e-mail**, informe o assunto e o texto simples da mensagem.
Escolha um endereço para enviar um teste ou os inscritos que consentiram. O
envio em massa exige a senha administrativa novamente, envia os destinatários
em cópia oculta e inclui uma cópia para o endereço do remetente. As mensagens
informam como pedir a remoção da lista por resposta ao e-mail. Por segurança,
uma campanha é limitada a 450 endereços por envio; para listas maiores, use um
serviço próprio de campanhas.

O acesso usa senha validada no servidor e cookie de sessão `HttpOnly`,
`SameSite=Strict`, com validade de oito horas. Os dados administrativos e a
Master Key nunca são enviados ao navegador sem autenticação. O painel carrega
até 10.000 e-mails/comentários e 2.500 respostas por atualização; se houver
mais registros, exporte a lista completa diretamente na fonte de dados.

## Estrutura

- `src/pages`: páginas associadas às rotas.
- `src/components`: blocos reutilizáveis de interface.
- `src/data`: dados compartilhados dos reinos.
- `src/api`: cliente Axios do Back4App.
- `netlify/functions`: endpoints seguros do painel administrativo.
- `public`: imagens, áudio, PDF e demais assets públicos.
# maryscastle-react
