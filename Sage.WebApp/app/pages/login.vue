<script setup lang="ts">
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'

definePageMeta({
  layout: 'landing'
})

const toast = useToast()

const fields = [
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  }
]

const schema = z.object({
  email: z.string().email('Invalid email'),
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
}
</script>
<template>
  <div class="flex-1 flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
          :schema="schema"
          :fields="fields"
          title="Welcome back!"
          icon="i-lucide-lock"
          @submit="onSubmit"
      >
        <template #validation>
          <UAlert color="error" icon="i-lucide-info" title="Error signing in"/>
        </template>
        
        <template #footer>
          By signing in, you agree to our
          <ULink to="#" class="text-(--ui-primary) font-medium">Terms of Service</ULink>
          .
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>