<script setup>
import { ref } from 'vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
}

const onSubmit = () => {
  // later for supabase just remove the double slash and this message // alert(formData.value.email)
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit
  })
}

const formData = ref({
  ...formDataDefault,
})

const isConfirmPasswordVisible = ref(false)
const isPasswordvisible = ref(false)
const refVForm = ref()
</script>

<template>
  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-text-field
      v-model="formData.firstname"
      label="First Name"
      variant="outlined"
      prepend-inner-icon="mdi-account-file-text"
      :rules="[requiredValidator]"
    ></v-text-field>
    <v-text-field
      v-model="formData.lastname"
      label="Last Name"
      variant="outlined"
      prepend-inner-icon="mdi-account-file-text"
      :rules="[requiredValidator]"
    ></v-text-field>
    <v-text-field
      v-model="formData.email"
      label="Email"
      variant="outlined"
      prepend-inner-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      label="Password"
      :type="isPasswordvisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordvisible ? 'mdi-eye-off' : 'mdi-eye-outline'"
      variant="outlined"
      prepend-inner-icon="mdi-lock"
      @click:append-inner="isPasswordvisible = !isPasswordvisible"
      :rules="[requiredValidator, passwordValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formData.password_confirmation"
      label="Password Confirmation"
      :type="isConfirmPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye-outline'"
      variant="outlined"
      prepend-inner-icon="mdi-lock"
      @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
      :rules="[
        requiredValidator,
        confirmedValidator(formData.password_confirmation, formData.password),
      ]"
    />

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
