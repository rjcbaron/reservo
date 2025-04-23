<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const selectedDate = ref('2025-04-22')
const selectedTime = ref('')
const dialog = ref(false)
const confirmed = ref(false)

const morningSlots = [
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
]
const afternoonSlots = [
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
]

const bookAppointment = () => {
  if (selectedTime.value) {
    dialog.value = true
  }
}

const confirmBooking = () => {
  confirmed.value = true
  dialog.value = false
}

const cancelBooking = () => {
  confirmed.value = false
  selectedTime.value = ''
}

const profile = ref({
  firstName: 'John',
  lastName: 'Doe',
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid class="pa-4">
        <!-- Welcome Banner -->
        <v-card class="ms-4 pa-4" color="blue-lighten-2" theme="dark" elevation="8" rounded="lg">
          <v-row align="center" justify="space-between">
            <div>
              <h2 class="text-h5 font-weight-bold ms-4">Welcome, {{ profile.firstName }}!</h2>
              <p class="ms-4">Reserve your spot and get ready for your next game!</p>
            </div>
            <v-img
              src="/images/sports-banner.png"
              max-width="150"
              class="ml-4"
              alt="Sports Image"
            />
          </v-row>
        </v-card>

        <!-- Scheduled Reservation Section -->
        <v-row class="mt-5 ms-2 mb-6" justify="left">
          <v-col cols="12" md="10">
            <v-card
              elevation="4"
              rounded="xl"
              class="pa-4"
              max-width="700"
              color="blue-grey-lighten-5"
              style="border: 2px dashed #90caf9"
            >
              <v-row align="center">
                <v-col cols="12" md="1" class="text-center">
                  <v-icon color="blue" size="36">mdi-calendar-check</v-icon>
                </v-col>
                <v-col cols="12" md="11">
                  <div v-if="confirmed">
                    <p class="text-body-1 font-weight-medium">
                      📢 You have confirmed a reservation on
                      <strong>{{ selectedDate }}</strong> at <strong>{{ selectedTime }}</strong
                      >.
                    </p>
                    <v-btn color="red" variant="text" @click="cancelBooking">Cancel</v-btn>
                    <v-btn color="blue-lighten-1" variant="text" @click="confirmed = false"
                      >Update</v-btn
                    >
                  </div>
                  <div v-else>
                    <p class="text-body-2 text-grey-darken-1">
                      No reservation scheduled yet. Select a time to reserve your slot.
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Booking Section -->
        <v-container class="d-flex justify-center align-center">
          <v-row class="w-100" align="center" justify="center">
            <v-col cols="12" md="4">
              <v-card elevation="2" class="rounded-xl pa-4">
                <v-date-picker
                  v-model="selectedDate"
                  color="blue-lighten-1"
                  show-adjacent-months
                  class="rounded-lg"
                />
              </v-card>
            </v-col>

            <v-col cols="12" md="7">
              <v-card elevation="2" class="rounded-xl pa-6">
                <v-row class="mb-6">
                  <v-col cols="12">
                    <h3 class="text-h6 font-weight-bold mb-2">Morning</h3>
                    <div class="d-flex flex-wrap gap-3">
                      <v-btn
                        v-for="time in morningSlots"
                        :key="time"
                        :variant="selectedTime === time ? 'flat' : 'outlined'"
                        :color="selectedTime === time ? 'blue-lighten-1' : 'blue-grey-lighten-3'"
                        class="rounded-lg text-caption ma-1"
                        style="min-width: 90px"
                        @click="selectedTime = time"
                      >
                        {{ time }}
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>

                <v-row class="mb-6">
                  <v-col cols="12">
                    <h3 class="text-h6 font-weight-bold mb-2">Afternoon</h3>
                    <div class="d-flex flex-wrap gap-3">
                      <v-btn
                        v-for="time in afternoonSlots"
                        :key="time"
                        :variant="selectedTime === time ? 'flat' : 'outlined'"
                        :color="selectedTime === time ? 'blue-lighten-1' : 'blue-grey-lighten-3'"
                        class="rounded-lg text-caption ma-1"
                        style="min-width: 90px"
                        @click="selectedTime = time"
                      >
                        {{ time }}
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>

                <v-divider class="my-6" />

                <div class="text-center">
                  <v-btn
                    color="blue-lighten-1"
                    size="large"
                    :disabled="!selectedTime"
                    @click="bookAppointment"
                  >
                    Book Now
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Confirmation Dialog -->
          <v-dialog v-model="dialog" width="400">
            <v-card>
              <v-card-title class="text-h6 font-weight-bold">Confirm Appointment</v-card-title>
              <v-card-text>
                <p>
                  You're booking an appointment for:
                  <br />
                  <strong>{{ selectedDate }}</strong> at <strong>{{ selectedTime }}</strong>
                </p>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
                <v-btn color="primary" @click="confirmBooking">Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped></style>
