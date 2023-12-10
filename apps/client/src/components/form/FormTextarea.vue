<script setup lang="ts">
const props = defineProps<{
  name: string
  label: string
  placeholder: string
  modelValue?: string
  maxlength?: number
  rows?: number
  resize?: boolean
  disabled?: boolean
  error?: string
}>()
defineEmits<{ (_e: 'update:modelValue'): void }>()

const slots = useSlots()

const textareaFinalClass = computed(() => {
  let classes = ''
  if (slots['field-icon'])
    classes = 'my-2 pr-2 pl-0'
  else
    classes = 'my-2 px-2'

  classes = props.resize ? classes : `${classes} resize-none`
  return classes
})
</script>

<template>
  <div class="flex flex-col gap-2" :class="{ 'opacity-50 pointer-events-none': disabled }">
    <div class="flex flex-col min-h-10 bg-primary border rounded" :class="error ? 'border-danger' : 'border-primary-1'">
      <div class="flex">
        <div v-if="slots['field-icon']" class="flex justify-center items-center w-10 h-10 text-secondary pointer-events-none">
          <slot name="field-icon" />
        </div>
        <textarea
          :name="name"
          :placeholder="placeholder"
          :value="modelValue"
          :maxlength="maxlength"
          :rows="rows"
          class="flex items-center w-full h-auto outline-none bg-transparent rounded text-secondary leading-6"
          :class="textareaFinalClass"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div v-if="maxlength && modelValue?.length" class="flex justify-end p-2 pt-0 text-sm text-secondary-2">
        {{ `${modelValue?.length} / ${maxlength}` }}
      </div>
    </div>
    <span v-if="error" class="relative self-end p-2 bg-danger rounded text-xs">
      <p>{{ error }}</p>
      <div class="absolute bottom-full error-message-arrow-up" />
    </span>
  </div>
</template>
