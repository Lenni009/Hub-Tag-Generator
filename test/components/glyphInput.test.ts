import { VueWrapper, mount } from '@vue/test-utils';
import { usePrefixDataStore } from '@/stores/prefixData';
import GlyphInput from '@/components/GlyphInput.vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { storeToRefs } from 'pinia';

describe('GlyphInput', () => {
  let wrapper: VueWrapper;
  const pinia = createTestingPinia();

  beforeEach(() => {
    wrapper = mount(GlyphInput, {
      global: {
        plugins: [pinia],
      },
      props: {
        error: false,
      },
    });
  });

  it('should render correctly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('updates glyphs.value when a button is clicked', async () => {
    const store = usePrefixDataStore(pinia);
    const { glyphs } = storeToRefs(store);
    const button = wrapper.find('button.button.glyphs');
    await button.trigger('click');

    expect(glyphs.value).toBe('0'); // replace 'expected-value' with the expected value after clicking the button
  });
});
