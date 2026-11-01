import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { reinos as dadosReinos } from "../data/reinos";

const perguntas = [
  {
    pergunta:
      "A pessoa que destruiu sua confiança pede que você esqueça tudo. O que seria imperdoável?",
    peso: 2,
    opcoes: [
      {
        texto: "Que ela escape sem encarar o dano que causou.",
        reino: "Cemitério",
      },
      {
        texto: "Que ela queira recomeçar sem reparar o que desequilibrou.",
        reino: "Natural",
      },
      {
        texto: "Que ela tente decidir por você qual caminho seguir agora.",
        reino: "Encruzilhada",
      },
      {
        texto: "Que ela espere que você diminua a si mesmo para manter a paz.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Você pode revelar uma verdade que libertará alguém, mas também destruirá a imagem que essa pessoa tem de si. O que faz?",
    opcoes: [
      {
        texto: "Revelo: a verdade não deve ser enterrada para poupar ninguém.",
        reino: "Cemitério",
      },
      {
        texto: "Revelo quando houver condições de lidar com as consequências.",
        reino: "Natural",
      },
      {
        texto: "Escolho o momento e a rota que causem menos dano irreversível.",
        reino: "Encruzilhada",
      },
      {
        texto: "Digo em voz alta: ninguém se liberta vivendo uma mentira.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Para obter justiça por uma pessoa que você ama, teria de se tornar alguém que despreza. Até onde iria?",
    peso: 2,
    opcoes: [
      {
        texto: "Até o responsável pagar por cada escolha que fez.",
        reino: "Cemitério",
      },
      {
        texto: "Até reparar o dano, mas sem fingir que o preço não existe.",
        reino: "Natural",
      },
      {
        texto: "Não cruzo esse limite; procuro outra saída, mesmo que demore.",
        reino: "Encruzilhada",
      },
      {
        texto: "Não sacrifico quem sou: minha dignidade também merece justiça.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Um poder capaz de mudar seu destino cobra algo que você ama. Qual preço aceitaria?",
    opcoes: [
      {
        texto: "O preço deve recair sobre quem provocou a injustiça.",
        reino: "Cemitério",
      },
      {
        texto: "Aceito perder algo se a troca for justa e consciente.",
        reino: "Natural",
      },
      {
        texto: "Negocio: todo preço tem uma brecha e todo destino, uma rota.",
        reino: "Encruzilhada",
      },
      {
        texto: "Não pago com minha liberdade nem com o desejo de outra pessoa.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Alguém que você ama escolhe um caminho que pode arruiná-lo. O que você respeita mais?",
    opcoes: [
      {
        texto: "A responsabilidade: cada escolha precisa ter consequência.",
        reino: "Cemitério",
      },
      {
        texto: "O ciclo: às vezes é preciso cair para aprender a se transformar.",
        reino: "Natural",
      },
      {
        texto: "A liberdade de escolher, mesmo quando eu escolheria diferente.",
        reino: "Encruzilhada",
      },
      {
        texto: "O direito de viver sem pedir licença para ser quem é.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Descobre que sua vingança atingirá também pessoas inocentes. O que pesa mais?",
    peso: 2,
    opcoes: [
      {
        texto: "Interrompo o plano: justiça que pune inocentes é outra injustiça.",
        reino: "Cemitério",
      },
      {
        texto: "Mudo o curso e aceito perder algo para restaurar o equilíbrio.",
        reino: "Natural",
      },
      {
        texto: "Procuro uma terceira via, ainda que ninguém acredite nela.",
        reino: "Encruzilhada",
      },
      {
        texto: "Não deixo a vingança tomar o lugar de tudo que ainda desejo.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Uma promessa antiga mantém sua família unida, mas também aprisionada. Você a quebra?",
    opcoes: [
      {
        texto: "Quebro, se a promessa encobrir uma culpa que precisa ser julgada.",
        reino: "Cemitério",
      },
      {
        texto: "Quebro quando seu custo já supera qualquer equilíbrio que proteja.",
        reino: "Natural",
      },
      {
        texto: "Abro uma saída que preserve o que ainda pode ser salvo.",
        reino: "Encruzilhada",
      },
      {
        texto: "Quebro: lealdade sem escolha é só outra forma de controle.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Você pode apagar a lembrança mais dolorosa da sua vida, mas perderá o que ela ensinou. Aceita?",
    opcoes: [
      {
        texto: "Não. Sem memória, não há como responder pelo que aconteceu.",
        reino: "Cemitério",
      },
      {
        texto: "Não apago; transformo a dor sem fingir que ela não teve custo.",
        reino: "Natural",
      },
      {
        texto: "Talvez. Se isso me permitir escolher um futuro que hoje não vejo.",
        reino: "Encruzilhada",
      },
      {
        texto: "Apago, se a lembrança continuar decidindo quem posso ser.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Para proteger alguém, você precisa escolher entre contar tudo ou carregar a culpa sozinho. Qual caminho toma?",
    peso: 2,
    opcoes: [
      {
        texto: "Conto: quem foi ferido merece saber e cobrar respostas.",
        reino: "Cemitério",
      },
      {
        texto: "Conto e assumo minha parte; reparação não pode ser unilateral.",
        reino: "Natural",
      },
      {
        texto: "Procuro uma saída que não transforme proteção em prisão.",
        reino: "Encruzilhada",
      },
      {
        texto: "Não decido pelo outro: proteger também exige respeitar sua vontade.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Uma autoridade oferece perdão em troca de obediência. O que você faz?",
    opcoes: [
      {
        texto: "Exijo que a regra valha também para quem está no poder.",
        reino: "Cemitério",
      },
      {
        texto: "Pergunto quem paga pela paz e o que será necessário reparar.",
        reino: "Natural",
      },
      {
        texto: "Aceito ganhar tempo, mas já começo a procurar outra passagem.",
        reino: "Encruzilhada",
      },
      {
        texto: "Recuso: perdão que exige submissão é só uma coleira dourada.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta:
      "Você pode salvar sua reputação expondo um segredo de alguém que confia em você. O que escolhe?",
    opcoes: [
      {
        texto: "A verdade, se o segredo encobre um dano que precisa ser cobrado.",
        reino: "Cemitério",
      },
      {
        texto: "O cuidado: procuro reparar o dano sem usar alguém como moeda.",
        reino: "Natural",
      },
      {
        texto: "Uma alternativa que me obrigue a enfrentar as consequências sem traí-lo.",
        reino: "Encruzilhada",
      },
      {
        texto: "Minha verdade, mas sem transformar a vulnerabilidade alheia em arma.",
        reino: "Lira",
      },
    ],
  },
  {
    pergunta: "Qual perda faria você sentir que traiu a si mesmo?",
    peso: 2,
    opcoes: [
      {
        texto: "Ver alguém escapar sem responder pelo dano que causou.",
        reino: "Cemitério",
      },
      {
        texto: "Destruir o equilíbrio tentando consertar tudo sozinho.",
        reino: "Natural",
      },
      {
        texto: "Aceitar um destino imposto e perder o direito de escolher.",
        reino: "Encruzilhada",
      },
      {
        texto: "Negar o que desejo para continuar sendo aceito.",
        reino: "Lira",
      },
    ],
  },
];

const reinos = ["Cemitério", "Natural", "Encruzilhada", "Lira"];

const resultadoDescricao = {
  Lira: "Você tende a priorizar autonomia, desejo e dignidade. Sua força está em não se apagar para ser aceito; seu ponto de atenção é considerar como suas escolhas também afetam quem está ao redor.",
  Encruzilhada:
    "Você tende a procurar alternativas e assumir a responsabilidade de escolher o próprio caminho. Sua força está em encontrar passagem; seu ponto de atenção é não adiar decisões à espera de uma saída perfeita.",
  Natural:
    "Você tende a ponderar equilíbrio, reciprocidade e o preço de cada transformação. Sua força está em perceber como as escolhas se conectam; seu ponto de atenção é não assumir sozinho a responsabilidade de reequilibrar tudo.",
  Cemitério:
    "Você tende a exigir responsabilidade e não ignorar o dano causado. Sua força está em encarar as consequências; seu ponto de atenção é não deixar que a busca por justiça se transforme em punição sem fim.",
};

const comparacaoParticipantes = {
  Lira: "Na Lira, Maria Padilha e as Marias defendem o desejo e o consentimento como lei. A afinidade entre vocês está em afirmar a própria vontade sem abrir mão do respeito.",
  Encruzilhada:
    "Sete orienta, provoca e abre caminhos, mas deixa a decisão nas mãos de quem os percorre. O Povo da Rua conhece o preço de cada rota — uma afinidade com sua disposição para escolher e seguir adiante.",
  Natural:
    "Esdras ensina pela escuta, enquanto magos e feiticeiros conhecem a lei da troca. No Reino Natural, mudar exige compreender o que se transforma junto — perspectiva que combina com a sua.",
  Cemitério:
    "O Senhor Caveira e as Caveiras fazem cumprir as leis do reino: ali, nenhuma escolha desaparece sem deixar vestígios. Você compartilha com seus habitantes a convicção de que a verdade precisa ser encarada.",
};

const principiosReinos = {
  Lira: "Preservar a dignidade, o desejo e a liberdade de ser quem você é.",
  Encruzilhada:
    "Manter o direito de escolher o próprio caminho, mesmo sob pressão.",
  Natural:
    "Buscar equilíbrio e reparação sem ignorar o preço das mudanças.",
  Cemitério:
    "Responsabilizar quem causou o dano, sem permitir que ele seja encoberto.",
};

const imagensReinos = {
  Lira: "/guardiao-padilha.jpeg",
  Encruzilhada: "/guardiao-sete.jpeg",
  Natural: "/guardiao-esdras.jpeg",
  Cemitério: "/guardiao-caveira.jpeg",
};

function QuizPage() {
  const [respostas, setRespostas] = useState({});
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [desempate, setDesempate] = useState(null);
  const [escolhaDesempate, setEscolhaDesempate] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [instagramHelpOpen, setInstagramHelpOpen] = useState(false);
  const questionLegendRef = useRef(null);
  const isInitialQuestion = useRef(true);

  useEffect(() => {
    if (isInitialQuestion.current) {
      isInitialQuestion.current = false;
      return;
    }

    questionLegendRef.current?.focus();
  }, [questaoAtual]);

  const reinoResultado = dadosReinos.find(
    (reino) => reino.titulo === resultado?.reino,
  );
  const handleChange = (index, valor) => {
    const novasRespostas = { ...respostas, [index]: valor };
    setRespostas(novasRespostas);

    if (index < perguntas.length - 1) {
      setQuestaoAtual(index + 1);
    } else {
      calcularResultado(novasRespostas);
    }
  };

  const calcularResultado = (respostasQuiz = respostas) => {
    const pontuacoes = Object.fromEntries(reinos.map((reino) => [reino, 0]));
    Object.entries(respostasQuiz).forEach(([index, opcao]) => {
      const pergunta = perguntas[index];
      pontuacoes[pergunta.opcoes[opcao].reino] += pergunta.peso || 1;
    });
    const maiorPontuacao = Math.max(...Object.values(pontuacoes));
    const reinosEmpatados = reinos.filter(
      (reino) => pontuacoes[reino] === maiorPontuacao,
    );

    if (reinosEmpatados.length > 1) {
      setDesempate({ reinos: reinosEmpatados, pontuacoes });
      setEscolhaDesempate("");
    } else {
      concluirResultado(reinosEmpatados[0], pontuacoes);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const concluirResultado = (reino, pontuacoes) => {
    setResultado({ reino, pontuacoes });
    setDesempate(null);
    setEscolhaDesempate("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmarDesempate = (event) => {
    event.preventDefault();
    concluirResultado(escolhaDesempate, desempate.pontuacoes);
  };

  const reiniciar = () => {
    setRespostas({});
    setQuestaoAtual(0);
    setResultado(null);
    setDesempate(null);
    setEscolhaDesempate("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const frasesCompartilhamento = {
    Cemitério:
      "Meu resultado é o Reino do Cemitério — responsabilidade e consequência vêm antes de encobrir o dano. Descubra qual plano de O Castelo das Marias chama por você:",
    Lira: "Meu resultado é o Reino da Lira — autonomia, desejo e dignidade não devem ser sacrificados para agradar. Descubra qual plano de O Castelo das Marias chama por você:",
    Encruzilhada:
      "Meu resultado é o Reino da Encruzilhada — escolher o próprio caminho e encontrar alternativas é essencial. Descubra qual plano de O Castelo das Marias chama por você:",
    Natural:
      "Meu resultado é o Reino Natural — equilíbrio, reciprocidade e reparação orientam minhas escolhas. Descubra qual plano de O Castelo das Marias chama por você:",
  };

  const getUrlResultado = () => {
    const baseUrl =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
        ? "https://livroocastelodasmarias.netlify.app"
        : window.location.origin;
    return `${baseUrl}${reinoResultado.rota}`;
  };

  const textoResultado = () => {
    return frasesCompartilhamento[resultado?.reino];
  };

  const compartilhar = (rede) => {
    const mensagem = textoResultado();
    const urlResultado = getUrlResultado();
    const mensagemEncoded = encodeURIComponent(mensagem);
    const urlResultadoEncoded = encodeURIComponent(urlResultado);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${mensagemEncoded}&url=${urlResultadoEncoded}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${urlResultadoEncoded}`,
      whatsapp: `https://api.whatsapp.com/send?text=${mensagemEncoded}%20${urlResultadoEncoded}`,
    };

    window.open(urls[rede], "_blank", "width=600,height=400");
  };

  const copiarResultado = async () => {
    const texto = `${textoResultado()} ${getUrlResultado()}`;
    try {
      await navigator.clipboard.writeText(texto);
      setShareStatus("Resultado copiado.");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = texto;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const copiado = document.execCommand("copy");
      document.body.removeChild(textArea);
      setShareStatus(
        copiado
          ? "Resultado copiado."
          : "Não foi possível copiar o resultado automaticamente.",
      );
    }
  };

  return (
    <main className="container-fluid quiz-page">
      <p className="section-kicker page-kicker">Uma escolha revela caminhos</p>
      <h1>Descubra seu Reino</h1>

      {resultado ? (
        <section className="quiz-result-card">
          <h2>Seu reino é {resultado.reino}</h2>
          <img
            src={imagensReinos[resultado.reino]}
            alt={`Guardião do Reino ${resultado.reino}`}
          />
          <section className="quiz-result-comparison">
            <h3>Sua personalidade e os habitantes deste reino</h3>
            <p className="quiz-result-description">
              {resultadoDescricao[resultado.reino]}
            </p>
            <p>{comparacaoParticipantes[resultado.reino]}</p>
          </section>
          <div className="quiz-book-invitation">
            <p>
              {reinoResultado.introducao} Para conhecer essa jornada de perto,
              comece pelos capítulos gratuitos.
            </p>
            <Link to="/livro" className="quiz-book-link">
              Ler os quatro primeiros capítulos <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="quiz-share">
            <h3>Compartilhe seu Reino!</h3>
            <div className="quiz-share-buttons">
              <button
                type="button"
                className="quiz-share-copy"
                onClick={copiarResultado}
                aria-label="Copiar resultado"
                title="Copiar resultado"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="8" y="8" width="12" height="13" rx="2" />
                  <path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
                </svg>
              </button>
              <button
                type="button"
                className="quiz-share-twitter"
                onClick={() => compartilhar("twitter")}
                aria-label="Compartilhar no X"
                title="Compartilhar no X"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l7.3-8.4L1.9 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z" />
                </svg>
              </button>
              <button
                type="button"
                className="quiz-share-facebook"
                onClick={() => compartilhar("facebook")}
                aria-label="Compartilhar no Facebook"
                title="Compartilhar no Facebook"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.3v3.2h2.8V22h3.4Z" />
                </svg>
              </button>
              <button
                type="button"
                className="quiz-share-whatsapp"
                onClick={() => compartilhar("whatsapp")}
                aria-label="Compartilhar no WhatsApp"
                title="Compartilhar no WhatsApp"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.3-4.9a8.4 8.4 0 1 1 16.2-3.8Z" />
                  <path d="M8.2 7.9c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4 0 .5l-.5.7c-.2.2-.2.4 0 .6.4.7 1 1.3 1.7 1.7.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .8-.4 1.5-1 1.8-.6.3-1.4.5-2.9-.1-1.4-.6-2.5-1.5-3.5-2.7-.9-1.1-1.5-2.4-1.5-3.4 0-.5.2-.9.4-1.2Z" />
                </svg>
              </button>
              <button
                type="button"
                className="quiz-share-instagram"
                onClick={() => setInstagramHelpOpen((isOpen) => !isOpen)}
                aria-label="Como compartilhar no Instagram"
                aria-expanded={instagramHelpOpen}
                aria-controls="instagram-share-help"
                title="Como compartilhar no Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle className="quiz-share-icon-dot" cx="18" cy="6" r="1" />
                </svg>
              </button>
            </div>
            {instagramHelpOpen && (
              <div
                className="quiz-instagram-help"
                id="instagram-share-help"
                aria-label="Instruções para compartilhar no Instagram"
              >
                <p>
                  X, Facebook e WhatsApp abrem o compartilhamento diretamente.
                  No Instagram, a publicação é manual:
                </p>
                <ol>
                  <li>Copie o texto do seu resultado.</li>
                  <li>
                    Abra o Instagram, crie uma publicação ou story e cole o
                    texto. Se quiser, adicione a imagem do guardião.
                  </li>
                </ol>
                <div className="quiz-instagram-help-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={copiarResultado}
                  >
                    Copiar texto e link
                  </button>
                  <a
                    className="btn btn-secondary"
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir Instagram
                  </a>
                </div>
              </div>
            )}
            {shareStatus && (
              <p className="quiz-share-status" role="status">
                {shareStatus}
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={reiniciar}
          >
            Fazer novamente
          </button>
        </section>
      ) : desempate ? (
        <section className="quiz-tiebreak">
          <p className="section-kicker">Uma última escolha</p>
          <h2>Qual princípio você não abriria mão?</h2>
          <p>
            Sua pontuação ficou equilibrada entre{" "}
            {desempate.reinos.join(" e ")}. Escolha qual destes princípios
            representa melhor a decisão que você tomaria.
          </p>
          <form onSubmit={confirmarDesempate}>
            <div className="quiz-options">
              {desempate.reinos.map((reino) => (
                <label className="quiz-option" key={reino}>
                  <input
                    type="radio"
                    name="desempate-reino"
                    value={reino}
                    required
                    checked={escolhaDesempate === reino}
                    onChange={() => setEscolhaDesempate(reino)}
                  />
                  <span>
                    <strong>{reino}:</strong> {principiosReinos[reino]}
                  </span>
                </label>
              ))}
            </div>
            <button type="submit" className="btn btn-primary quiz-submit">
              Revelar meu reino
            </button>
          </form>
        </section>
      ) : (
        <form
          className="quiz-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div
            className="quiz-progress"
            role="progressbar"
            aria-label="Progresso do quiz"
            aria-valuemin={1}
            aria-valuemax={perguntas.length}
            aria-valuenow={questaoAtual + 1}
            aria-valuetext={`${questaoAtual + 1} de ${perguntas.length}`}
          >
            <div className="quiz-progress-heading">
              <span>
                {questaoAtual + 1} de {perguntas.length}
              </span>
            </div>
            <span className="quiz-progress-track" aria-hidden="true">
              <span
                className="quiz-progress-fill"
                style={{
                  width: `${((questaoAtual + 1) / perguntas.length) * 100}%`,
                }}
              />
            </span>
          </div>
          <fieldset
            key={questaoAtual}
            className="quiz-item"
            aria-describedby={`pergunta-${questaoAtual}-desc`}
          >
            <legend
              id={`pergunta-${questaoAtual}-desc`}
              ref={questionLegendRef}
              tabIndex="-1"
            >
              {perguntas[questaoAtual].pergunta}
            </legend>
            <div
              className="quiz-options"
              role="radiogroup"
              aria-label={`Opções para a questão ${questaoAtual + 1}`}
            >
              {perguntas[questaoAtual].opcoes.map(({ texto }, optionIndex) => (
                <label key={texto} className="quiz-option">
                  <input
                    type="radio"
                    name={`pergunta-${questaoAtual}`}
                    value={optionIndex}
                    required
                    aria-label={texto}
                    checked={respostas[questaoAtual] === optionIndex}
                    onChange={() => handleChange(questaoAtual, optionIndex)}
                  />
                  <span>{texto}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="quiz-navigation">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setQuestaoAtual((current) => current - 1)}
              disabled={questaoAtual === 0}
            >
              Voltar
            </button>
          </div>
        </form>
      )}
    </main>
  );
}

export default QuizPage;
