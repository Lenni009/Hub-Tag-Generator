import PrefixGenerator from '@/components/PrefixGenerator.vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

describe('App', () => {
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
});
