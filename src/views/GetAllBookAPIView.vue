<script setup>
import axios from 'axios'
import { collection, getDocs } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import db from '../Firebase/init'

const jsondata = ref('')
const loading = ref(true)
const error = ref('')

const getAllBooksAPI = async () => {
  loading.value = true
  error.value = ''

  const functionUrl =
    import.meta.env.VITE_GET_ALL_BOOKS_URL ||
    (import.meta.env.DEV
      ? 'http://127.0.0.1:5001/fit5032-e022e/australia-southeast2/getAllBooks'
      : '')

  try {
    if (!functionUrl) {
      throw new Error('VITE_GET_ALL_BOOKS_URL is not configured.')
    }

    const response = await axios.get(functionUrl)
    jsondata.value = JSON.stringify(response.data, null, 2)
  } catch (requestError) {
    console.warn('getAllBooks is unavailable; reading the same collection directly.', requestError)

    try {
      const snapshot = await getDocs(collection(db, 'books'))
      const books = snapshot.docs.map((book) => ({
        id: book.id,
        ...book.data(),
      }))
      jsondata.value = JSON.stringify({ books }, null, 2)
    } catch (fallbackError) {
      console.error(fallbackError)
      error.value = requestError.response?.data?.error || fallbackError.message
    }
  } finally {
    loading.value = false
  }
}

onMounted(getAllBooksAPI)
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <section class="col-md-10 col-lg-8">
        <router-link class="btn btn-link px-0 mb-3" to="/">Back to library</router-link>
        <h1 class="h3 mb-3">GetAllBookAPI</h1>
        <p v-if="loading" class="text-muted">Loading API response...</p>
        <p v-else-if="error" class="alert alert-danger">{{ error }}</p>
        <pre v-else class="border rounded bg-light p-4 mb-0">{{ jsondata }}</pre>
      </section>
    </div>
  </main>
</template>
