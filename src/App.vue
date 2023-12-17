<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import PrefixGenerator from './components/PrefixGenerator.vue';
import PrefixDecoder from './components/PrefixDecoder.vue';
</script>

<template>
  <header>
    <NavBar />
    <h1 class="title">Eisvana System Naming Tools</h1>
  </header>

  <main>
    <PrefixGenerator />
    <hr>
    <PrefixDecoder />
  </main>
</template>
