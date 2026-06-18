<template>
    <section id="faq" class="py-24 px-4 bg-[#0a0a0a] relative overflow-hidden">
        <!-- Efeito de luz de fundo -->
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/5 blur-[120px] pointer-events-none">
        </div>

        <div class="container mx-auto max-w-3xl relative z-10">
            <div v-observe class="scroll-hidden text-center mb-16">
                <h3 class="text-4xl font-bold mb-4">
                    Perguntas <span class="text-amber-400">Frequentes</span>
                </h3>
                <p class="text-slate-400">Tudo o que você precisa saber para começar sua bio.</p>
            </div>

            <div class="space-y-4">
                <div v-for="(item, index) in faqItems" :key="index" v-observe class="scroll-hidden group"
                    :style="{ transitionDelay: `${index * 100}ms` }">
                    <div @click="toggle(index)"
                        class="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-amber-500/30 transition-all duration-300 cursor-pointer select-none"
                        :class="{ 'border-amber-500/50 bg-slate-900': activeIndex === index }">
                        <div class="flex items-center justify-between gap-4">
                            <h4 class="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                                {{ item.question }}
                            </h4>
                            <div class="shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-500"
                                :class="{ 'rotate-180 bg-amber-400 text-slate-900': activeIndex === index }">
                                <ChevronDown :size="18" />
                            </div>
                        </div>

                        <div class="grid transition-all duration-500 ease-in-out"
                            :class="activeIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'">
                            <div class="overflow-hidden text-slate-400 leading-relaxed faq-answer" v-html="item.answer">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const activeIndex = ref(null);

const toggle = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
};

const faqItems = [
    {
        question: "Como funciona a landing?",
        answer: "Você navega pelas seções e vê exemplos reais do produto. Comece pelo <a href=\"#explore\">Explore</a> para ver a animação e estilos, depois confira <a href=\"#features\">Recursos</a> e <a href=\"#pricing\">Planos</a>."
    },
    {
        question: "Quais seções existem aqui?",
        answer: "A landing tem: <a href=\"#explore\">Explore</a>, <a href=\"#features\">Recursos</a>, <a href=\"#pricing\">Planos</a> e este <a href=\"#faq\">FAQ</a>. Tudo foi organizado para você entender o produto sem cair em páginas inexistentes."
    },
    {
        question: "Como faço para começar?",
        answer: "Crie sua conta em <a href=\"/register\">/register</a>. Depois você consegue criar e editar suas páginas no painel."
    },
    {
        question: "Qual a diferença entre Free e Premium?",
        answer: "O Free cobre a base para publicar links e montar a identidade visual. O Premium destrava mídia (vídeo/áudio), cursor personalizado, agendamento, domínio personalizado e extras. Veja a comparação em <a href=\"#pricing\">Planos</a>."
    },
    {
        question: "Posso usar vídeo no fundo e domínio personalizado?",
        answer: "Esses recursos fazem parte do Premium. A lista completa do que destrava está em <a href=\"#pricing\">Planos</a>."
    },
    {
        question: "Onde vejo detalhes e faço upgrade?",
        answer: "Depois de criar conta, você consegue ver e iniciar o upgrade em <a href=\"/dashboard/plans\">/dashboard/plans</a>."
    }
];
</script>

<style scoped>
.faq-answer :deep(a) {
    color: rgba(251, 191, 36, 1);
    font-weight: 600;
    text-decoration: none;
}

.faq-answer :deep(a:hover) {
    text-decoration: underline;
}
</style>
