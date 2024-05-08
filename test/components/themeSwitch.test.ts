import ThemeSwitch from '@/components/ThemeSwitch.vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';

describe('ThemeSwitch', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(ThemeSwitch);
  });

  it('should render correctly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
