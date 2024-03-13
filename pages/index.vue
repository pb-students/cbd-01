<script setup lang="ts">
import type { Message } from '~/types'

definePageMeta({
  middleware: 'auth',
  auth: { guestRedirectTo: '/login' }
})

const colorMode = useColorMode()
colorMode.value = 'light'

// Polling users
const { data: users, refresh: refreshUsers } = await useFetch('/api/users')

// Polling messages
const { data: messages, refresh } = await useFetch<Message[]>('/api/messages', {
  transform: (data) => data.reverse()
})

const { pause, resume } = useIntervalFn(() => Promise.all([
  refresh(),
  refreshUsers()
]), 1000)

const fetchMessages = async () => {
  pause()
  await refresh()
  resume()
}

const currentMessage = ref('')

const scroll = ref<HTMLElement>()
const { y, arrivedState } = useScroll(scroll)

const scrollDown = () => {
  y.value = messages.value!.length * 1000
}

scrollDown()

watch(messages, async () => {
  if (arrivedState.bottom) {
    await nextTick()
    scrollDown()
  }
}, { deep: true, flush: 'pre' })

const sendMessage = async () => {
  if (currentMessage.value === '') return

  await $fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ message: currentMessage.value })
  })

  await fetchMessages()

  scrollDown()
  currentMessage.value = ''
}

const updateMessage = async (newMessage: string, message: Message) => {
  await $fetch('/api/messages/' + message.id, {
    method: 'POST',
    body: JSON.stringify({ message: newMessage })
  })

  await fetchMessages()
}

const deleteMessage = async (message: Message) => {
  await $fetch('/api/messages/' + message.id, {
    method: 'DELETE'
  })

  await fetchMessages()
}
</script>

<template>
  <div class="flex gap-4 justify-center items-center w-full min-h-screen light:bg-gray-200 dark:bg-gray-850">
    <div class="rounded-xl shadow-xl w-[960px] h-[550px] light:border-[1px] light:border-gray bg-white dark:bg-zinc-900 pb-[135px]">
      <div class="py-3 px-10 font-sans text-lg">
        Konspiracja PB
      </div>
      <div class="p-5 w-full h-full border-t-[1px] border-gray">
        <div
          ref="scroll"
          class="overflow-y-auto mb-4 w-full h-full rounded-lg shadow-md bg-zinc-50 dark:bg-zinc-950"
        >
          <div
            v-for="message in messages"
            :key="message.id"
          >
            <Message
              :message="message"
              @update-message="updateMessage($event, message)"
              @delete-message="deleteMessage(message)"
            />
          </div>
        </div>
        <div class="flex flex-shrink-0 w-full">
          <UTextarea
            v-model="currentMessage"
            class="mr-2 w-full"
            variant="outline"
            placeholder="Wpisz wiadomość"
            @keyup.enter="sendMessage"
          />
          <UButton
            color="gray"
            size="xl"
            icon="i-heroicons-paper-airplane"
            @click="sendMessage"
          />
        </div>
      </div>
      <div />
    </div>
    <div class="rounded-xl bg-white light:border-[1px] light:border-gray shadow-xl dark:bg-zinc-900 h-[550px] w-[400px]">
      <div class="py-3 px-10 font-sans text-lg">
        Uczestnicy czatu
      </div>
      <div class="p-5 w-full h-full border-t-[1px] border-gray">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items=center gap-4 my-4 w-full"
        >
          <UAvatar
            src="https://avatars.githubusercontent.com/u/739984?v=4"
          />
          {{ user.username }}

          <UTooltip
            class="ml-auto"
            text="Daj uprawnienia edycji"
          >
            <UButton
              v-if="user.canEdit"
              color="cyan"
              icon="i-heroicons-pencil"
              @click="user.canEdit = !user.canEdit"
            />
            <UButton
              v-else
              color="gray"
              icon="i-heroicons-pencil"
              @click="user.canEdit = !user.canEdit"
            />
          </UTooltip>
        </div>
      </div>
    </div>
  </div>
</template>
