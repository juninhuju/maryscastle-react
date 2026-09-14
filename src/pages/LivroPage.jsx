import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const capitulo = [
  "O cascalho estalou sob as rodas da carruagem e, antes que o cocheiro refreasse os animais, Joaquim saltou para a treva. Seus joelhos cederam, um impacto que vibrou dos calcanhares à base do crânio, mas ele não estancou. Avançou contra a fachada de taipa, os punhos cerrados, atingindo a madeira com a força de um martelo de carrasco. Golpeou uma, duas vezes. O som seco profanou o silêncio da rua de pedras irregulares, ecoando pelos becos.",
  "Um gosto amargo, como o de um prego enferrujado, inundou-lhe a boca, queimando a base da língua. Ele não precisava de provas; o homem que fornecia o tecido para sua loja era o mesmo que, agora, desatava os laços do vestido de sua esposa.",
  "Joaquim lançou o ombro contra o batente de jacarandá. A estrutura rangeu sob o peso do golpe, um estalo de madeira velha prestes a partir. Seus tendões esticaram-se ao limite, a pele das mãos esfolada pelo atrito bruto contra a porta trancada.",
  "— Ana! Abra! — O comando saiu como um rasgo.",
  "A tranca cedeu com um estalido de ferro. A porta escancarou-se, batendo contra a parede interna com um estrondo. Joaquim invadiu o átrio, o corpo projetado para a frente. Diante do rosto pálido da mulher, seu dedo em riste tremia; os músculos da face saltavam sob a pele.",
  "— Não era eu quem você esperava? — Joaquim sibilou. Os dentes pressionaram-se com tanta força que quase partiam sua mandíbula.",
  "— Joaquim, por favor… — Ela recuou, as mãos espalmadas contra o peito, os dedos tremendo sobre o tecido fino do vestido.",
  "Joaquim avançou. Perdigotos atingiram o rosto dela, misturando-se ao suor que brotava na testa da mulher. A voz do comerciante polido fora substituída por um som que não vinha da garganta, mas das entranhas.",
  "— Trabalhei até o sangue secar naquela loja. Cobri seu corpo com o que havia de melhor, sustentei cada luxo… Dei a você o meu nome! E você me paga com isso, entre estas paredes?",
  "Do lado de fora, o ritmo dos passos no pé-de-moleque mudou; a vizinhança desacelerava, alimentando-se da desgraça que escapava pelas frestas das janelas de jacarandá.",
  "— Responda! — Ele encurtou a distância. Cada fibra de seu corpo vibrava, os tendões do pescoço saltados. — Era por Baltazar que você vigiava a porta?",
  "Ana abriu a boca, mas o som pereceu antes de alcançar os lábios. Joaquim deu mais um passo, os dedos retorcidos. O santuário de sua casa agora fedia a carniça.",
  "A mulher cambaleou. Ergueu as mãos, mas Joaquim a atingiu com um empurrão seco. O corpo dela desabou contra o estofado. Ao lado, a mesa de apoio tombou; adornos de porcelana explodiram contra o assoalho.",
  "Antes que Joaquim pudesse avançar, um vulto bloqueou a luz do corredor. Baltazar. O soco estalou contra o maxilar de Joaquim. A cabeça dele foi lançada para trás e o sangue inundou sua boca no mesmo instante.",
  "Joaquim rosnou. O som subiu das entranhas, cru e sem palavras. Seus dedos buscaram o pescoço do rival, mas Baltazar tinha o corpo endurecido pelo peso dos fardos que carregava no porto. Com um movimento fluido, o invasor livrou-se do ataque, rasteirou Joaquim e o arremessou contra o tapete.",
  "— Ana! — Baltazar ajoelhou-se. As mãos pairavam sobre os ombros dela, os olhos fixos na mulher com um desespero que Joaquim jamais demonstrara. — Você está bem? O que esse animal fez?",
  "Joaquim ergueu-se. Sua respiração era um chiado descompassado, mas seus olhos fixaram-se na poltrona de carvalho. O urro que escapou de sua garganta não era humano; era o som de algo que se rompia. Ele agarrou a madeira, suspendeu-a acima da cabeça e a arremessou com uma violência que desafiava a própria estrutura dos músculos.",
  "O móvel atingiu as costas de Baltazar. O ar escapou dos pulmões do rival em um chiado de agonia. Ao olhar para trás, Baltazar não encontrou o amigo, mas pupilas dilatadas que engoliam a íris e uma face rubra, transfigurada. Atordoado, Baltazar buscou a porta aberta e disparou para o nada.",
  "A porta ficou aberta. Nenhum dos três a fechou.",
  "Ana e Joaquim permaneceram imóveis por um instante, ouvindo apenas o próprio fôlego, como se o corpo precisasse reaprender a funcionar.",
  "Joaquim limpou o rastro de sangue do lábio com o dorso da mão. Lançou um último olhar para a esposa, recolheu o amargor na boca e cuspiu sobre as saias de seda dela. Então, ganhou a noite, deixando para trás apenas o estilhaçar da porcelana e o silêncio denso da casa.",
  "As fachadas sucediam-se em silêncio. Joaquim não as via. Via apenas o chão e o movimento automático dos próprios pés.",
  "O peso do chumbo instalou-se sob seus olhos fundos. Ele cambaleou com o tronco inclinado, as mãos pendendo inertes e os dedos roçando as coxas, movendo-se apenas pelo impulso de uma alma que se desfazia.",
  "Após perder a conta dos passos, uma estrutura de pedra bruta surgiu na esquina, rompendo a linha monótona das fachadas. Joaquim estancou. Suas pupilas, dilatadas e fixas, captaram o brilho bruxuleante que escapava por entre os batentes de uma porta imponente, um convite de luz que parecia sustentar suas pernas onde a vontade já falhara. Ele não buscou placas ou nomes; o magnetismo do lugar era um fio que o puxava pelo peito.",
  "Antes que conseguisse tatear as algibeiras, um vulto descolou-se da sombra do portal. Um homem, vestindo um traje que parecia absorver a pouca luz da rua, ergueu o canto dos lábios em um movimento calculado. O tecido de sua casaca era de um preto absoluto, sem o menor brilho de desgaste.",
  "— Um digníssimo cavalheiro… — O sujeito o mediu da testa aos pés, os olhos percorrendo o sangue seco no lábio de Joaquim e a poeira nos seus sapatos. — Ou será apenas um coitado perdido?",
  "Joaquim hesitou, a mão trêmula buscando o apoio da cantaria fria para não desabar. O estranho deu um passo para o lado, com um gesto largo, franqueou a entrada, deixando que uma lufada de ar quente e denso o atingisse — um vapor carregado com o aroma doce do fumo de rolo, o almíscar das peles aquecidas e o odor profundo do carvalho molhado em destilados.",
  "— Entre, resto de homem, não lhe sobra nada a não ser entregar-se.",
  "O ambiente abria-se em um salão de tetos abobadados, a luz de grandes candelabros de bronze. Homens em casacas de linho fino reclinavam-se em poltronas, observando, por trás de copos de cristal com uísque.",
  "A estrutura de granito bruto, com seus blocos encaixados em uma precisão milimétrica, projetava torres contra o céu que ele mal ousava olhar. Ao cruzar o batente de carvalho, seus pés afundaram em tapetes felpudos que pareciam engolir seus passos. O ar ali era pesado, saturado por um perfume doce de sândalo que tentava, em vão, mascarar o cheiro de suor e devassidão.",
  "Pelas frestas da entrada, vultos femininos cruzavam o salão em uma exibição que lhe revirava as entranhas. Eram sedas e rendas de um requinte insultuoso; decotes que expunham o colo com uma ousadia que ele nunca vira, fendas que revelavam as coxas a cada passo. Joaquim sentiu o estômago contrair-se. Aquele prostíbulo ostentava uma riqueza que fedia a pecado. O nojo subiu-lhe à boca, mais amargo como fel.",
  "Os olhares delas pousaram nele por um breve instante antes de seguirem adiante, indiferentes. Eram sorrisos assimétricos e lábios pintados de um vermelho vivo que pareciam ignorar sua presença, mas Joaquim, com os nervos em carne viva, sentiu-se o centro de um escárnio invisível e o calor subiu pelo seu pescoço.",
  "— O que olham? — rosnou ele para o nada, os dedos cravando-se no forro do paletó.",
  "Nenhuma delas respondeu. O zumbido de vozes continuou ignorando o homem maltrapilho que acabara de invadir.",
  "O som de gargalhadas masculinas, abafadas e complacentes, vindo dos fundos do salão, soava como um insulto pessoal à sua própria ruína. A vontade de girar os calcanhares e fugir lutava contra o vislumbre daquelas peles expostas. Seus pés pareciam pregados ao chão, prisioneiro de uma curiosidade que o ultrajava tanto quanto o atraía.",
  "— Cavalheiros de linhagem… — Joaquim rosnou entre dentes, a mandíbula saltando em um ângulo rígido. — Frequentam este lodaçal como se fosse a própria paróquia.",
  "A crítica, porém, perdeu força diante do protesto de seu próprio corpo. Uma pontada aguda, como se um ferro em brasa tivesse sido cravado entre suas omoplatas, o fez dobrar-se. A saliva sumiu, ele engoliu o orgulho rascante e arrastou os pés em direção ao salão, movido não pela vontade, mas por um impulso que seus músculos já não sabiam questionar.",
  "Antes que cruzasse o limiar, o som de botas pesadas contra o chão o fez estacar. Um homem era arrastado para a calçada, os braços presos por dois guardas que não mostravam piedade; as pontas dos sapatos do infeliz ralavam no calçamento irregular, deixando um rastro de couro destruído e um gemido que se perdia na noite.",
  "— Grite lá fora, seu imundo! — esbravejou o guarda, a voz rouca, como se mastigasse cascalho. — Ofendeu a casa que o acolheu, agora lamba a poeira. Suma, antes que meu cajado desenhe o seu crânio!",
  "O guarda girou o bastão de madeira escura e seu olhar atingiu Joaquim. O suor ensopou as palmas de suas mãos. Joaquim buscou fôlego, mas o ar parecia saturado de uma agonia que ele não sabia nomear.",
  "— Deus me entregou aos cães… — murmurou, a voz falhando como uma chama ao vento.",
  "Ele apertou o crucifixo sob a camisa quando a densidade do ar ao redor mudou.",
  "Uma nota musical, límpida e vibrante, atravessou a espessura das paredes de pedra e atingiu o peito de Joaquim. Não era apenas um som; era uma vibração que ressoava dentro de seus ossos, uma voz feminina que parecia puxá-lo por fios invisíveis presos às suas entranhas. O lamento dissolvia o eco dos gritos do guarda e o latejar em suas costas, transformando a repulsa em um torpor que entorpecia os sentidos. Seus pés, antes pesados, moveram-se em um transe hipnótico, forçando-o a dar o segundo passo para dentro da escuridão luxuosa.",
  "Joaquim sentiu o som antes de processar a melodia. Sem que desse ordens aos membros, seus pés avançaram sobre a espessura do tapete.",
  "O salão abriu-se em um facho de tons âmbar e rubro. No centro do transe, a voz feminina ganhava corpo, preenchendo cada fresta do recinto com um convite que não aceitava recusas:",
  "Vem provar do que a pele reclama, nesta dança onde o sangue se inflama. Riso de dama e o brilho do cetim, o amor guarda o início, a noite guarda o fim. No ritmo do escuro, deixa-te levar, não há mais o que ter, resta apenas entregar.",
  "À medida que os versos o envolviam, a pontada aguda entre suas omoplatas desvaneceu; o rascante da garganta deu lugar a um frescor de beber água de uma nascente. O canto possuía uma dualidade perturbadora: a melodia carregava o peso de um desamor antigo, uma melancolia de séculos, transmutando a dor em algo proibitivamente belo.",
  "Joaquim já não era o senhor de suas vontades; entregando-se ao fluxo daquela casa que prometia saciar fomes que ele sequer sabia possuir.",
  "No fundo do salão, sobre um estrado que a elevava, uma mulher repousava como uma divindade sombria. O cetim de seu vestido, em tons de sangue e cinzas, captava a luz das chamas, cintilando entre rendas que pareciam teias. Seus cabelos, presos em um penteado impecável, possuíam o tom do ébano, fundindo-se com o olhar profundo que parecia atravessar a pele de Joaquim. Grandes argolas douradas pendiam de suas orelhas, balançando suavemente ao ritmo de sua respiração, enquanto uma cigarrilha vertia uma fumaça cinzenta que serpenteava pelo ar em volutas preguiçosas.",
  "Joaquim deixou-se cair em uma poltrona de veludo. Seus membros pesavam como chumbo. O mundo ao redor silenciou-se; o tilintar dos copos e o arrastar dos pés tornaram-se ruídos abafados. Restava apenas aquele canto, um véu que o isolava de tudo o que deixara na calçada.",
  "O roçar de seda contra suas pernas o despertou do torpor. Uma das mulheres aproximou-se com passos que não produziam som. Sem hesitar, ela acomodou-se no colo de Joaquim. Ela não buscava permissão; apenas se instalou ali. Não havia pressa em seus olhos — apenas atenção. Como alguém que reconhece um colapso antes que ele aconteça.",
  "— Sou Maria — ela murmurou, inclinando o rosto até que o hálito quente tocasse a orelha de Joaquim. Um sorriso de dentes muito brancos cortou a face dela. — Parece desanimado, Joaquim… Deixe-me resolver isso.",
  "Joaquim ergueu as pálpebras, as pupilas dilatadas varrendo as feições da mulher. Buscou em cada fragmento de memória um rosto familiar, uma lembrança do bairro ou do comércio, mas a perfeição daqueles traços era um território estrangeiro. Tentou mover os braços, mas os músculos ignoraram o comando; sentia como se o próprio veludo da poltrona o estivesse tragando, fundindo sua carne ao estofado. Um calafrio de pânico subiu por sua espinha, mas foi imediatamente abafado por uma onda de calor que o amansou, desarmando o que restava de sua vontade.",
  "Maria inclinou-se até que o calor de suas bocas se fundisse. A proximidade não trouxe o incêndio que ele esperava. Trouxe silêncio. Ele fechou as pálpebras, aguardando o impacto dos lábios, mas a vertigem o tragou para um abismo.",
  "Quando o chão retomou a solidez, Joaquim se encontrou no quarto de núpcias. Seus olhos, ávidos, seguiam o movimento do peito de Ana, que subia e descia enquanto a seda do vestido escorria pelos ombros, revelando a pele clara, ainda quente.",
  "— Não pare… — A voz dele saiu rouca, uma urgência que vibrou no ar pesado do aposento.",
  "Quando o tecido finalmente cedeu e caiu aos pés dela, a visão do corpo de Ana roubou-lhe o fôlego. Os seios eram fartos, a pele esticada e firme, com bicos que escureceram e se arrepiaram ao toque do ar. Seus quadris desenhavam uma curva sinuosa e vasta, onde as sombras pareciam convidar suas mãos ao pecado.",
  "Ana sustentou o olhar, as pupilas dilatadas.",
  "— Você… você me acha bonita, Joaquim? — perguntou ela.",
  "— Você é a visão mais divina que já tive — ele respondeu, avançando para um beijo faminto, com o gosto doce e úmido de um fruto maduro.",
  "Sentiu os dedos dela apressados, abrindo os botões de sua camisa, tateando o relevo de seu peito. Os anos de esforço na loja haviam transformado seus braços em vigas de força bruta.",
  "— Me tome… — Ana murmurou com a palma da mão deslizando pelos músculos dele, buscando o calor que de seu corpo rígido.",
  "Joaquim a pressionou contra si, sentindo a maciez das coxas dela ceder a invasão. Num fôlego, um buscou a do outro em uma fome de séculos. Ele a carregou para a cama enquanto ela o envolvia, Ana suspirou do fundo da alma.",
  "— Joaquim, eu esperei tanto por isso — ela confessou, apertando suas pernas em sua cintura, prendendo-o em um abraço de carne e desejo.",
  "— Agora você é minha, Ana. Inteiramente minha — ele declarou, pressionado-a enquanto ela agarrava os lençóis com força. O grito abafado de Ana contra o travesseiro selou o instante em que, enfim, as almas se fundiram ao sangue.",
  "O ápice daquela lembrança, contudo, desfez-se no vazio gelado do salão. A consciência escapou-lhe como areia entre os dedos, deixando apenas o rastro de um calor que ele já não possuía.",
  "Um murmúrio crescente, como o enxamear de insetos, o despertou. Joaquim tentou erguer as pálpebras, mas elas pesavam como moedas de chumbo sobre os globos oculares. O entorpecimento era total; perguntava-se se o vinho ou o próprio ar o haviam drogado. O calor que antes sentia nas coxas desaparecera.",
  "— Maria? — chamou, a voz apenas um sopro quebrado, procurando-a na penumbra turva.",
  "Mas ela sumira. Restava apenas o rastro gélido de um desejo que o corpo dele ainda tentava, inutilmente, alcançar entre os vultos que agora o vigiavam.",
  "As sombras do salão pareciam rastejar pelas paredes. Homens de trajes impecáveis acomodavam-se em poltronas de madeira entalhada, bebendo em silêncio, enquanto a fumaça dos charutos erguia uma névoa azulada. Havia uma pressa contida em seus gestos — a mesma do ar pouco antes da tempestade.",
  "Os olhares convergiram para ele. Testas se vincavam e sobrancelhas subiam em arcos de puro escárnio, como se o despissem de cada farrapo de dignidade. Sorrisos assimétricos surgiram — o tipo de reconhecimento compartilhado por quem habita o mesmo abismo. Joaquim sentiu a vergonha queimar seu pescoço, um calor que contrastava com o frio que emanava de suas próprias entranhas. Seus olhos buscaram, em vão, o refúgio no vazio do teto.",
  "— Ora, o que temos aqui? — Uma voz altiva e rouca estalou logo atrás de sua orelha, vibrando como o ranger de uma engrenagem pesada.",
  "Joaquim virou-se bruscamente, o coração martelando contra as costelas com tal força que cada batida parecia um soco. O homem diante dele ostentava um porte monumental sob uma cartola de seda, mas o rosto era uma abominação: presas amareladas empurravam o lábio inferior para fora, e pontas ósseas e retorcidas rasgavam o couro cabeludo sangrento. Abaixo da cintura, o tecido fino das calças esticava-se sobre a curvatura de pernas cobertas por pelos grossos, terminando em cascos que batiam contra o assoalho com o som seco de martelos.",
  "O pavor gelou o que restava de seu sangue. Joaquim tentou recuar, mas seus músculos pesavam como chumbo. Ao redor, o véu da ilusão rasgava-se com a crueza de uma ferida aberta: rostos humanos derretiam em formas grotescas e mandíbulas se alongavam em focinhos úmidos e monstruosos. O canto da lira cessara; agora, o silêncio era interrompido apenas pelo rosnar baixo que vibrava nos cantos escuros.",
  "O perfume doce, agora misturado ao enxofre e ao odor acre de couro queimado, invadiu seus pulmões. O estômago de Joaquim revirou, trazendo o gosto amargo de um prego enferrujado à boca. Ele cambaleou, o equilíbrio falhando a cada passo em direção à saída. Suas mãos suadas escorregaram pela madeira pesada da porta até que, com um último esforço, ele a empurrou e desabou para o ar cortante da noite.",
  "Nos degraus de cantaria, o guarda o aguardava com um sorriso torto. Os dentes brilhavam sob a luz baça da lanterna. Uma gargalhada áspera, como o atrito de pedras, ecoou pelo pátio.",
  "— Achou o que veio procurar no Castelo das Marias, Joaquim?",
  "Mesmo com os joelhos falhando, Joaquim forçou o corpo a correr. Ao atingir o calçamento irregular, seus olhos focaram a placa de ferro batido que rangia acima da entrada: O Castelo das Marias. Seus pés batiam no paralelepípedo enquanto ele tentava se distanciar daquelas torres que agora pareciam garras negras. Atrás dele, a voz do guarda ainda o perseguia, carregada por um vento gelado:",
  "— Fique tranquilo, cavalheiro… De fome você não vai perecer!",
];

function LivroPage() {
  const [fontSize, setFontSize] = useState(1.1); // em rem
  const [theme, setTheme] = useState("dark"); // dark, light, sepia
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className={`container-fluid livro-page theme-${theme}`}>
      {/* Barra de progresso de leitura suave no topo */}
      <div
        className="reading-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Progresso da leitura do capítulo"
      />

      <h1>Primeiro Capítulo de O Castelo das Marias | Leia Online</h1>

      <div className="reading-meta">
        <span className="reading-time">
          ⏱️ Tempo estimado: ~8 minutos de leitura
        </span>

        {/* Controles de Leitura: Tamanho de fonte e tema */}
        <div className="reading-controls" aria-label="Ajustes de leitura">
          <div
            className="font-controls"
            role="group"
            aria-label="Tamanho da fonte"
          >
            <button
              type="button"
              className="ctrl-btn"
              onClick={() => setFontSize((s) => Math.max(0.9, s - 0.1))}
              aria-label="Diminuir fonte"
            >
              A-
            </button>
            <button
              type="button"
              className="ctrl-btn"
              onClick={() => setFontSize(1.1)}
              aria-label="Restaurar tamanho padrão da fonte"
            >
              Padrão
            </button>
            <button
              type="button"
              className="ctrl-btn"
              onClick={() => setFontSize((s) => Math.min(1.5, s + 0.1))}
              aria-label="Aumentar fonte"
            >
              A+
            </button>
          </div>

          <div
            className="theme-controls"
            role="group"
            aria-label="Tema visual de leitura"
          >
            <button
              type="button"
              className={`ctrl-btn ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
              aria-label="Tema Escuro"
            >
              🌙 Escuro
            </button>
            <button
              type="button"
              className={`ctrl-btn ${theme === "sepia" ? "active" : ""}`}
              onClick={() => setTheme("sepia")}
              aria-label="Tema Sépia (descanso visual)"
            >
              📜 Sépia
            </button>
            <button
              type="button"
              className={`ctrl-btn ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
              aria-label="Tema Claro"
            >
              ☀️ Claro
            </button>
          </div>
        </div>
      </div>

      <p className="lead">
        Um convite ao desassossego: mergulhe no início do romance sobrenatural
        de Junior Cristovam, O Castelo das Marias, e acompanhe o colapso de
        Joaquim na noite em que seu casamento e sua sanidade ruíram.
      </p>
      <h2>Capítulo 1 - Onde o Sangue Beija a Seda</h2>

      <p className="descricao-capitulo">
        Em seu primeiro capítulo, <strong>O Castelo das Marias</strong> revela o
        flagrante da traição que despedaça Joaquim. Cego pelo ódio e pelo amor
        ferido, ele parte em busca de vingança, sendo tragado para os limiares
        de um plano onde o desejo reprimido, a dor e o sobrenatural cobram seu
        tributo.
      </p>

      <article className="capitulo" style={{ fontSize: `${fontSize}rem` }}>
        {capitulo.map((paragrafo, index) => {
          const isDialogue = paragrafo.startsWith("—");
          return (
            <p key={index} className={isDialogue ? "dialogue-line" : ""}>
              {paragrafo}
            </p>
          );
        })}
      </article>

      <div className="proximo-passo">
        <h2>Continue a jornada em O Castelo das Marias</h2>
        <p>
          Descubra os quatro reinos e seus mistérios, e acompanhe Joaquim em um
          conflito onde a dor do amor traído, o ódio e as forças sobrenaturais
          decidem o destino de sua alma.
        </p>
        <Link to="/" className="btn">
          Conhecer a obra
        </Link>
      </div>
    </main>
  );
}

export default LivroPage;
