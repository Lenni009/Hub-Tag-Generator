<script setup lang="ts">
import type { QuizSystem } from '@/types/types';
import { getRandomGlyphs } from '@/logic/glyphs';
import { glyphs2Coords } from '@/logic/coordGlyphConvert';
import { getPrefix } from '@/logic/prefix';
import { computed, ref } from 'vue';

const quizSystem = ref<QuizSystem>(generateQuizSystem());

function generateQuizSystem(): QuizSystem {
  const glyphs = getRandomGlyphs();
  return {
    glyphs,
    inputName: '',
    coordinates: glyphs2Coords(glyphs),
    expectedPrefix: getPrefix(glyphs),
    clickedSubmit: false,
    solved: false,
  };
}

const newQuizSystem = () => (quizSystem.value = generateQuizSystem());

const profanityFilter = computed(() => quizSystem.value.inputName.includes('69'));

const isPrefixCorrect = computed(() => quizSystem.value.inputName.startsWith(quizSystem.value.expectedPrefix));

function submitSystemName() {
  if (quizSystem.value.solved) {
    newQuizSystem();
    return;
  }
  quizSystem.value.clickedSubmit = true;
  quizSystem.value.solved =
    isPrefixCorrect.value && quizSystem.value.inputName.length >= quizSystem.value.expectedPrefix.length + 2;

  // delay in milliseconds
  const delay = 3000;
  setTimeout(() => {
    quizSystem.value.clickedSubmit = false;
  }, delay);
}

const output = computed(() => {
  if (profanityFilter.value) return 'Rejected By Profanity Filter';
  if (!quizSystem.value.solved) {
    return isPrefixCorrect.value ? 'Enter Prefix + Name!' : 'Incorrect!';
  }
  quizSystem.value.solved = true;
  return 'Correct!';
});
</script>

<template>
  <h2>Naming Quiz</h2>
  <p class="cta">Provide an appropriate system name for this address:</p>
  <div class="address">
    <p>
      <span class="has-text-weight-bold">Coordinates:</span>
      <span class="text-size-bigger">{{ quizSystem.coordinates }}</span>
    </p>
    <p>
      <span class="has-text-weight-bold">Glyphs:</span>
      <span class="glyphs">{{ quizSystem.glyphs }}</span>
    </p>
  </div>
  <form @submit.prevent>
    <div class="system-name-input">
      <label for="quizSystemName">Full System Name:</label>
      <input
        v-model="quizSystem.inputName"
        id="quizSystemName"
        placeholder="EVx-xx Hello World"
        type="text"
      />
    </div>
    <div class="actions">
      <input
        role="button"
        type="submit"
        :value="quizSystem.solved ? 'Next' : 'Submit'"
        @click="submitSystemName"
      />
      <input
        v-show="!quizSystem.solved"
        class="secondary"
        type="button"
        role="button"
        value="Skip"
        @click="newQuizSystem"
      />
    </div>
  </form>
  <Transition>
    <p
      v-if="quizSystem.clickedSubmit"
      class="status-wrapper"
    >
      <output
        :class="{ success: quizSystem.solved, error: !quizSystem.solved }"
        class="status"
      >
        {{ output }}
      </output>
    </p>
  </Transition>
</template>

<style scoped lang="scss">
.cta {
  margin-block-end: 1rem;
}

.address {
  user-select: none;
  margin-block-end: 1rem;

  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-block-end: 0;
  }

  .glyphs {
    word-break: unset;
    font-size: 2rem;
    line-height: normal;
  }
}
.has-text-weight-bold {
  font-weight: bold;
}

.text-size-bigger {
  font-size: 1.5rem;
}

form {
  .system-name-input {
    width: min-content;
  }

  margin-block-end: 0;
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  input {
    width: auto;
  }
}

.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-leave-to {
  opacity: 0;
}
</style>
