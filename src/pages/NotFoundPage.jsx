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
      <Link className="btn btn-primary" to="/">
        Voltar ao início
      </Link>
    </main>
  );
}

export default NotFoundPage;
