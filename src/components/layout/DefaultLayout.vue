<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { supabase } from '@/utils/supabase'

const drawer = ref(false)
const router = useRouter()
const { smAndDown } = useDisplay()

const logout = async () => {
  await supabase.auth.signOut()
  localStorage.removeItem('rememberedEmail')
  router.push('/')
}
</script>

// napugos kog comment ani kay nakulang akong commit message

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar
      app
      style="background: linear-gradient(to bottom, rgb(66, 165, 245), rgb(178, 202, 244))"
      flat
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <!-- Home Icon -->
      <v-btn icon to="/home" class="icon-hover">
        <v-icon size="28">mdi-home</v-icon>
      </v-btn>

      <!-- Profile Icon -->
      <v-btn icon to="/profile" class="icon-hover ml-2">
        <v-icon size="28">mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :temporary="smAndDown"
      :permanent="!smAndDown"
      style="background: linear-gradient(to bottom, rgb(66, 165, 245), rgb(178, 202, 244))"
    >
      <v-container class="text-center py-4">
        <router-link to="/home">
          <v-avatar size="100" class="mx-auto cursor-pointer logo-hover">
            <v-img src="/images/logo.png" alt="Logo" cover />
          </v-avatar>
        </router-link>
      </v-container>

      <v-list nav dense>
        <v-list-item @click="$router.push('/home')" link>
          <v-list-item-title><v-icon start>mdi-book</v-icon>Book Reservation</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$router.push('/profile')" link>
          <v-list-item-title><v-icon start>mdi-account</v-icon>View Profile</v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout" link>
          <v-list-item-title><v-icon start>mdi-logout</v-icon>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <slot name="content" />
    </v-main>

    <!-- Footer -->
    <v-footer app color="white" elevation="20">
      <span class="font-weight-bold">2025 - Reservo</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
.icon-hover:hover {
  color: #0d47a1;
  transition: color 0.3s ease;
}

.logo-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

</style>
