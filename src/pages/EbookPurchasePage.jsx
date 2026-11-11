import { Link } from "react-router-dom";
import BookPurchaseOptions from "../components/BookPurchaseOptions";
import { ebookProduct } from "../data/bookStores";

function EbookPurchasePage() {
  return (
    <main className="purchase-page ebook-purchase-page">
      <div className="purchase-page-panel ebook-purchase-panel">
        <Link className="ebook-purchase-back" to="/">
          ← Voltar ao site
        </Link>

        <section
          className="ebook-purchase-product"
          aria-labelledby="ebook-purchase-title"
        >
          <div className="ebook-purchase-cover">
            <img
              src="/Capalivro.jpeg"
              alt="Capa do livro O Castelo das Marias, de Junior Cristovam"
              width="500"
              height="750"
            />
          </div>

          <div className="ebook-purchase-copy">
            <p className="section-kicker">E-book · edição digital</p>
            <h1 id="ebook-purchase-title">O Castelo das Marias — e-book</h1>
            <p className="ebook-purchase-description">
              Romance sobrenatural e fantasia gótica de Junior Cristovam.
              Edição digital em formato PDF, com {ebookProduct.pageCount}{" "}
              páginas, para leitura em dispositivos compatíveis com esse
              formato.
            </p>
            <div
              className="ebook-purchase-presale"
              aria-label={`De ${ebookProduct.formattedRegularPrice} por ${ebookProduct.formattedPrice}`}
            >
              <span className="ebook-purchase-presale-kicker">
                Oferta especial do e-book
              </span>
              <p className="ebook-purchase-prices">
                <span>
                  De <del>{ebookProduct.formattedRegularPrice}</del> por
                </span>
                <strong>{ebookProduct.formattedPrice}</strong>
              </p>
              <div className="ebook-offer-action">
                <a
                  className="purchase-button ebook-purchase-button"
                  href={ebookProduct.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Comprar e-book por ${ebookProduct.formattedPrice} na Kiwify. Abre em nova aba.`}
                >
                  Comprar e-book
                </a>
                <p className="ebook-delivery-note">
                  Pagamento à vista no cartão de crédito ou Pix.
                </p>
              </div>
            </div>

            <h2>Detalhes do e-book</h2>
            <dl className="ebook-product-details">
              <div>
                <dt>Formato</dt>
                <dd>PDF</dd>
              </div>
              <div>
                <dt>Extensão</dt>
                <dd>{ebookProduct.pageCount} páginas</dd>
              </div>
              <div>
                <dt>Tamanho da página</dt>
                <dd>{ebookProduct.pageSize}</dd>
              </div>
              <div>
                <dt>Tamanho do arquivo</dt>
                <dd>{ebookProduct.fileSize}</dd>
              </div>
              <div>
                <dt>Leitura</dt>
                <dd>Celular, tablet ou computador com leitor de PDF</dd>
              </div>
              <div>
                <dt>Entrega</dt>
                <dd>Digital, por e-mail após a confirmação do pagamento</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          className="ebook-purchase-how"
          aria-labelledby="ebook-purchase-how-title"
        >
          <h2 id="ebook-purchase-how-title">Como funciona a compra</h2>
          <ol>
            <li>
              Acesse o checkout da Kiwify pelo botão acima e preencha os dados
              solicitados: nome, e-mail e confirmação do e-mail, CPF/CNPJ e
              telefone.
            </li>
            <li>
              Pague à vista no cartão de crédito ou Pix.
            </li>
            <li>
              Após a confirmação do pagamento, o acesso ao PDF é enviado ao
              e-mail informado na compra. Confira se digitou o endereço
              corretamente e verifique também a caixa de spam.
            </li>
          </ol>
          <p className="ebook-purchase-no-shipping">
            Este produto é digital: não há envio de livro físico nem cobrança
            de frete. É necessário ter um aplicativo ou programa compatível com
            arquivos PDF.
          </p>
          <p className="ebook-purchase-support">
            Dúvidas sobre o acesso após a compra? Escreva para{" "}
            <a href="mailto:ocastelodasmarias@gmail.com">
              ocastelodasmarias@gmail.com
            </a>
            .
          </p>
          <p className="ebook-purchase-terms">
            Antes de pagar, leia no checkout os Termos de Compra e as
            orientações da Kiwify para cancelamento ou reembolso.
          </p>
        </section>

        <section
          className="ebook-purchase-physical"
          aria-label="Opções para comprar o livro físico"
        >
          <BookPurchaseOptions compact />
        </section>
      </div>
    </main>
  );
}

export default EbookPurchasePage;
