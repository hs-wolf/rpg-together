<template>
  <div class="flex flex-col pb-[4.75rem]">
    <NuxtLoadingIndicator color="#6F6BF2" />
    <slot />
    <Navbar />
    <TableCardOptions />
  </div>
</template>
