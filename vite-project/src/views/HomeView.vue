<template>
  <div>

  </div>
</template>

<script setup lang="ts">
  import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://<project>.supabase.co', '<your-anon-key>')

</script>

<style lang="scss" scoped>

</style>