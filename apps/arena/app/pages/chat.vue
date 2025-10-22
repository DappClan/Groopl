<script setup lang="ts">
useHydratedHead({
  title: 'Chat',
})
</script>

<template>
  <div min-h-screen flex>
    <!-- Chat list sidebar -->
    <div w-80 border="r base" bg-base p-4 hidden md:block>
      <h2 text-xl font-bold mb-4>
        Conversations
      </h2>
      <div flex="~ col" gap-2>
        <div bg-active p-3 rounded-2 text-center>
          <p text-sm text-secondary>
            No conversations yet
          </p>
        </div>
      </div>
    </div>

    <!-- Chat content -->
    <div flex-1 flex="~ col" p-6>
      <div flex-1 flex items-center justify-center>
        <div text-center>
          <div i-ri:chat-3-line text-6xl text-secondary mx-auto mb-4 />
          <p text-secondary>
            Select a conversation to start chatting
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
