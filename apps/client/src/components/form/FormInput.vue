<script setup lang="ts">
const props = defineProps<{
  type?: string;
  name: string;
  label: string;
  placeholder: string;
  modelValue;
  error?;
  autocomplete?: 'on' | 'off';
  disabled?: boolean;
}>();
defineEmits<{ (e: 'update:modelValue') }>();

const slots = useSlots();
const showPassword = ref(false);

const finalType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

const inputFinalClass = computed(() => {
  if (slots['field-icon']) {
    if (props.type === 'password') {
      return '';
    }
    return 'mr-3';
  } else {
    if (props.type === 'password') {
      return 'ml-3';
    }
    return 'mx-3';
  }
});
</script>

<template>
  <div class="flex flex-col gap-2" :class="{ 'opacity-50 pointer-events-none': disabled }">
    <div class="relative flex items-center border rounded" :class="error ? 'border-red-500' : 'border-primary-light'">
      <div v-if="slots['field-icon']" class="shrink-0 flex justify-center items-center w-10 h-10 pointer-events-none">
        <slot name="field-icon" />
      </div>
      <input
        :type="finalType"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :autocomplete="autocomplete"
        class="flex items-center w-full outline-none bg-primary rounded text-secondary"
        :class="inputFinalClass"
      />
      <button
        v-if="type === 'password'"
        class="shrink-0 flex justify-center items-center w-10 h-10 text-xl transition-transform active:scale-90"
        @click.prevent="showPassword = !showPassword"
      >
        <slot v-if="showPassword" name="show-password-icon" />
        <slot v-else name="hide-password-icon" />
      </button>
    </div>
    <span v-if="error" class="relative px-2 py-1 self-end text-sm bg-red-500 rounded">
      <p>{{ error }}</p>
      <div class="absolute bottom-full arrow-up"></div>
    </span>
  </div>
</template>

<style scoped>
.arrow-up {
  @apply w-0 h-0;
  @apply border-l-4 border-l-transparent;
  @apply border-r-4 border-r-transparent;
  @apply border-b-4 border-b-red-500;
}
</style>
