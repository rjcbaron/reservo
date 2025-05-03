<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import { requiredValidator, emailValidator } from '@/utils/validators'

const router = useRouter()
const isPasswordvisible = ref(false)
const refVForm = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({ ...formActionDefault })

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data.session) {
    router.replace('/home')
  }

  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
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
      :rules="[requiredValidator]"
    ></v-text-field>

    <v-btn
      class="mt-2"
      type="submit"
      block
      color="primary"
      prepend-icon="mdi-login"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Log In
    </v-btn>
  </v-form>
</template>
