<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <div>
    {{ config }}
    <NuxtWelcome />
  </div>
</template>
