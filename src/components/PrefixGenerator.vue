<script setup lang="ts">
import GlyphInput from './GlyphInput.vue';
import { maxGlyphLength } from '../variables/constants';
import { computed } from 'vue';

import { usePrefixDataStore } from '../stores/prefixData';
import { storeToRefs } from 'pinia';
import { getPrefix, getRegionNumber } from '@/logic/prefix';

const prefixDataStore = usePrefixDataStore();
const { glyphs, glyphValues, systemName } = storeToRefs(prefixDataStore);

const prefix = computed(() => {
  const barePrefix = getPrefix(glyphValues.value);
  return barePrefix ? `${barePrefix} ${systemName.value}` : '';
});

function resetTagGenerator() {
  glyphs.value = '';
  systemName.value = '';
}

const outputLabel = computed(() => (systemName.value ? 'System Name' : 'Prefix'));

const isNotEisvana = computed(() => !getRegionNumber(glyphValues.value) && glyphValues.value.length === maxGlyphLength);
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
    class="status-wrapper"
    v-show="isNotEisvana"
  >
    <p class="status error">Not in Eisvana!</p>
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

<style scoped>
.glyph-input {
  flex-grow: 1;
  margin-block-end: 1rem;
}
</style>
