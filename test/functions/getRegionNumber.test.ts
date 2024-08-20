import { getRegionNumber } from '@/logic/prefix';
import { describe, expect, it } from 'vitest';

describe('regionNumberCalculator', () => {
  it('should calculate the correct region number', () => {
    expect(getRegionNumber('6227A21117FF')).toBe(1);
  });

  it('should calculate the correct region number', () => {
    expect(getRegionNumber('61A9A11117FF')).toBe(2);
  });

  it('should calculate the correct region number', () => {
    expect(getRegionNumber('2203A11127FF')).toBe(3);
  });

  it('should calculate the correct region number', () => {
    expect(getRegionNumber('2084A21127FF')).toBe(4);
  });

  it('should calculate the correct region number', () => {
    expect(getRegionNumber('500BA21107FF')).toBe(5);
  });

  it('should calculate the correct region number', () => {
    expect(getRegionNumber('2100A21107FE')).toBe(6);
  });

  it('should calculate the correct region number', () => {
    expect(getRegionNumber('00DBA21117FE')).toBe(7);
  });

  it('should return 0 on error', () => {
    expect(getRegionNumber('00DBA21117FD')).toBe(0);
  });
});
