<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const config = useRuntimeConfig()

const { $client } = useNuxtApp()

const { data, pending } = await $client.me.get.useQuery()
</script>

<template>
  <div>
    <header
      class="h-24 flex items-center justify-between p-6 lg:px-30"
    >
      <NuxtLink to="/dashboard">
        <span font-semibold>{{ config.public.appName }}</span>
      </NuxtLink>
    </header>
    <main>
      {{ pending }}
      {{ data }}
    </main>
  </div>
</template>
