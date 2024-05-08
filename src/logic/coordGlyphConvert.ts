import { PortalCode, GalacticCoordinate } from '@nmscd/coordinate-conversion';

// coords to glyphs
export const coords2Glyphs = (coords: string): string =>
  GalacticCoordinate({ code: coords }).toGlyph().value?.code ?? coords;

// glyphs to coords
export const glyphs2Coords = (glyphs: string) =>
  PortalCode({ code: glyphs }).toGalacticCoordinates().value?.code ?? glyphs;
