<script setup>
import { FEATURES } from 'vuefinder/dist/features'

const features = [FEATURES.PREVIEW, FEATURES.SEARCH, FEATURES.FULL_SCREEN, FEATURES.DOWNLOAD, FEATURES.LANGUAGE]
const separator = encodeURIComponent('://').toLowerCase()

const request = {
  baseUrl: import.meta.env.VITE_INDEX_URL,

  // Calling code looks like:
  // if (transformResult.params != null) {
  //     transformed.params = transformResult.params ?? {};
  // }
  transformRequest({ params }) {
    let version = params.adapter?.split('/').at(-2)
    if (!version?.match(/^\d+\./) && window.location.pathname.match(/^\/\d+\./)) {
      version = window.location.pathname.split('/')[1]
      const upstream = version.startsWith('3') ? 'https://patch.poecdn.com/' : 'https://patch-poe2.poecdn.com/'
      params.adapter = upstream + version + '/'
    }

    if (params.path?.includes('://')) {
      console.log('unencoded')
      params.path = params.path?.split('://').at(-1)
    }
    if (params.path?.includes(separator)) {
      console.log('encoded')
      params.path = params.path?.toLowerCase()?.split(separator).at(-1)
    }

    return { params }
  },
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
    <vue-finder id="my_vuefinder" :request="request" :features="features" />
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
