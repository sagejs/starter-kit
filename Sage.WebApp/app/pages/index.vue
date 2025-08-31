<script setup lang="ts">
import {useAuthWhoAmI} from "~/composables/auth";

definePageMeta({
  layout: 'landing'
})

const whoAmI = useAuthWhoAmI()

onServerPrefetch(async () => {
  await whoAmI.suspense()
  console.log(whoAmI.error.value)
})
</script>
<template>
  <div>
    {{ whoAmI }}
    <UPageHero
        orientation="horizontal"
        title="Build production ready applications in minutes."
        description="StarterApp is our baseline application created by StarterKit. You can explore it to get a sense of basic functions and interactions."
        :links="[
            {
              label: 'Explore StarterApp',
              to: '/login',
              trailingIcon: 'i-lucide-arrow-right'
            }
        ]"
    >
      <NuxtImg src="/images/message.png"/>
    </UPageHero>

    <UPageSection
        title="Our application features"
        :features="[
            {
              title: 'Example feature 1',
              description: 'This is a description of one of the features in the application'
            },
            {
              title: 'Example feature 2',
              description: 'This is a description of one of the features in the application'
            },
            {
              title: 'Example feature 3',
              description: 'This is a description of one of the features in the application'
            },
        ]"
    />

    <UPageSection
        :ui="{ root: 'bg-neutral-100 dark:bg-neutral-800' }"
        title="Another call to action"
        description="Sign in with your email address, and start building your app immediately. It’s free, and requires no onboarding or approvals."
        :links="[
            {
              label: 'Get started',
              to: '/login'
            }
        ]"
    />

    <UFooter>
      <template #left>
        <p class="text-(--ui-text-muted) text-sm">Copyright © {{ new Date().getFullYear() }}</p>
      </template>

      <template #right>
        <UButton
            icon="i-lucide-github"
            color="neutral"
            variant="ghost"
            to="https://github.com/sagejs/starter-kit"
            target="_blank"
            aria-label="GitHub"
        />
      </template>
    </UFooter>
  </div>
</template>