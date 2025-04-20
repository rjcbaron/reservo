<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar app color="blue-lighten-2" dark>
      <v-img src="images/logo.png" alt="Logo" max-width="90" class="mr-4" />

      <v-spacer />

      <v-btn to="/" text>Home</v-btn>
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
      <RouterView />
    </v-main>
  </v-app>
</template>
