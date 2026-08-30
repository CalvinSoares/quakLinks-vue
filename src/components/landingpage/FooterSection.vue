<template>
    <footer class="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10 px-4 overflow-hidden">
        <div class="container mx-auto max-w-7xl">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">

                <!-- Coluna 1: Marca -->
                <div class="col-span-2 lg:col-span-1">
                    <a href="/" class="flex items-center gap-3 mb-6">
                        <img src="/duckbio.png" alt="QuackLinks — logo da plataforma de biolinks" class="w-8 h-auto" />
                        <span class="font-bold text-xl tracking-tight text-white">
                            Quack<span class="text-amber-400">Links</span>
                        </span>
                    </a>
                    <p class="text-slate-500 text-sm leading-relaxed mb-6">
                        Todos os seus links num lugar só. Crie sua página de links na bio em segundos.
                    </p>
                    <div class="flex gap-4">
                        <a href="https://github.com/CalvinSoares" target="_blank"
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

                <!-- Coluna 4: Legal -->
                <div>
                    <h5 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Legal</h5>
                    <ul class="space-y-4">
                        <li>
                            <a href="/privacidade"
                                class="text-slate-500 hover:text-white text-sm transition-colors">Política de
                                Privacidade</a>
                        </li>
                        <li>
                            <a href="/termos" class="text-slate-500 hover:text-white text-sm transition-colors">Termos
                                de Uso</a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom Footer -->
            <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-slate-600 text-xs">
                    © 2026 QuackLinks. Feito com ❤️
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { Github } from 'lucide-vue-next';

const navDashboard = [
    { label: 'Visão geral', href: '/dashboard/overview' },
    { label: 'Páginas', href: '/dashboard/pages' },
    { label: 'Personalização', href: '/dashboard/appearance' },
    { label: 'Modelos', href: '/dashboard/templates' },
    { label: 'Planos', href: '/dashboard/plans' },
];

const navProduct = [
    { label: 'Como funciona', href: '#explore' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Criar conta', href: '/register' },
    { label: 'Entrar', href: '/login' },
];
</script>
