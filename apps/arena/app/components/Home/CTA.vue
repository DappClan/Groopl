<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <main flex-1 />
  <div>
    <div class="py-12 flex flex-col gap-6 max-w-3xl w-full">
      <!-- Badge -->
      <div class="flex items-center justify-center">
        <div class="group p-[1px] rounded-full inline-flex items-center justify-center relative overflow-hidden from-purple-500/10 to-indigo-500/10 via-violet-500/10 bg-gradient-to-r">
          <div class="px-6 py-2 rounded-full bg-background/80 relative backdrop-blur-sm">
            <span class="text-sm text-transparent font-medium from-purple-400 to-indigo-400 via-violet-400 bg-gradient-to-r bg-clip-text">
              🎮 Now Live on Hedera Testnet
            </span>
          </div>
        </div>
      </div>

      <!-- Main Heading -->
      <div class="font-serif space-y-2">
        <h1 class="font-uppercase font-regular text-5xl tracking-tight text-center md:text-7xl sm:text-6xl">
          <span class="text-foreground block">Welcome To</span>
          <span class="text-transparent block from-purple-400 to-indigo-400 via-violet-400 bg-gradient-to-r bg-clip-text">
            Groopl
          </span>
        </h1>
      </div>

      <!-- Tagline -->
      <div class="space-y-1">
        <p class="text-xl text-muted-foreground font-semibold text-center md:text-3xl sm:text-2xl">
          Play. Compete. Win. Repeat.
        </p>
      </div>

      <!-- Description -->
      <div class="mx-auto max-w-2xl">
        <p class="text-base text-muted-foreground leading-relaxed text-center md:text-xl sm:text-lg">
          Challenge friends in fast-paced multiplayer games, climb the leaderboards, and own your victories forever.
        </p>
      </div>

      <!-- CTA Button -->
      <div class="pt-4 flex flex-col gap-4 items-center">
        <Button
          size="lg"
          class="group text-lg text-white px-8 py-6 rounded-full transition-all duration-300 relative overflow-hidden from-purple-500 to-indigo-500 via-violet-500 bg-gradient-to-r hover:shadow-lg hover:shadow-purple-500/50"
        >
          <span class="flex gap-2 items-center relative z-10">
            Play Your First Game
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
          <div class="opacity-0 transition-opacity duration-300 inset-0 absolute from-indigo-500 to-purple-500 via-violet-500 bg-gradient-to-r group-hover:opacity-100" />
        </Button>

        <!-- Sub-text -->
        <p class="text-sm text-muted-foreground">
          No downloads • No credit card • Just pure fun
        </p>
      </div>

      <!-- Feature Pills -->
      <div class="pt-6 flex flex-wrap gap-3 items-center justify-center">
        <div class="text-sm px-4 py-2 rounded-full bg-muted/50 flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-green-500"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
          <span class="text-muted-foreground">Play instantly</span>
        </div>

        <div class="text-sm px-4 py-2 rounded-full bg-muted/50 flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-green-500"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
          <span class="text-muted-foreground">Earn as you play</span>
        </div>

        <div class="text-sm px-4 py-2 rounded-full bg-muted/50 flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-green-500"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
          <span class="text-muted-foreground">Own your wins</span>
        </div>

        <div class="text-sm px-4 py-2 rounded-full bg-muted/50 flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-green-500"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
          <span class="text-muted-foreground">Trade collectibles</span>
        </div>
      </div>

      <!-- Footer Badge -->
      <div class="pt-4 flex items-center justify-center">
        <div class="text-sm text-muted-foreground flex gap-2 items-center">
          <span class="text-green-600 px-3 py-1 rounded-full bg-green-500/10 inline-flex gap-1.5 items-center dark:text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            Carbon-negative
          </span>
          <span>•</span>
          <span>Powered by Hedera</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add smooth animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex.w-full > * {
  animation: fadeInUp 0.6s ease-out backwards;
}

.flex.w-full > *:nth-child(1) {
  animation-delay: 0.1s;
}

.flex.w-full > *:nth-child(2) {
  animation-delay: 0.2s;
}

.flex.w-full > *:nth-child(3) {
  animation-delay: 0.3s;
}

.flex.w-full > *:nth-child(4) {
  animation-delay: 0.4s;
}

.flex.w-full > *:nth-child(5) {
  animation-delay: 0.5s;
}

.flex.w-full > *:nth-child(6) {
  animation-delay: 0.6s;
}

.flex.w-full > *:nth-child(7) {
  animation-delay: 0.7s;
}

.flex.w-full > *:nth-child(8) {
  animation-delay: 0.8s;
}
</style>
