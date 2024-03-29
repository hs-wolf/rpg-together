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
    <div class="absolute inset-x-0 flex flex-wrap justify-end m-1 gap-2 lg:gap-3">
      <NuxtLink :to="localeRoute({ path: `/profile/${application.table?.owner?.id}` })" class="btn btn-primary w-auto">
        <NuxtImg
          :src="application.table?.owner?.avatar ?? DEFAULT_USER_AVATAR"
          :alt="application.table?.owner?.username"
          width="24px"
          height="24px"
          format="webp"
          class="shadow rounded-full aspect-square object-cover w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]"
        />
        <p class="truncate">
          {{ application.table?.owner?.username }}
        </p>
      </NuxtLink>
      <NuxtLink :to="localeRoute({ path: `/tables/${application.table?.id}` })" class="btn btn-secondary w-auto">
        <NuxtIcon name="bar-table" />
        <p>{{ $t('components.my-applications.application-card.view-table') }}</p>
      </NuxtLink>
    </div>
    <div class="flex flex-col gap-[1px] shadow overflow-hidden">
      <button
        class="z-10 flex justify-between items-center px-3 py-2 bg-secondary lg:text-lg"
        :class="{ 'rounded-b-sm': !showInfo }"
        @click.prevent="showInfo = !showInfo"
      >
        <div class="flex items-center gap-2 text-start">
          <NuxtIcon :name="statusIcon" class="text-xl lg:text-2xl" :class="statusColor" />
          <i18n-t keypath="components.my-applications.application-card.applying-to" tag="span" scope="global">
            <template #text>
              <span class="lg:text-lg font-semibold break-all">{{ application.table.title }}</span>
            </template>
          </i18n-t>
        </div>
        <NuxtIcon name="chevron-up" class="shrink-0 text-lg lg:text-xl transition-transform" :class="{ 'rotate-180': showInfo }" />
      </button>
      <Transition name="slide-down">
        <div v-if="showInfo" class="card-secondary gap-2 lg:gap-3 rounded-t-none">
          <i18n-t
            keypath="components.my-applications.application-card.your-message"
            tag="p"
            scope="global"
            class="flex flex-col gap-1 text-sm lg:text-base font-semibold"
          >
            <template #text>
              <span class="text-base lg:text-lg font-normal font-roboto-slab whitespace-pre-line">
                {{ application?.message }}
              </span>
            </template>
          </i18n-t>
          <hr class="border-secondary-2">
          <i18n-t keypath="components.my-applications.application-card.status" tag="p" scope="global" class="text-sm lg:text-base font-semibold">
            <template #text>
              <span class="text-base lg:text-lg" :class="statusColor">
                {{ application?.status }}
              </span>
            </template>
          </i18n-t>
          <i18n-t
            v-if="application.status === ApplicationStatus.ACCEPTED"
            keypath="components.my-applications.application-card.owner-message"
            tag="p"
            scope="global"
            class="flex flex-col gap-1 text-sm lg:text-base font-semibold"
          >
            <template #text>
              <span class="text-base lg:text-lg font-normal font-roboto-slab whitespace-pre-line">
                {{ acceptMessage?.message }}
              </span>
            </template>
          </i18n-t>
          <p v-if="application.status === ApplicationStatus.DECLINED" class="lg:text-lg">
            {{ $t('components.my-applications.application-card.declined-message') }}
          </p>
          <div class="flex flex-wrap justify-end gap-2 lg:gap-3 mt-2 lg:mt-3">
            <button class="btn btn-danger w-auto" @click.prevent="showDeleteModal = !showDeleteModal">
              <NuxtIcon name="trash" />
              <p>{{ $t('components.my-applications.application-card.delete') }}</p>
            </button>
          </div>
        </div>
      </Transition>
    </div>
    <Transition name="fade">
      <MyApplicationsDeleteApplicationModal v-if="showDeleteModal" :application="application" @close="showDeleteModal = false" />
    </Transition>
  </div>
</template>
