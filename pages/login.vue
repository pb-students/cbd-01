<script setup lang="ts">
import { userSchema } from '~/db/schema'
import { z } from 'zod'

import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'guest-only',
  auth: { authenticatedRedirectTo: '/' }
})

const { signIn } = useAuth()

const router = useRouter()

const credentialsSchema = userSchema.pick({
  username: true,
  password: true
})

type Credentials = z.infer<typeof credentialsSchema>

const state: Credentials = reactive({
  username: '',
  password: ''
})

const form = ref()

const login = async (event: FormSubmitEvent<Credentials>) => {
  try {
    await signIn('credentials', event.data)
    router.replace('/')
  } catch (_) {
    form.value.setErrors(Object.keys(event.data).map(path => ({
      path,
      message: 'Invalid credentials'
    })))
  }
}
</script>

<template>
  <UForm
    ref="form"
    :schema="credentialsSchema"
    :state="state"
    class="space-y-4"
    @submit="login"
  >
    <UFormGroup
      label="Email"
      name="username"
    >
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup
      label="Password"
      name="password"
    >
      <UInput
        v-model="state.password"
        type="password"
      />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
