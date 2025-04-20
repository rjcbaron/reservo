<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
// Simulated user session data — replace with real auth data
const user = ref({
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  avatar: '/images/default-avatar.png',
})

const isEditing = ref(false)

function saveChanges() {
  // Replace this with your API call to update user info
  console.log('Saved:', user.value)
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
  // Reset to original values if needed
}
</script>
<template>
  <AppLayout>
<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh">
    <v-card class="pa-6" max-width="600" width="100%">
      <v-card-title class="text-h5 text-center">User Profile</v-card-title>
      <v-divider class="my-4" />

      <v-card-text class="text-center">
        <v-avatar size="100" class="mx-auto mb-4">
          <v-img :src="user.avatar" alt="Avatar" />
        </v-avatar>

        <v-form v-if="isEditing" class="text-left">
          <v-text-field v-model="user.firstName" label="First Name" outlined dense />
          <v-text-field v-model="user.lastName" label="Last Name" outlined dense />
          <v-text-field v-model="user.email" label="Email" outlined dense />
        </v-form>

        <div v-else>
          <h3>{{ user.firstName }} {{ user.lastName }}</h3>
          <p>{{ user.email }}</p>
        </div>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn v-if="!isEditing" color="primary" @click="isEditing = true"> Edit Profile </v-btn>
        <div v-else>
          <v-btn color="success" @click="saveChanges">Save</v-btn>
          <v-btn color="error" variant="outlined" @click="cancelEdit">Cancel</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
</AppLayout>
</template>
