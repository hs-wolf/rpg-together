<template>
  <div class="relative flex flex-col h-full pb-16 lg:pb-0">
    <NuxtLoadingIndicator color="#6F6BF2" />
    <Navbar />
    <div class="flex-1 flex flex-col w-full overflow-y-auto">
      <slot />
      <Footer />
    </div>
  </div>
</template>
