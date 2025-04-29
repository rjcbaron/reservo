<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <!-- Background and Centering -->
      <div
        class="d-flex align-center justify-center"
        style="
          min-height: 100dvh;
          background:
            linear-gradient(to bottom right, rgba(26, 101, 162, 0.6), rgba(119, 154, 229, 0.6)),
            url('/images/facility.jpg') center/cover no-repeat;
        "
      >
        <v-row class="justify-center" style="width: 100%">
          <v-col cols="12" md="6">
            <v-card class="mx-auto text-center" subtitle="Create your account">
              <template #title>
                <v-img
                  class="mx-auto"
                  src="/images/logo-favicon.png"
                  :width="mobile ? '75%' : '50%'"
                ></v-img>
              </template>
              <v-divider class="my-5"></v-divider>
              <v-card-text class="bg-surface-light pt-4">
                <RegisterForm></RegisterForm>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
  </AppLayout>
</template>
