import { useEffect, useMemo, useRef, useState } from "react";
import {
  mergePreorderOrders,
  parsePreorderCsv,
} from "../utils/preorderCsv";

const AUTH_ENDPOINT = "/api/admin-auth";
const DATA_ENDPOINT = "/api/admin-data";

function messageForError(code) {
  const messages = {
    "dashboard-data-unavailable":
      "Não foi possível carregar os comentários. Confira as variáveis seguras do Back4App no Netlify.",
    "form-responses-unavailable":
      "Não foi possível atualizar as respostas. Confira o acesso à planilha e tente novamente.",
    "comment-delete-failed":
      "Não foi possível remover este comentário. Atualize a lista e tente novamente.",
    "invalid-credentials": "Senha incorreta.",
    "admin-not-configured":
      "O acesso administrativo ainda não está configurado no Netlify.",
    unauthorized: "Sua sessão expirou. Entre novamente para continuar.",
  };
  return messages[code] || "Ocorreu um erro. Tente novamente.";
}

async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        ...(options.body && { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Não foi possível conectar às funções seguras do Netlify.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(messageForError(data.error));
    error.status = response.status;
    error.code = data.error;
    error.message = data.message || error.message;
    throw error;
  }

  return data;
}

function csvCell(value) {
  let text = String(value ?? "");
  if (/^\s*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(filename, headers, rows) {
  const csv = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ].join("\r\n");
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("pt-BR");
}

function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [commentSearch, setCommentSearch] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsTruncated, setCommentsTruncated] = useState(false);
  const [orders, setOrders] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [ordersStatus, setOrdersStatus] = useState("");
  const [ordersSource, setOrdersSource] = useState("");
  const ordersFileInput = useRef(null);
  const ordersRef = useRef(null);
  const [activeSection, setActiveSection] = useState("comments");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDashboard = async () => {
    setDashboardLoading(true);
    setError("");
    try {
      const data = await requestJson(`${DATA_ENDPOINT}?action=dashboard`);
      setComments(data.comments);
      setCommentsTruncated(data.commentsTruncated);
    } catch (requestError) {
      if (requestError.status === 401) {
        setAuthenticated(false);
      }
      setError(requestError.message);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    requestJson(AUTH_ENDPOINT)
      .then(async (data) => {
        if (!active) return;
        setConfigured(data.configured);
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          await loadDashboard();
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredComments = useMemo(() => {
    const search = commentSearch.trim().toLowerCase();
    return search
      ? comments.filter(
          (item) =>
            item.nome.toLowerCase().includes(search) ||
            item.texto.toLowerCase().includes(search),
        )
      : comments;
  }, [commentSearch, comments]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await requestJson(AUTH_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ action: "login", password }),
      });
      setPassword("");
      setAuthenticated(true);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await requestJson(AUTH_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ action: "logout" }),
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAuthenticated(false);
      setComments([]);
      setOrders(null);
    }
  };

  const handleDeleteComment = async (comment) => {
    if (
      !window.confirm(
        `Remover permanentemente o comentário de ${comment.nome || "Leitor"}?`,
      )
    ) {
      return;
    }

    setError("");
    setNotice("");
    try {
      await requestJson(DATA_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          action: "delete-comment",
          objectId: comment.objectId,
        }),
      });
      setComments((current) =>
        current.filter((item) => item.objectId !== comment.objectId),
      );
      setNotice("Comentário removido.");
    } catch (requestError) {
      if (requestError.status === 401) {
        setAuthenticated(false);
      }
      setError(requestError.message);
    }
  };

  const handleRefreshOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    setOrdersStatus("");
    try {
      const data = await requestJson(DATA_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ action: "refresh-orders" }),
      });
      const mergedOrders = mergePreorderOrders(ordersRef.current, data);
      ordersRef.current = mergedOrders;
      setOrders(mergedOrders);
      setOrdersSource("Google Sheets");
      setOrdersStatus(
        `Atualizado em ${formatDate(data.updatedAt)} · ${mergedOrders.rows.length} respostas`,
      );
    } catch (requestError) {
      if (requestError.status === 401) {
        setAuthenticated(false);
      }
      setOrdersError(requestError.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleImportOrdersCsv = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setOrdersError("");
    setOrdersStatus("");
    try {
      const importedOrders = parsePreorderCsv(await file.text());
      const mergedOrders = mergePreorderOrders(
        ordersRef.current,
        importedOrders,
      );
      ordersRef.current = mergedOrders;
      setOrders(mergedOrders);
      setOrdersSource("CSV local");
      setOrdersStatus(
        `${mergedOrders.addedCount} novas respostas adicionadas; ${mergedOrders.skippedCount} repetidas ignoradas. Arquivo: ${file.name}. Disponíveis somente nesta sessão.`,
      );
    } catch (importError) {
      setOrdersError(importError.message);
    }
  };

  if (checkingSession) {
    return (
      <main className="admin-page">
        <p className="admin-status" role="status">
          Verificando acesso...
        </p>
      </main>
    );
  }

  if (!configured) {
    return (
      <main className="admin-page">
        <section className="admin-login-card">
          <p className="section-kicker">Área restrita</p>
          <h1>Administração</h1>
          <p className="admin-error" role="alert">
            O acesso ainda não está configurado. Defina{" "}
            <code>ADMIN_PASSWORD</code> (16 caracteres ou mais) e{" "}
            <code>ADMIN_SESSION_SECRET</code> (32 caracteres ou mais) nas
            variáveis seguras do Netlify.
          </p>
        </section>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="admin-page">
        <section className="admin-login-card">
          <p className="section-kicker">Área restrita</p>
          <h1>Administração</h1>
          <p>Acesse os comentários e pedidos da pré-venda.</p>
          <form className="admin-login-form" onSubmit={handleLogin}>
            <label htmlFor="admin-password">Senha administrativa</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              className="admin-button admin-button-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="section-kicker">Área restrita</p>
          <h1>Administração</h1>
          <p>Comentários e pedidos de pré-venda.</p>
        </div>
        <div className="admin-header-actions">
          <button
            className="admin-button"
            type="button"
            onClick={loadDashboard}
            disabled={dashboardLoading}
          >
            {dashboardLoading ? "Atualizando..." : "Atualizar painel"}
          </button>
          <button
            className="admin-button admin-button-quiet"
            type="button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </header>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}

      <nav className="admin-section-nav" aria-label="Seções administrativas">
        {[
          ["comments", "Comentários"],
          ["orders", "Pré-venda"],
        ].map(([section, label]) => (
          <button
            key={section}
            className="admin-button"
            type="button"
            aria-pressed={activeSection === section}
            onClick={() => setActiveSection(section)}
          >
            {label}
          </button>
        ))}
      </nav>

      <section
        className="admin-panel"
        aria-labelledby="admin-comments-title"
        hidden={activeSection !== "comments"}
      >
        <div className="admin-section-heading">
          <div>
            <p className="section-kicker">Vozes dos leitores</p>
            <h2 id="admin-comments-title">Comentários</h2>
          </div>
          <span className="admin-count">{comments.length}</span>
        </div>
        <div className="admin-tools">
          <label>
            <span className="sr-only">
              Buscar comentários por autor ou conteúdo
            </span>
            <input
              type="search"
              placeholder="Buscar por nome ou comentário"
              value={commentSearch}
              onChange={(event) => setCommentSearch(event.target.value)}
            />
          </label>
        </div>
        {commentsTruncated && (
          <p className="admin-warning">
            A lista está limitada aos primeiros 10.000 comentários. Atualize
            para carregar a lista mais recente.
          </p>
        )}
        <div className="admin-comment-list">
          {filteredComments.map((comment) => (
            <article className="admin-comment" key={comment.objectId}>
              <div className="admin-comment-heading">
                <div>
                  <h3>{comment.nome || "Leitor sem nome"}</h3>
                  <time>{formatDate(comment.createdAt)}</time>
                </div>
                <button
                  className="admin-button admin-button-danger"
                  type="button"
                  disabled={!comment.objectId}
                  onClick={() => handleDeleteComment(comment)}
                >
                  Remover
                </button>
              </div>
              <p>{comment.texto}</p>
            </article>
          ))}
          {!filteredComments.length && (
            <p className="admin-empty">
              {dashboardLoading
                ? "Carregando comentários..."
                : "Nenhum comentário encontrado."}
            </p>
          )}
        </div>
      </section>

      <section
        className="admin-panel"
        aria-labelledby="admin-orders-title"
        hidden={activeSection !== "orders"}
      >
        <div className="admin-section-heading">
          <div>
            <p className="section-kicker">Google Forms</p>
            <h2 id="admin-orders-title">Pedidos de pré-venda</h2>
          </div>
          <div className="admin-order-actions">
            <button
              className="admin-button"
              type="button"
              onClick={() => ordersFileInput.current?.click()}
            >
              Importar CSV
            </button>
            <input
              ref={ordersFileInput}
              className="admin-file-input"
              type="file"
              accept=".csv,text/csv"
              aria-label="Selecionar arquivo CSV de pré-venda"
              onChange={handleImportOrdersCsv}
            />
            <button
              className="admin-button admin-button-primary"
              type="button"
              onClick={handleRefreshOrders}
              disabled={ordersLoading}
            >
              {ordersLoading ? "Atualizando..." : "Atualizar respostas"}
            </button>
          </div>
        </div>
        <p className="admin-section-description">
          Consulte a planilha conectada ou importe um CSV. Arquivos CSV são
          processados somente nesta sessão e não são enviados nem salvos.
        </p>
        {ordersStatus && (
          <p className="admin-notice" role="status">
            {ordersStatus}
          </p>
        )}
        {ordersError && (
          <p className="admin-error" role="alert">
            {ordersError}
          </p>
        )}
        {orders?.truncated && (
          <p className="admin-warning">
            A visualização está limitada a 2.500 respostas. Consulte a planilha
            para acessar o conteúdo completo.
          </p>
        )}
        {orders && (
          <>
            <div className="admin-tools">
              <span>
                {orders.rows.length} respostas carregadas
                {ordersSource && ` · ${ordersSource}`}
              </span>
              <button
                className="admin-button"
                type="button"
                disabled={!orders.rows.length}
                onClick={() =>
                  downloadCsv(
                    "respostas-pre-venda.csv",
                    orders.headers,
                    orders.rows,
                  )
                }
              >
                Exportar respostas CSV
              </button>
            </div>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    {orders.headers.map((header, index) => (
                      <th scope="col" key={`${header}-${index}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.rows.map((row, rowIndex) => (
                    <tr key={`order-${rowIndex}`}>
                      {orders.headers.map((header, columnIndex) => (
                        <td key={`${header}-${columnIndex}`}>
                          {row[columnIndex]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {!orders.rows.length && (
                    <tr>
                      <td colSpan={orders.headers.length || 1} className="admin-empty">
                        A planilha não contém respostas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminPage;
