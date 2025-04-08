<template>
   <v-form fast-fail @submit.prevent>
                <v-text-field label="First Name" variant="outlined"></v-text-field>
                <v-text-field label="Last Name" variant="outlined"></v-text-field>
                <v-text-field label="Email" variant="outlined"></v-text-field>

                <v-text-field label="Password" type="password" variant="outlined"></v-text-field>

                <v-text-field
                  label="Password Confirmation"
                  type="password"
                  variant="outlined"
                ></v-text-field>

                <v-divider class="my-5"></v-divider>
                <h5 class="text-center">
                  Already have acount?
                  <RouterLink class="text-primary" to="/"> Click here to log in</RouterLink>
                </h5>
                <v-btn
                  class="mt-2"
                  type="submit"
                  block
                  color="primary"
                  prepend-icon="mdi-account-plus"
                  >Sign Up</v-btn
                >
              </v-form>
</template>
