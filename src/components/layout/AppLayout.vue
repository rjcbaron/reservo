<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(false)
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
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" color="blue-lighten-2">
      <v-btn icon @click="drawer = !drawer" class="mb-3">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-list>
        <v-list-item @click="$router.push('/home')">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$router.push('/reservation')">
          <v-list-item-title>Reserve</v-list-item-title>
        </v-list-item>
        <v-list-item @click="viewProfile">
          <v-list-item-title>View Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app dark style="background: linear-gradient(to right, rgb(220, 222, 231), #64b5f6)">
      <!-- Burger Menu Icon (only shows on small screens) -->
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none"></v-app-bar-nav-icon>

      <v-img src="images/logo.png" alt="Logo" max-width="120" class="mr-4" />

      <v-spacer />

      <v-btn to="/home" text class="d-none d-sm-flex">Home</v-btn>
      <v-btn to="/reservation" text class="d-none d-sm-flex">Reserve</v-btn>

      <v-menu offset-y class="d-none d-sm-flex">
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
