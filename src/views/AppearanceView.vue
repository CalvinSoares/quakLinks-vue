<template>
  <DashboardLayout>
    <div class="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0B0F19] text-white font-sans rounded-lg shadow-lg">

      <aside
        class="w-full lg:w-[480px] flex flex-col border-r border-slate-800/60 bg-[#0F172A] relative z-20 shadow-2xl">

        <div class="px-6 py-5 border-b border-slate-800/60 bg-[#0F172A] z-10">

          <div v-if="!isEditingPage" class="flex items-center justify-between mb-4">
            <h1 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="w-2 h-6 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-full"></span>
              Selecionar Página
            </h1>
          </div>


          <div v-if="isEditingPage" class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <button @click="handleBackToSelection"
                class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Voltar para seleção">
                <ArrowLeftIcon class="w-5 h-5" />
              </button>
              <h1 class="text-xl font-bold text-white flex items-center gap-2">
                <span class="w-2 h-6 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full"></span>
                Editor
              </h1>
            </div>

            <button @click="saveChanges" :disabled="isSaving || !isDirty"
              class="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
              <span v-if="isSaving"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isSaving ? 'Salvando...' : 'Publicar' }}
            </button>
          </div>

          <div v-if="isEditingPage" class="p-1 bg-slate-900/50 rounded-xl border border-slate-800/50 flex">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
              class="flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-300"
              :class="activeTab === tab.id ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'">
              <component :is="tab.icon" class="w-4 h-4" />
              <span class="hidden sm:inline">{{ tab.label }}</span>
            </button>
            <button @click="activeTab = 'blocks'"
              class="flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-300"
              :class="activeTab === 'blocks' ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300'">
              <BrandRedhatIcon class="w-4 h-4" />
              <span>Blocos</span>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-20">

          <transition name="fade" mode="out-in">

            <div v-if="!isEditingPage" key="selection-mode" class="space-y-4">
              <p class="text-sm text-slate-400 mb-4">Escolha qual página você deseja editar:</p>

              <div v-if="pageStore.isLoading" class="text-center py-8">
                <span class="loading-spinner"></span> Carregando páginas...
              </div>

              <div v-else class="space-y-3">
                <button v-for="page in pageStore.userPages" :key="page.id" @click="selectPage(page.slug)"
                  class="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800 transition-all group text-left">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      {{ page.title?.charAt(0).toUpperCase() || 'P' }}
                    </div>
                    <div>
                      <h4 class="font-bold text-white group-hover:text-indigo-400 transition-colors">{{ page.title ||
                        'Sem Título' }}</h4>
                      <p class="text-xs text-slate-500">/{{ page.slug }}</p>
                    </div>
                  </div>
                  <ChevronRightIcon class="w-5 h-5 text-slate-600 group-hover:text-white" />
                </button>

                <router-link to="/dashboard/pages"
                  class="w-full flex items-center justify-center p-4 border border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition-all gap-2 mt-4">
                  <PlusIcon class="w-5 h-5" /> Gerenciar Páginas
                </router-link>
              </div>
            </div>

            <div v-else key="edit-mode">

              <div v-if="activeTab === 'profile'" key="profile" class="space-y-6">


                <section class="group-section">
                  <h3 class="section-title">Identidade</h3>
                  <div class="space-y-4">

                    <div v-if="authStore.user?.googleImage"
                      class="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border transition-all"
                      :class="form.imageProvider === 'GOOGLE' ? 'border-slate-600 bg-slate-800/50' : 'border-slate-800/50 hover:border-slate-700'">
                      <div class="flex items-center gap-3">
                        <div class="relative">
                          <img :src="authStore.user.googleImage"
                            class="w-10 h-10 rounded-full ring-2 ring-slate-800 object-cover" />

                          <div class="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-slate-700">
                            <svg class="w-3 h-3" viewBox="0 0 24 24">
                              <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4" />
                              <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853" />
                              <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05" />
                              <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335" />
                            </svg>
                          </div>
                        </div>
                        <div class="flex flex-col">
                          <span class="text-sm font-medium text-white">Usar Google</span>
                          <span class="text-xs text-slate-500">Sincronizar foto do perfil</span>
                        </div>
                      </div>

                      <SwitchToggle :model-value="form.imageProvider === 'GOOGLE'"
                        @update:model-value="(val) => form.imageProvider = val ? 'GOOGLE' : 'LOCAL'" />
                    </div>


                    <div v-if="authStore.user?.discordImage"
                      class="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border transition-all"
                      :class="form.imageProvider === 'DISCORD' ? 'border-[#5865F2]/50 bg-[#5865F2]/10' : 'border-slate-800/50 hover:border-slate-700'">
                      <div class="flex items-center gap-3">
                        <div class="relative">
                          <img :src="authStore.user.discordImage"
                            class="w-10 h-10 rounded-full ring-2 ring-slate-800 object-cover" />

                          <div
                            class="absolute -bottom-1 -right-1 bg-[#5865F2] rounded-full p-0.5 border border-slate-700">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path
                                d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.486 13.486 0 0 0-.479 1.583 18.318 18.318 0 0 0-5.748 0 13.486 13.486 0 0 0-.48-1.583.076.076 0 0 0-.078-.037 19.793 19.793 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                            </svg>
                          </div>
                        </div>
                        <div class="flex flex-col">
                          <span class="text-sm font-medium text-white">Usar Discord</span>
                          <span class="text-xs text-slate-500">Sincronizar foto do perfil</span>
                        </div>
                      </div>

                      <SwitchToggle :model-value="form.imageProvider === 'DISCORD'"
                        @update:model-value="(val) => form.imageProvider = val ? 'DISCORD' : 'LOCAL'" />
                    </div>


                    <transition name="fade">
                      <div v-if="form.imageProvider === 'LOCAL'">
                        <AssetUploader title="Upload Avatar Personalizado" :current-url="form.avatarUrl"
                          upload-type="avatar" accepted-files="image/*" @upload="handleAssetChange"
                          @remove="removeAsset" />
                      </div>
                    </transition>

                  </div>
                </section>


                <section class="group-section">
                  <h3 class="section-title">Informações</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="input-label">Nome de Exibição</label>
                      <div class="relative">
                        <input v-model="form.title" type="text" class="input-modern" placeholder="Ex: @seunome" />
                        <button @click="isEffectsModalOpen = true"
                          class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-yellow-400 transition-colors"
                          title="Efeitos do Texto">
                          <IconSparkles class="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label class="input-label">Bio</label>
                      <textarea v-model="form.bio" rows="3" class="input-modern resize-none"
                        placeholder="Conte um pouco sobre você..." maxlength="200"></textarea>
                      <div class="text-right mt-1 text-[10px] text-slate-500 font-mono">{{ form.bio.length }}/200</div>
                    </div>

                    <div>
                      <label class="input-label">Localização</label>
                      <div class="relative">

                        <input v-model="form.location" type="text" class="input-modern pl-9" placeholder="Cidade, País"
                          maxlength="10" />
                        <div class="text-right mt-1 text-[10px] text-slate-500 font-mono">{{ form.location.length }}/10
                        </div>

                      </div>
                    </div>
                  </div>
                </section>
              </div>


              <div v-else-if="activeTab === 'style'" key="style" class="space-y-8">


                <section class="group-section">
                  <h3 class="section-title">Layout dos Links</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <button v-for="layout in [
                      { id: 'list', label: 'Lista', icon: 'list' },
                      { id: 'grid', label: 'Grade', icon: 'grid' },
                      { id: 'icons_only', label: 'Ícones', icon: 'apps' },
                      { id: 'stacked', label: 'Empilhado', icon: 'stack' }
                    ]" :key="layout.id" @click="form.layoutLinkStyle = layout.id"
                      class="relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group hover:bg-slate-800/50"
                      :class="form.layoutLinkStyle === layout.id ? 'border-yellow-500 bg-yellow-500/5' : 'border-slate-800 bg-slate-900/30 text-slate-400'">


                      <div class="w-full h-12 rounded bg-slate-800/50 flex items-center justify-center p-2">
                        <div v-if="layout.id === 'list'" class="w-full space-y-1">
                          <div class="h-2 bg-slate-600 rounded w-full"></div>
                          <div class="h-2 bg-slate-600 rounded w-3/4"></div>
                        </div>
                        <div v-if="layout.id === 'grid'" class="grid grid-cols-2 gap-1 w-full">
                          <div class="aspect-square bg-slate-600 rounded"></div>
                          <div class="aspect-square bg-slate-600 rounded"></div>
                        </div>
                        <div v-if="layout.id === 'icons_only'" class="flex gap-1">
                          <div class="w-4 h-4 rounded-full bg-slate-600"></div>
                          <div class="w-4 h-4 rounded-full bg-slate-600"></div>
                        </div>
                        <div v-if="layout.id === 'stacked'" class="flex flex-col items-center gap-1 w-full">
                          <div class="w-4 h-4 rounded bg-slate-600"></div>
                          <div class="h-1 w-1/2 bg-slate-600 rounded"></div>
                        </div>
                      </div>
                      <span class="text-xs font-semibold">{{ layout.label }}</span>
                    </button>
                  </div>
                </section>


                <section class="group-section">
                  <h3 class="section-title">Tema dos Botões</h3>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button v-for="styleOption in [
                      { id: 'classic', label: 'Clássico' },
                      { id: 'minimal', label: 'Minimal' },
                      { id: 'brutalist', label: 'Brutalista' },
                      { id: 'spotlight', label: 'Spotlight' },
                      { id: 'pixel', label: 'Pixel' },
                      { id: 'torn', label: 'Rasgado' }
                    ]" :key="styleOption.id" @click="form.linkStyle = styleOption.id"
                      class="px-2 py-3 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center text-center"
                      :class="form.linkStyle === styleOption.id
                        ? 'border-yellow-500 text-white bg-yellow-500/10'
                        : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800/30'">
                      {{ styleOption.label }}
                    </button>
                  </div>
                </section>


                <section class="group-section">
                  <h3 class="section-title">Paleta de Cores</h3>
                  <div class="space-y-4">
                    <ColorPicker id="textColor" label="Texto Principal" v-model="form.textColor" />

                    <ColorPicker id="btnColor" label="Fundo do Botão" :model-value="form.buttonColor ?? '#000000'"
                      @update:model-value="(val) => form.buttonColor = val" :disabled="form.linkStyle === 'minimal'" />


                    <div class="pt-4 border-t border-slate-800/50">
                      <div class="flex items-center justify-between mb-3">
                        <label class="text-xs text-slate-400 font-medium">Ícones Coloridos (Marca)</label>
                        <SwitchToggle v-model="form.useStandardIconColors" />
                      </div>
                      <transition name="fade">
                        <ColorPicker v-if="!form.useStandardIconColors" id="iconColor"
                          label="Cor Personalizada dos Ícones" v-model="form.iconColor" />
                      </transition>
                    </div>
                  </div>
                </section>


                <section class="group-section">
                  <h3 class="section-title">Tipografia & Forma</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                      <label class="input-label">Fonte</label>
                      <select v-model="form.fontFamily" class="input-modern">
                        <option value="Inter">Modern (Inter)</option>
                        <option value="Roboto Mono">Tech (Mono)</option>
                        <option value="'Press Start 2P'">Retro (Pixel)</option>
                        <option value="Cinzel">Fantasy (Cinzel)</option>
                        <option value="Playfair Display">Elegant (Serif)</option>
                      </select>
                    </div>
                    <div>
                      <label class="input-label">Bordas</label>
                      <select v-model="form.buttonRoundness" class="input-modern">
                        <option value="rounded-none">Quadrado</option>
                        <option value="rounded-md">Suave</option>
                        <option value="rounded-xl">Curvo</option>
                        <option value="rounded-full">Pílula</option>
                      </select>
                    </div>
                    <div>
                      <label class="input-label">Sombra</label>
                      <div
                        class="h-[42px] flex items-center px-3 bg-slate-950 border border-slate-800 rounded-lg justify-between">
                        <span class="text-xs text-slate-400">Ativar</span>
                        <SwitchToggle v-model="form.buttonShadow" />
                      </div>
                    </div>
                  </div>
                </section>
              </div>



              <div v-else-if="activeTab === 'background'" key="background" class="space-y-6">

                <section class="group-section">
                  <h3 class="section-title">Layout da Página</h3>
                  <div class="grid grid-cols-3 gap-3">

                    <button @click="changeLayout('standard')" class="group relative flex flex-col gap-2 cursor-pointer">
                      <div class="w-full aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all bg-slate-800"
                        :class="form.pageLayout === 'standard' ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-slate-700 hover:border-slate-500'">
                        <div class="w-full h-full flex flex-col items-center justify-center gap-2 pt-4">
                          <div class="w-8 h-8 rounded-full bg-slate-600"></div>
                          <div class="w-12 h-2 rounded bg-slate-700"></div>
                          <div class="w-10 h-1.5 rounded bg-slate-700/50 mt-1"></div>
                        </div>
                      </div>
                      <span class="text-xs font-medium text-center"
                        :class="form.pageLayout === 'standard' ? 'text-yellow-500' : 'text-slate-400'">Padrão</span>
                    </button>


                    <button @click="changeLayout('banner')" class="group relative flex flex-col gap-2 cursor-pointer">
                      <div class="w-full aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all bg-slate-900"
                        :class="form.pageLayout === 'banner' ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-slate-700 hover:border-slate-500'">
                        <div class="h-[35%] bg-slate-700 w-full border-b border-white/5"></div>
                        <div class="flex-1 bg-slate-800/50 flex justify-center">
                          <div class="w-8 h-8 -mt-4 rounded-full bg-slate-600 border-2 border-slate-800"></div>
                        </div>
                      </div>
                      <span class="text-xs font-medium text-center"
                        :class="form.pageLayout === 'banner' ? 'text-yellow-500' : 'text-slate-400'">Banner</span>
                    </button>


                    <button @click="changeLayout('portrait')" class="group relative flex flex-col gap-2 cursor-pointer">
                      <div class="w-full aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all bg-slate-900"
                        :class="form.pageLayout === 'portrait' ? 'border-yellow-500 ring-2 ring-yellow-500/20' : 'border-slate-700 hover:border-slate-500'">
                        <div class="h-[55%] bg-slate-700 w-full border-b border-white/5"></div>
                        <div class="flex-1 bg-slate-800/50 relative">
                          <div
                            class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800">
                          </div>
                        </div>
                      </div>
                      <span class="text-xs font-medium text-center"
                        :class="form.pageLayout === 'portrait' ? 'text-yellow-500' : 'text-slate-400'">Retrato</span>
                    </button>
                  </div>
                </section>

                <div class="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button v-for="type in availableBackgroundTabs" :key="type" @click="form.backgroundType = type"
                    class="flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-all"
                    :class="form.backgroundType === type ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'">
                    {{ type === 'solid' ? 'Cor' : (type === 'gradient' ? 'Gradiente' : (type === 'image' ? 'Imagem' :
                      'Vídeo')) }}
                  </button>
                </div>

                <div class="group-section min-h-[240px]">
                  <transition name="fade" mode="out-in">


                    <div v-if="form.pageLayout === 'standard'" key="standard-content" class="space-y-5">

                      <div v-if="form.backgroundType === 'solid'">
                        <ColorPicker id="bgColor" label="Cor de Fundo" v-model="form.backgroundColor" />
                      </div>

                      <div v-else-if="form.backgroundType === 'gradient'" class="space-y-4">
                        <div>
                          <label class="input-label">Direção</label>
                          <div class="grid grid-cols-4 gap-2">
                            <button v-for="dir in ['to bottom', 'to right', 'to top right', 'to bottom right']"
                              :key="dir" @click="form.gradientDirection = dir"
                              class="h-9 rounded-lg border flex items-center justify-center bg-slate-950 hover:border-yellow-500 transition-all"
                              :class="form.gradientDirection === dir ? 'border-yellow-500 ring-1 ring-yellow-500/50' : 'border-slate-800'">
                              <div class="w-5 h-5 rounded bg-gradient-to-br from-white/30 to-transparent"
                                :style="{ background: `linear-gradient(${dir}, rgba(255,255,255,0.4), transparent)` }">
                              </div>
                            </button>
                          </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                          <ColorPicker id="gradA_std" label="Início" v-model="form.gradientColorA" />
                          <ColorPicker id="gradB_std" label="Fim" v-model="form.gradientColorB" />
                        </div>
                      </div>

                      <div v-else-if="form.backgroundType === 'image'" class="space-y-4">
                        <AssetUploader title="Upload Imagem" :current-url="form.backgroundUrl" upload-type="background"
                          accepted-files="image/*" @upload="handleAssetChange" @remove="removeAsset" />
                        <div class="space-y-2">
                          <label class="input-label flex justify-between"><span>Blur</span><span
                              class="text-yellow-500">{{
                                form.backgroundBlur }}px</span></label>
                          <input type="range" v-model.number="form.backgroundBlur" min="0" max="20"
                            class="w-full accent-yellow-500">
                        </div>
                        <div>
                          <label class="input-label">Filtro</label>
                          <select v-model="form.backgroundOverlay" class="input-modern">
                            <option value="none">Nenhum</option>
                            <option value="noise">Noise</option>
                            <option value="scanlines">Scanlines</option>
                            <option value="vignette">Vinheta</option>
                          </select>
                        </div>
                      </div>


                      <div v-else-if="form.backgroundType === 'video'">
                        <AssetUploader title="Upload Vídeo (MP4)" :current-url="form.backgroundVideoUrl"
                          upload-type="video" field-name="backgroundVideoUrl" accepted-files="video/mp4, video/webm"
                          @upload="handleAssetChange" @remove="() => removeAsset('backgroundVideoUrl')" />
                      </div>


                      <section class="group-section">
                        <div class="flex items-center justify-between mb-4">
                          <h3 class="section-title mb-0">Card de Fundo do Perfil</h3>
                          <SwitchToggle v-model="form.showProfileCard" />
                        </div>
                        <transition name="fade">
                          <div v-if="form.showProfileCard" class="space-y-4">
                            <ColorPicker id="cardColor" label="Cor do Card" v-model="form.profileCardColor"
                              show-alpha />
                            <div class="space-y-2">
                              <label class="input-label flex justify-between">
                                <span>Opacidade</span>
                                <span>{{ Math.round(form.profileCardOpacity * 100) }}%</span>
                              </label>
                              <input type="range" v-model.number="form.profileCardOpacity" min="0" max="1" step="0.05"
                                class="w-full accent-yellow-500">
                            </div>
                          </div>
                        </transition>
                      </section>
                    </div>

                    <div v-else key="banner-content" class="space-y-8">


                      <div class="relative pl-3 border-l-2 border-yellow-500/50">
                        <h4 class="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-4">1. Cabeçalho (Topo)
                        </h4>


                        <div v-if="form.backgroundType === 'image'" class="space-y-4">
                          <AssetUploader title="Imagem de Capa" :current-url="form.backgroundUrl"
                            upload-type="background" accepted-files="image/*" @upload="handleAssetChange"
                            @remove="removeAsset" />

                          <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                              <label class="input-label">Blur</label>
                              <input type="range" v-model.number="form.backgroundBlur" min="0" max="20"
                                class="w-full accent-yellow-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer">
                            </div>
                            <div>
                              <label class="input-label">Filtro</label>
                              <select v-model="form.backgroundOverlay" class="input-modern py-1.5">
                                <option value="none">Normal</option>
                                <option value="noise">Ruído</option>
                                <option value="vignette">Vinheta</option>
                              </select>
                            </div>
                          </div>
                        </div>


                        <div v-else>
                          <AssetUploader title="Vídeo de Capa" :current-url="form.backgroundVideoUrl"
                            upload-type="video" field-name="backgroundVideoUrl" accepted-files="video/mp4, video/webm"
                            @upload="handleAssetChange" @remove="() => removeAsset('backgroundVideoUrl')" />
                        </div>
                      </div>



                      <div class="relative pl-3 border-l-2 border-indigo-500/50">
                        <div class="flex items-center justify-between mb-4">
                          <h4 class="text-xs text-indigo-400 font-bold uppercase tracking-wider">2. Fundo da Página</h4>


                          <div class="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                            <button @click="isBodyGradient = false"
                              class="px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all"
                              :class="!isBodyGradient ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'">
                              Sólido
                            </button>
                            <button @click="isBodyGradient = true"
                              class="px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all"
                              :class="isBodyGradient ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'">
                              Gradiente
                            </button>
                          </div>
                        </div>

                        <transition name="fade" mode="out-in">

                          <div v-if="!isBodyGradient" key="body-solid">
                            <ColorPicker id="bodyColor" label="Cor Principal" v-model="form.backgroundColor" />
                          </div>

                          <div v-else key="body-gradient" class="space-y-4">
                            <div>
                              <label class="input-label">Direção</label>
                              <div class="grid grid-cols-4 gap-2">
                                <button v-for="dir in ['to bottom', 'to right', 'to top right', 'to bottom right']"
                                  :key="dir" @click="form.gradientDirection = dir"
                                  class="h-9 rounded-lg border flex items-center justify-center bg-slate-950 hover:border-indigo-500 transition-all"
                                  :class="form.gradientDirection === dir ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-800'">
                                  <div class="w-5 h-5 rounded bg-gradient-to-br from-white/30 to-transparent"
                                    :style="{ background: `linear-gradient(${dir}, rgba(255,255,255,0.4), transparent)` }">
                                  </div>
                                </button>
                              </div>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                              <ColorPicker id="gradA_bnr" label="Início" v-model="form.gradientColorA" />
                              <ColorPicker id="gradB_bnr" label="Fim" v-model="form.gradientColorB" />
                            </div>
                          </div>
                        </transition>
                      </div>


                      <section class="group-section">
                        <div class="flex items-center justify-between mb-4">
                          <h3 class="section-title mb-0">Card de Fundo do Perfil</h3>
                          <SwitchToggle v-model="form.showProfileCard" />
                        </div>
                        <transition name="fade">
                          <div v-if="form.showProfileCard" class="space-y-4">
                            <ColorPicker id="cardColor" label="Cor do Card" v-model="form.profileCardColor"
                              show-alpha />
                            <div class="space-y-2">
                              <label class="input-label flex justify-between">
                                <span>Opacidade</span>
                                <span>{{ Math.round(form.profileCardOpacity * 100) }}%</span>
                              </label>
                              <input type="range" v-model.number="form.profileCardOpacity" min="0" max="1" step="0.05"
                                class="w-full accent-yellow-500">
                            </div>
                          </div>
                        </transition>
                      </section>
                    </div>
                  </transition>
                </div>
              </div>

              <div v-else-if="activeTab === 'extras'" key="extras" class="space-y-6">
                <section class="group-section">
                  <h3 class="section-title">Interatividade</h3>
                  <AssetUploader title="Cursor Personalizado" :current-url="form.cursorUrl" upload-type="cursor"
                    accepted-files="image/png, image/gif, .cur" @upload="handleAssetChange" @remove="removeAsset" />
                </section>

                <section class="group-section">
                  <h3 class="section-title">Áudio & Música</h3>
                  <button @click="isAudioManagerOpen = true"
                    class="w-full py-4 px-4 bg-slate-900 border border-dashed border-slate-700 rounded-xl hover:border-yellow-500 hover:bg-slate-800 transition flex items-center justify-center gap-3 group">
                    <div
                      class="p-2 bg-yellow-500/10 rounded-full text-yellow-500 group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <span class="font-medium text-slate-300 group-hover:text-white">Gerenciar Playlist ({{
                      pageStore.currentPage?.audios?.length || 0 }})</span>
                  </button>
                </section>
              </div>

              <div v-else-if="activeTab === 'blocks'" key="blocks">
                <BlockManager @edit="openBlockEditor" />
              </div>
            </div>


          </transition>
        </div>
      </aside>

      <div v-if="editingBlock" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md space-y-4">
          <h3 class="text-lg font-bold text-white">Editar Bloco</h3>


          <div v-if="editingBlock.type === 'HEADER' || editingBlock.type === 'TEXT'" class="space-y-3">
            <label class="input-label">Texto <span class="text-xs text-gray-500 ml-1">(Máx. 20
                caracteres)</span></label>
            <input v-model="editingBlockContent.text" class="input-modern" maxlength="20" />
            <div class="text-right text-xs text-gray-500 mt-1">{{ editingBlockContent.text?.length || 0 }}/20</div>
          </div>

          <div v-if="editingBlock.type === 'LINK'" class="space-y-3">
            <label class="input-label">Título</label>
            <input v-model="editingBlockContent.title" class="input-modern" />
            <label class="input-label">URL</label>
            <input v-model="editingBlockContent.url" class="input-modern" />
          </div>

          <div v-if="editingBlock.type === 'YOUTUBE_SUBSCRIBE'" class="space-y-3">
            <label class="input-label">ID do Canal (Channel ID)</label>
            <input v-model="editingBlockContent.channelId" class="input-modern"
              placeholder="Ex: UC_x5XG1OV2P6uZZ5FSM9Ttw" />
            <p class="text-[10px] text-gray-500">
              Encontre em: YouTube Studio > Personalização > Info Básica.
            </p>
          </div>


          <div v-if="editingBlock.type === 'PINTEREST'" class="space-y-3">
            <label class="input-label">URL do Pin</label>
            <input v-model="editingBlockContent.url" class="input-modern"
              placeholder="Ex: https://br.pinterest.com/pin/123456/" />
          </div>


          <div v-if="editingBlock.type === 'VIDEO'" class="space-y-3">
            <label class="input-label">URL do Vídeo</label>
            <input v-model="editingBlockContent.url" class="input-modern"
              placeholder="YouTube URL ou Link Direto (.mp4)" />
          </div>

          <div v-if="editingBlock.type === 'COUNTDOWN'" class="space-y-4">
            <div>
              <label class="input-label">Título</label>
              <input v-model="editingBlockContent.title" class="input-modern" />
            </div>
            <div>
              <label class="input-label">Data e Hora</label>
              <input type="datetime-local" v-model="editingBlockContent.date" class="input-modern"
                style="color-scheme: dark;" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="input-label">Texto do Botão <span class="text-[10px] text-slate-500">{{
                  editingBlockContent.buttonText?.length || 0 }}/25</span>
                </label>
                <input v-model="editingBlockContent.buttonText" class="input-modern" maxlength="25" />

              </div>
              <div>
                <label class="input-label">URL</label>
                <input v-model="editingBlockContent.url" class="input-modern" />
              </div>
            </div>
            <div>
              <label class="input-label">Descrição</label>
              <textarea v-model="editingBlockContent.description" class="input-modern" rows="2"></textarea>
            </div>

            <div class="space-y-2 pt-2 border-t border-slate-700">
              <label class="input-label">Ao encerrar:</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-sm text-slate-300">
                  <input type="radio" value="none" v-model="editingBlockContent.endBehavior" class="accent-indigo-500">
                  Nada
                </label>
                <label class="flex items-center gap-2 text-sm text-slate-300">
                  <input type="radio" value="message" v-model="editingBlockContent.endBehavior"
                    class="accent-indigo-500"> Mensagem
                </label>
              </div>
            </div>
            <div v-if="editingBlockContent.endBehavior === 'message'">
              <label class="input-label">Mensagem Final</label>
              <input v-model="editingBlockContent.endMessage" class="input-modern" />
            </div>

            <div class="flex items-center justify-between pt-2">
              <span class="text-sm font-medium text-white">Lembretes</span>
              <SwitchToggle v-model="editingBlockContent.reminders" />
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button @click="editingBlock = null"
              class="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancelar</button>
            <button @click="saveBlockEdit"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold">Salvar</button>
          </div>
        </div>
      </div>


      <main class="flex-1 relative bg-[#0B0F19] flex flex-col overflow-hidden">


        <div class="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style="background-image: radial-gradient(#4b5563 1px, transparent 1px); background-size: 24px 24px;"></div>


        <div v-if="isEditingPage" class="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">

          <div
            class="absolute top-6 z-30 flex items-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full shadow-xl">
            <button @click="previewMode = 'mobile'"
              :class="previewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'"
              class="p-2 rounded-full transition-all">
              <DevicePhoneMobileIcon class="w-5 h-5" />
            </button>
            <div class="w-px h-4 bg-slate-700"></div>
            <button @click="previewMode = 'desktop'"
              :class="previewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'"
              class="p-2 rounded-full transition-all">
              <ComputerDesktopIcon class="w-5 h-5" />
            </button>
          </div>

          <transition name="scale" mode="out-in">
            <div v-if="previewMode === 'mobile'" key="mobile"
              class="relative transition-all h-full duration-500 ease-out origin-center scale-[0.85] lg:scale-[0.9] xl:scale-100">
              <div
                class="relative w-[360px] h-full bg-black rounded-[3rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] border-[8px] border-slate-900 ring-1 ring-slate-800/50 overflow-hidden">
                <div class="w-full h-full bg-slate-950 overflow-y-auto custom-scrollbar">
                  <LivePreview :preview-data="previewData" />
                </div>
              </div>
            </div>

            <div v-else key="desktop"
              class="w-full max-w-5xl h-[80vh] bg-slate-900 rounded-xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
              <div class="flex-1 overflow-y-auto custom-scrollbar bg-black">
                <LivePreview :preview-data="previewData" class="min-h-full" />
              </div>
            </div>
          </transition>
        </div>

        <div v-else
          class="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
          <div class="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CursorArrowRaysIcon class="w-12 h-12 text-slate-500" />
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Nenhuma Página Selecionada</h2>
          <p class="text-slate-400 max-w-md">Selecione uma página no menu à esquerda para começar a editar seu biolink.
          </p>
        </div>

      </main>

      <div v-if="showUnsavedModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div
          class="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl animate-fade-in-up">
          <div class="flex flex-col items-center text-center gap-3">
            <div class="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <ExclamationTriangleIcon class="w-7 h-7" />
            </div>
            <h3 class="text-lg font-bold text-white">Alterações não salvas</h3>
            <p class="text-sm text-slate-400">Você tem alterações pendentes. Deseja sair sem salvar?</p>
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="confirmExit(false)"
              class="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-medium transition-all">
              Sair
            </button>
            <button @click="confirmExit(true)"
              class="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all">
              Salvar e Sair
            </button>
          </div>
        </div>
      </div>


    </div>
  </DashboardLayout>


  <TitleEffectsModal v-if="isEffectsModalOpen" v-model="form.titleEffect" :title="form.title"
    @close="isEffectsModalOpen = false" />
  <AudioManagerModal v-if="isAudioManagerOpen" :audios="pageStore.currentPage?.audios || []"
    :shuffle="form.shuffleAudios" :showPlayer="form.showAudioPlayer" :showEmbeds="form.showEmbeds"
    @close="isAudioManagerOpen = false" @add="handleAddAudio" @update="handleUpdateAudio" @delete="handleDeleteAudio"
    @set-active="handleSetActiveAudio" @update:shuffle="v => form.shuffleAudios = v"
    @update:showPlayer="v => form.showAudioPlayer = v" @update:showEmbeds="v => form.showEmbeds = v" />
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed, defineAsyncComponent, nextTick } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { usePageStore, type Page } from '@/store/page'
import { uploadFileWithSignedUrl } from '@/services/uploadService'
import AssetUploader from '@/components/assetUploader.vue'
import ColorPicker from '@/components/appearance/ColorPicker.vue'
import LivePreview from '@/components/appearance/LivePreview.vue'
import { useUserStore } from '@/store/user'
import SwitchToggle from '@/components/SwitchToggle.vue'
import AudioManagerModal from '@/components/appearance/AudioManagerModal.vue'
import TitleEffectsModal from '@/components/appearance/TitleEffectsModal.vue'
import { toast } from 'vue-sonner'
import { ArrowLeftIcon, BrandRedhatIcon, ChevronRightIcon, PlusIcon } from 'vue-tabler-icons'
import BlockManager from '@/components/BlockManager.vue'
import { useAuthStore } from '@/store/auth'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import isEqual from 'lodash/isEqual'
import { ComputerDesktopIcon, CursorArrowRaysIcon, DevicePhoneMobileIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'


const IconUserCircle = defineAsyncComponent(() => import('@heroicons/vue/24/outline/UserCircleIcon'))
const IconPaintBrush = defineAsyncComponent(() => import('@heroicons/vue/24/outline/PaintBrushIcon'))
const IconPhoto = defineAsyncComponent(() => import('@heroicons/vue/24/outline/PhotoIcon'))
const IconSparkles = defineAsyncComponent(() => import('@heroicons/vue/24/outline/SparklesIcon'))

const activeTab = ref('profile')
const tabs = [
  { id: 'profile', label: 'Perfil', icon: IconUserCircle },
  { id: 'style', label: 'Estilo', icon: IconPaintBrush },
  { id: 'background', label: 'Fundo', icon: IconPhoto },
  { id: 'extras', label: 'Extras', icon: IconSparkles },
]

type UploadableField = 'avatarUrl' | 'backgroundUrl' | 'cursorUrl' | 'backgroundVideoUrl'
type UploadType = 'avatar' | 'background' | 'audio' | 'cursor' | 'video';
interface AssetChangeEvent { file: File; field: UploadableField; uploadType: UploadType }

const route = useRoute();
const userStore = useUserStore()
const pageStore = usePageStore()
const isSaving = ref(false)
const isAudioManagerOpen = ref(false);
const isEffectsModalOpen = ref(false);
const isBodyGradient = ref(false);
const editingBlock = ref<any>(null);
const editingBlockContent = ref<any>({});
const showUnsavedModal = ref(false);
const pendingNavigation = ref<null | (() => void)>(null);
const isEditingPage = computed(() => !!route.query.slug);

const form = reactive({
  title: '',
  bio: '',
  location: '',
  avatarUrl: null as string | null,
  backgroundUrl: null as string | null,
  backgroundVideoUrl: null as string | null,
  cursorUrl: null as string | null,
  imageProvider: 'LOCAL',
  shuffleAudios: false,
  showAudioPlayer: true,
  showEmbeds: true,
  backgroundType: 'solid',
  gradientDirection: 'to bottom',
  gradientColorA: '#1E3A8A',
  gradientColorB: '#4C1D95',
  backgroundColor: '#1E293B',
  textColor: '#FFFFFF',
  iconColor: '#CCCCCC',
  fontFamily: 'Inter',
  buttonStyle: 'solid',
  buttonColor: null as string | null,
  buttonRoundness: 'rounded-lg',
  backgroundOverlay: 'none',
  backgroundBlur: 0,
  titleEffect: 'none',
  showProfileCard: true,
  profileCardColor: '#1f293780',
  profileCardOpacity: 0.2,
  showViewCount: true,
  buttonShadow: false,
  linkStyle: 'classic',
  layoutLinkStyle: 'list',
  useStandardIconColors: true,
  glowEffect: "none",
  profileRingType: 'none',
  profileRingColors: ['#FFFFFF', '#8B5CF6'],
  pageLayout: 'standard',

})

const authStore = useAuthStore();
const router = useRouter();
const pendingFiles = reactive<Partial<Record<UploadableField, File>>>({})
const previewMode = ref('mobile');
const previewData = computed(() => ({
  ...form,
  viewCount: pageStore.currentPage?.viewCount || 0,
  audios: pageStore.currentPage?.audios || [],
  isBodyGradient: isBodyGradient.value
}))

const originalForm = ref({});

const isDirty = computed(() => {
  return !isEqual(form, originalForm.value);
});

watch(() => pageStore.currentPage, (newPage) => {
  if (newPage) {

    Object.assign(form, {
      title: newPage.title ?? '',
      bio: newPage.bio ?? '',
      location: newPage.location ?? '',

      backgroundType: newPage.backgroundType ?? 'solid',
      gradientDirection: newPage.gradientDirection ?? 'to bottom',
      gradientColorA: newPage.gradientColorA ?? '#1E3A8A',
      gradientColorB: newPage.gradientColorB ?? '#4C1D95',
      backgroundColor: newPage.backgroundColor ?? '#1E293B',
      backgroundUrl: newPage.backgroundUrl ?? null,
      backgroundVideoUrl: newPage.backgroundVideoUrl ?? null,
      backgroundOverlay: newPage.backgroundOverlay ?? 'none',
      backgroundBlur: newPage.backgroundBlur ?? 0,
      pageLayout: newPage.pageLayout ?? 'standard',
      isBodyGradient: true,


      textColor: newPage.textColor ?? '#FFFFFF',
      iconColor: newPage.iconColor ?? '#CCCCCC',
      useStandardIconColors: newPage.useStandardIconColors ?? true,
      glowEffect: newPage.glowEffect ?? 'none',
      fontFamily: newPage.fontFamily ?? 'Inter',
      titleEffect: newPage.typewriterEffect ? 'typewriter' : (newPage.titleEffect ?? 'none'),


      linkStyle: newPage.linkStyle ?? 'classic',
      layoutLinkStyle: newPage.layoutLinkStyle ?? 'list',
      buttonStyle: newPage.buttonStyle ?? 'solid',
      buttonColor: newPage.buttonColor ?? null,
      buttonRoundness: newPage.buttonRoundness ?? 'rounded-lg',
      buttonShadow: newPage.buttonShadow ?? false,


      avatarUrl: newPage.avatarUrl ?? null,
      imageProvider: authStore.user?.imageProvider || 'LOCAL',
      cursorUrl: newPage.cursorUrl ?? null,
      profileRingType: newPage.profileRingType ?? 'none',
      profileRingColors: (newPage.profileRingColors && newPage.profileRingColors.length > 0)
        ? [...newPage.profileRingColors]
        : ['#FFFFFF', '#8B5CF6'],

      showProfileCard: newPage.showProfileCard ?? true,
      profileCardColor: newPage.profileCardColor ?? '#1f293780',
      profileCardOpacity: newPage.profileCardOpacity ?? 0.2,
      showViewCount: newPage.showViewCount ?? true,

      shuffleAudios: newPage.shuffleAudios ?? false,
      showAudioPlayer: newPage.showAudioPlayer ?? true,
      showEmbeds: newPage.showEmbeds ?? true,
    });

    nextTick(() => {
      originalForm.value = JSON.parse(JSON.stringify(form));
    });
  }
}, { immediate: true });

onMounted(async () => {
  await pageStore.fetchUserPages();

  if (route.query.slug) {
    await pageStore.fetchPageBySlug(route.query.slug as string);
  }
});

onMounted(async () => {
  const slug = route.query.slug as string;

  if (slug) {

    await pageStore.fetchPageBySlug(slug);
  } else {
    await pageStore.fetchUserPages(1);

    const firstPage = pageStore.userPages[0];

    if (firstPage) {
      await pageStore.fetchPageBySlug(firstPage.slug);
    }
  }
});

async function selectPage(slug: string) {
  if (isDirty.value) {
    requestExit(() => {
      router.push({ query: { slug } });
      pageStore.fetchPageBySlug(slug);
    });
  } else {
    await router.push({ query: { slug } });
    await pageStore.fetchPageBySlug(slug);
  }
}

function handleBackToSelection() {
  requestExit(() => {
    router.push({ query: {} });
    pageStore.currentPage = null;
  });
}

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    requestExit(() => next());
  } else {
    next();
  }
});

function requestExit(callback: () => void) {
  pendingNavigation.value = callback;
  showUnsavedModal.value = true;
}

async function confirmExit(save: boolean) {
  showUnsavedModal.value = false;

  if (save) {
    await saveChanges();
  } else {
    Object.assign(form, originalForm.value);
  }

  if (pendingNavigation.value) {
    pendingNavigation.value();
    pendingNavigation.value = null;
  }
}


function handleAssetChange({ file, field }: AssetChangeEvent) {
  pendingFiles[field] = file
  const reader = new FileReader()
  reader.onload = (e) => { form[field] = e.target?.result as string }
  reader.readAsDataURL(file)
}

function removeAsset(field: UploadableField) {
  form[field] = null
  delete pendingFiles[field]
}

function openBlockEditor(block: any) {
  editingBlock.value = block;
  editingBlockContent.value = { ...block.content };
}

async function saveBlockEdit() {
  if (editingBlock.value) {
    await pageStore.updateBlock(editingBlock.value.id, {
      content: editingBlockContent.value
    });
    editingBlock.value = null;
  }
}


const handleAddAudio = (data: any) => pageStore.addAudio(data).catch(err => toast.error(err.message));
const handleUpdateAudio = (data: any) => pageStore.updateAudio(data.id, data).catch(err => toast.error(err.message));
const handleDeleteAudio = (id: string) => { if (confirm('Excluir áudio?')) pageStore.deleteAudio(id).catch(err => toast.error(err.message)); };
const handleSetActiveAudio = (id: string) => pageStore.setActiveAudio(id).catch(err => toast.error(err.message));


async function saveChanges() {
  isSaving.value = true;
  try {

    if (authStore.user && form.imageProvider !== authStore.user.imageProvider) {
      await userStore.updateUserProfile({ imageProvider: form.imageProvider });
    }

    const pagePayload: Partial<Page> = {};
    const originalPage = pageStore.currentPage;

    Object.keys(form).forEach(key => {
      const typedKey = key as keyof typeof form;

      if (typedKey === 'imageProvider') return;

      if (originalPage && typedKey in originalPage) {
        const formValue = form[typedKey];
        const originalValue = originalPage[typedKey as keyof Page];
        if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
          if (formValue !== null) (pagePayload as any)[typedKey] = formValue;
        }
      }
    });

    for (const key in pendingFiles) {
      const field = key as UploadableField;
      const file = pendingFiles[field];
      if (file) {
        const uploadType = field === 'backgroundVideoUrl' ? 'video' : field.replace('Url', '') as UploadType;
        const newUrl = await uploadFileWithSignedUrl(file, uploadType);
        (pagePayload as any)[field] = newUrl;
      }
    }

    if (Object.keys(pagePayload).length > 0) await pageStore.updateMyPage(pagePayload);
    Object.keys(pendingFiles).forEach(key => delete pendingFiles[key as UploadableField]);
    toast.success('Alterações salvas!');

  } catch (error) {
    console.error("Erro ao salvar:", error);
    toast.error('Erro ao salvar.');
  } finally {
    isSaving.value = false;
  }
}


function changeLayout(newLayout: string) {
  form.pageLayout = newLayout;

  if (newLayout !== 'standard') {
    if (form.backgroundType === 'solid' || form.backgroundType === 'gradient') {
      form.backgroundType = 'image';
    }
  }
}


const availableBackgroundTabs = computed(() => {
  if (form.pageLayout === 'standard') {
    return ['solid', 'gradient', 'image', 'video'];
  } else {

    return ['image', 'video'];
  }
});

</script>

<style scoped>
.group-section {
  @apply bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-4;
}

.section-title {
  @apply text-sm font-bold text-slate-300 uppercase tracking-wider mb-2;
}

/* Inputs Modernos */
.input-label {
  @apply block text-xs font-semibold text-slate-400 mb-1.5 ml-1;
}

.input-modern {
  @apply w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all;
}

/* Scrollbar Clean */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}

/* Animações Vue */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>