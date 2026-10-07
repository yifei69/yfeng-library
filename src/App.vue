<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isAuthenticated = ref(
  localStorage.getItem('isAuthenticated') === 'true'
)

const showHeader = () =>
  !['CountBookAPI', 'GetAllBookAPI'].includes(route.name)

// Update login state whenever the route changes
watch(
  () => route.path,
  () => {
    isAuthenticated.value =
      localStorage.getItem('isAuthenticated') === 'true'
  }
)

// Logout
const logout = () => {
  localStorage.removeItem('isAuthenticated')
  isAuthenticated.value = false
  router.push('/login')
}
</script>

<template>
  <div>
    <nav v-if="showHeader()" class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">

        <span class="navbar-brand">
          Library
        </span>

        <div class="navbar-nav">

          <router-link
            to="/"
            class="nav-link"
            active-class="active"
          >
            Home (Week 5)
          </router-link>

          <router-link
            to="/about"
            class="nav-link"
            active-class="active"
          >
            About
          </router-link>

          <router-link
            to="/firebase-register"
            class="nav-link"
            active-class="active"
          >
            Firebase Register
          </router-link>

          <router-link
            to="/firebase-signin"
            class="nav-link"
            active-class="active"
          >
            Firebase Sign In
          </router-link>

          <router-link
            to="/addbook"
            class="nav-link"
            active-class="active"
          >
            Add Book
          </router-link>

          <router-link
            to="/book-counter"
            class="nav-link"
            active-class="active"
          >
            Book Counter
          </router-link>

          <router-link
            to="/WeatherCheck"
            class="nav-link"
            active-class="active"
          >
            Get Weather
          </router-link>

          <router-link
            to="/CountBookAPI"
            class="nav-link"
            active-class="active"
          >
            Count Book API
          </router-link>

          <router-link
            to="/GetAllBookAPI"
            class="nav-link"
            active-class="active"
          >
            Get All Books API
          </router-link>

          <!-- Show Login when user is not authenticated -->
          <router-link
            v-if="!isAuthenticated"
            to="/login"
            class="nav-link"
            active-class="active"
          >
            Login
          </router-link>

          <!-- Show Logout when user is authenticated -->
          <button
            v-else
            class="btn btn-link nav-link"
            @click="logout"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>
