<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { parseSync } from '@qingu/remark-vue'

interface Props extends /* @vue-ignore */ HTMLAttributes {
  content: string
}

const props = defineProps<Props>()

onMounted(() => {
  console.log(parseSync(props.content))
})
</script>

<template>
  <div
    v-bind="props"
    data-id="vue-email-markdown"
  >
    <!-- <component :is="content" /> -->
  </div>
</template>
