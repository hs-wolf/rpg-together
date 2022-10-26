<script setup lang="ts">
import { AdvancedSelectOption } from '~~/custom-types';

const props = defineProps<{
  options: AdvancedSelectOption[];
  initialValue?: AdvancedSelectOption[];
  placeholderMessage: string;
  searchMessage: string;
  emptyMessage: string;
}>();
const emits = defineEmits<{ (e: 'change-options', items: AdvancedSelectOption[]): void }>();

const componentRef = ref();
const showOptions = ref(false);

const selectedOptions = ref<AdvancedSelectOption[]>([]);
const optionsQuery = ref('');
const filteredOptions = computed(() =>
  props.options
    .filter((item) => !selectedOptions.value.includes(item))
    .filter((item) => item.label.toLowerCase().includes(optionsQuery.value.toLowerCase()))
);

onClickOutside(componentRef, () => {
  showOptions.value = false;
});

const changeOptions = () => {
  emits('change-options', selectedOptions.value);
};

const insertOption = (item: AdvancedSelectOption) => {
  selectedOptions.value.push(item);
  if (!filteredOptions.value.length) {
    optionsQuery.value = '';
    showOptions.value = false;
  }
  changeOptions();
};

const removeOption = (index: number) => {
  selectedOptions.value.splice(index, 1);
  changeOptions();
};

const clearOptions = () => {
  selectedOptions.value = [];
  showOptions.value = false;
  changeOptions();
};

onMounted(() => {
  if (props.initialValue) {
    selectedOptions.value = props.initialValue;
  }
});

defineExpose({
  clearOptions,
});
</script>

<template>
  <div ref="componentRef" class="relative flex flex-col shadow text-sm" :class="{ 'w-full': showOptions }">
    <div
      class="flex flex-col border bg-primary-dark"
      :class="[showOptions ? 'border-accent-dark rounded-t' : 'border-primary-light rounded']"
    >
      <div class="flex flex-col">
        <button
          class="flex items-center gap-1 p-3 text-secondary"
          :class="{ 'w-full': !showOptions }"
          @click.prevent="showOptions = !showOptions"
        >
          <p class="font-medium leading-none">{{ placeholderMessage }}</p>
          <NuxtIcon name="chevron-up" class="transition-transform" :class="showOptions ? 'rotate-0' : 'rotate-180'" />
        </button>
      </div>
      <div class="flex flex-wrap gap-2 px-3" :class="{ 'pb-3': selectedOptions.length }">
        <TransitionGroup name="fade">
          <button
            v-for="(option, index) in selectedOptions"
            :key="option.name"
            class="flex items-center gap-1 px-1 py-0.5 bg-accent-dark rounded text-xs text-secondary"
            @click.prevent="removeOption(index)"
          >
            <p class="leading-none">{{ option.label }}</p>
            <NuxtIcon name="close" />
          </button>
        </TransitionGroup>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="showOptions"
        class="z-10 absolute top-[calc(100%-1px)] inset-x-0 flex flex-col bg-primary-dark border border-accent-dark rounded-b text-sm text-secondary"
      >
        <div v-if="showOptions" class="flex bg-primary">
          <NuxtIcon name="search" class="p-3 text-accent-light" />
          <input
            type="text"
            v-model="optionsQuery"
            :placeholder="searchMessage"
            class="w-full bg-transparent outline-none placeholder-accent-light placeholder:font-normal text-secondary font-medium leading-none"
          />
        </div>
        <div class="flex flex-col max-h-[190px] overflow-y-auto">
          <button
            v-for="option in filteredOptions"
            :key="option.name"
            class="p-3 text-start leading-none active:bg-accent-dark"
            @click.prevent="insertOption(option)"
          >
            {{ option.label }}
          </button>
          <p v-if="!filteredOptions.length" class="px-3 py-6 text-secondary-dark leading-none">{{ emptyMessage }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
