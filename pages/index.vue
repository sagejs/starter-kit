<script setup lang="ts">
import Button from 'primevue/button'

function docs() {
  window.open('https://start-docs.qinguan.me', '_target')
}
</script>

<template>
  <section class="
    bg-$primary-50 
    p-6 pt-15 lg:p-30 xl:p-30
    grid grid-cols-1 lg:grid-cols-2
  ">
    <div>
      <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl ">
        This is the best landing page. Ever.
      </h1>
      <p class="mb-6 md:text-lg lg:text-xl">
        Seriously, you won't believe how cute the dog is
      </p>
      <div flex="~ gap-2">
        <Button @click="$router.push('/login')" rounded label="Get started" />
        <Button @click="docs" rounded link label="Documentation"></Button>
      </div>
    </div>
    <div py-20>
      <UndrawDog max-h-sm mx-auto />
    </div>
  </section>
</template>
