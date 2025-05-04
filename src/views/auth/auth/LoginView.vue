<script setup>
import AuthLayout from '@/components/layout/AuthLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AuthLayout>
    <template #content>
      <div
        class="d-flex align-center justify-center"
        style="
          min-height: 100dvh;
          background:
            linear-gradient(to bottom right, rgba(26, 101, 162, 0.6), rgba(119, 154, 229, 0.6)),
            url('/images/facility.jpg') center/cover no-repeat;
        "
      >
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-card
              class="mx-auto pt-16 text-center"
              subtitle="Log in to your account"
              max-width="450"
              elevation="10"
              style="
                background-color: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(3px);
                border: 2px solid #2196f3;
                border-radius: 16px;
              "
            >
              <template #title>
                <v-img
                  class="mx-auto"
                  src="/images/logo-favicon.png"
                  :width="mobile ? '75%' : '50%'"
                >
                </v-img>
              </template>
              <v-divider class="my-5"></v-divider>
              <v-card-text class="bg-surface-light pt-4">
                <LoginForm />
                <v-divider class="my-5"></v-divider>
                <h5 class="text-center">
                  Don't have account?
                  <RouterLink class="text-primary" to="/register"
                    >Click here to register</RouterLink
                  >
                </h5>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
  </AuthLayout>
</template>
