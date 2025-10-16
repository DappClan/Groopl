<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils'

const props = defineProps<{
  text: string
  icon?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <button
    :class="cn(`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-linear-to-b from-primary to-[oklch(var(--primary-to))] text-primary-foreground shadow-sm bg-[length:100%_100%] bg-[bottom] hover:bg-[length:100%_150%] inset-shadow-[0_1px_rgb(255_255_255/0.15)] transition-all h-10 rounded-md px-8 w-full hover:cursor-pointer`, props.class)"
  >
    <span flex flex-row items-center box-border justify-start>
      {{ props.text }}
      <div v-if="props.icon" :class="cn('w-[.625rem] h-[.625rem] opacity-62 ml-[.5rem] shrink-0', props.icon)" />
    </span>
  </button>
</template>
