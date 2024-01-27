import { useCoords2Glyphs } from '@/composables/coordGlyphConvert';
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
    glyphValues: (state) => useCoords2Glyphs(state.glyphs),
  },
});
