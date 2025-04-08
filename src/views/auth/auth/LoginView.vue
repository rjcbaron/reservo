<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="mx-auto pt-16 text-center" subtitle="Log in to your account">
            <template #title>
              <v-img class="mx-auto" src="/images/logo-favicon.png" :width="mobile ? '75%' : '50%'">
              </v-img>
            </template>
            <v-divider class="my-5"></v-divider>
            <v-card-text class="bg-surface-light pt-4">
              <v-form fast-fail @submit.prevent>
                <v-text-field label="Email" variant="outlined"></v-text-field>

                <v-text-field label="Password" type="password" variant="outlined"></v-text-field>

                <v-btn class="mt-2" type="submit" block color="primary" prepend-icon="mdi-login"
                  >Log In</v-btn
                >
              </v-form>

              <v-divider class="my-5"></v-divider>
              <h5 class="text-center">
                Don't have account?
                <RouterLink class="text-primary" to="/register"> Click here to register</RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
