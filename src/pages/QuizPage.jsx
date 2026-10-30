import { useEffect, useState } from "react";

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
  Lira: "Suas escolhas priorizam autonomia, desejo e dignidade. Você não confunde paz com submissão e tende a proteger o direito de cada pessoa escolher por si. Sua força está em não se apagar para ser aceito; seu desafio é sustentar essa liberdade sem ignorar os efeitos das próprias escolhas.",
  Encruzilhada:
    "Suas escolhas priorizam autonomia de decisão e leitura das consequências. Diante de uma rota imposta, você procura alternativas e prefere assumir o risco de escolher a obedecer por medo. Sua força está em encontrar passagem; seu desafio é não adiar decisões esperando uma saída perfeita.",
  Natural:
    "Suas escolhas priorizam equilíbrio, reciprocidade e transformação. Você considera quem será afetado, o que precisa ser reparado e qual preço uma mudança cobra. Sua força está em reconhecer interdependências; seu desafio é não assumir sozinho a responsabilidade de reequilibrar tudo.",
  Cemitério:
    "Suas escolhas priorizam responsabilidade e consequência. Para você, reconhecer o dano e responder por ele é parte da justiça; perdão sem prestação de contas não resolve a ruptura. Sua força está em não encobrir o que aconteceu; seu desafio é não deixar que a cobrança se torne punição sem fim.",
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
  const [resultado, setResultado] = useState(null);
  const [desempate, setDesempate] = useState(null);
  const [escolhaDesempate, setEscolhaDesempate] = useState("");
  const [faltantes, setFaltantes] = useState([]);
  const [avisoId, setAvisoId] = useState(0);
  const respondidas = Object.keys(respostas).length;

  useEffect(() => {
    if (!avisoId) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setAvisoId(0), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [avisoId]);

  const handleChange = (index, valor) => {
    setRespostas((prev) => ({ ...prev, [index]: valor }));
    setFaltantes((prev) => prev.filter((item) => item !== index));
  };

  const calcularResultado = (event) => {
    event.preventDefault();
    const faltando = perguntas
      .map((_, index) => index)
      .filter((index) => respostas[index] === undefined);
    if (faltando.length) {
      setFaltantes(faltando);
      setAvisoId((prev) => prev + 1);
      requestAnimationFrame(() => {
        const primeiraFaltante = document.querySelector(".quiz-item.missing");
        primeiraFaltante?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        primeiraFaltante
          ?.querySelector('input[type="radio"]')
          ?.focus({ preventScroll: true });
      });
      return;
    }
    const pontuacoes = Object.fromEntries(reinos.map((reino) => [reino, 0]));
    Object.entries(respostas).forEach(([index, opcao]) => {
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
    const evidencias = Object.entries(respostas)
      .map(([index, opcao]) => {
        const pergunta = perguntas[index];
        const resposta = pergunta.opcoes[opcao];
        return {
          pergunta: pergunta.pergunta,
          texto: resposta.texto,
          peso: pergunta.peso || 1,
          reino: resposta.reino,
        };
      })
      .filter((resposta) => resposta.reino === reino)
      .sort((a, b) => b.peso - a.peso)
      .slice(0, 3);

    setResultado({ reino, pontuacoes, evidencias });
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
    setFaltantes([]);
    setAvisoId(0);
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

  const getUrlQuiz = () => {
    return window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
      ? "https://livroocastelodasmarias.netlify.app/quiz"
      : `${window.location.origin}/quiz`;
  };

  const textoResultado = () => {
    return frasesCompartilhamento[resultado?.reino];
  };

  const compartilhar = (rede) => {
    const mensagem = textoResultado();
    const urlQuiz = getUrlQuiz();
    const mensagemEncoded = encodeURIComponent(mensagem);
    const urlQuizEncoded = encodeURIComponent(urlQuiz);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${mensagemEncoded}&url=${urlQuizEncoded}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${urlQuizEncoded}`,
      whatsapp: `https://api.whatsapp.com/send?text=${mensagemEncoded}%20${urlQuizEncoded}`,
    };

    window.open(urls[rede], "_blank", "width=600,height=400");
  };

  const copiarResultado = async () => {
    const texto = `${textoResultado()} ${getUrlQuiz()}`;
    try {
      await navigator.clipboard.writeText(texto);
      window.alert("Resultado copiado com sucesso!");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = texto;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const copiado = document.execCommand("copy");
      document.body.removeChild(textArea);
      window.alert(
        copiado
          ? "Resultado copiado com sucesso!"
          : "Não foi possível copiar o resultado automaticamente.",
      );
    }
  };

  return (
    <main className="container-fluid quiz-page">
      <p className="section-kicker page-kicker">Uma escolha revela caminhos</p>
      <h1>Descubra seu Reino</h1>
      <p className="quiz-instruction">
        O resultado considera os princípios que suas escolhas colocam em
        primeiro lugar.
      </p>

      {resultado ? (
        <section className="quiz-result-card">
          <h2>Seu reino é {resultado.reino}</h2>
          <img
            src={imagensReinos[resultado.reino]}
            alt={`Guardião do Reino ${resultado.reino}`}
          />
          <p className="quiz-result-description">
            {resultadoDescricao[resultado.reino]}
          </p>
          <div className="quiz-result-evidence">
            <h3>Respostas que sustentam este resultado</h3>
            <ul>
              {resultado.evidencias.map((evidencia) => (
                <li key={evidencia.pergunta}>
                  <strong>{evidencia.pergunta}</strong>
                  <p>{evidencia.texto}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="quiz-share">
            <h3>Compartilhe seu Reino!</h3>
            <div className="quiz-share-buttons">
              <button
                type="button"
                className="quiz-share-copy"
                onClick={copiarResultado}
              >
                Copiar resultado
              </button>
              <button
                type="button"
                className="quiz-share-twitter"
                onClick={() => compartilhar("twitter")}
              >
                Twitter/X
              </button>
              <button
                type="button"
                className="quiz-share-facebook"
                onClick={() => compartilhar("facebook")}
              >
                Facebook
              </button>
              <button
                type="button"
                className="quiz-share-whatsapp"
                onClick={() => compartilhar("whatsapp")}
              >
                WhatsApp
              </button>
            </div>
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
        <form className="quiz-form" onSubmit={calcularResultado}>
          <div
            className="quiz-progress"
            aria-label={`Progresso: ${respondidas} de ${perguntas.length} perguntas respondidas`}
            aria-live="polite"
          >
            {respondidas} de {perguntas.length} perguntas respondidas
          </div>
          {faltantes.length > 0 && avisoId > 0 && (
            <p className="quiz-error" role="alert">
              Responda às questões destacadas antes de enviar.
            </p>
          )}
          {perguntas.map(({ pergunta, opcoes }, index) => (
            <fieldset
              key={pergunta}
              aria-describedby={`pergunta-${index}-desc`}
              className={
                faltantes.includes(index) ? "quiz-item missing" : "quiz-item"
              }
            >
              <legend id={`pergunta-${index}-desc`}>
                <span className="quiz-question-number">
                  Questão {index + 1}:
                </span>{" "}
                {pergunta}
              </legend>
              <div
                className="quiz-options"
                role="radiogroup"
                aria-label={`Opções para a questão ${index + 1}`}
              >
                {opcoes.map(({ texto }, optionIndex) => (
                  <label key={texto} className="quiz-option">
                    <input
                      type="radio"
                      name={`pergunta-${index}`}
                      value={optionIndex}
                      aria-label={`${String.fromCharCode(65 + optionIndex)}: ${texto}`}
                      checked={respostas[index] === optionIndex}
                      onChange={() => handleChange(index, optionIndex)}
                    />
                    <span>
                      {String.fromCharCode(65 + optionIndex)}. {texto}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button type="submit" className="btn btn-primary quiz-submit">
            Enviar respostas
          </button>
        </form>
      )}
    </main>
  );
}

export default QuizPage;
