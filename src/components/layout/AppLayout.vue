<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/')
}

function viewProfile() {
  router.push('/profile')
}
</script>

<template>
  <v-app>
    <!-- Side Drawer -->
    <v-navigation-drawer
      app
      permanent
      style="background: linear-gradient(to bottom, rgb(66, 165, 245), rgb(178, 202, 244))"
    >
      <!-- Logo -->
      <v-container class="text-center py-4">
        <v-avatar size="150" class="mx-auto">
          <v-img src="images/logo.png" alt="Logo" cover></v-img>
        </v-avatar>
      </v-container>

      <!-- Menu List -->
      <v-list nav dense>
        <v-list-item @click="$router.push('/home')" link>
          <v-list-item-title class="text-subtitle-1"
            ><v-icon start>mdi-book</v-icon>Book Reservation</v-list-item-title
          >
        </v-list-item>

        <v-list-item @click="viewProfile" link>
          <v-list-item-title class="text-subtitle-1"
            ><v-icon start>mdi-account</v-icon>View Profile</v-list-item-title
          >
        </v-list-item>

        <v-list-item @click="logout" link>
          <v-list-item-title class="text-subtitle-1"
            ><v-icon start>mdi-logout</v-icon>Logout</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <div class="fill-height pa-0 ma-0">
        <slot name="content"></slot>
      </div>
    </v-main>

    <!-- Footer -->
    <v-footer class="font-weight-bold" color="transparent" elevation="20" border app>
      2025 - Reservo
    </v-footer>
  </v-app>
</template>
