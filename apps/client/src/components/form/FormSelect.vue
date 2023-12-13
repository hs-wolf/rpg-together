<script setup lang="ts">
import type { AdvancedSelectOption } from '~/types'

const props = defineProps<{
  modelValue?: AdvancedSelectOption[]
  options: AdvancedSelectOption[]
  placeholder: string
  searchMessage: string
  emptyMessage: string
}>()

const emits = defineEmits<{ (_e: 'update:modelValue', _items: AdvancedSelectOption[]): void }>()

const showOptions = ref(false)
const componentRef = ref<HTMLElement>()
const selectedOptions = ref<AdvancedSelectOption[]>([])
const optionsQuery = ref('')

const filteredOptions = computed(() =>
  props.options
    .filter(item => !selectedOptions.value.includes(item))
    .filter(item => item.label.toLowerCase().includes(optionsQuery.value.toLowerCase())),
)

function insertOption(item: AdvancedSelectOption) {
  selectedOptions.value.push(item)
  if (!filteredOptions.value.length) {
    optionsQuery.value = ''
    showOptions.value = false
  }
  changeOptions()
}

function removeOption(index: number) {
  selectedOptions.value.splice(index, 1)
  changeOptions()
}

function clearOptions() {
  selectedOptions.value = []
  showOptions.value = false
  changeOptions()
}

function changeOptions() {
  emits('update:modelValue', selectedOptions.value)
}

onClickOutside(componentRef, () => showOptions.value = false)

defineExpose({
  clearOptions,
})
</script>

<template>
  <div ref="componentRef" class="relative flex flex-col shadow text-sm lg:text-base" :class="{ 'w-full': showOptions }">
    <div
      class="flex flex-col border bg-secondary"
      :class="[showOptions ? 'border-accent-2 rounded-t-sm' : 'border-secondary-1 rounded-sm']"
    >
      <div class="flex flex-col">
        <button
          class="flex items-center gap-1 px-3 py-2 text-primary"
          :class="{ 'w-full': !showOptions }"
          @click.prevent="showOptions = !showOptions"
        >
          <p class="font-semibold">
            {{ placeholder }}
          </p>
          <NuxtIcon name="chevron-up" class="transition-transform" :class="{ 'rotate-180': showOptions }" />
        </button>
      </div>
      <div v-if="selectedOptions.length" class="flex flex-wrap gap-1 lg:gap-2 px-3" :class="{ 'pb-2 lg:pb-3': selectedOptions.length }">
        <TransitionGroup name="fade" appear>
          <button
            v-for="(option, index) in selectedOptions"
            :key="option.name"
            class="flex items-center gap-1 px-1 py-0.5 bg-accent-1 rounded-sm text-xs lg:text-sm text-secondary lg:px-1.5 lg:py-1"
            @click.prevent="removeOption(index)"
          >
            <p>{{ option.label }}</p>
            <NuxtIcon name="x-close" class="text-sm lg:text-base" />
          </button>
        </TransitionGroup>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="showOptions"
        class="flex flex-col bg-secondary border border-accent-2 rounded-b text-primary"
      >
        <div v-if="showOptions" class="flex items-center gap-1 px-3 py-2 bg-secondary-2">
          <button :disabled="!optionsQuery.length" @click.prevent="optionsQuery = ''">
            <NuxtIcon :name="optionsQuery.length ? 'x-close' : 'search-tool'" class="text-accent text-lg" />
          </button>
          <input
            v-model="optionsQuery"
            type="text"
            :placeholder="searchMessage"
            class="w-full bg-transparent outline-none placeholder-accent text-sm lg:text-base"
          >
        </div>
        <div class="flex flex-col max-h-[120px] lg:max-h-[160px] text-sm lg:text-base overflow-y-auto">
          <button
            v-for="option in filteredOptions"
            :key="option.id ?? option.name"
            class="flex px-3 py-2 active:bg-accent-2 active:text-secondary"
            @click.prevent="insertOption(option)"
          >
            {{ option.label }}
          </button>
          <p v-if="!filteredOptions.length" class="px-3 py-2 text-danger">
            {{ emptyMessage }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>
