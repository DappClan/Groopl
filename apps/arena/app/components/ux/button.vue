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
    :class="cn(`isolate relative inline-flex justify-center items-center transition-all duration-100 font-500
        border border-primary h-2rem w-full hover:bg-foreground:80 after:absolute after:z-1 after:inset-0 after:transition-all
        after:bg-gradient-to-b after:from-black:15 after:to-transparent after:opacity-100 after:rounded-inherit
        after:content-empty  outline-0 select-none cursor-pointer shadow-sm m-0 text-background font-bold
        py-[.375rem] px-[.75rem] bg-foreground rounded-[.375rem] disabled:bg-foreground:50 disabled:border-border:20 disabled:cursor-auto
        text-[.8125rem]`, props.class)"
  >
    <span flex flex-row items-center box-border justify-start>
      {{ props.text }}
      <div v-if="props.icon" :class="cn('w-[.625rem] h-[.625rem] opacity-62 ml-[.5rem] shrink-0', props.icon)" />
    </span>
  </button>
</template>
