<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import BookList from '../components/firebase/BookList.vue'
import db from '../Firebase/init'

const isbn = ref('')
const name = ref('')
const message = ref('')
const error = ref('')
const bookList = ref(null)

const addBook = async () => {
  message.value = ''
  error.value = ''

  try {
    await addDoc(collection(db, 'books'), {
      isbn: Number(isbn.value),
      name: name.value,
    })
    message.value = 'Book added to Firestore.'
    isbn.value = ''
    name.value = ''
    await bookList.value?.loadBooks?.()
  } catch (err) {
    console.error(err)
    error.value = err.message
  }
}
</script>

<template>
  <main class="container mt-5 mb-5">
    <div class="row justify-content-center">
      <section class="col-md-8 col-lg-6">
        <h1 class="mb-4 text-center">Add Book</h1>
        <form @submit.prevent="addBook">
          <div class="mb-3">
            <label for="bookIsbn" class="form-label">ISBN</label>
            <input id="bookIsbn" v-model="isbn" class="form-control" type="number" min="0" required />
          </div>
          <div class="mb-3">
            <label for="bookName" class="form-label">Book name</label>
            <input id="bookName" v-model="name" class="form-control" type="text" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Add Book</button>
        </form>
        <p v-if="message" class="alert alert-success mt-3">{{ message }}</p>
        <p v-if="error" class="alert alert-danger mt-3">{{ error }}</p>
      </section>
    </div>

    <BookList ref="bookList" />
  </main>
</template>
