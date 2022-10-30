<template>
  <router-view v-slot="{ Component, route }">
    <!-- <transition name="fade"> -->
    <component :is="Component" :key="route.fullPath" />
    <!-- </transition> -->
  </router-view>
</template>

<style>
html,
body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  text-align: center;
}
.hidden {
  display: none;
}
</style>
