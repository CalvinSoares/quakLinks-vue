<template>
    <div class="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-400 selection:text-slate-900">
        <slot />
    </div>
</template>

<script setup>
// Layout público, sem sidebar e sem header do dashboard.
// Usado em páginas acessíveis sem autenticação (privacidade, termos, etc).
</script>
