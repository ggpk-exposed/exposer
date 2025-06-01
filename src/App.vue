<script setup>
import { FEATURES } from 'vuefinder/dist/features'

const features = [FEATURES.PREVIEW, FEATURES.SEARCH, FEATURES.FULL_SCREEN, FEATURES.DOWNLOAD, FEATURES.LANGUAGE]
const separator = encodeURIComponent('://').toLowerCase()

const ADAPTERS = ["poe1", "poe2"]
let [, adapter, path] = window.location.pathname.match(/^\/(poe1|poe2)\/(.*[^/])/) || [,,]
if (!adapter) {
  adapter = ADAPTERS[0]
}

const request = {
  baseUrl: import.meta.env.VITE_INDEX_URL,

  // Calling code looks like:
  // if (transformResult.params != null) {
  //     transformed.params = transformResult.params ?? {};
  // }
  transformRequest({ params }) {
    let version = params.adapter
    if (!ADAPTERS.includes(version)) {
      version = window.location.pathname.split('/')[1]
      if (!ADAPTERS.includes(version)) {
        version = ADAPTERS[0]
      }
      params.adapter = version
    }

    if (path && adapter) {
      params.path = path
      params.adapter = adapter
      path = ''
      adapter = ''
    }
    if (params.path?.includes('://')) {
      params.path = params.path?.split('://').at(-1)
    }
    if (params.path?.includes(separator)) {
      params.path = params.path?.toLowerCase()?.split(separator).at(-1)
    }

    return { params }
  },
}

// localStorage events don't fire for the tab that created them
// https://stackoverflow.com/a/75101492/2063518
const setItem = localStorage.setItem.bind(localStorage)
localStorage.setItem = (key, value) => {
  setItem(key, value)
  if (key === 'my_vuefinder_storage') {
    try {
      let { path, adapter } = JSON.parse(value)
      const slash = path.startsWith('/') ? '' : '/'
      window.history.pushState(null, '', `/${adapter}${slash}${path}`)
    } catch (e) {
      console.warn(e)
    }
  }
}

window.addEventListener('popstate', () => window.location.reload())
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="app-title">
        <h1 class="green">GGPK Browser</h1>
        <h3>not affiliated.</h3>
      </div>
    </div>
  </header>

  <main>
    <vue-finder id="my_vuefinder" :request="request" :features="features" :full-screen="true" persist />
  </main>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.app-title h1,
.app-title h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .app-title h1,
  .app-title h3 {
    text-align: left;
  }
}
</style>
