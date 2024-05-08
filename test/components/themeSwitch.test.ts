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

  it('should swap theme if clicked', async () => {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const button = wrapper.find('button');
    await button.trigger('click');

    expect(document.documentElement.dataset.theme).toBe(newTheme);
  });
});
