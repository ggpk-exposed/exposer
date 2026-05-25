<script setup>
import {VueFinder, RemoteDriver, useVueFinder} from "vuefinder";

const features = {
  preview: true,
  search: true,
  fullscreen: true,
  download: true,
  language: true,
}

const ADAPTERS = ["poe1", "poe2"]

const getInitialPath = () => {
  let [adapter, path] = window.location.pathname.split('://');

  if (!ADAPTERS.includes(adapter)) {
    adapter = ADAPTERS[0];
  }
  return `${adapter}://${path || ""}`;
}

const config = {
  initialPath: getInitialPath(),
  fullScreen: true,
  persist: true,
}

const driver = new RemoteDriver({
  baseURL: import.meta.env.VITE_INDEX_URL,
});

const onPathChange = (path) => {
  console.log('path change', path);
  if (!path) return;
  const slash = path.includes('/') ? '' : '/';
  const newUrl = `/${path}${slash}`;
  if (window.location.pathname !== newUrl) {
    window.history.pushState(null, '', newUrl);
  }
}

window.addEventListener('popstate', () => {
  try {
    const {open} = useVueFinder('my_vuefinder');
    const path = getInitialPath();
    if (path) {
      open(path);
    }
  } catch (e) {
    console.warn(e);
  }
});
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
    <vue-finder id="my_vuefinder" :driver="driver" :config="config" :features="features" @path-change="onPathChange"/>
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
