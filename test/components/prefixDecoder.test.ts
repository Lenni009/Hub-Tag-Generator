import PrefixDecoder from '@/components/PrefixDecoder.vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { usePrefixDataStore } from '@/stores/prefixData';
import { storeToRefs } from 'pinia';

describe('PrefixDecoder', () => {
  let wrapper: VueWrapper;
  const pinia = createTestingPinia();

  beforeEach(() => {
    wrapper = mount(PrefixDecoder, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('should render correctly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should reset data on button click', async () => {
    const store = usePrefixDataStore(pinia);
    const { prefix } = storeToRefs(store);
    prefix.value = 'EV6-69';
    const button = wrapper.find('button.reset-button');
    await button.trigger('click');

    expect(prefix.value).toBe('');
  });

  it('should render correctly when bad regions are entered', async () => {
    const store = usePrefixDataStore(pinia);
    const { prefix } = storeToRefs(store);
    prefix.value = 'EV8-69';

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render correctly when bad regions are entered', async () => {
    const store = usePrefixDataStore(pinia);
    const { prefix } = storeToRefs(store);
    prefix.value = 'EV5-AB69';

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render correctly when bad regions are entered', async () => {
    const store = usePrefixDataStore(pinia);
    const { prefix } = storeToRefs(store);
    prefix.value = 'EV0-69';

    expect(wrapper.html()).toMatchSnapshot();
  });
});
