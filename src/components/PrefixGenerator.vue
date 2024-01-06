<script setup lang="ts">
import GlyphInput from './GlyphInput.vue';
import { regionGlyphs } from '../variables/regions';
import { systemIndexLength, maxGlyphLength } from '../variables/constants';
import { computed } from 'vue';

import { usePrefixDataStore } from '../stores/prefixData';
import { storeToRefs } from 'pinia';

const prefixDataStore = usePrefixDataStore();
const { glyphs, glyphValues, systemName } = storeToRefs(prefixDataStore);

const regionNumber = computed(() => {
  const regionGlyphsSubstring = glyphValues.value.slice(4);
  const regionIndex = regionGlyphs.indexOf(regionGlyphsSubstring);
  return regionIndex + 1;
});

const prefix = computed(() => {
  const systemIndexString = glyphValues.value.slice(1, 4);
  const systemIndex = parseInt(systemIndexString, 16);
  if (!regionNumber.value || isNaN(systemIndex) || systemIndexString.length !== systemIndexLength) return '';
  const expectedIndex = systemIndex.toString(16).replace('69', '68+1').toUpperCase();
  return `EV${regionNumber.value}-${expectedIndex} ${systemName.value}`;
});

function resetTagGenerator() {
  glyphs.value = '';
  systemName.value = '';
}

const outputLabel = computed(() => (systemName.value ? 'System Name' : 'Prefix'));

const isNotEisvana = computed(() => !regionNumber.value && glyphValues.value.length === maxGlyphLength);
</script>

<template>
  <h2>Name Generator</h2>
  <p>A proper system name consists of two parts:</p>
  <div class="input-group">
    <div>
      <label for="systemName">System Name:</label>
      <input
        id="systemName"
        type="text"
        v-model="systemName"
      />
    </div>
    <GlyphInput
      class="glyph-input"
      :error="isNotEisvana"
    />
  </div>
  <div
    class="error-wrapper"
    v-show="isNotEisvana"
  >
    <p class="error">Not in Eisvana!</p>
  </div>
  <div
    v-show="prefix"
    class="output-wrapper"
  >
    <p class="output-label">{{ outputLabel }}:</p>
    <output class="prefix-output">{{ prefix.trim() }}</output>
  </div>
  <button
    v-show="glyphs || systemName"
    class="reset-button secondary"
    type="reset"
    @click="resetTagGenerator"
  >
    Reset
  </button>
</template>

<style scoped lang="scss">
.glyph-input {
  flex-grow: 1;
}
</style>
