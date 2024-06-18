<script setup lang="ts">
import { credentialsSchema } from '~/db/schema'
import { z } from 'zod'

import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'guest-only',
  auth: { authenticatedRedirectTo: '/' }
})

const { signIn } = useAuth()

const router = useRouter()

type Credentials = z.infer<typeof credentialsSchema>
const state: Credentials = reactive({
  username: '',
  password: ''
})

const form = ref()

const loading = ref(false)
const login = async (event: FormSubmitEvent<Credentials>) => {
  loading.value = true
  try {
    await signIn('credentials', event.data)
    router.replace('/')
  } catch (err) {
    console.error(err)
    form.value.setErrors(Object.keys(event.data).map(path => ({
      path,
      message: (err as Error).message ?? 'Invalid credentials'
    })))
  } finally {
    loading.value = false
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
      required
    >
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup
      label="Password"
      name="password"
      required
    >
      <UInput
        v-model="state.password"
        type="password"
      />
    </UFormGroup>

    <UButton type="submit" :loading="loading">
      Submit
    </UButton>
  </UForm>
</template>
