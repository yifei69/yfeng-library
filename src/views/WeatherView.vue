<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const city = ref('')
const weatherData = ref(null)
const loading = ref(false)
const error = ref('')
const locationMessage = ref('')

const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
const fallbackLocation = {
  latitude: -37.911,
  longitude: 145.133,
  name: 'Clayton',
  country: 'AU',
}

const weatherCodeMap = {
  0: { description: 'clear sky', icon: '01d' },
  1: { description: 'mainly clear', icon: '02d' },
  2: { description: 'partly cloudy', icon: '03d' },
  3: { description: 'overcast', icon: '04d' },
  45: { description: 'fog', icon: '50d' },
  48: { description: 'depositing rime fog', icon: '50d' },
  51: { description: 'light drizzle', icon: '09d' },
  53: { description: 'moderate drizzle', icon: '09d' },
  55: { description: 'dense drizzle', icon: '09d' },
  61: { description: 'slight rain', icon: '10d' },
  63: { description: 'moderate rain', icon: '10d' },
  65: { description: 'heavy rain', icon: '10d' },
  71: { description: 'slight snow', icon: '13d' },
  73: { description: 'moderate snow', icon: '13d' },
  75: { description: 'heavy snow', icon: '13d' },
  80: { description: 'slight rain showers', icon: '09d' },
  81: { description: 'moderate rain showers', icon: '09d' },
  82: { description: 'violent rain showers', icon: '09d' },
  95: { description: 'thunderstorm', icon: '11d' },
  96: { description: 'thunderstorm with hail', icon: '11d' },
  99: { description: 'thunderstorm with heavy hail', icon: '11d' },
}

const temperature = computed(() => {
  const value = weatherData.value?.main?.temp
  return value === undefined ? null : Math.round(value)
})

const iconUrl = computed(() => {
  const icon = weatherData.value?.weather?.[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
})

const locationLabel = computed(() => {
  const name = weatherData.value?.name || ''
  const country = weatherData.value?.sys?.country
  return country ? `${name}, ${country}` : name
})

const weatherDescription = computed(
  () => weatherData.value?.weather?.[0]?.description || '',
)

const errorMessage = (requestError) =>
  requestError.response?.data?.message ||
  requestError.response?.data?.reason ||
  requestError.message ||
  'Unable to load weather data.'

const createWeatherDataFromOpenMeteo = (data, name, country) => {
  const current = data.current
  const weather = weatherCodeMap[current.weather_code] || {
    description: 'unknown conditions',
    icon: '03d',
  }

  return {
    name,
    sys: { country },
    main: { temp: current.temperature_2m },
    weather: [weather],
  }
}

const fetchOpenMeteoWeather = async ({ latitude, longitude, name, country }) => {
  const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude,
      longitude,
      current: 'temperature_2m,weather_code',
      timezone: 'auto',
    },
  })

  weatherData.value = createWeatherDataFromOpenMeteo(response.data, name, country)
}

const fetchWeatherByCoordinates = async ({ latitude, longitude, name, country }) => {
  if (openWeatherApiKey) {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat: latitude,
            lon: longitude,
            appid: openWeatherApiKey,
            units: 'metric',
          },
        },
      )
      weatherData.value = response.data
      return
    } catch (requestError) {
      console.warn('OpenWeather request failed; using the free fallback API.', requestError)
    }
  }

  await fetchOpenMeteoWeather({ latitude, longitude, name, country })
}

const fetchWeatherByCity = async (cityName) => {
  if (openWeatherApiKey) {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: cityName,
            appid: openWeatherApiKey,
            units: 'metric',
          },
        },
      )
      weatherData.value = response.data
      return
    } catch (requestError) {
      console.warn('OpenWeather request failed; using the free fallback API.', requestError)
    }
  }

  const geocodingResponse = await axios.get(
    'https://geocoding-api.open-meteo.com/v1/search',
    {
      params: {
        name: cityName,
        count: 1,
        language: 'en',
        format: 'json',
      },
    },
  )
  const place = geocodingResponse.data.results?.[0]

  if (!place) {
    throw new Error(`No location found for "${cityName}".`)
  }

  await fetchOpenMeteoWeather({
    latitude: place.latitude,
    longitude: place.longitude,
    name: place.name,
    country: place.country_code,
  })
}

const getCurrentCoordinates = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not available in this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          name: 'Current location',
          country: '',
        }),
      reject,
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 },
    )
  })

const fetchCurrentLocationWeather = async () => {
  loading.value = true
  error.value = ''
  locationMessage.value = ''

  try {
    const coordinates = await getCurrentCoordinates()
    await fetchWeatherByCoordinates(coordinates)
  } catch (requestError) {
    try {
      await fetchWeatherByCoordinates(fallbackLocation)
      locationMessage.value = 'Location access was unavailable, so Clayton, AU is shown.'
    } catch (fallbackError) {
      error.value = errorMessage(fallbackError)
    }
    if (!weatherData.value && requestError) {
      console.warn('Current location weather was unavailable.', requestError)
    }
  } finally {
    loading.value = false
  }
}

const searchByCity = async () => {
  const cityName = city.value.trim()
  if (!cityName) {
    error.value = 'Enter a city name to search.'
    return
  }

  loading.value = true
  error.value = ''
  locationMessage.value = ''

  try {
    await fetchWeatherByCity(cityName)
  } catch (requestError) {
    error.value = errorMessage(requestError)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCurrentLocationWeather)
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <section class="col-md-9 col-lg-7">
        <h1 class="mb-4 text-center">Weather Check</h1>

        <form class="input-group mb-2" @submit.prevent="searchByCity">
          <label class="visually-hidden" for="city">City</label>
          <input
            id="city"
            v-model="city"
            class="form-control"
            type="search"
            placeholder="Search by city, e.g. Clayton, AU"
            autocomplete="address-level2"
          />
          <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Loading...' : 'Search' }}
          </button>
        </form>

        <button
          class="btn btn-outline-secondary w-100 mb-3"
          type="button"
          :disabled="loading"
          @click="fetchCurrentLocationWeather"
        >
          Use current location
        </button>

        <p v-if="locationMessage" class="alert alert-info">{{ locationMessage }}</p>
        <p v-if="error" class="alert alert-danger">{{ error }}</p>
        <p v-if="loading" class="text-center text-muted" aria-live="polite">
          Loading weather data...
        </p>

        <article v-if="weatherData" class="border rounded p-4 text-center shadow-sm">
          <h2 class="h4">{{ locationLabel }}</h2>
          <div class="d-flex align-items-center justify-content-center gap-3 my-3">
            <img v-if="iconUrl" :src="iconUrl" alt="Weather icon" width="100" height="100" />
            <p class="display-5 mb-0">{{ temperature }} &deg;C</p>
          </div>
          <p class="mb-0 text-capitalize">{{ weatherDescription }}</p>
        </article>
      </section>
    </div>
  </main>
</template>
