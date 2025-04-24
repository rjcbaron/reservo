<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'

const props = defineProps(['theme'])

// Utilize pre-defined vue functions
const { mdAndDown } = useDisplay()


</script>

<template>
  <v-card :min-height="mdAndDown ? undefined : '370px'">
    <template #title>
      <span class="text-h6 font-weight-bold">
        <v-breadcrumbs :items="['System', 'Dashboard']">
          <template #content>
            <v-icon icon="mdi-view-dashboard" size="small" class="me-1"></v-icon>
          </template>
        </v-breadcrumbs>
      </span>
    </template>

    <template #content>
      <p class="ms-4 text-wrap">View product inventory level and other administrative widgets.</p>
    </template>

    <v-divider class="my-3" thickness="2"></v-divider>


        <v-col cols="12" sm="8">
          <h2 class="mb-5">
            Welcome Aboard,
            <span class="font-weight-black">
              {{ authStore.userData.firstname + ' ' + authStore.userData.lastname }}!
            </span>
          </h2>

          <p class="text-justify">
            Welcome to the Inventory Management System! Effortlessly manage your inventory from one
            place. Here, you can track items, manage stock levels, and streamline your operations
            for greater efficiency. We’re here to make inventory management simple and effective!
          </p>
        </v-col>
  </v-card>
</template>
