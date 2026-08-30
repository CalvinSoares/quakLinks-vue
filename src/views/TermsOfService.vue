<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <DashboardLayout>
      <div class="max-w-3xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-black mb-8">Termos de Uso</h1>
        
        <div class="prose prose-invert prose-amber max-w-none space-y-8 text-slate-300">
          <p class="text-lg">Última atualização: Janeiro de 2026</p>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a plataforma QuackLinks, você concorda em cumprir estes Termos de Uso. 
              Se você não concorda com qualquer parte destes termos, não deve usar nossa plataforma.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">2. Descrição do Serviço</h2>
            <p>
              A QuackLinks é uma plataforma que permite criar e gerenciar páginas de links na bio. 
              Oferecemos um plano gratuito com funcionalidades básicas e planos premium com recursos adicionais.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">3. Conta do Usuário</h2>
            <p>Para usar a plataforma, você deve:</p>
            <ul class="list-disc pl-6 space-y-2 mt-4">
              <li>Ter pelo menos 13 anos de idade;</li>
              <li>Fornecer informações verdadeiras e completas;</li>
              <li>Manter a segurança da sua conta (senha);</li>
              <li>Ser responsável por todas as atividades na sua conta.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">4. Uso Aceitável</h2>
            <p>Você concorda em:</p>
            <ul class="list-disc pl-6 space-y-2 mt-4">
              <li>Não usar a plataforma para atividades ilegais;</li>
              <li>Não publicar conteúdo que viole direitos de terceiros;</li>
              <li>Não tentar hackear, sobrecarregar ou danificar a plataforma;</li>
              <li>Não usar a plataforma para spam ou scams;</li>
              <li>Não infringir propriedade intelectual de terceiros.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">5. Conteúdo do Usuário</h2>
            <p>
              Você mantém a propriedade do conteúdo que publica na sua página. Ao usar a plataforma, 
              você nos concede uma licença limitada para exibir seu conteúdo. Você é o único responsável 
              pelo conteúdo que publica.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">6. Planos e Pagamentos</h2>
            <p>
              Oferecemos planos gratuitos e premium. Os planos premium são cobrados conforme o período 
              escolhido. Você pode cancelar sua assinatura a qualquer momento. Não oferecemos reembolso 
              por períodos já pagos, exceto em casos especiais a nosso critério.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">7. Isenção de Responsabilidade</h2>
            <p>
              A plataforma é fornecida "como está". Não garantimos que a plataforma estará sempre 
              disponível ou livre de erros. Não somos responsáveis por qualquer dano decorrente do uso 
              da plataforma.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">8. Limitação de Responsabilidade</h2>
            <p>
              Na medida máxima permitida por lei, a QuackLinks não será responsável por quaisquer danos 
              indiretos, incidentais, especiais ou consequentes decorrentes do uso da plataforma.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">9. Modificações</h2>
            <p>
              Reservamos o direito de modificar estes termos a qualquer momento. Notificaremos sobre 
              mudanças significativas. O uso continuado da plataforma após as mudanças constitui 
              aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">10. Rescisão</h2>
            <p>
              Podemos suspender ou encerrar sua conta se você violar estes termos. Você pode excluir 
              sua conta a qualquer momento através das configurações.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-white mb-4">11. Contato</h2>
            <p>
              Para questões sobre estes termos, entre em contato pelo email: 
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
