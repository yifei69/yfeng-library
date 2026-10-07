<script setup>
import { onUnmounted, ref } from 'vue'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../Firebase/init'

const email = ref('')
const password = ref('')
const selectedRole = ref('reader')
const currentUser = ref(null)
const currentRole = ref(localStorage.getItem('firebaseRole') || '')
const error = ref('')

const unsubscribe = onAuthStateChanged(auth, (user) => {
  currentUser.value = user
  console.log('Current Firebase user:', user ? {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  } : null)
})

onUnmounted(() => unsubscribe())

const signIn = async () => {
  error.value = ''
  try {
    const credential = await signInWithEmailAndPassword(auth, email.value, password.value)
    localStorage.setItem('firebaseRole', selectedRole.value)
    currentRole.value = selectedRole.value
    console.log('Signed in user:', {
      uid: credential.user.uid,
      email: credential.user.email,
    })
  } catch (err) {
    console.error(err)
    error.value = err.code || err.message
  }
}

const logout = async () => {
  await signOut(auth)
  localStorage.removeItem('firebaseRole')
  currentRole.value = ''
  console.log('Current Firebase user after logout:', auth.currentUser)
}
</script>

<template>
  <main class="container mt-5">
    <div class="row justify-content-center">
      <section class="col-md-7 col-lg-6">
        <h1 class="mb-4 text-center">Firebase Sign In</h1>
        <form @submit.prevent="signIn">
          <div class="mb-3">
            <label for="firebaseSigninEmail" class="form-label">Email</label>
            <input id="firebaseSigninEmail" v-model="email" class="form-control" type="email" autocomplete="email" required />
          </div>
          <div class="mb-3">
            <label for="firebaseSigninPassword" class="form-label">Password</label>
            <input id="firebaseSigninPassword" v-model="password" class="form-control" type="password" autocomplete="current-password" required />
          </div>
          <div class="mb-3">
            <label for="firebaseSigninRole" class="form-label">Sign in role</label>
            <select id="firebaseSigninRole" v-model="selectedRole" class="form-select">
              <option value="reader">Reader</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary w-100">Sign In</button>
        </form>
        <button class="btn btn-outline-secondary w-100 mt-3" type="button" @click="logout">Log Out</button>
        <div v-if="currentUser" class="alert alert-success mt-3">
          <strong>Current user:</strong> {{ currentUser.email }}<br />
          <strong>Role:</strong> {{ currentRole }}
        </div>
        <p v-else class="alert alert-info mt-3">No Firebase user is currently signed in.</p>
        <p v-if="error" class="alert alert-danger mt-3">{{ error }}</p>
      </section>
    </div>
  </main>
</template>
