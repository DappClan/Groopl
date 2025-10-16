<template>
  <main class="px-4 overflow-hidden sm:px-6 supports-[overflow:clip]:overflow-clip">
    <div class="mx-auto flex flex-col max-w-170 min-h-screen relative after:w-1px before:w-1px after:content-empty before:content-empty after:inset-y-0 before:inset-y-0 after:absolute before:absolute after:from-zinc-800/25 after:via-zinc-500/50 before:from-zinc-800/25 before:via-zinc-500/50 after:bg-gradient-to-b before:bg-gradient-to-b after:-right-42 before:-left-42">
      <slot />
    </div>
  </main>
</template>
