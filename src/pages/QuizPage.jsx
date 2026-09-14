import { useEffect, useState } from "react";

const perguntas = [
  [
    "Você está em uma festa. Qual é o seu papel natural?",
    [
      "O diplomata que garante que todos estejam felizes e engajados.",
      "O ponto de referência: sempre se movendo e planejando a próxima atividade.",
      "O observador silencioso, focado em entender a dinâmica e a energia do lugar.",
      "A pessoa que garante que as regras da casa e do evento sejam respeitadas.",
    ],
  ],
  [
    "O que mais lhe chama a atenção em uma pessoa?",
    [
      "Sua aura de mistério e a elegância sombria de sua postura.",
      "Seu carisma, a roupa luxuosa e a forma como ela se comunica.",
      "Sua habilidade de planejar o futuro e tomar decisões rápidas.",
      "A paz que ela irradia e o domínio sobre suas emoções.",
    ],
  ],
  [
    "Qual destas frases é a sua favorita?",
    [
      "A única verdade é o fim de todas as coisas.",
      "Deixe o coração guiar sua ação, a vida é uma festa!",
      "Cada escolha que fazemos define nosso destino.",
      "O segredo da vida está no silêncio e no ciclo da natureza.",
    ],
  ],
  [
    "Você vê uma injustiça. Sua reação imediata é:",
    [
      "Consertar o caos, traçando um caminho e orientando quem precisa.",
      "Planejar uma retaliação longa, fria e justa.",
      "Criar um movimento artístico para despertar a emoção do público.",
      "Entender a causa raiz para neutralizar a origem do problema.",
    ],
  ],
  [
    "Qual tipo de magia o fascina mais?",
    [
      "A magia da transmutação: purificar o que já não serve.",
      "A magia dos elementos: comandar fogo, água, terra e ar.",
      "A magia da rota: abrir portais e caminhos para qualquer destino.",
      "A magia do charme e da ilusão: despertar desejo e alegria.",
    ],
  ],
  [
    "Qual é sua principal filosofia de vida?",
    [
      "A busca incessante por sabedoria e conhecimento antigo.",
      "A ambição de ir sempre mais longe, desbravando horizontes.",
      "Viver intensamente o prazer e a beleza em todas as formas.",
      "A aplicação justa e implacável das regras.",
    ],
  ],
  [
    "Qual cenário o acalma mais profundamente?",
    [
      "Uma rua movimentada, cheia de encontros e caminhos.",
      "Uma floresta isolada, onde se ouve água e vento.",
      "Uma mansão luxuosa com música e vinho.",
      "Um lugar silencioso, como uma biblioteca de leis.",
    ],
  ],
  [
    "Se você fosse professor, ensinaria sobre:",
    [
      "O poder das escolhas e como defender seu caminho.",
      "Como emoções e beleza influenciam e curam.",
      "Os ciclos de vida, energia e segredos da natureza.",
      "A ordem final e a verdade por trás de todas as coisas.",
    ],
  ],
  [
    "Qual é o seu objeto de maior valor?",
    [
      "Uma planta rara, cristal ou elixir preparado por você.",
      "Uma joia bela ou roupa que atrai a atenção.",
      "Um mapa que mostra todas as rotas possíveis.",
      "Um livro antigo de leis ou diário de segredos.",
    ],
  ],
  [
    "Qual roupa usaria em uma cerimônia importante?",
    [
      "Algo pesado, escuro e austero, que impõe respeito.",
      "Algo rústico, de tecidos naturais, ligado ao ambiente.",
      "Algo elegante, com capa e cartola, que sugere autoridade.",
      "Algo chamativo, com cores vibrantes e joias.",
    ],
  ],
  [
    "Qual é sua relação com a memória e o passado?",
    [
      "O passado é chave para entender o presente e seus legados.",
      "O passado é uma âncora; prefiro focar no próximo objetivo.",
      "São histórias valiosas, mas o presente deve ser aproveitado.",
      "São dados importantes para que as regras futuras sejam justas.",
    ],
  ],
  [
    "Sua principal fonte de energia vem de:",
    [
      "Sentir a força da terra e dos elementos ao redor.",
      "Estar no centro da atenção, influenciando pessoas.",
      "Tomar uma decisão e seguir um novo caminho.",
      "Um período de isolamento e silêncio para impor ordem interna.",
    ],
  ],
];

const reinos = ["Cemitério", "Natural", "Encruzilhada", "Lira"];
const resultadoPorOpcao = [
  ["Lira", "Encruzilhada", "Natural", "Cemitério"],
  ["Cemitério", "Lira", "Encruzilhada", "Natural"],
  ["Cemitério", "Lira", "Encruzilhada", "Natural"],
  ["Encruzilhada", "Cemitério", "Lira", "Natural"],
  ["Cemitério", "Natural", "Encruzilhada", "Lira"],
  ["Natural", "Encruzilhada", "Lira", "Cemitério"],
  ["Encruzilhada", "Natural", "Lira", "Cemitério"],
  ["Encruzilhada", "Lira", "Natural", "Cemitério"],
  ["Natural", "Lira", "Encruzilhada", "Cemitério"],
  ["Cemitério", "Natural", "Encruzilhada", "Lira"],
  ["Natural", "Encruzilhada", "Lira", "Cemitério"],
  ["Natural", "Lira", "Encruzilhada", "Cemitério"],
];

const resultadoDescricao = {
  Lira: "Você é o encanto em forma de gente. Sua alma vibra com a música da vida, e sua presença transforma qualquer espaço em palco. Você pertence ao Reino da Lira, onde o riso é ritual, o toque é cura e a festa é sagrada.",
  Encruzilhada:
    "Você é o mestre dos caminhos. Sua alma é feita de escolhas e sua mente, de possibilidades. Você pertence ao Reino da Encruzilhada, onde o tempo hesita, os caminhos se cruzam e a sabedoria veste cartola.",
  Natural:
    "Você é feito de raiz e vento. Sua alma pulsa com os ciclos da terra e sua sabedoria vem do silêncio das árvores. Você pertence ao Reino Natural, onde a floresta fala, a água ensina e a magia é feita de verdade.",
  Cemitério:
    "Você é introspectivo, firme e poderoso. Sua energia é como a terra: densa, ancestral e implacável. Você pertence ao Reino do Cemitério, onde cada passo é uma sentença e cada silêncio é um julgamento.",
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
  const [faltantes, setFaltantes] = useState([]);
  const [avisoId, setAvisoId] = useState(0);
  const respondidas = Object.keys(respostas).length;
  const progresso = Math.round((respondidas / perguntas.length) * 100);

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
      pontuacoes[resultadoPorOpcao[index][opcao]] += 1;
    });
    const maiorPontuacao = Math.max(...Object.values(pontuacoes));
    const reinosEmpatados = reinos.filter(
      (reino) => pontuacoes[reino] === maiorPontuacao,
    );
    const reino = reinosEmpatados[0];
    setResultado({ reino, pontuacoes, reinosEmpatados });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reiniciar = () => {
    setRespostas({});
    setFaltantes([]);
    setAvisoId(0);
    setResultado(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const frasesCompartilhamento = {
    Cemitério:
      "Minha alma ressoa com o Reino do Cemitério — onde cada ato tem seu preço e não existe perdão. Descubra qual plano de O Castelo das Marias chama por você:",
    Lira: "Minha alma ressoa com o Reino da Lira — onde o desejo não se esconde e o ego se desfaz em dança. Descubra qual plano de O Castelo das Marias chama por você:",
    Encruzilhada:
      "Minha alma ressoa com o Reino da Encruzilhada — o passo é livre, mas o eco da decisão é eterno. Descubra qual plano de O Castelo das Marias chama por você:",
    Natural:
      "Minha alma ressoa com o Reino Natural — onde nada é dado e tudo é troca. Descubra qual plano de O Castelo das Marias chama por você:",
  };

  const getUrlQuiz = () => {
    return window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
      ? "https://livroocastelodasmarias.netlify.app/quiz"
      : `${window.location.origin}/quiz`;
  };

  const textoResultado = () =>
    frasesCompartilhamento[resultado?.reino] ||
    `Descobri minha afinidade com o Reino ${resultado?.reino} em O Castelo das Marias! Descubra qual plano chama por você:`;

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
      <h1>Descubra seu Reino</h1>
      <p className="lead">
        Descubra qual dos quatro reinos de <strong>O Castelo das Marias</strong>
        representa sua personalidade.
      </p>

      {resultado ? (
        <section className="quiz-result-card">
          <h2>Seu reino é {resultado.reino}</h2>
          {resultado.reinosEmpatados.length > 1 && (
            <p className="quiz-tie-note">
              Sua personalidade transita entre{" "}
              {resultado.reinosEmpatados.join(" e ")}. O resultado principal é{" "}
              {resultado.reino}.
            </p>
          )}
          <img
            src={imagensReinos[resultado.reino]}
            alt={`Guardião do Reino ${resultado.reino}`}
          />
          <p>{resultadoDescricao[resultado.reino]}</p>
          <ul className="affinity-list">
            {reinos.map((reino) => (
              <li key={reino}>
                <span>{reino}</span>
                <strong>
                  {Math.round(
                    (resultado.pontuacoes[reino] / perguntas.length) * 100,
                  )}
                  %
                </strong>
              </li>
            ))}
          </ul>
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
      ) : (
        <form className="quiz-form" onSubmit={calcularResultado}>
          <div
            className="quiz-progress"
            aria-label={`Progresso: ${respondidas} de ${perguntas.length} perguntas respondidas`}
          >
            <div className="quiz-progress-label">
              <span>
                {respondidas} de {perguntas.length} respondidas
              </span>
              <strong>{progresso}%</strong>
            </div>
            <div className="quiz-progress-track" aria-hidden="true">
              <span style={{ width: `${progresso}%` }} />
            </div>
          </div>
          {faltantes.length > 0 && avisoId > 0 && (
            <p className="quiz-error" role="alert">
              Responda às questões destacadas antes de enviar.
            </p>
          )}
          {perguntas.map(([pergunta, opcoes], index) => (
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
                {opcoes.map((opcao, optionIndex) => (
                  <label key={opcao} className="quiz-option">
                    <input
                      type="radio"
                      name={`pergunta-${index}`}
                      value={optionIndex}
                      aria-label={`${String.fromCharCode(65 + optionIndex)}: ${opcao}`}
                      checked={respostas[index] === optionIndex}
                      onChange={() => handleChange(index, optionIndex)}
                    />
                    <span>
                      {String.fromCharCode(65 + optionIndex)}. {opcao}
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
