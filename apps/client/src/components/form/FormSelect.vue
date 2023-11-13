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
      :class="[showOptions ? 'border-accent-dark rounded-t-sm' : 'border-secondary-light rounded-sm']"
    >
      <div class="flex flex-col">
        <button
          class="flex items-center gap-1 p-2 lg:p-3 text-primary"
          :class="{ 'w-full': !showOptions }"
          @click.prevent="showOptions = !showOptions"
        >
          <p class="font-semibold">
            {{ placeholder }}
          </p>
          <NuxtIcon name="chevron-up" class="transition-transform" :class="{ 'rotate-180': showOptions }" />
        </button>
      </div>
      <div class="flex flex-wrap gap-2 px-2 lg:px-3" :class="{ 'pb-2 lg:pb-3': selectedOptions.length }">
        <TransitionGroup name="fade">
          <button
            v-for="(option, index) in selectedOptions"
            :key="option.name"
            class="flex items-center gap-1 px-1.5 py-1 bg-accent-dark rounded-sm text-xs text-secondary"
            @click.prevent="removeOption(index)"
          >
            <p>{{ option.label }}</p>
            <NuxtIcon name="x-close" />
          </button>
        </TransitionGroup>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="showOptions"
        class="flex flex-col bg-secondary border border-accent-dark rounded-b text-primary"
      >
        <div v-if="showOptions" class="flex items-center gap-2 p-2 lg:p-3 bg-secondary-dark">
          <NuxtIcon name="search-tool" class="text-accent-dark text-lg" />
          <input
            v-model="optionsQuery"
            type="text"
            :placeholder="searchMessage"
            class="w-full bg-transparent outline-none placeholder-accent-dark placeholder:font-normal"
          >
        </div>
        <div class="flex flex-col max-h-[190px] overflow-y-auto">
          <button
            v-for="option in filteredOptions"
            :key="option.id ?? option.name"
            class="flex p-2 lg:p-3 active:bg-accent-dark active:text-secondary"
            @click.prevent="insertOption(option)"
          >
            <span>{{ option.label }}</span>
          </button>
          <p v-if="!filteredOptions.length" class="px-2 py-3 text-primary-light">
            {{ emptyMessage }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>
