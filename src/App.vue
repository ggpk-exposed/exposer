<script setup>
import { FEATURES } from 'vuefinder/dist/features'

const features = [FEATURES.PREVIEW, FEATURES.SEARCH, FEATURES.FULL_SCREEN, FEATURES.DOWNLOAD, FEATURES.LANGUAGE]
const separator = encodeURIComponent('://').toLowerCase()

let [, adapter, path] = window.location.pathname.match(/^\/(\d+(?:\.\d+)+)\/(.*[^/])/) || [, ,]
if (path && adapter) {
  console.log(window.location.pathname, adapter, path)
  const upstream = adapter.startsWith('3') ? 'https://patch.poecdn.com/' : 'https://patch-poe2.poecdn.com/'
  adapter = upstream + adapter + '/'
}

const request = {
  baseUrl: import.meta.env.VITE_INDEX_URL,

  // Calling code looks like:
  // if (transformResult.params != null) {
  //     transformed.params = transformResult.params ?? {};
  // }
  transformRequest({ params }) {
    console.log(params, path, adapter)
    let version = params.adapter?.split('/').at(-2)
    if (!version?.match(/^\d+\./) && window.location.pathname.match(/^\/\d+\./)) {
      version = window.location.pathname.split('/')[1]
      const upstream = version.startsWith('3') ? 'https://patch.poecdn.com/' : 'https://patch-poe2.poecdn.com/'
      params.adapter = upstream + version + '/'
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
      let version = adapter?.split('/').at(-2)
      if (!version?.match(/^\d+\./) && window.location.pathname.match(/^\/\d+\./)) {
        version = window.location.pathname.split('/')[1]
      }
      const slash = path.startsWith('/') ? '' : '/'
      window.history.pushState(null, '', `/${version}${slash}${path}`)
    } catch (e) {
      console.warn(e)
    }
  }
}
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

.vuefinder__explorer__item-path {
  grid-column: span 5 / span 5;
}
</style>
