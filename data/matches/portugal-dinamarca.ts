import type { Match } from "@/types/game";

// Liga das Nações A · Grupo 4 · Parken, Copenhaga
// Qui 1 out 2026, 18:45 UTC = 19:45 em Lisboa (WEST, +01:00)
//
// `challenges`: os 5 desafios canónicos de cada ronda. Não mexer sem decisão de produto.
// `alternatives`: só entram com 6–8 jogadores (os 5 canónicos entram sempre primeiro).
// `rareEvents`: cada jogador recebe também um raro por ronda. Nunca aparecem na landing.
// `times`: 3x provável · 4x intermédio · 5x menos provável · 6x pouco provável.
// Os 5 canónicos da ronda 1 são também o teaser antes do dia do jogo.
// Cada ronda é ~um quarto do jogo; os desafios de uma ronda só contam dentro do seu intervalo.
const STRIKER_NOTE = "Se não jogar, vale para o ponta-de-lança de Portugal.";

export const portugalDinamarca: Match = {
  slug: "portugal-dinamarca",
  teamA: "Portugal",
  teamB: "Dinamarca",
  competition: "Liga das Nações",
  venue: "Parken, Copenhaga",
  kickoff: "2026-10-01T19:45:00+01:00",
  rounds: [
    {
      id: 1,
      label: "0'–22'",
      startMinute: 0,
      challenges: [
        { id: "r1-ronaldo-fora-de-jogo", text: "Ronaldo é apanhado em fora de jogo", note: STRIKER_NOTE, times: 4 },
        { id: "r1-canto-portugal", text: "Portugal ganha um canto", times: 3 },
        { id: "r1-remate-enquadrado-dinamarca", text: "Dinamarca faz um remate enquadrado", times: 4 },
        { id: "r1-nuno-mendes-cruzamento", text: "Nuno Mendes faz um cruzamento cortado pelo adversário", times: 3 },
        { id: "r1-joao-felix-falta", text: "João Félix sofre uma falta", times: 3 },
      ],
      alternatives: [
        { id: "r1-alt-portugues-no-chao", text: "Um português fica no chão a pedir falta", times: 3 },
        { id: "r1-alt-lancamento-area", text: "A Dinamarca atira um lançamento lateral para a área", times: 4 },
        { id: "r1-alt-capacete-viking", text: "A realização mostra um adepto com capacete viking", times: 5 },
      ],
    },
    {
      id: 2,
      label: "23'–45'+",
      startMinute: 23,
      challenges: [
        {
          id: "r2-ronaldo-remate-fora",
          text: "Ronaldo remata para fora ou tem um remate bloqueado",
          note: "Se não jogar, vale para o ponta-de-lança.",
          times: 3,
        },
        { id: "r2-canto-dinamarca", text: "Dinamarca ganha um canto", times: 4 },
        { id: "r2-remate-enquadrado-portugal", text: "Portugal faz um remate enquadrado", times: 4 },
        { id: "r2-amarelo-portugal", text: "Um jogador de Portugal vê amarelo", times: 5 },
        {
          id: "r2-jorge-jesus",
          text: "A realização mostra Jorge Jesus a reclamar/gesticular claramente no banco",
          times: 4,
        },
      ],
      alternatives: [
        { id: "r2-alt-lei-vantagem", text: "O árbitro dá lei da vantagem", times: 3 },
        { id: "r2-alt-bracos-abertos", text: "Um jogador protesta com o árbitro de braços abertos", times: 3 },
        { id: "r2-alt-compensacao", text: "O árbitro dá 3 ou mais minutos de compensação", times: 4 },
      ],
    },
    {
      id: 3,
      label: "46'–67'",
      startMinute: 46,
      challenges: [
        { id: "r3-diogo-costa-defesa", text: "Diogo Costa faz uma defesa", times: 4 },
        { id: "r3-substituicao-portugal", text: "Portugal faz uma substituição", times: 3 },
        { id: "r3-dinamarca-remata-fora", text: "Dinamarca remata para fora", times: 3 },
        {
          id: "r3-ronaldo-remate-enquadrado",
          text: "Ronaldo faz um remate enquadrado",
          note: "Se não jogar, vale para o ponta-de-lança.",
          times: 5,
        },
        { id: "r3-livre-ultimo-terco", text: "Portugal ganha um livre no último terço", times: 4 },
      ],
      alternatives: [
        { id: "r3-alt-replay-falta", text: "Há uma repetição em câmara lenta de uma falta", times: 3 },
        { id: "r3-alt-intensidade", text: "O comentador diz a palavra \"intensidade\"", times: 4 },
        { id: "r3-alt-substituicao-dinamarca", text: "A Dinamarca faz uma substituição", times: 3 },
      ],
    },
    {
      id: 4,
      label: "68'–90'+",
      startMinute: 68,
      challenges: [
        { id: "r4-canto-portugal", text: "Portugal ganha um canto", times: 3 },
        { id: "r4-amarelo-dinamarca", text: "Um jogador da Dinamarca vê amarelo", times: 4 },
        { id: "r4-portugal-fora-de-jogo", text: "Portugal é apanhado em fora de jogo", times: 4 },
        {
          id: "r4-diogo-costa-tempo",
          text: "Diogo Costa demora claramente tempo numa reposição/pontapé de baliza",
          note: "Caso Portugal esteja a ganhar ou empatado.",
          times: 4,
        },
        {
          id: "r4-era-para-marcar",
          text: "Um jogador de Portugal falha uma ocasião que o grupo considera “era para marcar”",
          times: 3,
        },
      ],
      alternatives: [
        { id: "r4-alt-assistencia-medica", text: "Um jogador precisa de assistência médica", times: 4 },
        { id: "r4-alt-queimar-tempo", text: "Alguém queima tempo e o estádio assobia", times: 4 },
        { id: "r4-alt-compensacao-5", text: "A compensação final é de 5 ou mais minutos", times: 5 },
      ],
    },
  ],
  // Acontecimentos objetivos e inequívocos. Podem repetir entre rondas, nunca na mesma ronda.
  // Se coincidirem com uma regra geral (ex.: penálti), aplicam-se as duas.
  rareEvents: [
    { id: "raro-poste-barra", text: "Bola no poste ou na barra", times: 6 },
    { id: "raro-penalti", text: "Há um penálti", times: 6 },
    { id: "raro-gr-defende-penalti", text: "O guarda-redes defende um penálti", times: 6 },
    { id: "raro-var-muda-decisao", text: "O VAR muda uma decisão do árbitro", times: 6 },
    { id: "raro-golo-anulado", text: "Um golo é anulado", times: 6 },
    { id: "raro-vermelho", text: "Cartão vermelho", times: 6 },
    { id: "raro-autogolo", text: "Autogolo", times: 6 },
    { id: "raro-golo-livre-direto", text: "Golo de livre direto", times: 6 },
    { id: "raro-golo-cabeca", text: "Golo de cabeça", times: 6 },
    { id: "raro-golo-fora-area", text: "Golo de fora da área", times: 6 },
    { id: "raro-golo-canto", text: "Golo na sequência de um canto", times: 6 },
    { id: "raro-substituicao-lesao", text: "Substituição por lesão", times: 6 },
  ],
  globalRules: [
    { text: "Golo de Portugal", times: 2 },
    { text: "Golo da Dinamarca", times: 1 },
    { text: "Penálti para qualquer equipa", times: 2 },
    { text: "Golo anulado pelo VAR", times: 2 },
    { text: "Cartão vermelho", times: 3 },
  ],
};
