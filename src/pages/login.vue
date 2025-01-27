<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height align-center justify-center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="headline text-center py-4">Login</v-card-title>
          <v-card-text class="pb-3">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="email" placeholder="Email" :rules="emailRules" single-line required />
              <v-text-field
                v-model="password"
                placeholder="Password"
                :rules="passwordRules"
                type="password"
                class="mt-2"
                single-line
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn :disabled="!valid" color="primary" variant="flat" block @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useUserStore } from '~/stores/user.store'
const userStore = useUserStore()
const email = ref('')
const password = ref('')
const valid = ref(false)
const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]
const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
]

const router = useRouter()

async function login() {
  const auth = getAuth()
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('User logged in:', userCredential.user)
    userStore.setUid(userCredential.user.uid)
    router.push('/control')
  } catch (error) {
    console.error('Error logging in:', error)
    alert('Login failed. Please check your credentials and try again.')
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
