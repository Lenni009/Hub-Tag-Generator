import PrefixGenerator from '@/components/PrefixGenerator.vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { usePrefixDataStore } from '@/stores/prefixData';
import { storeToRefs } from 'pinia';

describe('PrefixGenerator', () => {
  let wrapper: VueWrapper;
  const pinia = createTestingPinia();

  beforeEach(() => {
    wrapper = mount(PrefixGenerator, {
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
    const { glyphs, systemName } = storeToRefs(store);
    glyphs.value = '0001A21117FF';
    systemName.value = 'Hello World';
    const button = wrapper.find('button.reset-button');
    await button.trigger('click');

    expect(glyphs.value + systemName.value).toBe('');
  });

  it('should have the correct label', async () => {
    const output = wrapper.find('.output-label');

    expect(output.element.textContent).toBe('Prefix:');
  });

  it('should have the correct label', async () => {
    const systemInput = wrapper.find('#systemName');
    const glyphInput = wrapper.find('#portalglyphsInput');
    const output = wrapper.find('.prefix-output');
    await systemInput.setValue('Hello World');
    await glyphInput.setValue('0001A21117FF');

    expect(output.element.textContent).toBe('EV1-1 Hello World');
  });
});
