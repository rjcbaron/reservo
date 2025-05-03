<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'

const router = useRouter()
const route = useRoute()

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarTimeout = ref(3000)

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout error:', error.message)
  } else {
    localStorage.removeItem('rememberedEmail')
    setTimeout(() => {
      router.push('/')
    }, snackbarTimeout.value)
  }
}

const viewProfile = () => {
  router.push('/profile')
}

// Only show drawer and footer on non-login/register pages
const showLayout = computed(() => {
  return route.name !== 'login' && route.name !== 'register'
})
</script>

<template>
  <v-app>
    <!-- Side Drawer -->
    <v-navigation-drawer
      v-if="showLayout"
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
          <v-list-item-title class="text-subtitle-1">
            <v-icon start>mdi-book</v-icon>Book Reservation
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="viewProfile" link>
          <v-list-item-title class="text-subtitle-1">
            <v-icon start>mdi-account</v-icon>View Profile
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout" link>
          <v-list-item-title class="text-subtitle-1">
            <v-icon start>mdi-logout</v-icon>Logout
          </v-list-item-title>
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
    <v-footer v-if="showLayout" class="font-weight-bold" color="white" elevation="20" border app>
      2025 - Reservo
    </v-footer>
  </v-app>
</template>
