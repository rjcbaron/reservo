<script setup>
import { useRouter } from 'vue-router'

// get the router instance
const router = useRouter()

function logout() {
  // Clear any auth/session data (optional)
  localStorage.removeItem('token') // if you use tokens

  // Redirect to login or home
  router.push('/')
}

function viewProfile() {
  router.push('/profile')
}
</script>

<template>
  <v-app>
    <v-app-bar app dark style="background: linear-gradient(to right, rgb(220, 222, 231), #1976d2)">
      <v-img src="images/logo.png" alt="Logo" max-width="120" class="mr-4" />

      <v-spacer />

      <v-btn to="/home" text>Home</v-btn>
      <v-btn to="/reservation" text>Reserve</v-btn>

      <!-- Profile Menu -->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="viewProfile">
            <v-list-item-title>View Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Page Content -->
    <v-main>
      <div class="fill-height pa-0 ma-0">
        <slot name="content"></slot>
      </div>
    </v-main>

    <v-footer class="font-weight-bold" color="transparent" elevation="20" border app>
      2025 - Reservo
    </v-footer>
  </v-app>
</template>
