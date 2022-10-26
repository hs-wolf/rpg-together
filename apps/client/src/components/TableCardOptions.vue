<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTablesStore } from '~/stores';

const tablesStore = useTablesStore();
const { showTableCardOptionsModal, selectedTableCard } = storeToRefs(tablesStore);

const cardRef = ref<HTMLDivElement>();
onClickOutside(cardRef, () => {
  if (!showTableCardOptionsModal.value) {
    return;
  }
  tablesStore.toggleTableCardOptions();
});

// TODO: Need to create the logic.
const applyToTable = () => {
  tablesStore.toggleTableCardOptions();
};

// TODO: Need to create the logic.
const viewTable = () => {
  tablesStore.toggleTableCardOptions();
};

// TODO: Need to create the logic.
const viewOwner = () => {
  tablesStore.toggleTableCardOptions();
};

// TODO: Need to create the logic.
const report = () => {
  tablesStore.toggleTableCardOptions();
};
</script>

<template>
  <Transition name="fade">
    <div v-if="showTableCardOptionsModal" class="modal justify-center p-3">
      <div
        ref="cardRef"
        class="flex flex-col items-start gap-3 w-full p-3 bg-secondary rounded shadow text-sm text-primary break-all"
      >
        <h1 class="font-semibold">{{ selectedTableCard?.title }}</h1>
        <button @click.prevent="applyToTable" class="text-accent">{{ $t('table-card-options.apply-to-table') }}</button>
        <button @click.prevent="viewTable">{{ $t('table-card-options.view-table') }}</button>
        <button @click.prevent="viewOwner">{{ $t('table-card-options.view-owner') }}</button>
        <button @click.prevent="report" class="text-red-500">{{ $t('table-card-options.report') }}</button>
      </div>
    </div>
  </Transition>
</template>
