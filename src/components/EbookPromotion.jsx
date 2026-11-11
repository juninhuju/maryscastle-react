import { Link } from "react-router-dom";
import { ebookProduct } from "../data/bookStores";

function EbookPromotion({ compact = false }) {
  return (
    <section
      className={`ebook-promotion${compact ? " compact" : ""}`}
      aria-labelledby="ebook-promotion-title"
    >
      <div className="ebook-promotion-copy">
        <p className="section-kicker">O Castelo das Marias</p>
        <h2 id="ebook-promotion-title">E-book</h2>
        <p>
          Formato PDF · {ebookProduct.pageCount} páginas
        </p>
      </div>
      <div className="ebook-presale-offer">
        <p className="ebook-presale-kicker">Oferta especial do e-book</p>
        <p className="ebook-presale-price">
          <span>
            De <del>{ebookProduct.formattedRegularPrice}</del> por
          </span>
          <strong>{ebookProduct.formattedPrice}</strong>
        </p>
        <div className="ebook-offer-action">
          <Link
            className="ebook-buy-button purchase-button"
            to="/comprar"
            aria-label={`Ver detalhes do e-book em formato PDF, de ${ebookProduct.formattedRegularPrice} por ${ebookProduct.formattedPrice}.`}
          >
            Ver detalhes do e-book
          </Link>
          <p className="ebook-delivery-note">
            Pagamento à vista no cartão de crédito ou Pix. O acesso é enviado
            ao e-mail após a confirmação.
          </p>
        </div>
      </div>
    </section>
  );
}

export default EbookPromotion;
