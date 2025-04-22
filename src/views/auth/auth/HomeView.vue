<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const formattedDate = ref(
  new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }),
)
</script>

<template>
<AppLayout>
<template #content>
  <v-container fluid class="pa-4">
    <!-- Welcome Banner -->
    <v-card
      class="ms-4 pa-4"
      color="blue-lighten-2"
      theme="dark"
      elevation="8"
      max-width="800"
      rounded="lg"
    >
      <v-row align="center" justify="space-between">
        <div>
          <h2 class="text-h5 font-weight-bold ms-4">Welcome, future champions!</h2>
          <p class="ms-4">
            Reserve your spot, sharpen your skills, and compete in upcoming tournaments!
          </p>
        </div>
        <v-img src="/images/sports-banner.png" max-width="180" class="ml-4" alt="Sports Image" />
      </v-row>
    </v-card>

    <!-- Map Section -->
    <v-card class="ms-4 mt-8 pa-4" elevation="8" max-width="1500" rounded="lg">
      <v-row mx-12>
        <!-- Map -->
        <v-col cols="12" md="7">
          <iframe
            width="100%"
            height="300"
            frameborder="0"
            style="border: 0"
            allowfullscreen
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=125.5325%2C8.9455%2C125.5425%2C8.9555&layer=mapnik&marker=8.9505%2C125.5375"
          >
          </iframe>
        </v-col>

        <v-col cols="12" md="5">
          <h3 class="text-h6 font-weight-bold mb-4">📅 Calendar</h3>
          <v-sheet color="blue-lighten-5" class="pa-4 rounded-lg text-center" elevation="2">
            <h2 class="text-h4 font-weight-bold mb-2">{{ formattedDate }}</h2>
            <p class="text-subtitle-1">Stay updated with your game schedule!</p>
            <p class="text-subtitle-1">{{ currentTime }}</p>
            <!-- Time added here -->
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

</AppLayout>
</template>
<style scoped></style>
