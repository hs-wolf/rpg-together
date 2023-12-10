<script setup lang="ts">
import type { Application } from '@rpg-together/models'
import { ApplicationStatus } from '@rpg-together/models'
import { DEFAULT_USER_AVATAR } from '@rpg-together/utilities'

const props = defineProps<{ application: Application }>()

const emits = defineEmits<{ (_e: 'accept'): void; (_e: 'decline'): void }>()

const localeRoute = useLocaleRoute()

const showInfo = ref(false)
const showAcceptModal = ref(false)
const showRejectModal = ref(false)

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

function acceptApplication() {
  showAcceptModal.value = false
  emits('accept')
}

function declineApplication() {
  showRejectModal.value = false
  emits('decline')
}
</script>

<template>
  <div class="flex flex-col gap-[1px] shadow text-primary overflow-hidden">
    <button
      class="z-10 flex justify-between items-center gap-2 p-2 lg:p-3 bg-secondary rounded-sm"
      :class="showInfo ? 'rounded-t-sm' : 'rounded-sm'"
      @click.prevent="showInfo = !showInfo"
    >
      <div class="flex items-center gap-2 text-start">
        <NuxtIcon :name="statusIcon" class="text-xl lg:text-2xl" :class="statusColor" />
        <NuxtImg
          :src="application?.applicant?.avatar ?? DEFAULT_USER_AVATAR"
          :alt="application?.applicant?.username"
          width="24px"
          height="24px"
          format="webp"
          class="shadow rounded-full w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]"
        />
        <h1 class="truncate font-semibold lg:text-lg">
          {{ application?.applicant?.username }}
        </h1>
      </div>
      <NuxtIcon name="chevron-up" class="shrink-0 text-xl lg:text-2xl transition-transform" :class="{ 'rotate-180': !showInfo }" />
    </button>
    <Transition name="slide-down">
      <div v-if="showInfo" class="card-secondary gap-5 rounded-t-none">
        <i18n-t
          keypath="components.my-tables.application-card.their-message"
          tag="p"
          scope="global"
          class="flex flex-col gap-1 text-sm lg:text-base font-semibold"
        >
          <template #text>
            <span class="text-base lg:text-lg font-normal font-roboto-slab leading-5 whitespace-pre-line">
              {{ application?.message }}
            </span>
          </template>
        </i18n-t>
        <hr class="border-secondary-dark">
        <i18n-t keypath="components.my-applications.application-card.status" tag="p" scope="global" class="text-sm lg:text-base font-semibold">
          <template #text>
            <span class="text-base lg:text-lg" :class="statusColor">
              {{ application?.status }}
            </span>
          </template>
        </i18n-t>
        <div class="flex flex-wrap justify-between lg:justify-end gap-3 lg:gap-5">
          <button
            v-if="application.status === ApplicationStatus.WAITING"
            class="btn-danger"
            @click.prevent="showRejectModal = !showRejectModal"
          >
            {{ $t('components.my-tables.application-card.decline') }}
          </button>
          <NuxtLink :to="localeRoute({ path: `/profile/${application?.applicant.id}` })" class="btn-secondary flex gap-2">
            <NuxtIcon name="external-link" class="lg:text-lg" />
            <p>{{ $t('components.my-tables.application-card.profile') }}</p>
          </NuxtLink>
          <button
            v-if="application.status === ApplicationStatus.WAITING"
            class="btn-accent"
            @click.prevent="showAcceptModal = !showAcceptModal"
          >
            {{ $t('components.my-tables.application-card.accept') }}
          </button>
        </div>
      </div>
    </Transition>
    <TransitionGroup name="fade" tag="div">
      <MyTablesApplicationCardAcceptModal
        v-if="showAcceptModal"
        :application="application"
        @close="showAcceptModal = false"
        @accept="acceptApplication"
      />
      <MyTablesApplicationCardDeclineModal
        v-if="showRejectModal"
        :application="application"
        @close="showRejectModal = false"
        @decline="declineApplication"
      />
    </TransitionGroup>
  </div>
</template>
