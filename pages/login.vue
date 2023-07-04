<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const config = useRuntimeConfig()
const { $client } = useNuxtApp()

const formData = reactive({
  email: '',
})

function login() {
  $client.auth.email.login.mutate(formData)
}

useSeoMeta({
  title: config.public.appName,
})
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
    <div class="p-6 lg:px-30">
      <InputText v-model="formData.email" />
      <Button @click="login">
        Login
      </Button>
    </div>
  </div>
</template>
