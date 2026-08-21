<script setup>
import { ref } from 'vue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: ''
})

const submittedCards = ref([])

const errors = ref({
  username: null,
  password: null,
  resident: null,
  gender: null,
  reason: null
})

// Username validation
const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) {
      errors.value.username = 'Name must be at least 3 characters'
    }
  } else {
    errors.value.username = null
  }
}

// Password validation
const validatePassword = (blur) => {
  const password = formData.value.password

  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) {
      errors.value.password =
        `Password must be at least ${minLength} characters long.`
    }
  } else if (!hasUppercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one uppercase letter.'
    }
  } else if (!hasLowercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one lowercase letter.'
    }
  } else if (!hasNumber) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one number.'
    }
  } else if (!hasSpecialChar) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one special character.'
    }
  } else {
    errors.value.password = null
  }
}

// Australian Resident validation
const validateResident = () => {
  if (!formData.value.isAustralian) {
    errors.value.resident =
      'You must confirm Australian residency.'
  } else {
    errors.value.resident = null
  }
}

// Gender validation
const validateGender = () => {
  if (!formData.value.gender) {
    errors.value.gender = 'Please select a gender.'
  } else {
    errors.value.gender = null
  }
}

// Reason validation
const validateReason = (blur) => {
  if (formData.value.reason.trim().length < 10) {
    if (blur) {
      errors.value.reason =
        'Reason must be at least 10 characters.'
    }
  } else {
    errors.value.reason = null
  }
}

// Submit
const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateResident()
  validateGender()
  validateReason(true)

  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.resident &&
    !errors.value.gender &&
    !errors.value.reason
  ) {
    submittedCards.value.push({
      ...formData.value
    })

    clearForm()
  }
}

// Clear
const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
  }

  errors.value = {
    username: null,
    password: null,
    resident: null,
    gender: null,
    reason: null
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">

        <h1 class="text-center">
          User Information Form
        </h1>

        <form @submit.prevent="submitForm">

          <!-- Username and Password -->
          <div class="row mb-3">

            <div class="col-md-6">
              <label
                for="username"
                class="form-label"
              >
                Username
              </label>

              <input
                type="text"
                class="form-control"
                id="username"
                v-model="formData.username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
              />

              <div
                v-if="errors.username"
                class="text-danger"
              >
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6">
              <label
                for="password"
                class="form-label"
              >
                Password
              </label>

              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
              />

              <div
                v-if="errors.password"
                class="text-danger"
              >
                {{ errors.password }}
              </div>
            </div>

          </div>

          <!-- Australian Resident and Gender -->
          <div class="row mb-3">

            <div class="col-md-6">

              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                  v-model="formData.isAustralian"
                  @change="validateResident"
                />

                <label
                  for="isAustralian"
                  class="form-check-label"
                >
                  Australian Resident?
                </label>
              </div>

              <div
                v-if="errors.resident"
                class="text-danger"
              >
                {{ errors.resident }}
              </div>

            </div>

            <div class="col-md-6">

              <label
                for="gender"
                class="form-label"
              >
                Gender
              </label>

              <select
                class="form-select"
                id="gender"
                v-model="formData.gender"
                @change="validateGender"
              >
                <option value="">
                  Please select
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>

              <div
                v-if="errors.gender"
                class="text-danger"
              >
                {{ errors.gender }}
              </div>

            </div>

          </div>

          <!-- Reason -->
          <div class="mb-3">

            <label
              for="reason"
              class="form-label"
            >
              Reason for joining
            </label>

            <textarea
              class="form-control"
              id="reason"
              rows="3"
              v-model="formData.reason"
              @blur="() => validateReason(true)"
              @input="() => validateReason(false)"
            ></textarea>

            <div
              v-if="errors.reason"
              class="text-danger"
            >
              {{ errors.reason }}
            </div>

          </div>

          <!-- Buttons -->
          <div class="text-center">

            <button
              type="submit"
              class="btn btn-primary me-2"
            >
              Submit
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="clearForm"
            >
              Clear
            </button>

          </div>

        </form>
      </div>
    </div>

    <!-- PrimeVue DataTable -->
    <div
      class="row mt-5"
      v-if="submittedCards.length"
    >
      <div class="col-12">

        <h2 class="text-center mb-3">
          Submitted User Information
        </h2>

        <DataTable
          :value="submittedCards"
          tableStyle="min-width: 50rem"
        >

          <Column
            field="username"
            header="Username"
          />

          <Column
            field="password"
            header="Password"
          />

          <Column header="Australian Resident">
            <template #body="slotProps">
              {{
                slotProps.data.isAustralian
                  ? 'Yes'
                  : 'No'
              }}
            </template>
          </Column>

          <Column
            field="gender"
            header="Gender"
          />

          <Column
            field="reason"
            header="Reason"
          />

        </DataTable>

      </div>
    </div>

  </div>
</template>

<style scoped>
.text-danger {
  margin-top: 4px;
}
</style>