<template>
  <i18n-t keypath="components.recaptcha.message" tag="div" scope="global" class="text-center text-xs lg:text-sm text-secondary-2">
    <template #privacy>
      <a href="https://policies.google.com/privacy" target="_blank" class="text-accent-1">
        {{ $t('components.recaptcha.privacy') }}
      </a>
    </template>
    <template #tos>
      <a href="https://policies.google.com/terms" target="_blank" class="text-accent-1">
        {{ $t('components.recaptcha.tos') }}
      </a>
    </template>
  </i18n-t>
</template>
