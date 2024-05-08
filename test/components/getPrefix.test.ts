import { getPrefix } from '@/logic/prefix';
import { describe, expect, it } from 'vitest';

describe('prefixCalculator', () => {
  it('should calculate the correct prefix', () => {
    expect(getPrefix('6227A21117FF')).toBe('EV1-227');
  });

  it('should calculate the correct prefix', () => {
    expect(getPrefix('61A9A11117FF')).toBe('EV2-1A9');
  });

  it('should calculate the correct prefix', () => {
    expect(getPrefix('2203A11127FF')).toBe('EV3-203');
  });

  it('should calculate the correct prefix', () => {
    expect(getPrefix('2084A21127FF')).toBe('EV4-84');
  });

  it('should calculate the correct prefix', () => {
    expect(getPrefix('500BA21107FF')).toBe('EV5-B');
  });

  it('should calculate the correct prefix', () => {
    expect(getPrefix('2100A21107FE')).toBe('EV6-100');
  });

  it('should calculate the correct prefix', () => {
    expect(getPrefix('00DBA21117FE')).toBe('EV7-DB');
  });

  it('should return an empty string on error', () => {
    expect(getPrefix('00DBA21117FD')).toBe('');
  });
});
