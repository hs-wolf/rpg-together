<script setup lang="ts">
const props = defineProps<{
  type?: string;
  name: string;
  label: string;
  placeholder: string;
  modelValue?: string;
  maxlength?: number;
  autocomplete?: 'on' | 'off';
  disabled?: boolean;
  error?: string;
}>();
defineEmits<{ (e: 'update:modelValue'): void }>();

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
    <div class="relative flex items-center h-10 border rounded" :class="error ? 'border-red-500' : 'border-primary-light'">
      <div v-if="slots['field-icon']" class="shrink-0 flex justify-center items-center w-10 h-10 pointer-events-none">
        <slot name="field-icon" />
      </div>
      <input
        :type="finalType"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        :maxlength="maxlength"
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
    <span v-if="error" class="relative self-end p-2 bg-red-500 rounded text-xs">
      <p>{{ error }}</p>
      <div class="absolute bottom-full error-message-arrow-up"></div>
    </span>
  </div>
</template>
