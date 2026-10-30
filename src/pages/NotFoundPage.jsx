import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="container-fluid page-not-found">
      <p className="section-kicker">O caminho se perdeu</p>
      <h1>Página não encontrada</h1>
      <p>
        Este caminho não leva a nenhum reino conhecido. Volte ao início e
        continue explorando o universo de O Castelo das Marias.
      </p>
      <div className="not-found-actions">
        <Link className="btn btn-primary" to="/">
          Voltar ao início
        </Link>
        <Link className="btn btn-secondary" to="/reinos">
          Explorar os reinos
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
