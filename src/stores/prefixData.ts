import { useCoordConversion } from '@/composables/useCoordConversion';
import { defineStore } from 'pinia';

interface State {
  glyphs: string;
  systemName: string;
  prefix: string;
}

export const usePrefixDataStore = defineStore('prefixData', {
  state: (): State => ({
    glyphs: '',
    systemName: '',
    prefix: '',
  }),

  getters: {
    glyphValues: (state) => useCoordConversion(state.glyphs),
  },
});
