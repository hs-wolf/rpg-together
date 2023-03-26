<script setup lang="ts">
import { Table } from '@rpg-together/models';

const props = defineProps<{ show: boolean; table: Table }>();

const emits = defineEmits<{ (e: 'close'): void }>();

const localeRoute = useLocaleRoute();

const cardRef = ref<HTMLDivElement>();
onClickOutside(cardRef, () => {
  emits('close');
});

const viewTable = () => {
  navigateTo(localeRoute({ path: `/tables/${props.table.id}` }));
  emits('close');
};

// TODO: Need to create the logic.
const viewOwner = () => {
  emits('close');
};

// TODO: Need to create the logic.
const report = () => {
  emits('close');
};

type Option = { name: string; label: string; icon: string; action: Function; enabled: boolean; extraCss?: string };
const options: Option[] = [
  {
    name: 'view-table',
    label: 'table-card-options.view-table',
    icon: 'bar-table',
    action: () => viewTable(),
    enabled: true,
  },
  {
    name: 'view-owner',
    label: 'table-card-options.view-owner',
    icon: 'user',
    action: () => viewOwner(),
    enabled: false,
  },
  {
    name: 'report',
    label: 'table-card-options.report',
    icon: 'danger',
    action: () => report(),
    enabled: false,
    extraCss: 'text-danger',
  },
];
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal justify-center p-3">
      <div ref="cardRef" class="flex flex-col gap-3 w-full p-3 bg-secondary rounded shadow text-sm text-primary break-all">
        <h1 class="font-semibold uppercase">{{ table.title }}</h1>
        <hr class="border-secondary-dark" />
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="option in options"
            :key="option.name"
            @click.prevent="option.action"
            class="btn-effect flex flex-col items-center gap-1"
            :class="[option.extraCss, { 'opacity-50 pointer-events-none': !option.enabled }]"
          >
            <NuxtIcon :name="option.icon" class="text-2xl" />
            <p>{{ $t(option.label) }}</p>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
