import PrefixQuiz from '@/components/PrefixQuiz.vue';
import { vi, beforeEach, describe, expect, it } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';

describe('PrefixQuiz', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(PrefixQuiz);
  });

  it('should render correctly', () => {
    vi.mock('@/logic/glyphs', () => ({
      getRandomGlyphs: vi.fn().mockReturnValue('0001A21117FF'),
    }));

    expect(wrapper.html()).toMatchSnapshot();
  });
});
