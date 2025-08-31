<script setup lang="ts">
const items = computed(() => [{
  label: 'Login',
  to: '/login',
}])
</script>

<template>
  <UHeader mode="drawer">
    <template #left>
      <NuxtLink to="/">
        Starter Kit
      </NuxtLink>
    </template>

    <template #body>
      <UNavigationMenu
          :items="items"
          orientation="vertical"
          class="-mx-2.5"
      />
    </template>

    <template #right>
      <UNavigationMenu
          :items="items"
          variant="link"
          class="hidden lg:block"
      />

      <UColorModeButton/>
    </template>
  </UHeader>
</template>