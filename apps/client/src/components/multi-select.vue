<script setup lang="ts">
import { MultiSelectOption } from '~~/types';

const props = defineProps<{ options: MultiSelectOption[]; initialValue?: MultiSelectOption[]; placeholder: string }>();
const emits = defineEmits<{ (e: 'changeOptions', items: MultiSelectOption[]): void }>();

const componentRef = ref();
const showOptions = ref(false);

const selectedOptions = ref<MultiSelectOption[]>([]);
const optionsQuery = ref('');
const filteredOptions = computed(() => props.options.filter((item) => !selectedOptions.value.includes(item)));

onClickOutside(componentRef, () => {
  showOptions.value = false;
});

const insertOption = (item: MultiSelectOption) => {
  selectedOptions.value.push(item);
  if (!filteredOptions.value.length) {
    showOptions.value = false;
  }
  changeOptions();
};

const removeOption = (index: number) => {
  selectedOptions.value.splice(index, 1);
  changeOptions();
};

const changeOptions = () => {
  emits('changeOptions', selectedOptions.value);
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
  <div
    ref="componentRef"
    class="relative flex flex-col shadow text-sm"
    :class="{ 'w-full': showOptions || selectedOptions.length }"
  >
    <div
      class="flex flex-col border"
      :class="[showOptions ? 'bg-primary-dark border-accent-dark rounded-t' : ' bg-primary border-primary-light rounded']"
    >
      <div class="flex">
        <button
          class="flex items-center gap-1 p-3 text-secondary"
          :class="{ 'w-full': !showOptions }"
          @click.prevent="showOptions = !showOptions"
        >
          <p class="font-medium leading-none">{{ placeholder }}</p>
          <nuxt-icon name="chevron-up" class="transition-transform" :class="showOptions ? 'rotate-0' : 'rotate-180'" />
        </button>
        <transition name="fade">
          <div v-if="showOptions" class="flex items-center text-secondary-dark">
            <nuxt-icon name="search" />
            <input
              type="text"
              v-model="optionsQuery"
              placeholder="Search"
              class="w-full px-2 bg-transparent outline-none placeholder-secondary-dark placeholder:font-normal text-secondary font-medium"
            />
          </div>
        </transition>
      </div>
      <div class="flex flex-wrap gap-2 px-3" :class="{ 'pb-3': selectedOptions.length }">
        <transition-group name="fade">
          <button
            v-for="(option, index) in selectedOptions"
            :key="option.name"
            class="flex items-center gap-1 px-1 bg-accent rounded text-secondary"
            @click.prevent="removeOption(index)"
          >
            <p>{{ option.label }}</p>
            <nuxt-icon name="close" />
          </button>
        </transition-group>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="showOptions"
        class="z-10 absolute top-[calc(100%-1px)] inset-x-0 flex flex-col max-h-[190px] bg-primary-dark border border-accent-dark rounded-b text-sm text-secondary overflow-y-auto"
      >
        <button
          v-for="option in filteredOptions"
          :key="option.name"
          class="p-3 text-start text-secondary-dark leading-none active:bg-primary"
          @click.prevent="insertOption(option)"
        >
          {{ option.label }}
        </button>
        <p v-if="!filteredOptions.length" class="p-3 text-primary-light">No options left.</p>
      </div>
    </transition>
  </div>
</template>
