<script setup lang="ts">
import { AdvancedSelectOption } from '~/types';

const props = defineProps<{
  options: AdvancedSelectOption[];
  initialValue?: AdvancedSelectOption[];
  placeholderMessage: string;
  searchMessage: string;
  emptyMessage: string;
}>();
const emits = defineEmits<{ (e: 'change', items: AdvancedSelectOption[]): void }>();

const componentRef = ref<HTMLElement>();
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
  emits('change', selectedOptions.value);
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
      class="flex flex-col border bg-secondary"
      :class="[showOptions ? 'border-accent-dark rounded-t-sm' : 'border-secondary-light rounded-sm']"
    >
      <div class="flex flex-col">
        <button
          class="flex items-center gap-1 p-3 text-primary"
          :class="{ 'w-full': !showOptions }"
          @click.prevent="showOptions = !showOptions"
        >
          <p class="font-semibold">{{ placeholderMessage }}</p>
          <Icon name="ion:chevron-up" class="transition-transform" :class="{ 'rotate-180': showOptions }" />
        </button>
      </div>
      <div class="flex flex-wrap gap-2 px-3" :class="{ 'pb-3': selectedOptions.length }">
        <TransitionGroup name="fade">
          <button
            v-for="(option, index) in selectedOptions"
            :key="option.name"
            class="flex items-center gap-1 px-1.5 py-1 bg-accent-dark rounded-sm text-xs text-secondary"
            @click.prevent="removeOption(index)"
          >
            <p>{{ option.label }}</p>
            <Icon name="material-symbols:close" />
          </button>
        </TransitionGroup>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="showOptions"
        class="z-10 absolute top-[calc(100%-1px)] inset-x-0 flex flex-col bg-secondary border border-accent-dark rounded-b text-primary"
      >
        <div v-if="showOptions" class="flex items-center gap-2 p-3 h-10 bg-secondary-dark">
          <Icon name="material-symbols:search" class="text-accent-dark" />
          <input
            type="text"
            v-model="optionsQuery"
            :placeholder="searchMessage"
            class="w-full bg-transparent outline-none placeholder-accent-dark placeholder:font-normal"
          />
        </div>
        <div class="flex flex-col max-h-[190px] overflow-y-auto">
          <button
            v-for="option in filteredOptions"
            :key="option.id ?? option.name"
            class="flex p-3 active:bg-accent-dark active:text-secondary"
            @click.prevent="insertOption(option)"
          >
            <span>{{ option.label }}</span>
          </button>
          <p v-if="!filteredOptions.length" class="px-3 py-4 text-primary-light">{{ emptyMessage }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
