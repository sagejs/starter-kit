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
    hello {{ data }}
  </div>
</template>
