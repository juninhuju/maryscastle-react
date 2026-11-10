import ReleaseNotice from "./ReleaseNotice";

function EbookPromotion({ compact = false }) {
  return (
    <section
      className={`ebook-promotion${compact ? " compact" : ""}`}
      aria-labelledby="ebook-promotion-title"
    >
      <div className="ebook-promotion-copy">
        <p className="section-kicker">E-book em breve</p>
        <h2 id="ebook-promotion-title">Garanta o preço de lançamento</h2>
        <p>
          Receba o aviso de disponibilidade e aproveite a promoção de lançamento.
        </p>
      </div>
      <p className="ebook-release-price">
        De <s>R$ 29,90</s> por <strong>R$ 19,90</strong>
      </p>
      <ReleaseNotice className="ebook-notice-button purchase-button">
        Avise-me do lançamento
      </ReleaseNotice>
    </section>
  );
}

export default EbookPromotion;
