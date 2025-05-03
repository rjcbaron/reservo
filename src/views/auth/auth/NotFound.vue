<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center text-center">
    <v-icon color="red" size="120">mdi-alert-circle-outline</v-icon>
    <h1 class="text-h3 font-weight-bold mt-4">404 - Page Not Found</h1>
    <p class="text-subtitle-1 mt-2">
      Sorry, the page you’re looking for doesn’t exist or has been moved.
    </p>
    <v-btn class="mt-6" color="primary" prepend-icon="mdi-home" @click="goHome">
      Back to Home
    </v-btn>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>
