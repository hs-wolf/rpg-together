<script setup lang="ts">
import type { AdvancedSelectOption } from '~/types'

const props = defineProps<{
  options: AdvancedSelectOption[]
  initialValue?: AdvancedSelectOption[]
  placeholderMessage: string
  searchMessage: string
  emptyMessage: string
  enableSearch: boolean
}>()
const emits = defineEmits<{ (_e: 'changeOptions', _items: AdvancedSelectOption[]): void }>()

const componentRef = ref()
const showOptions = ref(false)

const selectedOptions = ref<AdvancedSelectOption[]>([])
const optionsQuery = ref('')
const filteredOptions = computed(() =>
  props.options
    .filter(item => !selectedOptions.value.includes(item))
    .filter(item => item.label.toLowerCase().includes(optionsQuery.value.toLowerCase())),
)

onClickOutside(componentRef, () => {
  showOptions.value = false
})

function changeOptions() {
  emits('changeOptions', selectedOptions.value)
}

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

onMounted(() => {
  if (props.initialValue)
    selectedOptions.value = props.initialValue
})

defineExpose({
  clearOptions,
})
</script>

<template>
  <div ref="componentRef" class="relative flex flex-col shadow text-sm lg:text-base" :class="{ 'w-full': showOptions }">
    <div
      class="flex flex-col border bg-primary-2"
      :class="[showOptions ? 'border-accent-2 rounded-t-sm' : 'border-primary-1 rounded-sm']"
    >
      <button
        class="flex items-center gap-1 p-2 lg:p-3 text-secondary"
        :class="{ 'w-full': !showOptions }"
        @click.prevent="showOptions = !showOptions"
      >
        <p class="font-medium">
          {{ placeholderMessage }}
        </p>
        <NuxtIcon name="chevron-up" class="transition-transform lg:text-lg" :class="showOptions ? 'rotate-0' : 'rotate-180'" />
      </button>
      <Transition name="fade">
        <div v-if="selectedOptions.length" class="flex flex-wrap gap-2 px-2 lg:px-3" :class="{ 'pb-2 lg:pb-3': selectedOptions.length }">
          <TransitionGroup name="fade">
            <button
              v-for="(option, index) in selectedOptions"
              :key="option.name"
              class="flex items-center gap-1 px-1 py-0.5 lg:py-1 lg:px-1.5 bg-accent-2 rounded-sm text-xs lg:text-sm text-secondary"
              @click.prevent="removeOption(index)"
            >
              <p class="leading-none">
                {{ option.label }}
              </p>
              <NuxtIcon name="x-close" />
            </button>
          </TransitionGroup>
        </div>
      </Transition>
    </div>
    <Transition name="fade">
      <div
        v-if="showOptions"
        class="relative -top-[1px] flex flex-col bg-primary-2 border border-accent-2 rounded-b-sm text-sm lg:text-base text-secondary"
      >
        <div v-if="showOptions && enableSearch" class="flex bg-primary">
          <NuxtIcon name="search-tool" class="p-3 text-accent-1" />
          <input
            v-model="optionsQuery"
            type="text"
            :placeholder="searchMessage"
            class="w-full bg-transparent outline-none placeholder-accent-1 placeholder:font-normal text-secondary font-medium leading-none"
          >
        </div>
        <div class="flex flex-col" :class="{ 'max-h-[190px] overflow-y-auto': enableSearch }">
          <button
            v-for="option in filteredOptions"
            :key="option.name"
            class="p-2 lg:p-3 text-start active:bg-accent-2"
            @click.prevent="insertOption(option)"
          >
            {{ option.label }}
          </button>
          <p v-if="!filteredOptions.length" class="px-2 py-4 lg:px-3 lg:py-5 text-secondary-2 leading-none">
            {{ emptyMessage }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>
