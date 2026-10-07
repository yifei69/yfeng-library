<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../Firebase/init'

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('reader')
const message = ref('')
const error = ref('')

const register = async () => {
  message.value = ''
  error.value = ''
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await updateProfile(credential.user, {
      displayName: `${name.value || email.value} (${role.value})`,
    })
    console.log('Registered user:', {
      uid: credential.user.uid,
      email: credential.user.email,
    })
    message.value = `Registered ${credential.user.email} as ${role.value}`
    name.value = ''
    email.value = ''
    password.value = ''
    role.value = 'reader'
  } catch (err) {
    console.error(err)
    error.value = err.code || err.message
  }
}
</script>

<template>
  <main class="container mt-5">
    <div class="row justify-content-center">
      <section class="col-md-7 col-lg-6">
        <h1 class="mb-4 text-center">Firebase Registration</h1>
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="firebaseName" class="form-label">Name</label>
            <input id="firebaseName" v-model="name" class="form-control" type="text" autocomplete="name" />
          </div>
          <div class="mb-3">
            <label for="firebaseRegisterEmail" class="form-label">Email</label>
            <input id="firebaseRegisterEmail" v-model="email" class="form-control" type="email" autocomplete="email" required />
          </div>
          <div class="mb-3">
            <label for="firebaseRegisterPassword" class="form-label">Password</label>
            <input id="firebaseRegisterPassword" v-model="password" class="form-control" type="password" autocomplete="new-password" required minlength="6" />
          </div>
          <div class="mb-3">
            <label for="firebaseRegisterRole" class="form-label">Role</label>
            <select id="firebaseRegisterRole" v-model="role" class="form-select">
              <option value="reader">Reader</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
        <p v-if="message" class="alert alert-success mt-3">{{ message }}</p>
        <p v-if="error" class="alert alert-danger mt-3">{{ error }}</p>
      </section>
    </div>
  </main>
</template>
