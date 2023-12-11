<template>
  <div class="relative flex flex-col h-full pb-[58px] lg:pb-0">
    <Navbar />
    <div class="flex-1 flex flex-col overflow-y-auto">
      <slot />
      <Footer />
    </div>
  </div>
</template>
