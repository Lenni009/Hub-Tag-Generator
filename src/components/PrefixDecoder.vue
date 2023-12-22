<script setup lang="ts">
import { eisvanaRegionAmount, systemIndexLength } from '../variables/constants';
import { regionGlyphs } from '../variables/regions';
import { computed, watchEffect } from 'vue';

import { usePrefixDataStore } from '../stores/prefixData';
import { storeToRefs } from 'pinia';

const prefixDataStore = usePrefixDataStore();
const { prefix } = storeToRefs(prefixDataStore);

const prefixParts = computed(() => prefix.value.toLowerCase().replace('ev', '').split('-'));

const regionNumber = computed(() => parseInt(prefixParts.value[0]));
const systemIndex = computed(() => {
  const actualNumber = prefixParts.value[1]?.replace('68+1', '69');
  return parseInt(actualNumber, 16);
});

const isNotEisvana = computed(
  () =>
    prefix.value &&
    prefixParts.value.length === 2 &&
    (isNaN(regionNumber.value) ||
      regionNumber.value < 1 ||
      regionNumber.value > eisvanaRegionAmount ||
      systemIndex.value.toString(16).length > systemIndexLength)
);

const glyphs = computed(() => {
  const glyphComponents = {
    planet: 0,
    system: systemIndex.value.toString(16).padStart(systemIndexLength, '0'),
    region: regionGlyphs[regionNumber.value - 1],
  };

  return Object.values(glyphComponents).join('').toUpperCase();
});

function resetTagDecoder() {
  prefix.value = '';
}

watchEffect(() => (prefix.value = prefix.value.toUpperCase()));
</script>

<template>
  <h2>Prefix Decoder</h2>
  <div>
    <label for="prefix">Prefix:</label>
    <input
      :aria-invalid="isNotEisvana || undefined"
      class="prefix-input"
      id="prefix"
      type="text"
      maxlength="9"
      v-model="prefix"
    />
  </div>
  <div
    class="error-wrapper"
    v-show="isNotEisvana"
  >
    <p class="error">Invalid Prefix!</p>
  </div>
  <div
    v-show="!isNaN(regionNumber) && !isNaN(systemIndex) && !isNotEisvana"
    class="output-wrapper"
  >
    <p class="output-label">Glyphs:</p>
    <output class="glyphs">{{ glyphs }}</output>
  </div>
  <button
    v-show="prefix"
    class="reset-button secondary"
    type="reset"
    @click="resetTagDecoder"
  >
    Reset
  </button>
</template>

<style scoped lang="scss">
.prefix-input {
  width: auto;
}
</style>
