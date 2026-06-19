<template>
    <footer class="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10 px-4 overflow-hidden">
        <div class="container mx-auto max-w-7xl">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">

                <!-- Coluna 1: Marca -->
                <div class="col-span-2 lg:col-span-1">
                    <a href="/" class="flex items-center gap-3 mb-6">
                        <img src="/duckbio.png" alt="QuackLinks — logo da plataforma de biolinks" class="w-8 h-auto" />
                        <span class="font-bold text-xl tracking-tight text-white">
                            Quack<span class="text-amber-400">Links</span>
                        </span>
                    </a>
                    <p class="text-slate-500 text-sm leading-relaxed mb-6">
                        QuackLinks é a solução definitiva para organizar sua presença online com estilo, velocidade e simplicidade. Crie sua página de links na bio em quacklinks.com.br.
                    </p>
                    <div class="flex gap-4">
                        <!-- Ícones Sociais (Exemplo) -->
                        <a :href="githubUrl" target="_blank"
                            class="text-slate-500 hover:text-amber-400 transition-colors">
                            <Github :size="20" />
                        </a>
                    </div>
                </div>

                <!-- Coluna 2: Dashboard -->
                <div>
                    <h5 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Dashboard</h5>
                    <ul class="space-y-4">
                        <li v-for="link in navDashboard" :key="link.label">
                            <a :href="link.href" class="text-slate-500 hover:text-white text-sm transition-colors">{{
                                link.label }}</a>
                        </li>
                    </ul>
                </div>

                <!-- Coluna 3: Produto -->
                <div>
                    <h5 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Produto</h5>
                    <ul class="space-y-4">
                        <li v-for="link in navProduct" :key="link.label">
                            <a :href="link.href" class="text-slate-500 hover:text-white text-sm transition-colors">{{
                                link.label }}</a>
                        </li>
                    </ul>
                </div>

                <!-- Coluna 4: Recursos -->
                <div>
                    <h5 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Recursos</h5>
                    <ul class="space-y-4">
                        <li v-for="link in navResources" :key="link.label">
                            <a :href="link.href" class="text-slate-500 hover:text-white text-sm transition-colors">{{
                                link.label }}</a>
                        </li>
                    </ul>
                </div>

                <!-- Coluna 5: GitHub / Externos -->
                <div>
                    <h5 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Open Source</h5>
                    <ul class="space-y-4">
                        <li>
                            <a :href="githubUrl" target="_blank"
                                class="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors group">
                                Meu GitHub
                                <ExternalLink :size="14" class="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </li>
                        <li>
                            <a :href="`${githubUrl}/quacklinks`" target="_blank"
                                class="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors group">
                                Repositório
                                <ExternalLink :size="14" class="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom Footer -->
            <div class="pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4">
                <p class="text-slate-600 text-xs">
                    © 2026 QuackLinks. Desenvolvido com ❤️ para a comunidade.
                </p>
                <div class="flex gap-8 text-xs text-slate-600">
                    <a href="#" class="hover:text-slate-400">Privacidade</a>
                    <a href="#" class="hover:text-slate-400">Termos</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { Github, ExternalLink } from 'lucide-vue-next';

// Link do GitHub Parametrizável
const githubUrl = "https://github.com/seu-usuario";

const navDashboard = [
    { label: 'Visão geral', href: '/dashboard/overview' },
    { label: 'Páginas', href: '/dashboard/pages' },
    { label: 'Personalização', href: '/dashboard/appearance' },
    { label: 'Modelos', href: '/dashboard/templates' },
    { label: 'Análises', href: '/analytics' },
    { label: 'Planos', href: '/dashboard/plans' },
];

const navProduct = [
    { label: 'Como funciona', href: '#explore' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Criar conta', href: '/register' },
    { label: 'Entrar', href: '/login' },
];

const navResources = [
    { label: 'Documentação', href: '#' },
    { label: 'Suporte', href: '#' },
    { label: 'Integrações', href: '#' },
    { label: 'API', href: '#' },
];
</script>
