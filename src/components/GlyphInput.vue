<script setup lang="ts">
import { computed } from 'vue';
import { usePrefixDataStore } from '../stores/prefixData';
import { storeToRefs } from 'pinia';
import { maxCoordLength, maxGlyphLength, validInputRegex } from '../variables/constants';

const prefixDataStore = usePrefixDataStore();
const { glyphs, glyphValues } = storeToRefs(prefixDataStore);

defineProps<{
  error: boolean;
}>();

function addGlyph(e: Event) {
  if (!(e.target instanceof HTMLButtonElement)) return;
  glyphs.value ??= '';
  if (glyphs.value?.length < maxGlyphLength) {
    glyphs.value += e.target.value; // NoSonar 12 is maximum glyph length
  }
}

function deleteGlyph() {
  glyphs.value = glyphs.value.slice(0, -1);
}

function lintGlyphs() {
  glyphs.value = glyphs.value
    .toUpperCase()
    .split('')
    .filter((char) => validInputRegex.test(char))
    .join('');
}

const numberToGlyph = (n: number) => n.toString(16).toUpperCase(); // NoSonar this is dec to hex

const isCoords = computed(() => glyphValues.value.includes(':'));

// uses 19 if input is empty
const maxLength = computed(() => (isCoords.value || !glyphValues.value ? maxCoordLength : maxGlyphLength));
</script>

<template>
  <div>
    <label
      class="required"
      for="portalglyphsInput"
      >Glyphs or Coordinates:</label
    >
    <div class="glyph-input-wrapper">
      <input
        :aria-invalid="error || undefined"
        :maxlength="maxLength"
        class="glyphs-input"
        id="portalglyphsInput"
        type="text"
        v-model="glyphs"
        @input="lintGlyphs"
      />
      <button
        class="delete-button is-error"
        id="delButton"
        type="button"
        @click="deleteGlyph"
      >
        &larr; Delete
      </button>
    </div>
    <div class="portal-buttons grid">
      <button
        v-for="n in 16"
        class="button glyphs"
        type="button"
        :id="'glyphButton' + n"
        :value="numberToGlyph(n - 1)"
        @click="addGlyph"
      >
        {{ numberToGlyph(n - 1) }}
      </button>
    </div>
    <p
      v-show="glyphValues && !glyphValues.includes(':')"
      class="glyph-display-wrapper"
    >
      <output
        class="glyphs"
        id="glyphDisplay"
        >{{ glyphValues }}</output
      >
    </p>
  </div>
</template>

<style scoped lang="scss">
.glyphs {
  font-family: NMS-Glyphs-Mono;
  font-size: 3rem;
  word-break: break-word;
}

.glyph-display-wrapper {
  margin-bottom: 0 !important;
}

.portal-buttons {
  display: grid;
  grid-template-columns: repeat(8, auto);
  max-width: 800px;

  .button {
    line-height: 3rem;
    padding: 0;
    margin: 0;
  }
}

@media only screen and (max-width: 767px) {
  .portal-buttons {
    display: flex;
    flex-wrap: wrap;

    .button {
      width: 4rem;
    }
  }
}

.glyph-input-wrapper {
  display: flex;
  flex-wrap: wrap;
  max-width: 800px;

  .delete-button {
    margin-inline-start: 0.5rem;
    width: auto;
  }

  .glyphs-input {
    flex-grow: 1;
    width: auto;
  }
}

.is-error {
  background-color: indianred;
  border: 1px solid firebrick;
}
</style>
