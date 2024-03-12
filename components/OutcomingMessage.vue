<script setup lang="ts">
const props = defineProps(['message'])
const emit = defineEmits(['updateMessage', 'deleteMessage'])
// TODO: fetch users from the backend
const users = reactive([
  { id: 1, username: 'Ula Kużelewska', canEdit: false },
  { id: 2, username: 'Mateusz Daniel', canEdit: false },
  { id: 3, username: 'Kasper Serweryn', canEdit: false }
])

const user = computed(() => users.find((user) => user.id === props.message.userId))
const isEditing = ref(false)
const isDeleting = ref(false)
const deleteMessage = () => {
  if (!isDeleting.value) {
    isDeleting.value = true
    return
  }

  emit('deleteMessage')
  isDeleting.value = false
}
</script>
<template>
  <div class="flex w-full h-min justify-end">
    <div
      v-if="!isEditing"
      class="w-64 h-full rounded-lg bg-cyan-600 my-2 p-4"
    >
      <div class="font-bold text-sm">
        {{ user?.username }}
      </div>
      {{ message.message }}
    </div>
    <div
      v-else
      class="w-64 h-full rounded-lg bg-cyan-600 my-2 p-4"
    >
      <UTextarea
        :value="message.message"
        class="w-full h-min mr-2"
        variant="outline"
        placeholder="Wpisz wiadomość"
        @update:model-value="emit('updateMessage', $event)"
        @keyup.enter="isEditing = false"
      />
    </div>
    <div class="mr-10 p-2 w-min">
      <UButton
        class="mr-2 mb-2"
        color="gray"
        icon="i-heroicons-pencil"
        @click="isEditing = true"
      />
      <UButton
        v-if="!isDeleting"
        color="gray"
        icon="i-heroicons-trash"
        @click="deleteMessage"
      />
      <UButton
        v-else
        color="red"
        icon="i-heroicons-trash"
        @click="deleteMessage"
      />
    </div>
  </div>
</template>
