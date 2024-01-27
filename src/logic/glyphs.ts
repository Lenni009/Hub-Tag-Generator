import { getRandomNumber } from './randomGenerator';
import { regionGlyphs } from '@/variables/regions';

export function getRandomGlyphs() {
  const randomRegionGlyphs = getRandomRegion();
  const SIV = getRandomSIV();
  const planetId = getRandomPlanet();
  const glyphs = planetId + SIV + randomRegionGlyphs;
  return glyphs;
}

function getRandomRegion(): string {
  const amountOfRegions = regionGlyphs.length;
  const randomIndex = getRandomNumber(0, amountOfRegions);
  const chosenRegion = regionGlyphs[randomIndex];
  return chosenRegion;
}

function getRandomSIV(): string {
  const decId = getRandomNumber(1, 768); // 768 is 300 in Hex, which is not possible as a system ID
  const hexId = decId.toString(16).toUpperCase();
  const SIV = hexId.padStart(3, '0');
  return SIV;
}

function getRandomPlanet(): string {
  const planetId = getRandomNumber(1, 7); // since the second arg is *excluding*, we need to be one higher than the maximum to include 6
  return planetId.toString();
}
