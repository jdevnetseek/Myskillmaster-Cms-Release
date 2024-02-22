<template>
  <auth-layout>
    <router-view />
  </auth-layout>
</template>

<script>
import AuthLayout from '@/layouts/AuthLayout'

export default {
  components: { AuthLayout },
}
</script>
