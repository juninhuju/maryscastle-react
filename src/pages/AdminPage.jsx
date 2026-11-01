import { useEffect, useMemo, useState } from "react";

const AUTH_ENDPOINT = "/api/admin-auth";
const DATA_ENDPOINT = "/api/admin-data";
const SENDER_EMAIL = "ocastelodasmarias@gmail.com";

function messageForError(code) {
  const messages = {
    "dashboard-data-unavailable":
      "Não foi possível carregar os cadastros e comentários. Confira as variáveis seguras do Back4App no Netlify.",
    "form-responses-unavailable":
      "Não foi possível atualizar as respostas. Confira o acesso à planilha e tente novamente.",
    "comment-delete-failed":
      "Não foi possível remover este comentário. Atualize a lista e tente novamente.",
    "email-send-failed":
      "Não foi possível enviar o e-mail. Confira a configuração de envio e tente novamente.",
    "email-not-configured":
      "O envio de e-mails ainda não está configurado no Netlify.",
    "email-list-truncated":
      "A lista excede o limite seguro de envio. Use um serviço de e-mail para listas maiores.",
    "email-list-unavailable":
      "Não foi possível consultar os inscritos no Back4App. Confira as credenciais do servidor.",
    "email-recipient-limit":
      "O envio está limitado a 450 inscritos por mensagem. Use um serviço de e-mail para listas maiores.",
    "no-subscribed-emails":
      "Não há e-mails válidos com consentimento para receber a mensagem.",
    "invalid-email-recipient": "Informe um endereço de e-mail válido para o teste.",
    "invalid-email-request":
      "Confira o assunto e o texto. O assunto pode ter até 200 caracteres e o texto até 5.000.",
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
  const [emailSearch, setEmailSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [emails, setEmails] = useState([]);
  const [comments, setComments] = useState([]);
  const [emailsTruncated, setEmailsTruncated] = useState(false);
  const [commentsTruncated, setCommentsTruncated] = useState(false);
  const [emailMode, setEmailMode] = useState("test");
  const [testRecipient, setTestRecipient] = useState(SENDER_EMAIL);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailText, setEmailText] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSendError, setEmailSendError] = useState("");
  const [emailSendStatus, setEmailSendStatus] = useState("");
  const [orders, setOrders] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [ordersStatus, setOrdersStatus] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDashboard = async () => {
    setDashboardLoading(true);
    setError("");
    try {
      const data = await requestJson(`${DATA_ENDPOINT}?action=dashboard`);
      setEmails(data.emails);
      setComments(data.comments);
      setEmailsTruncated(data.emailListTruncated);
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

  const filteredEmails = useMemo(() => {
    const search = emailSearch.trim().toLowerCase();
    return search
      ? emails.filter((item) => item.email.toLowerCase().includes(search))
      : emails;
  }, [emailSearch, emails]);

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

  const subscribedEmailCount = useMemo(() => {
    const addresses = emails
      .filter(
        (item) =>
          item.consentimento &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email),
      )
      .map((item) => item.email.trim().toLowerCase());
    return new Set(addresses).size;
  }, [emails]);

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
      setEmails([]);
      setComments([]);
      setOrders(null);
      setEmailPassword("");
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
      setOrders(data);
      setOrdersStatus(
        `Atualizado em ${formatDate(data.updatedAt)} · ${data.rows.length} respostas`,
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

  const handleSendEmail = async (event) => {
    event.preventDefault();
    const isBulkSend = emailMode === "subscribers";
    if (
      isBulkSend &&
      !window.confirm(
        `Enviar “${emailSubject.trim()}” para ${subscribedEmailCount} e-mails com consentimento? Uma cópia também será enviada para ${SENDER_EMAIL}.`,
      )
    ) {
      return;
    }

    setEmailSending(true);
    setEmailSendError("");
    setEmailSendStatus("");
    try {
      const data = await requestJson(DATA_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          action: "send-email",
          mode: emailMode,
          ...(emailMode === "test" && { to: testRecipient.trim() }),
          subject: emailSubject.trim(),
          text: emailText.trim(),
          password: emailPassword,
        }),
      });
      setEmailSendStatus(
        data.mode === "test"
          ? `E-mail de teste enviado para ${data.recipient}.`
          : data.rejectedCount
            ? `E-mail aceito para ${data.recipientCount} inscritos; ${data.rejectedCount} endereço(s) foram recusados pelo servidor. Uma cópia foi enviada para ${SENDER_EMAIL}.`
            : `E-mail enviado para ${data.recipientCount} inscritos. Uma cópia foi enviada para ${SENDER_EMAIL}.`,
      );
    } catch (requestError) {
      if (requestError.status === 401) {
        if (requestError.code === "unauthorized") setAuthenticated(false);
      }
      setEmailSendError(requestError.message);
    } finally {
      setEmailPassword("");
      setEmailSending(false);
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
          <p>Acesse os cadastros, comentários e pedidos da pré-venda.</p>
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
          <p>Cadastros, comentários e pedidos de pré-venda.</p>
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

      <section className="admin-panel" aria-labelledby="admin-emails-title">
        <div className="admin-section-heading">
          <div>
            <p className="section-kicker">Aviso de lançamento</p>
            <h2 id="admin-emails-title">E-mails cadastrados</h2>
          </div>
          <span className="admin-count">{emails.length}</span>
        </div>
        <div className="admin-tools">
          <label>
            <span className="sr-only">Filtrar e-mails</span>
            <input
              type="search"
              placeholder="Buscar e-mail"
              value={emailSearch}
              onChange={(event) => setEmailSearch(event.target.value)}
            />
          </label>
          <button
            className="admin-button admin-button-primary"
            type="button"
            disabled={!emails.length}
            onClick={() =>
              downloadCsv(
                "avisos-de-lancamento.csv",
                ["E-mail", "Data de cadastro", "Consentimento", "Origem"],
                filteredEmails.map((item) => [
                  item.email,
                  formatDate(item.createdAt),
                  item.consentimento ? "Sim" : "Não",
                  item.origem,
                ]),
              )
            }
          >
            Exportar CSV
          </button>
        </div>
        {emailsTruncated && (
          <p className="admin-warning">
            A lista está limitada aos primeiros 10.000 registros. Exporte os
            dados completos diretamente no Back4App.
          </p>
        )}
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">E-mail</th>
                <th scope="col">Cadastro</th>
                <th scope="col">Consentimento</th>
                <th scope="col">Origem</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((item, index) => (
                <tr key={`${item.email}-${item.createdAt}-${index}`}>
                  <td>{item.email || "—"}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{item.consentimento ? "Sim" : "Não"}</td>
                  <td>{item.origem || "—"}</td>
                </tr>
              ))}
              {!filteredEmails.length && (
                <tr>
                  <td colSpan="4" className="admin-empty">
                    {dashboardLoading
                      ? "Carregando cadastros..."
                      : "Nenhum e-mail encontrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel" aria-labelledby="admin-email-compose-title">
        <div className="admin-section-heading">
          <div>
            <p className="section-kicker">Comunicação com leitores</p>
            <h2 id="admin-email-compose-title">Enviar e-mail</h2>
          </div>
          <span className="admin-count" title="Inscritos com consentimento válido">
            {subscribedEmailCount}
          </span>
        </div>
        <p className="admin-section-description">
          Remetente: <strong>{SENDER_EMAIL}</strong>. Envie primeiro um teste
          para validar o conteúdo ou escolha a lista de inscritos. No envio em
          massa, os endereços ficam ocultos entre si e somente quem consentiu
          recebe a mensagem. Limite de 450 destinatários por campanha.
        </p>
        {emailsTruncated && (
          <p className="admin-warning">
            A lista está limitada a 10.000 registros. O envio para inscritos
            fica bloqueado para evitar uma campanha incompleta.
          </p>
        )}
        <form className="admin-compose-form" onSubmit={handleSendEmail}>
          <label htmlFor="admin-email-mode">Destinatários</label>
          <select
            id="admin-email-mode"
            value={emailMode}
            onChange={(event) => {
              setEmailMode(event.target.value);
              setEmailSendError("");
              setEmailSendStatus("");
            }}
          >
            <option value="test">Enviar teste para um endereço</option>
            <option value="subscribers">
              Enviar para inscritos com consentimento ({subscribedEmailCount})
            </option>
          </select>

          {emailMode === "test" && (
            <>
              <label htmlFor="admin-test-recipient">E-mail para o teste</label>
              <input
                id="admin-test-recipient"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={testRecipient}
                onChange={(event) => setTestRecipient(event.target.value)}
              />
            </>
          )}

          <label htmlFor="admin-email-subject">Assunto</label>
          <input
            id="admin-email-subject"
            type="text"
            maxLength={200}
            required
            value={emailSubject}
            onChange={(event) => setEmailSubject(event.target.value)}
          />

          <label htmlFor="admin-email-text">Texto do e-mail</label>
          <textarea
            id="admin-email-text"
            rows={8}
            maxLength={5000}
            required
            value={emailText}
            onChange={(event) => setEmailText(event.target.value)}
          />
          <span className="admin-compose-hint">
            {emailText.length}/5000 caracteres. Inclua links completos
            (https://...) no texto, se necessário.
          </span>

          <label htmlFor="admin-email-password">
            Confirme sua senha administrativa para enviar
          </label>
          <input
            id="admin-email-password"
            type="password"
            autoComplete="current-password"
            maxLength={256}
            required
            value={emailPassword}
            onChange={(event) => setEmailPassword(event.target.value)}
          />
          <button
            className="admin-button admin-button-primary"
            type="submit"
            disabled={
              emailSending ||
              (emailMode === "subscribers" &&
                (subscribedEmailCount === 0 || emailsTruncated))
            }
          >
            {emailSending
              ? "Enviando..."
              : emailMode === "test"
                ? "Enviar e-mail de teste"
                : `Enviar para ${subscribedEmailCount} inscritos`}
          </button>
        </form>
        {emailSendError && (
          <p className="admin-error" role="alert">
            {emailSendError}
          </p>
        )}
        {emailSendStatus && (
          <p className="admin-notice" role="status">
            {emailSendStatus}
          </p>
        )}
      </section>

      <section className="admin-panel" aria-labelledby="admin-comments-title">
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

      <section className="admin-panel" aria-labelledby="admin-orders-title">
        <div className="admin-section-heading">
          <div>
            <p className="section-kicker">Google Forms</p>
            <h2 id="admin-orders-title">Pedidos de pré-venda</h2>
          </div>
          <button
            className="admin-button admin-button-primary"
            type="button"
            onClick={handleRefreshOrders}
            disabled={ordersLoading}
          >
            {ordersLoading ? "Atualizando..." : "Atualizar respostas"}
          </button>
        </div>
        <p className="admin-section-description">
          As respostas são lidas da planilha vinculada ao formulário e não são
          copiadas para o Back4App.
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
              <span>{orders.rows.length} respostas carregadas</span>
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
