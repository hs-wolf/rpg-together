<template>
  <div class="relative flex flex-col h-full pb-[58px] lg:pb-0">
    <NuxtLoadingIndicator color="#6f6bf2" />
    <Navbar />
    <div class="flex-1 flex flex-col w-full overflow-y-auto">
      <slot />
      <Footer />
    </div>
  </div>
</template>
