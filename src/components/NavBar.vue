<script setup lang="ts">
import ThemeSwitch from './ThemeSwitch.vue';

const isEisvanaHost = window.location.host === 'naming.eisvana.com';
</script>

<template>
  <nav>
    <ul>
      <li>
        <a :href="isEisvanaHost ? 'https://eisvana.com' : '..'">&larr; View other pages</a>
      </li>
    </ul>
    <ul>
      <li>
        <ThemeSwitch />
      </li>
    </ul>
  </nav>
</template>
