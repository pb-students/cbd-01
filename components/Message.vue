<script setup lang="ts">
import type { Message } from '~/types'
const props = defineProps<{
  message: Message
}>()

const { user } = useAuth()

const emit = defineEmits(['updateMessage', 'deleteMessage'])

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

const edit = ref(props.message.message)

const canEdit = computed(() => props.message.userId === +user.value!.id || props.message.editors.some(editor => editor.id === +user.value!.id))
</script>
<template>
  <div class="flex pl-10">
    <div
      v-if="!isEditing"
      :class="[message.user.id !== +user!.id ? ' bg-slate-200 dark:bg-gray-600' : 'bg-cyan-200 dark:bg-cyan-500 ml-auto']"
      class="p-4 my-2 w-64 h-full rounded-lg"
    >
      <div class="text-sm font-bold">
        {{ message.user.username }}
      </div>
      {{ message.message }}
    </div>
    <div
      v-else
      :class="[message.user.id !== +user!.id ? 'bg-gray-200 dark:bg-gray-600' : 'bg-cyan-200 dark:bg-cyan-500 ml-auto']"
      class="p-4 my-2 w-64 h-full rounded-lg"
    >
      <UTextarea
        v-model="edit"
        class="mr-2 w-full h-min"
        variant="outline"
        placeholder="Wpisz wiadomość"
        @keydown.enter.prevent="() => { emit('updateMessage', edit); isEditing = false }"
      />
    </div>
    <div
      v-if="canEdit"
      class="p-2 mr-10 w-min"
    >
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
