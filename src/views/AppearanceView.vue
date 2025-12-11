<template>
  <DashboardLayout>
    <!-- Layout Principal: Full Height sem scroll na janela principal -->
    <div class="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-950 text-white">

      <!-- LADO ESQUERDO: EDITOR (Scrollável e com Abas) -->
      <div class="w-full lg:w-1/2 xl:w-2/5 h-full flex flex-col overflow-hidden border-r border-slate-800 bg-slate-950">

        <!-- 1. Cabeçalho Fixo do Editor -->
        <div class="p-6 border-b border-slate-800 shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-white">Personalizar Página</h1>
              <p class="text-slate-400 text-sm">Edite a aparência e veja em tempo real.</p>
            </div>
            <button @click="saveChanges" :disabled="isSaving"
              class="lg:hidden px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {{ isSaving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>

        <!-- 2. Navegação por Abas (Tabs) -->
        <div class="border-b border-slate-800 shrink-0">
          <nav class="flex space-x-2 px-6 -mb-px">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
              'flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors duration-200 border-b-2',
              activeTab === tab.id
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-slate-400 hover:text-white hover:border-slate-500'
            ]">
              <component :is="tab.icon" class="w-5 h-5" />
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </div>

        <!-- 3. Conteúdo das Abas (Área de Rolagem) -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <main class="p-6">
            <transition name="tab-content" mode="out-in">

              <div v-if="activeTab === 'profile'" key="profile" class="space-y-6">
                <div class="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-6">
                  <!-- ... conteúdo do perfil ... -->
                  <div v-if="pageStore.currentPage?.user?.discordAvatarUrl"
                    class="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <div class="flex items-center gap-3">
                      <img :src="pageStore.currentPage.user.discordAvatarUrl" class="w-8 h-8 rounded-full" />
                      <span class="text-sm text-slate-300">Usar Avatar do Discord</span>
                    </div>
                    <SwitchToggle v-model="form.useDiscordAvatar" />
                  </div>
                  <transition name="fade">
                    <div v-if="!form.useDiscordAvatar">
                      <label class="label-text">Avatar Personalizado</label>
                      <AssetUploader title="avatar" :current-url="form.avatarUrl" upload-type="avatar"
                        accepted-files="image/*" @upload="handleAssetChange" @remove="removeAsset" class="mt-1" />
                    </div>
                  </transition>


                  <div>
                    <label class="label-text">Efeito do Nome</label>
                    <button @click="isEffectsModalOpen = true"
                      class="input-dark text-left flex justify-between items-center w-full">
                      <span>{{ currentEffectName }}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-500" viewBox="0 0 24 24"
                        stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                          d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <label class="label-text">Bio / Descrição</label>
                    <textarea v-model="form.bio" rows="3" class="input-dark resize-none" placeholder="Sua bio..."
                      maxlength="200"></textarea>
                    <div class="flex justify-between mt-1">

                      <span class="text-xs text-slate-500">{{ form.bio.length }}/200</span>
                    </div>
                  </div>
                  <div>
                    <label class="label-text">Localização</label>
                    <input type="text" v-model="form.location" placeholder="Ex: Brasil" class="input-dark" />
                  </div>
                </div>
              </div>

              <!-- Aba 2: Estilo (usa v-else-if) -->
              <div v-else-if="activeTab === 'style'" key="style" class="space-y-6">
                <div class="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-5">
                  <!-- ... conteúdo de estilo ... -->
                  <div>
                    <label class="label-text">Estilo dos Links</label>
                    <div class="grid grid-cols-2 gap-3 mt-2">
                      <label class="cursor-pointer">
                        <input type="radio" name="link-style" value="classic" class="sr-only" v-model="form.linkStyle">
                        <div class="p-3 text-center rounded-lg border-2 transition-all"
                          :class="form.linkStyle === 'classic' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
                          <div class="w-full bg-slate-700/80 rounded p-2 text-xs font-semibold">Clássico</div>
                        </div>
                      </label>
                      <label class="cursor-pointer">
                        <input type="radio" name="link-style" value="minimal" class="sr-only" v-model="form.linkStyle">
                        <div class="p-3 text-center rounded-lg border-2 transition-all"
                          :class="form.linkStyle === 'minimal' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
                          <div class="w-full border-b border-dashed border-slate-600 rounded p-2 text-xs font-semibold">
                            Minimalista</div>
                        </div>
                      </label>
                      <label class="cursor-pointer">
                        <input type="radio" name="link-style" value="brutalist" class="sr-only"
                          v-model="form.linkStyle">
                        <div class="p-3 text-center rounded-lg border-2 transition-all"
                          :class="form.linkStyle === 'brutalist' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
                          <div
                            class="w-full bg-slate-300 border-2 border-slate-600 shadow-[3px_3px_0px_#64748b] rounded p-2 text-xs font-semibold text-slate-800">
                            Brutalista</div>
                        </div>
                      </label>
                      <label class="cursor-pointer">
                        <input type="radio" name="link-style" value="spotlight" class="sr-only"
                          v-model="form.linkStyle">
                        <div class="p-3 text-center rounded-lg border-2 transition-all"
                          :class="form.linkStyle === 'spotlight' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
                          <div class="w-full bg-slate-800/50 opacity-60 rounded p-2 text-xs font-semibold">Destaque
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="pt-4 border-t border-slate-800/50">
                    <label class="label-text">Formato dos Links</label>
                    <div class="grid grid-cols-2 gap-3 mt-2">
                      <label class="cursor-pointer">
                        <input type="radio" name="layout-type" value="list" class="sr-only"
                          v-model="form.layoutLinkStyle">
                        <div
                          class="p-3 text-center rounded-lg border-2 transition-all flex flex-col items-center gap-2 h-full"
                          :class="form.layoutLinkStyle === 'list' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
                          <div class="flex items-center gap-2 w-full bg-slate-700/80 rounded p-1">
                            <div class="w-3 h-3 bg-slate-500 rounded-sm"></div>
                            <div class="h-1 flex-1 bg-slate-500 rounded-full"></div>
                          </div>
                          <span class="text-xs font-semibold">Lista</span>
                        </div>
                      </label>
                      <label class="cursor-pointer">
                        <input type="radio" name="layout-type" value="grid" class="sr-only"
                          v-model="form.layoutLinkStyle">
                        <div
                          class="p-3 text-center rounded-lg border-2 transition-all flex flex-col items-center gap-2 h-full"
                          :class="form.layoutLinkStyle === 'grid' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
                          <div class="grid grid-cols-2 gap-1 w-full">
                            <div class="w-full h-3 bg-slate-700/80 rounded-sm"></div>
                            <div class="w-full h-3 bg-slate-700/80 rounded-sm"></div>
                            <div class="w-full h-3 bg-slate-700/80 rounded-sm"></div>
                            <div class="w-full h-3 bg-slate-700/80 rounded-sm"></div>
                          </div>
                          <span class="text-xs font-semibold">Grade</span>
                        </div>
                      </label>
                      <label class="cursor-pointer">
                        <input type="radio" name="layout-type" value="icons_only" class="sr-only"
                          v-model="form.layoutLinkStyle">
                        <div
                          class="p-3 text-center rounded-lg border-2 transition-all flex flex-col items-center gap-2 h-full"
                          :class="form.layoutLinkStyle === 'icons_only' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
                          <div class="flex items-center justify-center gap-1.5 w-full">
                            <div class="w-4 h-4 bg-slate-700/80 rounded-full"></div>
                            <div class="w-4 h-4 bg-slate-700/80 rounded-full"></div>
                            <div class="w-4 h-4 bg-slate-700/80 rounded-full"></div>
                          </div>
                          <span class="text-xs font-semibold">Apenas Ícones</span>
                        </div>
                      </label>
                      <label class="cursor-pointer">
                        <input type="radio" name="layout-type" value="stacked" class="sr-only"
                          v-model="form.layoutLinkStyle">
                        <div
                          class="p-3 text-center rounded-lg border-2 transition-all flex flex-col items-center gap-2 h-full"
                          :class="form.layoutLinkStyle === 'stacked' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'">
                          <div class="flex flex-col items-center gap-1 w-full bg-slate-700/80 rounded p-1">
                            <div class="w-3 h-3 bg-slate-500 rounded-sm"></div>
                            <div class="h-1 w-3/4 bg-slate-500 rounded-full"></div>
                          </div>
                          <span class="text-xs font-semibold">Empilhado</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                    <div class="col-span-2">
                      <label class="label-text">Fonte Principal</label>
                      <select v-model="form.fontFamily" class="input-dark">
                        <option value="Inter">Inter (Padrão)</option>
                        <option value="Roboto Mono">Roboto Mono (Tech)</option>
                        <option value="'Press Start 2P'">Pixel Art (Retro)</option>
                        <option value="Cinzel">Cinzel (Gothic/RPG)</option>
                        <option value="Playfair Display">Playfair (Elegante)</option>
                      </select>
                    </div>
                    <div>
                      <label class="label-text">Estilo dos Botões</label>
                      <select v-model="form.buttonStyle" class="input-dark">
                        <option value="solid">Sólido</option>
                        <option value="outline">Borda (Outline)</option>
                        <option value="glass">Vidro (Glass)</option>
                        <option value="soft">Suave</option>
                      </select>
                    </div>
                    <div>
                      <label class="label-text">Arredondamento</label>
                      <select v-model="form.buttonRoundness" class="input-dark">
                        <option value="rounded-none">Quadrado</option>
                        <option value="rounded-md">Médio</option>
                        <option value="rounded-xl">Grande</option>
                        <option value="rounded-full">Redondo</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-4 pt-4 border-t border-slate-800/50">
                    <ColorPicker id="textColor" label="Cor do Texto" v-model="form.textColor" />
                    <transition name="fade">
                      <ColorPicker v-if="!form.useStandardIconColors" id="iconColor"
                        label="Cor dos Ícones (Personalizada)" v-model="form.iconColor" />
                    </transition>
                  </div>
                  <div class="space-y-4 pt-4 border-t border-slate-800/50">
                    <div class="flex items-center justify-between">
                      <label class="label-text">Usar Cores Padrão dos Ícones</label>
                      <SwitchToggle v-model="form.useStandardIconColors" />
                    </div>
                    <div>
                      <label class="label-text">Efeito de Brilho (Glow)</label>
                      <div class="flex items-center gap-2 p-1 bg-slate-800 rounded-lg w-full">
                        <button @click="setGlow('none')" :class="getGlowButtonClass('none')">Nenhum</button>
                        <button @click="setGlow('title')" :class="getGlowButtonClass('title')">Título</button>
                        <button @click="setGlow('icons')" :class="getGlowButtonClass('icons')">Ícones</button>
                        <button @click="setGlow('both')" :class="getGlowButtonClass('both')">Ambos</button>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-4 pt-4 border-t border-slate-800/50">
                    <label class="label-text">Borda do Avatar (Ring)</label>
                    <div class="flex items-center gap-2 p-1 bg-slate-800 rounded-lg w-full">
                      <button @click="setRingType('none')" :class="getRingTypeButtonClass('none')">Nenhuma</button>
                      <button @click="setRingType('solid')" :class="getRingTypeButtonClass('solid')">Sólida</button>
                      <button @click="setRingType('gradient')"
                        :class="getRingTypeButtonClass('gradient')">Gradiente</button>
                      <button @click="setRingType('animated')"
                        :class="getRingTypeButtonClass('animated')">Animada</button>
                    </div>

                    <transition name="fade">
                      <div v-if="form.profileRingType !== 'none'" class="pt-4 border-t border-slate-800/50 space-y-4">

                        <!-- Lista dinâmica de ColorPickers -->
                        <div v-for="(color, index) in form.profileRingColors" :key="index" class="flex items-end gap-2">

                          <ColorPicker :id="`ringColor_${index}`" :label="`Cor ${index + 1}`"
                            :modelValue="form.profileRingColors[index] || ''"
                            @update:modelValue="newValue => form.profileRingColors[index] = newValue"
                            class="flex-grow" />

                          <button v-if="form.profileRingColors.length > 1" @click="removeColor(index)"
                            class="h-11 w-11 flex-shrink-0 flex items-center justify-center bg-rose-600/20 text-rose-400 hover:bg-rose-600/40 hover:text-rose-300 rounded-lg transition-colors"
                            title="Remover Cor">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
                              stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M4 7l16 0" />
                              <path d="M10 11l0 6" />
                              <path d="M14 11l0 6" />
                              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                          </button>

                          <!-- Esconde o botão de remover se for a única cor -->
                          <div v-else class="h-11 w-11 flex-shrink-0"></div>

                        </div>

                        <!-- Botão para adicionar cor -->
                        <button v-if="form.profileRingColors.length < 3 && form.profileRingType !== 'solid'"
                          @click="addColor"
                          class="w-full mt-2 p-2 text-xs font-semibold text-slate-300 bg-slate-800/50 border border-dashed border-slate-700 hover:border-yellow-500 hover:text-yellow-500 rounded-lg transition">
                          + Adicionar Cor
                        </button>
                      </div>
                    </transition>
                  </div>
                  <div class="space-y-4 pt-4 border-t border-slate-800/50">
                    <div class="flex items-center justify-between">
                      <label class="label-text">Mostrar Contador de Views</label>
                      <SwitchToggle v-model="form.showViewCount" />
                    </div>
                    <div class="flex items-center justify-between">
                      <label class="label-text">Sombra nos Botões</label>
                      <SwitchToggle v-model="form.buttonShadow" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Aba 3: Fundo & Efeitos (usa v-else-if) -->
              <div v-else-if="activeTab === 'background'" key="background"
                class="space-y-6 bg-slate-900 p-5 rounded-xl border border-slate-800 ">

                <div>
                  <label class="label-text">Tipo de Fundo</label>
                  <div class="flex items-center gap-2 p-1 bg-slate-800 rounded-lg w-full">
                    <button @click="form.backgroundType = 'solid'" :class="getBgTypeButtonClass('solid')">Cor
                      Sólida</button>
                    <button @click="form.backgroundType = 'gradient'"
                      :class="getBgTypeButtonClass('gradient')">Gradiente</button>
                    <button @click="form.backgroundType = 'image'"
                      :class="getBgTypeButtonClass('image')">Imagem</button>
                    <button @click="form.backgroundType = 'video'" :class="getBgTypeButtonClass('video')">Vídeo</button>

                  </div>
                </div>

                <transition name="fade" mode="out-in">
                  <!-- Controles para Cor Sólida -->
                  <div v-if="form.backgroundType === 'solid'" class="pt-4 border-t border-slate-800/50">
                    <ColorPicker id="bgColor" label="Cor de Fundo" v-model="form.backgroundColor" />
                  </div>

                  <!-- Controles para Gradiente -->
                  <div v-else-if="form.backgroundType === 'gradient'"
                    class="pt-4 border-t border-slate-800/50 space-y-4">
                    <div>
                      <label class="label-text">Direção do Gradiente</label>
                      <select v-model="form.gradientDirection" class="input-dark">
                        <option value="to top">Para Cima</option>
                        <option value="to right">Para Direita</option>
                        <option value="to bottom">Para Baixo (Padrão)</option>
                        <option value="to left">Para Esquerda</option>
                        <option value="to top right">Para Cima-Direita</option>
                        <option value="to bottom right">Para Baixo-Direita</option>
                        <option value="to bottom left">Para Baixo-Esquerda</option>
                        <option value="to top left">Para Cima-Esquerda</option>
                      </select>
                    </div>
                    <ColorPicker id="gradA" label="Cor 1" v-model="form.gradientColorA" />
                    <ColorPicker id="gradB" label="Cor 2" v-model="form.gradientColorB" />
                  </div>

                  <!-- Controles para Imagem -->
                  <div v-else-if="form.backgroundType === 'image'"
                    class="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-5">
                    <AssetUploader title="Imagem de Fundo" :current-url="form.backgroundUrl" upload-type="background"
                      accepted-files="image/*" @upload="handleAssetChange" @remove="removeAsset" />
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                      <div>
                        <label class="label-text">Overlay (Efeito FX)</label>
                        <select v-model="form.backgroundOverlay" class="input-dark">
                          <option value="none">Nenhum</option>
                          <option value="noise">Ruído (Noise)</option>
                          <option value="scanlines">Scanlines (CRT)</option>
                          <option value="vignette">Vinheta Escura</option>
                          <option value="particles">Partículas</option>
                        </select>
                      </div>
                      <div>
                        <label class="label-text">Desfoque do Fundo: {{ form.backgroundBlur }}px</label>
                        <input type="range" v-model.number="form.backgroundBlur" min="0" max="20" step="1"
                          class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 mt-3">
                      </div>
                    </div>

                  </div>

                  <div v-else-if="form.backgroundType === 'video'" class="pt-4 border-t border-slate-800/50 space-y-5">
                    <AssetUploader title="Vídeo de Fundo Animado" :current-url="form.backgroundVideoUrl"
                      upload-type="video" :field-name="'backgroundVideoUrl'" accepted-files="video/mp4, video/webm"
                      @upload="handleAssetChange" @remove="() => removeAsset('backgroundVideoUrl')" />
                  </div>
                </transition>


                <div class="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div class="flex items-center justify-between">
                    <label class="label-text">Mostrar Fundo do Card de Perfil</label>
                    <SwitchToggle v-model="form.showProfileCard" />
                  </div>
                  <transition name="fade">
                    <div v-if="form.showProfileCard" class="space-y-4 pt-4 border-t border-slate-800/50">
                      <ColorPicker id="profileCardColor" label="Cor do Card (com transparência)"
                        v-model="form.profileCardColor" show-alpha />
                      <div>
                        <label class="label-text">Opacidade do Card: {{ Math.round(form.profileCardOpacity * 100)
                          }}%</label>
                        <input type="range" v-model.number="form.profileCardOpacity" min="0" max="1" step="0.05"
                          class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 mt-3">
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <!-- Aba 4: Extras (usa v-else-if) -->
              <div v-else-if="activeTab === 'extras'" key="extras" class="space-y-6">
                <div class="bg-slate-900 p-5 rounded-xl border border-slate-800 grid grid-cols-1 gap-6">
                  <!-- ... conteúdo de extras ... -->
                  <AssetUploader title="Cursor Personalizado" :current-url="form.cursorUrl" upload-type="cursor"
                    accepted-files="image/png, image/gif, .cur" @upload="handleAssetChange" @remove="removeAsset" />
                  <div>
                    <label class="label-text">Música de Fundo</label>
                    <button @click="isAudioManagerOpen = true"
                      class="w-full text-left p-3 bg-slate-950 border border-slate-700 rounded-lg hover:border-yellow-500 transition">
                      Gerenciar Áudios ({{ pageStore.currentPage?.audios?.length || 0 }})
                    </button>
                  </div>

                </div>
              </div>


            </transition>
          </main>
        </div>

        <!-- 4. Botão Salvar Fixo (Desktop) -->
        <div class="p-6 mt-auto bg-slate-950 border-t border-slate-800 shrink-0">
          <button @click="saveChanges" :disabled="isSaving"
            class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 flex items-center justify-center gap-2">
            <span v-if="isSaving" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            {{ isSaving ? 'Salvando Alterações...' : 'Salvar Página' }}
          </button>
        </div>
      </div>

      <!-- LADO DIREITO: LIVE PREVIEW (Permanece igual) -->
      <div class="hidden  lg:flex flex-col lg:w-1/2 xl:w-3/5 bg-slate-950/50">
        <div class="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Preview
          </span>
          <div class="flex items-center gap-2 p-1 bg-slate-800 rounded-lg">
            <button @click="previewMode = 'mobile'" :class="[
              'px-3 py-1 rounded-md text-xs transition-colors',
              previewMode === 'mobile' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-700'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11 5l-1 1l-2 3l-1 3v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1 -1v-4l-1 -3l-2 -3l-1 -1z" />
                <path d="M6 15h4" />
                <path d="M7 12h2" />
                <path d="M16 4h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1z" />
              </svg>
            </button>
            <button @click="previewMode = 'desktop'" :class="[
              'px-3 py-1 rounded-md text-xs transition-colors',
              previewMode === 'desktop' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-700'
            ]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z" />
                <path d="M7 20h10" />
                <path d="M9 16v4" />
                <path d="M15 16v4" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex-1 flex items-center justify-center p-8 bg-[url('/grid-pattern.svg')]">
          <div v-if="previewMode === 'mobile'"
            class="w-[380px] h-[100%] border-[12px] border-slate-900 rounded-[3rem] shadow-2xl bg-black overflow-hidden ring-1 ring-slate-800/50 transition-all duration-300">
            <div
              class="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-800/50 transform origin-center">
              <div class="w-full h-full overflow-y-auto custom-scrollbar">
                <LivePreview :preview-data="previewData" />
              </div>
            </div>
          </div>
          <div v-else-if="previewMode === 'desktop'" class="w-full h-full transition-all duration-300">
            <div
              class="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-800/50 transform scale-[0.9] origin-center">
              <div class="w-full h-full overflow-y-auto custom-scrollbar">
                <LivePreview :preview-data="previewData" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
  <TitleEffectsModal v-if="isEffectsModalOpen" v-model="form.titleEffect" :title="form.title"
    @close="isEffectsModalOpen = false" />
  <AudioManagerModal v-if="isAudioManagerOpen" :audios="pageStore.currentPage?.audios || []"
    :shuffle="form.shuffleAudios" :showPlayer="form.showAudioPlayer" @close="isAudioManagerOpen = false"
    @add="handleAddAudio" @update="handleUpdateAudio" @delete="handleDeleteAudio" @set-active="handleSetActiveAudio"
    @update:shuffle="v => form.shuffleAudios = v" @update:showPlayer="v => form.showAudioPlayer = v" />
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed, defineAsyncComponent } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { usePageStore, type Audio, type Page } from '@/store/page'
import { uploadFileWithSignedUrl } from '@/services/uploadService'
import AssetUploader from '@/components/assetUploader.vue'
import ColorPicker from '@/components/appearance/ColorPicker.vue'
import LivePreview from '@/components/appearance/LivePreview.vue'
import { useUserStore } from '@/store/user'
import SwitchToggle from '@/components/SwitchToggle.vue'
import AudioManagerModal from '@/components/appearance/AudioManagerModal.vue'
import TitleEffectsModal from '@/components/appearance/TitleEffectsModal.vue'
import { toast } from 'vue-sonner'

// Importação dinâmica de ícones para as abas (requer @heroicons/vue)
const IconUserCircle = defineAsyncComponent(() => import('@heroicons/vue/24/outline/UserCircleIcon'))
const IconPaintBrush = defineAsyncComponent(() => import('@heroicons/vue/24/outline/PaintBrushIcon'))
const IconPhoto = defineAsyncComponent(() => import('@heroicons/vue/24/outline/PhotoIcon'))
const IconSparkles = defineAsyncComponent(() => import('@heroicons/vue/24/outline/SparklesIcon'))

// Estado para controlar a aba ativa
const activeTab = ref('profile')

// Estrutura de dados para as abas
const tabs = [
  { id: 'profile', label: 'Perfil', icon: IconUserCircle },
  { id: 'style', label: 'Estilo', icon: IconPaintBrush },
  { id: 'background', label: 'Fundo & FX', icon: IconPhoto },
  { id: 'extras', label: 'Extras', icon: IconSparkles },
]

type UploadableField = 'avatarUrl' | 'backgroundUrl' | 'cursorUrl' | 'backgroundVideoUrl'
type UploadType = 'avatar' | 'background' | 'audio' | 'cursor' | 'video';

interface AssetChangeEvent {
  file: File
  field: UploadableField
  uploadType: UploadType
}

const userStore = useUserStore()
const pageStore = usePageStore()
const isSaving = ref(false)
const isAudioManagerOpen = ref(false);
const isEffectsModalOpen = ref(false);

// O objeto 'form' e a lógica permanecem exatamente os mesmos. Nenhuma alteração no modelo de dados.
const form = reactive({
  title: '',
  bio: '',
  location: '',
  avatarUrl: null as string | null,
  backgroundUrl: null as string | null,
  backgroundVideoUrl: null as string | null,
  cursorUrl: null as string | null,
  useDiscordAvatar: true,
  shuffleAudios: false,
  showAudioPlayer: true,
  backgroundType: 'solid',
  gradientDirection: 'to bottom',
  gradientColorA: '#1E3A8A',
  gradientColorB: '#4C1D95',

  backgroundColor: '#1E293B',
  textColor: '#FFFFFF',
  iconColor: '#CCCCCC',
  fontFamily: 'Inter',
  buttonStyle: 'solid',
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
})

const titleEffectsList = [
  { id: 'none', name: 'Nenhum', previewClass: '' },
  { id: 'typewriter', name: 'Máquina de Escrever' },
  { id: 'rainbow', name: 'Arco-íris', previewClass: 'effect-rainbow' },
  { id: 'neon', name: 'Neon', previewClass: 'effect-neon' },
  { id: 'outline', name: 'Contorno', previewClass: 'effect-outline' },
  { id: 'glitch', name: 'Glitch', previewClass: 'effect-glitch' }
];

const currentEffectName = computed(() => {
  return titleEffectsList.find(e => e.id === form.titleEffect)?.name || 'Nenhum';
});


const pendingFiles = reactive<Partial<Record<UploadableField, File>>>({})
const previewMode = ref('mobile');
const previewData = computed(() => ({
  ...form,
  viewCount: pageStore.currentPage?.viewCount || 0,
  audios: pageStore.currentPage?.audios || [],
}))

watch(() => pageStore.currentPage, (newPage) => {
  if (newPage) {
    form.title = newPage.title ?? '';
    form.bio = newPage.bio ?? ''
    form.location = newPage.location ?? ''

    form.backgroundType = newPage.backgroundType ?? 'solid';
    form.gradientDirection = newPage.gradientDirection ?? 'to bottom';
    form.gradientColorA = newPage.gradientColorA ?? '#1E3A8A';
    form.gradientColorB = newPage.gradientColorB ?? '#4C1D95';
    form.backgroundColor = newPage.backgroundColor ?? '#1E293B'
    form.textColor = newPage.textColor ?? '#FFFFFF'
    form.iconColor = newPage.iconColor ?? '#CCCCCC'
    form.avatarUrl = newPage.avatarUrl ?? null
    form.backgroundUrl = newPage.backgroundUrl ?? null
    form.backgroundVideoUrl = newPage.backgroundVideoUrl ?? null;
    form.cursorUrl = newPage.cursorUrl ?? null
    form.titleEffect = newPage.typewriterEffect ? 'typewriter' : (newPage.titleEffect ?? 'none'); form.fontFamily = newPage.fontFamily ?? 'Inter'
    form.buttonStyle = newPage.buttonStyle ?? 'solid'
    form.buttonRoundness = newPage.buttonRoundness ?? 'rounded-lg'
    form.backgroundOverlay = newPage.backgroundOverlay ?? 'none'
    form.backgroundBlur = newPage.backgroundBlur ?? 0
    form.showProfileCard = newPage.showProfileCard ?? true;
    form.profileCardColor = newPage.profileCardColor ?? '#1f293780';
    form.profileCardOpacity = newPage.profileCardOpacity ?? 0.2;
    form.showViewCount = newPage.showViewCount ?? true;
    form.buttonShadow = newPage.buttonShadow ?? false;
    form.linkStyle = newPage.linkStyle ?? 'classic';
    form.layoutLinkStyle = newPage.layoutLinkStyle ?? 'list';
    form.shuffleAudios = newPage.shuffleAudios ?? false;
    form.showAudioPlayer = newPage.showAudioPlayer ?? true;
    form.useStandardIconColors = newPage.useStandardIconColors ?? true;
    form.glowEffect = newPage.glowEffect ?? 'none';
    form.profileRingType = newPage.profileRingType ?? 'none';
    form.profileRingType = newPage.profileRingType ?? 'none';
    if (newPage.profileRingColors && newPage.profileRingColors.length > 0) {
      form.profileRingColors = [...newPage.profileRingColors];
    } else {
      form.profileRingColors = ['#FFFFFF', '#8B5CF6'];
    }

  }
}, { immediate: true })

watch(() => form.backgroundType, (newType) => {
  if (newType !== 'image') {
    form.backgroundUrl = null;
    delete pendingFiles.backgroundUrl;
  }
  if (newType !== 'video') {
    form.backgroundVideoUrl = null;
    delete pendingFiles.backgroundVideoUrl;
  }
});

const getEffectButtonClass = (effectId: string) => {
  return [
    'cursor-pointer p-3 text-center rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 aspect-square',
    form.titleEffect === effectId
      ? 'border-yellow-500 bg-yellow-500/10'
      : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
  ];
};

const getBgTypeButtonClass = (value: string) => {
  return [
    'flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
    form.backgroundType === value
      ? 'bg-yellow-500 text-slate-900 shadow-md'
      : 'text-slate-300 hover:bg-slate-700'
  ];
};


const getRingTypeButtonClass = (value: string) => {
  return [
    'flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
    form.profileRingType === value
      ? 'bg-yellow-500 text-slate-900 shadow-md'
      : 'text-slate-300 hover:bg-slate-700'
  ];
};

onMounted(() => {
  if (!pageStore.currentPage) {
    pageStore.fetchMyPage()
  }
})

const setGlow = (value: 'none' | 'title' | 'icons' | 'both') => {
  form.glowEffect = value;
};

const getGlowButtonClass = (value: string) => {
  return [
    'flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
    form.glowEffect === value
      ? 'bg-yellow-500 text-slate-900 shadow-md'
      : 'text-slate-300 hover:bg-slate-700'
  ];
};


function handleAssetChange({ file, field }: AssetChangeEvent) {
  pendingFiles[field] = file
  const reader = new FileReader()
  reader.onload = (e) => { form[field] = e.target?.result as string }
  reader.readAsDataURL(file)
}

function setRingType(type: 'none' | 'solid' | 'gradient' | 'animated') {
  form.profileRingType = type;

  if (type === 'solid') {
    const currentColor = form.profileRingColors[0] || '#FFFFFF';
    form.profileRingColors = [currentColor];
  }
}

function addColor() {
  if (form.profileRingColors.length < 3) {
    form.profileRingColors.push('#4ade80'); // Adiciona um verde como padrão
  }
}

function removeColor(index: number) {
  if (form.profileRingColors.length > 1) { // Garante que sempre haja pelo menos uma cor
    form.profileRingColors.splice(index, 1);
  }
}

function removeAsset(field: UploadableField) {
  form[field] = null
  delete pendingFiles[field]
}

const handleAddAudio = (data: { title: string; url: string; coverUrl?: string | null, type: "DIRECT" | "SPOTIFY" | "SOUNDCLOUD"; }) => {
  pageStore.addAudio(data).catch(err => toast.error(err.message)); // Adicionado .catch para feedback
};

// CORRIGIDO: Tipagem para o parâmetro 'data'
const handleUpdateAudio = (data: { id: string } & Partial<Omit<Audio, 'id'>>) => {
  pageStore.updateAudio(data.id, data).catch(err => toast.error(err.message));
};

// CORRIGIDO: Tipagem para o parâmetro 'id'
const handleDeleteAudio = (id: string) => {
  if (confirm('Tem certeza que deseja excluir este áudio?')) {
    pageStore.deleteAudio(id).catch(err => toast.error(err.message));
  }
};

// CORRIGIDO: Tipagem para o parâmetro 'id'
const handleSetActiveAudio = (id: string) => {
  pageStore.setActiveAudio(id).catch(err => toast.error(err.message));
};


async function saveChanges() {
  isSaving.value = true;
  try {
    const originalPage = pageStore.currentPage;

    if (originalPage?.user && form.useDiscordAvatar !== originalPage.user.useDiscordAvatar) {
      await userStore.updateUserProfile({ useDiscordAvatar: form.useDiscordAvatar });
    }


    const pagePayload: Partial<Page> = {};

    Object.keys(form).forEach(key => {
      const typedKey = key as keyof typeof form;

      if (typedKey === 'useDiscordAvatar') {
        return;
      }

      if (originalPage && typedKey in originalPage) {
        const formValue = form[typedKey];
        const originalValue = originalPage[typedKey as keyof Page];

        if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
          if (formValue !== null) {
            (pagePayload as any)[typedKey] = formValue;
          }
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

    if (Object.keys(pagePayload).length > 0) {
      await pageStore.updateMyPage(pagePayload);
    }

    Object.keys(pendingFiles).forEach(key => delete pendingFiles[key as UploadableField]);


  } catch (error) {
    console.error("Erro ao salvar aparência:", error);
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped>
/* INPUTS: Adicionado foco amarelo para consistência */
.input-dark {
  @apply w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors placeholder-slate-600 text-sm;
}

.label-text {
  @apply block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide;
}

/* SCROLLBAR: Levemente ajustada para o novo layout */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}

/* ANIMAÇÃO DAS ABAS: A mágica da transição dinâmica */
.tab-content-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-content-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-content-enter-from,
.tab-content-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

/* ANIMAÇÃO FADE: Para elementos internos que aparecem/desaparecem */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

effect-rainbow {
  background-image: linear-gradient(45deg, #f3ec78, #af4261);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.effect-neon {
  text-shadow: 0 0 5px var(--glow-color, #ff00de);
}

.effect-outline {
  -webkit-text-stroke: 1px white;
}

.effect-glitch {
  position: relative;
}

.effect-glitch::before,
.effect-glitch::after {
  content: 'Aa';
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  background: #111827;
  /* Cor de fundo do botão */
}

.effect-glitch::before {
  left: 2px;
  text-shadow: -1px 0 red;
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}

.effect-glitch::after {
  left: -2px;
  text-shadow: -1px 0 blue;
  animation: glitch-anim-2 2s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(45% 0 56% 0);
  }

  100% {
    clip-path: inset(5% 0 90% 0);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(80% 0 3% 0);
  }

  100% {
    clip-path: inset(50% 0 30% 0);
  }
}
</style>