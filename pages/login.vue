<script setup lang="ts">
const { $client } = useNuxtApp()
const config = useRuntimeConfig()
useSeoMeta({
  title: config.public.appName,
})

const { data } = await $client.hello.useQuery({ text: 'client' })
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
      {{ data }}
    </div>
  </div>
</template>
