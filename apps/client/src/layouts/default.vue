<template>
  <div class="flex flex-col min-h-screen pb-16">
    <NuxtLoadingIndicator color="#6F6BF2" />
    <slot />
    <Navbar />
    <TableCardOptions />
    <Snackbar />
  </div>
</template>
