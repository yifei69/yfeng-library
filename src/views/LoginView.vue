<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

const login = () => {
  if (username.value === 'admin' && password.value === 'password') {
    localStorage.setItem('isAuthenticated', 'true')
    error.value = ''
    router.push('/about')
  } else {
    error.value = 'Invalid username or password.'
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">

        <h1 class="text-center mb-4">Login</h1>

        <form @submit.prevent="login">

          <div class="mb-3">
            <label for="loginUsername" class="form-label">
              Username
            </label>

            <input
              id="loginUsername"
              v-model="username"
              type="text"
              class="form-control"
            />
          </div>

          <div class="mb-3">
            <label for="loginPassword" class="form-label">
              Password
            </label>

            <input
              id="loginPassword"
              v-model="password"
              type="password"
              class="form-control"
            />
          </div>

          <div
            v-if="error"
            class="alert alert-danger"
          >
            {{ error }}
          </div>

          <button
            type="submit"
            class="btn btn-primary"
          >
            Login
          </button>

        </form>

        <div class="mt-3">
          <strong>Test Account:</strong>
          admin / password
        </div>

      </div>
    </div>
  </div>
</template>