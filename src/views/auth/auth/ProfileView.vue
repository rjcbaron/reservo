<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { supabase } from '@/utils/supabase'

const currentTab = ref('profile')

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: '',
  phone: '',
})

const reservations = ref([])

onMounted(async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.error('User not logged in:', error)
    return
  }

  const metadata = user.user_metadata || {}
  profile.value.firstName = metadata.firstname || ''
  profile.value.lastName = metadata.lastname || ''
  profile.value.email = user.email || ''
  profile.value.confirmEmail = user.email || ''
  profile.value.phone = metadata.phone || ''

  // Fetch reservations
  const { data: reservationsData, error: reservationsError } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', user.id)
    .order('reserved_start', { ascending: true })

  if (reservationsError) {
    console.error('Error fetching reservations:', reservationsError)
  } else {
    reservations.value = reservationsData
  }
})

const saveChanges = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    console.error('User not found:', error)
    return
  }

  const { error: updateError } = await supabase.auth.updateUser({
    email: profile.value.email,
    data: {
      firstname: profile.value.firstName,
      lastname: profile.value.lastName,
      phone: profile.value.phone,
    },
  })

  if (updateError) {
    console.error('Failed to update user:', updateError)
  } else {
    alert('Profile updated successfully!')
  }
}
</script>

<template>
  <DefaultLayout>
    <template #content>
      <v-container class="d-flex justify-center align-center" style="min-height: 100vh">
        <v-row class="w-100" align="center" justify="center">
          <!-- Sidebar -->
          <v-col cols="12" md="3">
            <v-card elevation="2" class="rounded-xl pa-4" style="height: 100%">
              <div class="text-center mb-4">
                <v-avatar size="80" class="mb-2">
                  <v-img
                    :width="300"
                    aspect-ratio="16/9"
                    cover
                    src="/public/images/user.png"
                  ></v-img>
                </v-avatar>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ profile.firstName }} {{ profile.lastName }}
                </div>
              </div>
              <v-divider class="my-4" />
              <v-list density="compact" nav>
                <v-list-item
                  v-for="item in [
                    { title: 'Account Details', value: 'profile' },
                    { title: 'Reservations', value: 'reservations' },
                    { title: 'FAQ', value: 'faq' },
                    { title: 'About Us', value: 'about' },
                  ]"
                  :key="item.value"
                  :active="currentTab === item.value"
                  @click="currentTab = item.value"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- Main Content -->
          <v-col cols="12" md="8">
            <v-card elevation="2" class="rounded-xl pa-6">
              <v-window v-model="currentTab">
                <!-- Profile Tab -->
                <v-window-item value="profile">
                  <h3 class="text-h6 font-weight-bold mb-4">Account Details</h3>
                  <v-text-field
                    label="First Name"
                    v-model="profile.firstName"
                    outlined
                    class="mb-3"
                  />
                  <v-text-field
                    label="Last Name"
                    v-model="profile.lastName"
                    outlined
                    class="mb-3"
                  />
                  <v-text-field label="Email" v-model="profile.email" outlined class="mb-3" />
                  <v-text-field
                    label="Confirm Email"
                    v-model="profile.confirmEmail"
                    outlined
                    class="mb-3"
                  />
                  <v-text-field
                    label="Password"
                    v-model="profile.password"
                    type="password"
                    outlined
                    class="mb-3"
                  />
                  <v-text-field
                    label="Confirm Password"
                    v-model="profile.confirmPassword"
                    type="password"
                    outlined
                    class="mb-3"
                  />
                  <v-text-field
                    label="Phone Number"
                    v-model="profile.phone"
                    outlined
                    class="mb-6"
                  />
                  <v-btn color="blue-lighten-1" size="large" @click="saveChanges">
                    Save Changes
                  </v-btn>
                </v-window-item>

                <!-- Reservations Tab -->
                <v-window-item value="reservations">
                  <h3 class="text-h6 font-weight-bold mb-4">My Reservations</h3>
                  <v-list>
                    <v-list-item
                      v-for="(res, index) in reservations"
                      :key="index"
                      class="rounded-lg border mb-2"
                    >
                      <v-list-item-title>
                        {{ new Date(res.reserved_start).toLocaleDateString() }}
                        at
                        {{ new Date(res.reserved_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-window-item>

                <!-- FAQ Tab -->
                <v-window-item value="faq">
                  <h3 class="text-h6 font-weight-bold mb-4">FAQ</h3>
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-title>How do I edit my profile?</v-expansion-panel-title>
                      <v-expansion-panel-text>
                        Just update the fields and click "Save Changes".
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-title>
                        How do I cancel a reservation?
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        Contact support to cancel a reservation.
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-window-item>

                <!-- About Us Tab -->
                <v-window-item value="about">
                  <h3 class="text-h6 font-weight-bold mb-4">About Us</h3>
                  <p class="text-body-2">
                    Welcome to our reservation platform! <br /><br />
                    This system is developed as a final project for IT 110 – Web Systems and
                    Technologies. <br />
                    Our goal is to provide a fast, easy, and reliable way to book facility
                    slots—whether for sports, meetings, or other activities.
                    <br />
                    <br />
                    Thank you for trying out our system!
                  </p>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </DefaultLayout>
</template>
