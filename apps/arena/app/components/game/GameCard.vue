<script setup lang="ts">
interface GameTag {
  text: string
  color?: 'primary' | 'green' | 'red' | 'blue' | 'yellow'
}

interface GameCardProps {
  title: string
  description: string
  icon?: string
  to?: string
  tags?: GameTag[]
  available?: boolean
}

withDefaults(defineProps<GameCardProps>(), {
  icon: 'i-ri:gamepad-fill',
  available: true,
})
</script>

<template>
  <NuxtLink
    :to="to"
    bg-base
    p-6
    rounded-3
    border="~ base"
    :class="[
      to && available ? 'hover:bg-active transition-100 cursor-pointer' : '',
      !available ? 'opacity-60' : '',
    ]"
    block
    no-underline
  >
    <div flex="~ col" justify-between items-start h-full>
      <div flex="~ col">
        <div :class="[icon, available ? 'text-primary' : 'text-secondary']" text-4xl />
        <h3 text-xl font-bold>
          {{ title }}
        </h3>
      </div>

      <p text-sm text-secondary>
        {{ description }}
      </p>
    </div>
  </NuxtLink>
</template>
