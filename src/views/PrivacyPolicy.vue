<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <DashboardLayout>
      <div class="max-w-3xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-black mb-8">Política de Privacidade</h1>
        
        <div class="prose prose-invert prose-amber max-w-none space-y-8 text-slate-300">
          <p class="text-lg">Última atualização: Janeiro de 2026</p>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">1. Introdução</h2>
            <p>
              A QuackLinks ("nós", "nosso" ou "plataforma") se compromete a proteger sua privacidade. 
              Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações pessoais.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">2. Informações que Coletamos</h2>
            <p>Coletamos as seguintes informações:</p>
            <ul class="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Dados de conta:</strong> nome, email e senha que você fornece ao criar uma conta.</li>
              <li><strong>Dados do perfil:</strong> nome de usuário, avatar, bio e links que você adiciona à sua página.</li>
              <li><strong>Dados de uso:</strong> informações sobre como você usa a plataforma, incluindo cliques nos links.</li>
              <li><strong>Dados de integrações:</strong> quando você conecta serviços como Discord ou Spotify.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">3. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul class="list-disc pl-6 space-y-2 mt-4">
              <li>Fornecer e manter nossa plataforma;</li>
              <li>Permitir que você crie e gerencie sua página de links;</li>
              <li>Mostrar análises de cliques nos seus links;</li>
              <li>Comunicar-se com você sobre sua conta;</li>
              <li>Proteger contra fraudes e abuses.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">4. Compartilhamento de Dados</h2>
            <p>
              Não vendemos seus dados pessoais. Compartilhamos informações apenas quando necessário para 
              fornecer nossos serviços (como integração com Discord ou Spotify) ou quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">5. Cookies</h2>
            <p>
              Utilizamos cookies para manter sua sessão ativa e melhorar sua experiência. Você pode 
              desativar cookies nas configurações do seu navegador, mas algumas funcionalidades podem 
              não funcionar corretamente.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">6. Segurança</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados, 
              incluindo criptografia de senhas e conexões (HTTPS).
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">7. Seus Direitos</h2>
            <p>Você tem direito a:</p>
            <ul class="list-disc pl-6 space-y-2 mt-4">
              <li>Acessar seus dados pessoais;</li>
              <li>Corrigir dados incorretos;</li>
              <li>Solicitar a exclusão da sua conta;</li>
              <li>Exportar seus dados.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">8. Contato</h2>
            <p>
              Para questões sobre esta política ou sobre seus dados, entre em contato pelo email: 
              <a href="mailto:contato@quacklinks.com.br" class="text-amber-400 hover:underline">contato@quacklinks.com.br</a>
            </p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  </div>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue';
</script>
