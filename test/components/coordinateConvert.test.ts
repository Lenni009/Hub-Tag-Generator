import { coords2Glyphs, glyphs2Coords } from '@/logic/coordGlyphConvert';
import { describe, expect, it } from 'vitest';

describe('Coordinate Converter', () => {
  it('should convert glyphs to coords correctly', () => {
    expect(glyphs2Coords('405EA21107FF')).toBe('0FFE:0021:090F:005E');
  });

  it('should return the input glyphs on error', () => {
    expect(glyphs2Coords('405EA21107F')).toBe('405EA21107F');
  });

  it('should convert coords to glyphs correctly', () => {
    expect(coords2Glyphs('0FFE:0021:090F:005E')).toBe('005EA21107FF');
  });

  it('should return the input coords on error', () => {
    expect(coords2Glyphs('0FFE:0021:090F:005')).toBe('0FFE:0021:090F:005');
  });
});
