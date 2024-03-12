<script setup lang="ts">
const currentMessage = ref('')
const messages = reactive([
  {
    userId: 1,
    message: 'Panie Mateuszu proszę stawić się na zajęcia, Pana koledzy czekają na pomoc'
  },
  {
    userId: 2,
    message: 'Oczywiście proszę Pani, juz idę, prawie zawału dostałem jak Pani do mnie napisała na tym czacie'
  },
  {
    userId: 3,
    message: 'Dzień dobry, tutaj Kasper Seweryn, chciałbym poinformować, że zaczeliśmy już pracę, i wszystko wyślemy maksymalnie kilka dni po terminie'
  },
  {
    userId: 1,
    message: 'Dobrze, w takim razie, niech zróbcie Państwo zadanie najszybciej jak się da, pamiętajcie by nie robić w Reacie, jest wolny!'
  },
  {
    userId: 2,
    message: 'Z wielką chęcią!'
  }
])

const scroll = ref<HTMLElement | null>(null)
const sendMessage = () => {
  // TODO: Add current logged user's id instead of 2
  messages.push({ userId: 2, message: currentMessage.value })
  currentMessage.value = ''
}

const updateMessage = (newMessage, index: number) => {
  messages[index].message = newMessage
}

const deleteMessage = (index: number) => {
  messages.splice(index, 1)
}
</script>

<template>
  <div class="flex items-center justify-center bg-gray-850 w-full min-h-screen">
    <div class="w-[960px] h-[550px] bg-zinc-900 shadow-lg rounded-xl pb-[135px]">
      <div class="px-28 py-3 font-sans text-lg">
        Konspiracja PB
      </div>
      <div class="p-5 w-full h-full border-t-[1px] border-gray">
        <div
          ref="scroll"
          class="rounded-lg bg-zinc-950 w-full h-full mb-4 shadow-md overflow-y-auto"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
          >
            <!-- TODO: change 2 to current logged user's id -->
            <IncomingMessage
              v-if="message.userId !== 2"
              :message="message"
            />
            <OutcomingMessage
              v-else
              :message="message"
              @update-message="updateMessage($event, index)"
              @delete-message="deleteMessage(index)"
            />
          </div>
        </div>
        <div class="flex w-full flex-shrink-0">
          <UTextarea
            v-model="currentMessage"
            class="w-full mr-2"
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
  </div>
</template>
