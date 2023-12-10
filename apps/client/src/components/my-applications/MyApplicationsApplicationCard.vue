<script setup lang="ts">
import type { AcceptMessage, Application } from '@rpg-together/models'
import { ApplicationStatus } from '@rpg-together/models'
import { DEFAULT_TABLE_BANNER, DEFAULT_USER_AVATAR } from '@rpg-together/utilities'

const props = defineProps<{ application: Application }>()

const localeRoute = useLocaleRoute()

const showInfo = ref(false)
const showDeleteModal = ref(false)
const acceptMessage = ref<AcceptMessage>()

const statusColor = computed(() => {
  switch (props.application.status) {
    case ApplicationStatus.WAITING:
      return 'text-blue-500'
    case ApplicationStatus.ACCEPTED:
      return 'text-green-500'
    case ApplicationStatus.DECLINED:
      return 'text-danger'
    default:
      return 'text-blue-500'
  }
})

const statusIcon = computed(() => {
  switch (props.application.status) {
    case ApplicationStatus.WAITING:
      return 'analog-clock'
    case ApplicationStatus.ACCEPTED:
      return 'check'
    case ApplicationStatus.DECLINED:
      return 'danger'
    default:
      return 'analog-clock'
  }
})

onMounted(async () => {
  if (props.application.status === ApplicationStatus.ACCEPTED)
    acceptMessage.value = await useRpgTogetherAPI.getApplicationAcceptMessage({ applicationId: props.application.id })
})
</script>

<template>
  <div class="relative flex flex-col text-primary">
    <NuxtImg
      :src="application.table.banner ?? DEFAULT_TABLE_BANNER"
      :alt="application.table.title"
      width="128"
      height="128"
      format="webp"
      class="w-full h-32 lg:h-48 rounded-t-sm object-cover"
    />
    <div class="absolute self-end flex m-1 gap-2 lg:gap-3">
      <NuxtLink :to="localeRoute({ path: `/profile/${application.table?.owner?.id}` })" class="btn-primary gap-2 overflow-hidden">
        <NuxtImg
          :src="application.table?.owner?.avatar ?? DEFAULT_USER_AVATAR"
          :alt="application.table?.owner?.username"
          width="24px"
          height="24px"
          format="webp"
          class="shadow rounded-full w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]"
        />
        <h1 class="truncate font-semibold lg:text-lg">
          {{ application.table?.owner?.username }}
        </h1>
      </NuxtLink>
      <NuxtLink :to="localeRoute({ path: `/tables/${application.table?.id}` })" class="btn-secondary gap-2">
        <NuxtIcon name="bar-table" class="text-xl lg:text-2xl" />
        <p>{{ $t('components.my-applications.application-card.view-table') }}</p>
      </NuxtLink>
    </div>
    <div class="flex flex-col gap-[1px] shadow overflow-hidden">
      <button
        class="z-10 flex justify-between items-center p-2 lg:p-3 bg-secondary"
        :class="{ 'rounded-b-sm': !showInfo }"
        @click.prevent="showInfo = !showInfo"
      >
        <div class="flex items-center gap-2 text-start">
          <NuxtIcon :name="statusIcon" class="text-xl" :class="statusColor" />
          <i18n-t keypath="components.my-applications.application-card.applying-to" tag="span" scope="global">
            <template #text>
              <span class="lg:text-lg font-semibold break-all">{{ application.table.title }}</span>
            </template>
          </i18n-t>
        </div>
        <NuxtIcon name="chevron-up" class="shrink-0 text-xl lg:text-2xl transition-transform" :class="{ 'rotate-180': showInfo }" />
      </button>
      <Transition name="slide-down">
        <div v-if="showInfo" class="card-secondary gap-5 rounded-t-none">
          <i18n-t
            keypath="components.my-applications.application-card.your-message"
            tag="p"
            scope="global"
            class="flex flex-col gap-1 font-semibold"
          >
            <template #text>
              <span class="lg:text-lg font-normal font-roboto-slab leading-5 whitespace-pre-line">
                {{ application?.message }}
              </span>
            </template>
          </i18n-t>
          <hr class="border-secondary-dark">
          <i18n-t keypath="components.my-applications.application-card.status" tag="p" scope="global" class="font-semibold">
            <template #text>
              <span class="lg:text-lg" :class="statusColor">
                {{ application?.status }}
              </span>
            </template>
          </i18n-t>
          <i18n-t
            v-if="application.status === ApplicationStatus.ACCEPTED"
            keypath="components.my-applications.application-card.owner-message"
            tag="p"
            scope="global"
            class="flex flex-col gap-1 font-semibold"
          >
            <template #text>
              <span class="lg:text-lg font-roboto-slab font-normal leading-5 whitespace-pre-line">
                {{ acceptMessage?.message }}
              </span>
            </template>
          </i18n-t>
          <p v-if="application.status === ApplicationStatus.DECLINED" class="lg:text-lg">
            {{ $t('components.my-applications.application-card.declined-message') }}
          </p>
          <div class="flex justify-end">
            <button class="btn-danger" @click.prevent="showDeleteModal = !showDeleteModal">
              <NuxtIcon name="trash" class="text-xl lg:text-2xl" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
    <MyApplicationsDeleteApplicationModal :show="showDeleteModal" :application="application" @close="showDeleteModal = false" />
  </div>
</template>
