<script setup lang="ts">
const props = defineProps<{
  type?: string
  name: string
  label: string
  placeholder: string
  modelValue?: string
  maxlength?: number
  autocomplete?: 'on' | 'off'
  disabled?: boolean
  error?: string
  theme?: 'primary' | 'secondary'
}>()
defineEmits<{ (_e: 'update:modelValue'): void }>()

const slots = useSlots()
const showPassword = ref(false)

const finalType = computed(() => {
  return props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type
})

const inputFinalClass = computed(() => {
  return slots['field-icon'] ? (props.type === 'password' ? '' : 'mr-3') : props.type === 'password' ? 'ml-3' : 'mx-3'
})

const wrapperCustomClass = computed(() => {
  const bg = !props.theme || props.theme === 'primary' ? 'bg-primary' : 'bg-secondary'
  const text = !props.theme || props.theme === 'primary' ? 'text-secondary' : 'text-primary'
  const border = props.error
    ? 'border-danger'
    : !props.theme || props.theme === 'primary'
        ? 'border-primary-1'
        : 'border-secondary-2'
  return `${bg} ${text} ${border}`
})
</script>

<template>
  <div class="flex flex-col gap-2" :class="{ 'opacity-50 pointer-events-none': disabled }">
    <div class="relative flex items-center h-10 border rounded-sm" :class="wrapperCustomClass">
      <div v-if="slots['field-icon']" class="shrink-0 flex justify-center items-center w-10 h-10 pointer-events-none">
        <slot name="field-icon" />
      </div>
      <input
        :type="finalType"
        :name="name"
        :placeholder="placeholder"
        :value="modelValue"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        class="flex items-center w-full h-full outline-none bg-transparent"
        :class="inputFinalClass"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <button
        v-if="type === 'password'"
        class="shrink-0 flex justify-center items-center w-10 h-10 text-xl transition-transform active:scale-90"
        @click.prevent="showPassword = !showPassword"
      >
        <slot v-if="showPassword" name="show-password-icon" />
        <slot v-else name="hide-password-icon" />
      </button>
    </div>
    <FormErrorMessage :error="error ?? ''" />
  </div>
</template>
