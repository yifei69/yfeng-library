<script setup>
import axios from 'axios'
import { ref } from 'vue'

const count = ref(null)
const error = ref('')
const loading = ref(false)

const getBookCount = async () => {
  count.value = null
  error.value = ''
  loading.value = true

  try {
    const functionUrl = import.meta.env.VITE_COUNT_BOOKS_URL
    if (!functionUrl) {
      throw new Error('VITE_COUNT_BOOKS_URL is not configured.')
    }

    const response = await axios.get(functionUrl)
    count.value = response.data.count
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="container mt-5">
    <div class="row justify-content-center">
      <section class="col-md-7 col-lg-6 text-center">
        <h1 class="mb-4">Book Counter</h1>
        <button
          class="btn btn-primary w-100"
          type="button"
          :disabled="loading"
          @click="getBookCount"
        >
          {{ loading ? 'Loading...' : 'Get Book Count' }}
        </button>

        <p v-if="count !== null" class="alert alert-success mt-3">
          Total number of books: {{ count }}
        </p>
        <p v-else-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </p>
      </section>
    </div>
  </main>
</template>
