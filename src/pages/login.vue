<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height align-center justify-center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="headline">Login</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="email"
                label="Email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                :rules="passwordRules"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!valid" color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

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
    // router.push('/main')
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