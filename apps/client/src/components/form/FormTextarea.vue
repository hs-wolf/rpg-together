<script setup lang="ts">
const props = defineProps<{
  name: string;
  label: string;
  placeholder: string;
  modelValue?: string;
  maxlength?: number;
  rows?: number;
  resize?: boolean;
  disabled?: boolean;
  error?: string;
}>();
defineEmits<{ (e: 'update:modelValue'): void }>();

const slots = useSlots();

const textareaFinalClass = computed(() => {
  let classes = '';
  if (slots['field-icon']) {
    classes = 'my-2 pr-2 pl-0';
  } else {
    classes = 'my-2 px-2';
  }
  classes = props.resize ? classes : `${classes} resize-none`;
  return classes;
});
</script>

<template>
  <div class="flex flex-col gap-2" :class="{ 'opacity-50 pointer-events-none': disabled }">
    <div class="flex flex-col min-h-10 border rounded" :class="error ? 'border-red-500' : 'border-primary-light'">
      <div class="flex">
        <div v-if="slots['field-icon']" class="flex justify-center items-center w-10 h-10 pointer-events-none">
          <slot name="field-icon" />
        </div>
        <textarea
          :name="name"
          :placeholder="placeholder"
          :value="modelValue"
          :maxlength="maxlength"
          :rows="rows"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          class="flex items-center w-full h-auto outline-none bg-primary rounded text-secondary leading-6"
          :class="textareaFinalClass"
        ></textarea>
      </div>
      <div v-if="maxlength && modelValue?.length" class="flex justify-end p-2 pt-0 text-sm text-secondary-dark">
        {{ `${modelValue?.length} / ${maxlength}` }}
      </div>
    </div>
    <span v-if="error" class="relative self-end p-2 bg-red-500 rounded text-xs">
      <p>{{ error }}</p>
      <div class="absolute bottom-full error-message-arrow-up"></div>
    </span>
  </div>
</template>
