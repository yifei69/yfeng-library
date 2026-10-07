<script setup>
import { onMounted, ref } from 'vue'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import db from '../../Firebase/init'

const books = ref([])
const loading = ref(false)
const error = ref('')
const editingId = ref(null)
const editForm = ref({ isbn: '', name: '' })

const loadBooks = async () => {
  loading.value = true
  error.value = ''

  try {
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(20),
    )
    const snapshot = await getDocs(booksQuery)
    books.value = snapshot.docs.map((book) => ({
      id: book.id,
      ...book.data(),
    }))
  } catch (err) {
    console.error(err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const startEdit = (book) => {
  editingId.value = book.id
  editForm.value = { isbn: book.isbn, name: book.name }
}

const cancelEdit = () => {
  editingId.value = null
}

const saveEdit = async () => {
  if (!editingId.value || !editForm.value.name) return

  try {
    await updateDoc(doc(db, 'books', editingId.value), {
      isbn: Number(editForm.value.isbn),
      name: editForm.value.name,
    })
    editingId.value = null
    await loadBooks()
  } catch (err) {
    console.error(err)
    error.value = err.message
  }
}

const removeBook = async (id) => {
  try {
    await deleteDoc(doc(db, 'books', id))
    await loadBooks()
  } catch (err) {
    console.error(err)
    error.value = err.message
  }
}

onMounted(loadBooks)

defineExpose({ loadBooks })
</script>

<template>
  <section class="mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4 mb-0">Books with ISBN above 1000</h2>
      <button class="btn btn-outline-primary" type="button" @click="loadBooks">
        Refresh
      </button>
    </div>

    <p v-if="loading" class="text-muted">Loading books...</p>
    <p v-if="error" class="alert alert-danger">{{ error }}</p>
    <p v-if="!loading && !books.length" class="alert alert-info">
      No matching books found.
    </p>

    <div v-if="books.length" class="table-responsive">
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <template v-if="editingId === book.id">
              <td>
                <input v-model="editForm.isbn" class="form-control" type="number" min="0" />
              </td>
              <td>
                <input v-model="editForm.name" class="form-control" type="text" />
              </td>
              <td class="text-nowrap">
                <button class="btn btn-sm btn-success me-2" type="button" @click="saveEdit">
                  Save
                </button>
                <button class="btn btn-sm btn-secondary" type="button" @click="cancelEdit">
                  Cancel
                </button>
              </td>
            </template>
            <template v-else>
              <td>{{ book.isbn }}</td>
              <td>{{ book.name }}</td>
              <td class="text-nowrap">
                <button class="btn btn-sm btn-outline-primary me-2" type="button" @click="startEdit(book)">
                  Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" type="button" @click="removeBook(book.id)">
                  Delete
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
