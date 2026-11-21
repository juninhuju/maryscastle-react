import { bookStores } from "../data/bookStores";

function StoreIcon({ storeName }) {
  if (storeName === "UICLAP") {
    return (
      <svg className="book-store-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 6.5c-2.6-2-5.3-2.4-9-1.6v13c3.7-.8 6.4-.4 9 1.6m0-13c2.6-2 5.3-2.4 9-1.6v13c-3.7-.8-6.4-.4-9 1.6m0-13v13" />
      </svg>
    );
  }

  return (
    <svg className="book-store-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 8H6" />
      <circle cx="10" cy="19" r="1.25" />
      <circle cx="18" cy="19" r="1.25" />
    </svg>
  );
}

function BookPurchaseOptions({ compact = false }) {
  return (
    <section
      className={`book-purchase-options${compact ? " compact" : ""}`}
      aria-labelledby="purchase-title"
    >
      <div className="book-purchase-copy">
        <p className="section-kicker">Livro físico à venda</p>
        {compact ? (
          <>
            <h2 id="purchase-title">Edição impressa</h2>
            <p className="book-purchase-subtitle">
              Disponível nas lojas oficiais com entrega em todo o Brasil.
            </p>
          </>
        ) : (
          <h1 id="purchase-title">Onde comprar O Castelo das Marias</h1>
        )}
      </div>
      <div className="book-store-links">
        {bookStores.map((store) => (
          <a
            key={store.name}
            className="book-store-link"
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Comprar O Castelo das Marias na ${store.name}`}
          >
            <StoreIcon storeName={store.name} />
            <strong className={`book-store-wordmark ${store.name.toLowerCase()}`}>
              {store.name}
            </strong>
            <span className="book-store-detail">Comprar ↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default BookPurchaseOptions;
