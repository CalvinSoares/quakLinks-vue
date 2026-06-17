export interface PlanFeature {
  label: string;
  free: boolean | string;
  premium: boolean | string;
}

export interface PlanTier {
  id: "free" | "premium";
  name: string;
  priceLabel: string;
  description: string;
  ctaLabel: string;
  highlight?: boolean;
}

export const planTiers: PlanTier[] = [
  {
    id: "free",
    name: "Free",
    priceLabel: "R$ 0",
    description: "Para começar sua página e publicar seus links essenciais.",
    ctaLabel: "Seu plano atual",
  },
  {
    id: "premium",
    name: "Premium",
    priceLabel: "Upgrade",
    description:
      "Para destravar personalização avançada, mídia e recursos profissionais.",
    ctaLabel: "Assinar Premium",
    highlight: true,
  },
];

export const planFeatures: PlanFeature[] = [
  { label: "Avatar e imagem de fundo", free: true, premium: true },
  { label: "Gradientes e estilos visuais", free: true, premium: true },
  { label: "Vídeo no background", free: false, premium: true },
  { label: "Cursor personalizado", free: false, premium: true },
  { label: "Playlist e player de áudio", free: false, premium: true },
  { label: "Agendamento de links", free: false, premium: true },
  { label: "Domínio personalizado", free: false, premium: true },
  { label: "Efeito Máquina de Escrever", free: false, premium: true },
  { label: "Templates e assets premium", free: false, premium: true },
];

export const premiumHighlights = [
  "Remova fricção ao desbloquear vídeo, áudio, cursor e domínio personalizado.",
  "Ganhe recursos pensados para páginas mais ricas e com mais identidade visual.",
  "Tenha um caminho único de upgrade em vez de descobrir o plano por tentativa e erro.",
];
