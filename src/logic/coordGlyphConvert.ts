import { maxCoordLength, maxGlyphLength } from '@/variables/constants';

// coords to glyphs
export function coords2Glyphs(coords: string): string {
  if (coords.length !== maxCoordLength) return coords;

  const X_Z_POS_SHIFT = 2049;
  const X_Z_NEG_SHIFT = 2047;
  const Y_POS_SHIFT = 129;
  const Y_NEG_SHIFT = 127;

  const x_coords = parseInt(coords.substring(0, 4), 16); // NoSonar X coordinate part
  const y_coords = parseInt(coords.substring(5, 9), 16); // NoSonar Y coordinate part
  const z_coords = parseInt(coords.substring(10, 14), 16); // NoSonar Z coordinate part
  const system_idx = parseInt(coords.substring(15, 19), 16); // NoSonar system index part

  let portal_x = 0;
  let portal_y = 0;
  let portal_z = 0;
  if (x_coords < X_Z_NEG_SHIFT) {
    portal_x = x_coords + X_Z_POS_SHIFT;
  } else {
    portal_x = x_coords - X_Z_NEG_SHIFT;
  }
  if (z_coords < X_Z_NEG_SHIFT) {
    portal_z = z_coords + X_Z_POS_SHIFT;
  } else {
    portal_z = z_coords - X_Z_NEG_SHIFT;
  }
  if (y_coords < Y_NEG_SHIFT) {
    portal_y = y_coords + Y_POS_SHIFT;
  } else {
    portal_y = y_coords - Y_NEG_SHIFT;
  }

  const glyphs = [
    '0',
    system_idx.toString(16).toUpperCase().padStart(3, '0'),
    portal_y.toString(16).toUpperCase().padStart(2, '0'),
    portal_z.toString(16).toUpperCase().padStart(3, '0'),
    portal_x.toString(16).toUpperCase().padStart(3, '0'),
  ];
  const glyphString = glyphs.join('');

  return glyphString.length === maxGlyphLength ? glyphString : '';
}

// glyphs to coords
export function glyphs2Coords(glyphs: string) {
  if (glyphs.length !== maxGlyphLength) return '';

  const X_Z_POS_SHIFT = 2049;
  const X_Z_NEG_SHIFT = 2047;
  const Y_POS_SHIFT = 129;
  const Y_NEG_SHIFT = 127;

  const x_glyphs = parseInt(glyphs.substring(9, 12), 16); // NoSonar X coordinate part
  const y_glyphs = parseInt(glyphs.substring(4, 6), 16); // NoSonar Y coordinate part
  const z_glyphs = parseInt(glyphs.substring(6, 9), 16); // NoSonar Z coordinate part
  const system_idx = glyphs.substring(1, 4); // NoSonar system index part

  let coords_x = 0;
  let coords_y = 0;
  let coords_z = 0;

  if (x_glyphs >= X_Z_POS_SHIFT) {
    coords_x = x_glyphs - X_Z_POS_SHIFT;
  } else {
    coords_x = x_glyphs + X_Z_NEG_SHIFT;
  }

  if (z_glyphs >= X_Z_POS_SHIFT) {
    coords_z = z_glyphs - X_Z_POS_SHIFT;
  } else {
    coords_z = z_glyphs + X_Z_NEG_SHIFT;
  }

  if (y_glyphs >= Y_POS_SHIFT) {
    coords_y = y_glyphs - Y_POS_SHIFT;
  } else {
    coords_y = y_glyphs + Y_NEG_SHIFT;
  }

  const coordData = [coords_x, coords_y, coords_z];
  const coordinates = coordData.map((coord) => coord.toString(16).toUpperCase().padStart(4, '0'));

  coordinates[3] = system_idx.padStart(4, '0'); // NoSonar the 4 is to bump it to a length of 4

  return coordinates.join(':');
}
