<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import type { TRPCError } from '@trpc/server'

const config = useRuntimeConfig()
const { $client } = useNuxtApp()

useSeoMeta({
  title: config.public.appName,
})

const formData = reactive<{
  email: string
  otp: string
  pending: boolean
  stage: 'email' | 'otp'
  error?: string
}>({
  email: '',
  otp: '',
  pending: false,
  stage: 'email',
})

async function login() {
  formData.pending = true
  try {
    if (formData.stage === 'email') {
      await $client.auth.email.login.mutate(formData)
      formData.stage = 'otp'
    }
    else if (formData.stage === 'otp') {
      // something else here
    }
    formData.pending = false
  }
  catch (err) {
    formData.error = (err as TRPCError).message
  }
}
</script>

<template>
  <div>
    <header
      class="h-24 flex items-center justify-between p-6 lg:px-30"
    >
      <NuxtLink to="/">
        <span font-semibold>{{ config.public.appName }}</span>
      </NuxtLink>
    </header>

    <div grid grid-cols-1 lg:grid-cols-2 lg:py-20>
      <div mx-auto max-w-lg w-full p-10>
        <UndrawLogin />
      </div>

      <div p-6 lg:px-30>
        <h1 text-3xl font-bold>
          Login
        </h1>

        <form mt-8 @submit.prevent="login">
          <template v-if="formData.stage === 'email'">
            <div class="flex flex-col gap-2">
              <label for="email">Email</label>
              <InputText id="email" v-model="formData.email" autofocus :required="true" placeholder="sam@example.com" type="email" aria-describedby="email-help" class="max-w-md" />
              <small id="email-help" class="sr-only">Enter your email</small>
            </div>
            <Button type="submit" :loading="formData.pending" mt-6>
              Get OTP
            </Button>
          </template>
          <template v-if="formData.stage === 'otp'">
            <div class="flex flex-col gap-2">
              <label for="otp">OTP</label>
              <InputText id="otp" v-model="formData.otp" autofocus :required="true" placeholder="123456" aria-describedby="otp-help" class="max-w-md" />
              <small id="otp-help" class="sr-only">Enter your OTP</small>
            </div>

            <Button type="submit" :loading="formData.pending" mt-6>
              Login
            </Button>
          </template>
        </form>
      </div>
    </div>
  </div>
</template>
