<script setup lang="ts">
import type { Message } from '~/types'
interface User {
  id: number
  username: string
}

const props = defineProps<{
  message: Message
  users: User[]
}>()

const emit = defineEmits(['updateMessage', 'deleteMessage'])
const { user } = useAuth()
const isModalOpen = ref(false)
const users = toRef(props, 'users')
const message = toRef(props, 'message')

const userEdits = computed(() => {
  return users.value.reduce((acc, user) => {
    if (message.value.editors[user.id]) acc[user.id] = true
    else acc[user.id] = false
    return acc
  }, {} as Record<number, boolean>)
})

watchEffect(() => {
  const editorsId = Object.keys(userEdits.value).filter((id) => userEdits.value[id] === true)
  const editors = users.value.filter((user: User) => editorsId.includes(user.id.toString()))
  emit('updateMessage', {
    userId: message.value.userId,
    message: message.value.message,
    editors,
    id: message.value.id,
    user: message.value.user,
    createdAt: message.value.createdAt,
    updatedAt: message.value.updatedAt
  })
})

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
      class="flex p-4 my-2 h-full rounded-lg"
      style="word-wrap: break-word;"
    >
      <div class="w-48 h-full">
        <div class="text-sm font-bold">
          {{ message.user.username }}
        </div>
        {{ message.message }}
      </div>
      <div
        v-if="message.user.id === +user!.id"
        class="w-5 h-full px-5"
      >
        <UModal v-model="isModalOpen">
          <UCard>
            <div class="flex w-full justify-end">
              Uprawnienia do edycji
            </div>
            <div
              v-for="userEditor in users"
              :key="userEditor.id"
              class="flex items=center gap-4 my-4 w-full"
            >
              <UAvatar
                src="https://avatars.githubusercontent.com/u/739984?v=4"
              />
              {{ userEditor.username }}

              <UCheckbox
                v-model="userEdits[userEditor.id]"
                class="ml-auto"
              />
            </div>
          </UCard>
        </UModal>
        <UButton
          color="cyan"
          variant="soft"
          :ui="{ rounded: 'rounded-full' }"
          size="2xs"
          icon="i-heroicons-ellipsis-horizontal"
          @click="isModalOpen = true"
        />
      </div>
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
      <div v-if="message.user.id === +user!.id">
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
  </div>
</template>
