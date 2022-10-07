<script setup lang="ts">
const tables = ref([
  {
    id: '1',
    title: 'Abyss Temple',
    flairs: ['D&D', 'Adult content', 'English', '8 Slots', 'Dark Fantasy'],
    owner: {
      avatar: 'https://i.pinimg.com/280x280_RS/6b/c7/31/6bc731fbe8866f02d929c5579ccd4f45.jpg',
      name: 'Username 1',
    },
    summary:
      'Sed blandit ornare tellus, non iaculis risus aliquet at. Suspendisse lectus nibh, porta non lacinia sit amet, molestie quis magna. Nullam rhoncus, nulla non gravida pellentesque, nisl orci tempor erat, lacinia imperdiet turpis sem non orci. Donec vel orci.',
    banner: 'https://www.pcgamesn.com/wp-content/uploads/2022/01/fantasy-games-elden-ring.jpg',
  },
  {
    id: '2',
    title: 'Cursed Pirates',
    flairs: ['7th Sea', 'Adult content', 'English', '3 Slots', 'Sword and Cape'],
    owner: {
      avatar: 'https://i.pinimg.com/280x280_RS/6b/c7/31/6bc731fbe8866f02d929c5579ccd4f45.jpg',
      name: 'Username 2',
    },
    summary:
      'Aenean ornare vehicula lectus, accumsan varius eros blandit ut. Sed molestie, sapien id facilisis tincidunt, sapien purus tristique tortor, at feugiat enim est et ipsum. Aenean nec finibus enim, quis sodales mi. Curabitur fermentum magna nec nunc pharetra.',
    banner:
      'https://cdn.vox-cdn.com/thumbor/fccqXsZbPuH7DnlI4Qn7XybX34k=/0x0:2048x1152/1200x800/filters:focal(861x413:1187x739)/cdn.vox-cdn.com/uploads/chorus_image/image/70878822/2048_1152_nocopy.0.jpg',
  },
  {
    id: '3',
    title: 'Knights of the Round Table',
    flairs: ['7th Sea', 'Adult content', 'English', '3 Slots', 'Sword and Cape'],
    owner: {
      avatar: 'https://i.pinimg.com/280x280_RS/6b/c7/31/6bc731fbe8866f02d929c5579ccd4f45.jpg',
      name: 'Username 3',
    },
    summary:
      'Morbi blandit vestibulum pretium. Pellentesque feugiat leo in felis fermentum bibendum. Nullam massa orci, consequat et quam ut, posuere sodales ex. Quisque in tortor interdum, pharetra erat sed, congue ligula. Ut vitae massa vitae dui maximus luctus quam.',
    banner: 'https://i.ytimg.com/vi/q_weaD47HmY/maxresdefault.jpg',
  },
]);

const showOptionsMenu = ref(false);
const selectedTable = ref('');
const setOptionsMenu = (id?: string) => {
  selectedTable.value = id ?? '';
  showOptionsMenu.value = id && !showOptionsMenu.value ? true : false;
};

const optionsMenuRef = ref<HTMLDivElement>();
onClickOutside(optionsMenuRef, () => {
  if (!showOptionsMenu.value) {
    return;
  }
  setOptionsMenu();
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2 px-3 font-semibol">
      <nuxt-icon name="featured" />
      <h1>{{ $t('home-featured.title') }}</h1>
    </div>
    <div class="flex gap-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
      <div
        v-for="(table, index) in tables"
        :key="table.id"
        class="snap-center flex flex-col gap-3 min-w-full p-3 break-all text-primary bg-secondary"
      >
        <div class="flex items-center justify-between gap-2">
          <h1 class="font-semibold">{{ table.title }}</h1>
          <p class="text-xs whitespace-nowrap tracking-widest">{{ `(${index + 1}/${tables.length})` }}</p>
        </div>
        <p class="text-sm">{{ table.summary }}</p>
        <div class="flex flex-col justify-center max-h-64 overflow-hidden">
          <nuxt-img
            format="webp"
            fit="cover"
            loading="lazy"
            height="256"
            sizes="xs:100vw"
            :src="table.banner"
            :alt="table.title"
            class="rounded"
          />
        </div>
        <div class="flex flex-wrap gap-1 text-xs">
          <div v-for="flair in table.flairs" class="flex items-center p-1 bg-accent-dark shadow rounded text-secondary">
            {{ flair }}
          </div>
        </div>
        <div class="flex justify-between items-center gap-2 mt-auto text-sm">
          <div class="flex items-center gap-1">
            <nuxt-img
              format="webp"
              fit="cover"
              loading="lazy"
              width="20"
              height="20"
              sizes="xs:100vw"
              :src="table.owner.avatar"
              :alt="table.owner.name"
              class="w-5 shadow rounded-full"
            />
            <h1 class="font-semibold truncate">{{ table.owner.name }}</h1>
          </div>
          <button name="options" @click.prevent="setOptionsMenu(table.id)" class="btn-secondary">
            <nuxt-icon name="three-dots" class="text-xl" />
          </button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showOptionsMenu" class="modal justify-center p-3">
        <div
          ref="optionsMenuRef"
          class="flex flex-col items-start gap-3 w-full p-3 bg-secondary rounded shadow text-sm text-primary break-all"
        >
          <h1 class="font-semibold">{{ tables.find((table) => table.id === selectedTable)?.title }}</h1>
          <button class="text-accent">{{ $t('home-featured.apply-to-table') }}</button>
          <button>{{ $t('home-featured.view-table') }}</button>
          <button>{{ $t('home-featured.view-user') }}</button>
          <button class="text-red-500">{{ $t('home-featured.report') }}</button>
        </div>
      </div>
    </transition>
  </div>
</template>
