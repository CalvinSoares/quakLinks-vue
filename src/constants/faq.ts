export interface FaqItem {
  question: string;
  answer: string;
}

export const landingFaqItems: FaqItem[] = [
  {
    question: "O que é o QuackLinks?",
    answer:
      "QuackLinks é uma plataforma brasileira de biolinks para criar sua página de links na bio. Com o QuackLinks você centraliza redes sociais, links e identidade visual em um único perfil em quacklinks.com.br.",
  },
  {
    question: "Como funciona a landing?",
    answer:
      'Você navega pelas seções e vê exemplos reais do produto. Comece pelo <a href="#explore">Explore</a> para ver a animação e estilos, depois confira <a href="#features">Recursos</a> e <a href="#pricing">Planos</a>.',
  },
  {
    question: "Quais seções existem aqui?",
    answer:
      'A landing tem: <a href="#explore">Explore</a>, <a href="#features">Recursos</a>, <a href="#pricing">Planos</a> e este <a href="#faq">FAQ</a>. Tudo foi organizado para você entender o produto sem cair em páginas inexistentes.',
  },
  {
    question: "Como faço para começar no QuackLinks?",
    answer:
      'Crie sua conta gratuita em <a href="/register">quacklinks.com.br/register</a>. Depois você consegue criar e editar suas páginas de biolink no painel.',
  },
  {
    question: "Qual a diferença entre Free e Premium?",
    answer:
      'O Free cobre a base para publicar links e montar a identidade visual. O Premium destrava mídia (vídeo/áudio), cursor personalizado, agendamento, domínio personalizado e extras. Veja a comparação em <a href="#pricing">Planos</a>.',
  },
  {
    question: "Posso usar vídeo no fundo e domínio personalizado?",
    answer:
      'Esses recursos fazem parte do Premium do QuackLinks. A lista completa do que destrava está em <a href="#pricing">Planos</a>.',
  },
  {
    question: "Onde vejo detalhes e faço upgrade?",
    answer:
      'Depois de criar conta no QuackLinks, você consegue ver e iniciar o upgrade em <a href="/dashboard/plans">/dashboard/plans</a>.',
  },
];
