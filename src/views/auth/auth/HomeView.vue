<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const selectedDate = ref('')
const selectedTime = ref('')
const userReservations = ref([])
const allReservations = ref([])
const dialog = ref(false)
const confirmed = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const loadingReservations = ref(false)
const tab = ref('upcoming')

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

const profile = ref({ firstName: '', lastName: '', userId: null })

const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  const minutesStr = minutes < 10 ? '0' + minutes : minutes
  return `${hours}:${minutesStr} ${ampm}`
}

const upcomingReservations = computed(() => {
  const now = new Date()
  return userReservations.value
    .filter((res) => new Date(res.reserved_start) >= now)
    .sort((a, b) => new Date(a.reserved_start) - new Date(b.reserved_start))
})

const pastReservations = computed(() => {
  const now = new Date()
  return userReservations.value
    .filter((res) => new Date(res.reserved_start) < now)
    .sort((a, b) => new Date(b.reserved_start) - new Date(a.reserved_start))
})

const fetchUserReservations = async (userId) => {
  if (!userId) return
  loadingReservations.value = true
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', userId)
      .order('reserved_start', { ascending: false })
    if (error) console.error('Error fetching reservations:', error)
    userReservations.value = data || []
  } catch (err) {
    console.error('Unexpected error fetching reservations:', err)
  } finally {
    loadingReservations.value = false
  }
}

const fetchAllReservations = async () => {
  loadingReservations.value = true
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('reserved_start', { ascending: true })
    if (error) console.error('Error fetching all reservations:', error)
    allReservations.value = data || []
  } catch (err) {
    console.error('Unexpected error fetching all reservations:', err)
  } finally {
    loadingReservations.value = false
  }
}

const deleteReservation = async (reservationId) => {
  if (!reservationId) return
  loading.value = true
  try {
    const { error } = await supabase.from('reservations').delete().eq('id', reservationId)
    if (error) {
      errorMessage.value = 'Failed to delete reservation. Try again.'
      console.error('Reservation delete error:', error)
    } else {
      await fetchUserReservations(profile.value.userId)
      await fetchAllReservations()
    }
  } catch (err) {
    errorMessage.value = 'Unexpected error occurred.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const currentDate = new Date()
  selectedDate.value = currentDate.toISOString().split('T')[0]
  const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes()
  const roundedTime = Math.round(currentTime / 30) * 30
  const hour = Math.floor(roundedTime / 60)
  const minute = roundedTime % 60
  const time = `${hour % 12 === 0 ? 12 : hour % 12}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`
  selectedTime.value = time

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      profile.value.userId = storedUserId
      profile.value.firstName = 'User'
      profile.value.lastName = ''
      await fetchUserReservations(storedUserId)
    }
    await fetchAllReservations()
    return
  }

  profile.value.firstName = user.user_metadata?.firstname || 'User'
  profile.value.lastName = user.user_metadata?.lastname || ''
  profile.value.userId = user.id
  localStorage.setItem('userId', user.id)
  await fetchUserReservations(user.id)
  await fetchAllReservations()
})

const bookAppointment = () => {
  errorMessage.value = ''
  const today = new Date()
  const selected = new Date(selectedDate.value)
  if (selected < new Date(today.toDateString())) {
    errorMessage.value = 'You cannot book an appointment in the past.'
    return
  }
  if (selectedTime.value) {
    dialog.value = true
  }
}

const confirmBooking = async () => {
  errorMessage.value = ''
  if (!selectedDate.value || !selectedTime.value) {
    errorMessage.value = 'Please select date and time before confirming.'
    return
  }

  loading.value = true
  const timeParts = selectedTime.value.match(/(\d+):(\d+) (\w+)/)
  if (!timeParts) {
    errorMessage.value = 'Invalid time format selected.'
    loading.value = false
    return
  }

  let hour = parseInt(timeParts[1])
  const minute = parseInt(timeParts[2])
  const ampm = timeParts[3]
  if (ampm === 'PM' && hour !== 12) hour += 12
  else if (ampm === 'AM' && hour === 12) hour = 0

  const reservedStart = new Date(selectedDate.value)
  reservedStart.setHours(hour, minute, 0, 0)

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      errorMessage.value = 'User not authenticated.'
      loading.value = false
      return
    }

    const { data: existing, error: checkError } = await supabase
      .from('reservations')
      .select('*')
      .eq('reserved_start', reservedStart.toISOString())

    if (checkError) {
      errorMessage.value = 'Error checking existing bookings.'
      loading.value = false
      return
    }

    if (existing.length > 0) {
      errorMessage.value = 'This time slot is already booked. Please choose another.'
      loading.value = false
      return
    }

    const { error } = await supabase.from('reservations').insert([
      {
        user_id: user.id,
        reserved_start: reservedStart.toISOString(),
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      errorMessage.value = 'Failed to create reservation. Try again.'
      console.error('Reservation insert error:', error)
    } else {
      confirmed.value = true
      dialog.value = false
      await fetchUserReservations(user.id)
      await fetchAllReservations()
    }
  } catch (err) {
    errorMessage.value = 'Unexpected error occurred.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const cancelBooking = () => {
  confirmed.value = false
  selectedTime.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <DefaultLayout>
    <template #content>
      <v-container fluid class="pa-4">
        <!-- Welcome Banner -->
        <v-card
          class="ms-4 pa-4"
          style="background: linear-gradient(to bottom, rgb(66, 165, 245), rgb(178, 202, 244))"
          elevation="8"
          rounded="lg"
        >
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

        <!-- User Reservations Section -->
        <v-row class="mt-5 mb-4" justify="center">
          <v-col cols="12" md="11">
            <v-card elevation="4" rounded="xl" class="pa-4 mx-auto">
              <v-card-title class="text-h6 font-weight-bold pb-2 pt-1">
                <v-icon color="blue" size="28" class="me-2">mdi-calendar-multiple</v-icon>
                Your Reservations
              </v-card-title>

              <v-card-text>
                <v-tabs v-model="tab" color="blue-lighten-1">
                  <v-tab value="upcoming">Upcoming</v-tab>
                  <v-tab value="past">Past</v-tab>
                  <v-tab value="all">All Reservations</v-tab>
                </v-tabs>

                <v-window v-model="tab">
                  <!-- Upcoming Reservations Tab -->
                  <v-window-item value="upcoming">
                    <v-sheet class="pt-4">
                      <div v-if="loadingReservations" class="d-flex justify-center pa-4">
                        <v-progress-circular indeterminate color="blue"></v-progress-circular>
                      </div>
                      <div
                        v-else-if="upcomingReservations.length === 0"
                        class="text-center pa-4 text-grey"
                      >
                        No upcoming reservations. Book a time slot below!
                      </div>
                      <v-list v-else lines="two">
                        <v-list-item
                          v-for="reservation in upcomingReservations"
                          :key="reservation.id"
                          class="mb-2"
                          rounded="lg"
                        >
                          <template v-slot:prepend>
                            <v-avatar color="blue-lighten-4" class="me-4">
                              <v-icon color="blue-darken-1">mdi-clock</v-icon>
                            </v-avatar>
                          </template>

                          <v-list-item-title class="font-weight-medium">
                            {{ formatDate(reservation.reserved_start) }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Time: {{ formatTime(reservation.reserved_start) }}
                          </v-list-item-subtitle>

                          <template v-slot:append>
                            <v-btn
                              color="red"
                              variant="text"
                              density="comfortable"
                              :loading="loading"
                              @click="deleteReservation(reservation.id)"
                            >
                              Cancel
                            </v-btn>
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-sheet>
                  </v-window-item>

                  <!-- Past Reservations Tab -->
                  <v-window-item value="past">
                    <v-sheet class="pt-4">
                      <div v-if="loadingReservations" class="d-flex justify-center pa-4">
                        <v-progress-circular indeterminate color="blue"></v-progress-circular>
                      </div>
                      <div
                        v-else-if="pastReservations.length === 0"
                        class="text-center pa-4 text-grey"
                      >
                        No past reservations found.
                      </div>
                      <v-list v-else lines="two">
                        <v-list-item
                          v-for="reservation in pastReservations"
                          :key="reservation.id"
                          class="mb-2"
                          rounded="lg"
                        >
                          <template v-slot:prepend>
                            <v-avatar color="grey-lighten-3" class="me-4">
                              <v-icon color="grey-darken-1">mdi-clock-outline</v-icon>
                            </v-avatar>
                          </template>

                          <v-list-item-title class="text-grey-darken-1">
                            {{ formatDate(reservation.reserved_start) }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="text-grey">
                            Time: {{ formatTime(reservation.reserved_start) }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-sheet>
                  </v-window-item>

                  <!-- All Reservations Tab -->
                  <v-window-item value="all">
                    <v-sheet class="pt-4">
                      <div v-if="loadingReservations" class="d-flex justify-center pa-4">
                        <v-progress-circular indeterminate color="blue"></v-progress-circular>
                      </div>
                      <div
                        v-else-if="allReservations.length === 0"
                        class="text-center pa-4 text-grey"
                      >
                        No reservations found.
                      </div>
                      <v-list v-else lines="two">
                        <v-list-item
                          v-for="reservation in allReservations"
                          :key="reservation.id"
                          class="mb-2"
                          rounded="lg"
                        >
                          <template v-slot:prepend>
                            <v-avatar color="grey-lighten-3" class="me-4">
                              <v-icon color="grey-darken-1">mdi-clock-outline</v-icon>
                            </v-avatar>
                          </template>

                          <v-list-item-title class="text-grey-darken-1">
                            {{ formatDate(reservation.reserved_start) }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="text-grey">
                            Time: {{ formatTime(reservation.reserved_start) }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-sheet>
                  </v-window-item>
                </v-window>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Booking Section -->
        <v-container class="d-flex justify-center align-center">
          <v-row class="w-100" align="center" justify="center">
            <v-col cols="12" md="4">
              <v-card elevation="2" class="rounded-xl pa-4">
                <v-card-title class="text-h6 font-weight-bold pb-2">
                  <v-icon color="blue" size="24" class="me-2">mdi-calendar-plus</v-icon>
                  Book a Slot
                </v-card-title>
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
                <!-- Morning Slots -->
                <v-row class="mb-6">
                  <v-col cols="12">
                    <h3 class="text-h6 font-weight-bold mb-2">Morning</h3>
                    <div class="d-flex flex-wrap gap-3">
                      <v-btn
                        v-for="time in morningSlots"
                        :key="time"
                        :variant="selectedTime === time ? 'flat' : 'outlined'"
                        :class="
                          selectedTime === time ? 'text-white' : 'text-black border-blue-lighten-1'
                        "
                        class="rounded-lg text-caption ma-1"
                        style="min-width: 90px"
                        color="blue-lighten-1"
                        @click="selectedTime = time"
                      >
                        {{ time }}
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>

                <!-- Afternoon Slots -->
                <v-row class="mb-6">
                  <v-col cols="12">
                    <h3 class="text-h6 font-weight-bold mb-2">Afternoon</h3>
                    <div class="d-flex flex-wrap gap-3">
                      <v-btn
                        v-for="time in afternoonSlots"
                        :key="time"
                        :variant="selectedTime === time ? 'flat' : 'outlined'"
                        color="blue-lighten-1"
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

                <!-- Error Message -->
                <p v-if="errorMessage" class="text-center red--text mb-4">{{ errorMessage }}</p>

                <!-- Book Now Button -->
                <div class="text-center">
                  <v-btn
                    color="blue-lighten-1"
                    size="large"
                    :disabled="!selectedTime || loading"
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
                <v-btn variant="text" @click="dialog = false" :disabled="loading">Cancel</v-btn>
                <v-btn
                  color="primary"
                  @click="confirmBooking"
                  :loading="loading"
                  :disabled="loading"
                >
                  Confirm
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-container>
    </template>
  </DefaultLayout>
</template>

<style scoped>
.v-list-item {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
