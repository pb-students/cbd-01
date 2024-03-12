<script setup lang="ts">
const props = defineProps(['message'])

const users = reactive([
  { id: 1, username: 'Ula Kużelewska' },
  { id: 2, username: 'Mateusz Daniel' },
  { id: 3, username: 'Kasper Serweryn' }
])

const user = computed(() => users.find((user) => user.id === props.message.userId))
</script>
<template>
  <div class="ml-10 w-64 h-min bg-gray-700 rounded-lg my-2 p-4">
    <div class="font-bold text-sm">
      {{ user?.username }}
    </div>
    {{ message.message }}
  </div>
</template>
