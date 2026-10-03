import type { Match } from "@/types/game";

// Liga das Nações A · Grupo 4 · Estádio do Dragão, Porto
// Dom 4 out 2026, 18:45 UTC = 19:45 em Lisboa (WEST, +01:00)
//
// `challenges`: os 5 desafios canónicos de cada ronda. Não mexer sem decisão de produto.
// `alternatives`: só entram com 6–8 jogadores (os 5 canónicos entram sempre primeiro).
// `rareEvents`: cada jogador recebe também um raro por ronda. Nunca aparecem na landing.
// Principal = meio copo · raro = vira o copo.
// Os 5 canónicos da ronda 1 são também o teaser antes do dia do jogo.
// Cada ronda é ~um quarto do jogo; os desafios de uma ronda só contam dentro do seu intervalo.
export const portugalNoruega: Match = {
  slug: "portugal-noruega",
  teamA: "Portugal",
  teamB: "Noruega",
  competition: "Liga das Nações",
  venue: "Estádio do Dragão, Porto",
  kickoff: "2026-10-04T19:45:00+01:00",
  rounds: [
    {
      id: 1,
      label: "0'–22'",
      startMinute: 0,
      challenges: [
        { id: "r1-canto-portugal", text: "Portugal ganha um canto" },
        { id: "r1-haaland-remate", text: "Haaland faz um remate" },
        { id: "r1-bruno-bola-parada", text: "Bruno Fernandes bate um canto ou um livre" },
        { id: "r1-defesa-gr-noruega", text: "O guarda-redes da Noruega faz uma defesa" },
        { id: "r1-portugal-fora-de-jogo", text: "Portugal é apanhado em fora de jogo" },
      ],
      alternatives: [
        { id: "r1-alt-jorge-jesus", text: "A realização mostra Jorge Jesus no banco" },
        { id: "r1-alt-lancamento-area", text: "A Noruega atira um lançamento lateral para a área" },
        { id: "r1-alt-odegaard-falta", text: "Ødegaard sofre uma falta" },
      ],
    },
    {
      id: 2,
      label: "23'–45'+",
      startMinute: 23,
      challenges: [
        { id: "r2-canto-noruega", text: "A Noruega ganha um canto" },
        { id: "r2-remate-enquadrado-portugal", text: "Portugal faz um remate enquadrado" },
        { id: "r2-odegaard-bola-parada", text: "Ødegaard bate um canto ou um livre" },
        { id: "r2-amarelo-portugal", text: "Um jogador de Portugal vê amarelo" },
        { id: "r2-haaland-fora-de-jogo", text: "Haaland é apanhado em fora de jogo" },
      ],
      alternatives: [
        { id: "r2-alt-lei-vantagem", text: "O árbitro dá lei da vantagem" },
        { id: "r2-alt-assistencia-medica", text: "Um jogador recebe assistência médica no relvado" },
        { id: "r2-alt-compensacao", text: "O árbitro dá 3 ou mais minutos de compensação" },
      ],
    },
    {
      id: 3,
      label: "46'–67'",
      startMinute: 46,
      challenges: [
        { id: "r3-diogo-costa-defesa", text: "Diogo Costa faz uma defesa" },
        { id: "r3-substituicao-portugal", text: "Portugal faz uma substituição" },
        { id: "r3-noruega-remata-fora", text: "A Noruega remata para fora" },
        { id: "r3-haaland-remate-enquadrado", text: "Haaland faz um remate enquadrado" },
        { id: "r3-portugal-livre-direto", text: "Portugal remata de livre direto" },
      ],
      alternatives: [
        { id: "r3-alt-substituicao-noruega", text: "A Noruega faz uma substituição" },
        { id: "r3-alt-replay-falta", text: "Há uma repetição em câmara lenta de uma falta" },
        { id: "r3-alt-adeptos-noruega", text: "A realização mostra os adeptos da Noruega" },
      ],
    },
    {
      id: 4,
      label: "68'–90'+",
      startMinute: 68,
      challenges: [
        { id: "r4-canto-portugal", text: "Portugal ganha um canto" },
        { id: "r4-amarelo-noruega", text: "Um jogador da Noruega vê amarelo" },
        { id: "r4-portugal-remate-fora-area", text: "Portugal faz um remate de fora da área" },
        { id: "r4-noruega-remate-enquadrado", text: "A Noruega faz um remate enquadrado" },
        { id: "r4-substituicao-dupla", text: "Uma equipa faz duas substituições ao mesmo tempo" },
      ],
      alternatives: [
        { id: "r4-alt-portugal-fora-de-jogo", text: "Portugal é apanhado em fora de jogo" },
        { id: "r4-alt-lancamento-area", text: "A Noruega atira um lançamento lateral para a área" },
        { id: "r4-alt-compensacao-5", text: "A compensação final é de 5 ou mais minutos" },
      ],
    },
  ],
  // Acontecimentos objetivos e inequívocos. Podem repetir entre rondas, nunca na mesma ronda.
  rareEvents: [
    { id: "raro-poste-barra", text: "Bola no poste ou na barra" },
    { id: "raro-penalti", text: "Há um penálti" },
    { id: "raro-gr-defende-penalti", text: "O guarda-redes defende um penálti" },
    { id: "raro-var-muda-decisao", text: "O VAR muda uma decisão do árbitro" },
    { id: "raro-golo-anulado", text: "Um golo é anulado" },
    { id: "raro-vermelho", text: "Cartão vermelho" },
    { id: "raro-autogolo", text: "Autogolo" },
    { id: "raro-golo-livre-direto", text: "Golo de livre direto" },
    { id: "raro-golo-cabeca", text: "Golo de cabeça" },
    { id: "raro-golo-fora-area", text: "Golo de fora da área" },
    { id: "raro-golo-canto", text: "Golo na sequência de um canto" },
    { id: "raro-substituicao-lesao", text: "Substituição por lesão" },
    { id: "raro-golo-descontos", text: "Golo nos descontos" },
  ],
};
