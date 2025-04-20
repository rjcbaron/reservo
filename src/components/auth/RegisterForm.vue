<script setup>
  import { ref } from 'vue'

  const isPasswordvisible = ref(false)
</script>

<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field
      label="First Name"
      variant="outlined"
      prepend-inner-icon="mdi-account-file-text"
    ></v-text-field>
    <v-text-field
      label="Last Name"
      variant="outlined"
      prepend-inner-icon="mdi-account-file-text"
    ></v-text-field>
    <v-text-field label="Email" variant="outlined" prepend-inner-icon="mdi-email"></v-text-field>

    <v-text-field
      label="Password"
      :type="isPasswordvisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordvisible ? 'mdi-eye-off' : 'mdi-eye-outline'"
      variant="outlined"
      prepend-inner-icon="mdi-lock"
      @click:append-inner="isPasswordvisible = !isPasswordvisible"
    ></v-text-field>

    <v-text-field
      label="Password Confirmation"
      t:type="isPasswordvisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordvisible ? 'mdi-eye-off' : 'mdi-eye-outline'"
      variant="outlined"
      prepend-inner-icon="mdi-lock"
      @click:append-inner="isPasswordvisible = !isPasswordvisible"
    ></v-text-field>

    <v-divider class="my-5"></v-divider>
    <h5 class="text-center">
      Already have acount?
      <RouterLink class="text-primary" to="/"> Click here to log in</RouterLink>
    </h5>
    <v-btn class="mt-2" type="submit" block color="primary" prepend-icon="mdi-account-plus"
      >Sign Up</v-btn
    >
  </v-form>
</template>
