<template>
  <div class="fixed inset-0 flex flex-col gap-3 justify-center items-center">
    <NuxtLoadingIndicator color="#6F6BF2" />
    <slot />
    <Snackbar />
  </div>
</template>
