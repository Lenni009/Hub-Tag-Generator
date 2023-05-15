import '@picocss/pico';
import './styles.css';
// the order of the CSS imports is IMPORTANT, DO NOT change it!!!
import { getRegions } from './getRegions';
import { checkGlyphs, getRegionNum, getSIV } from './glyphLogic';
import { globalElements } from './elementStore';
import { OutputObj } from './formActions';

export let galaxy: string;

// hides the main element if no galaxy is given
hideMain();

// changes the "other pages" link if on subdomain
const GHubHosts = ['hubtag.nmsgalactichub.com', 'hub-tag.nmsgalactichub.com', 'hub-tag-generator.nmsgalactichub.com'];
if (GHubHosts.includes(window.location.host)) (document.querySelector('a[href=".."]') as HTMLAnchorElement).href = 'https://lenni009.github.io/';	// 'https://nmsgalactichub.com';

// hides the main element if no galaxy is given
export function hideMain() {
	const dropdownId = 'galaxyInput';
	const tocId = 'toc';
	const dropdownElement = globalElements.input![dropdownId] as HTMLSelectElement;
	const tocElement = globalElements.output![tocId] as HTMLUListElement;
	const mainElement = document.querySelector('main') as HTMLElement;
	galaxy = dropdownElement.value;
	([mainElement, tocElement]).forEach(element => element.style.display = galaxy ? '' : 'none');
}

// gets section of clicked element
export function getSectionId(element: HTMLElement) {
	return element.closest('section')!.id;
}

export function generateTag(): OutputObj {
	const glyphInputId = 'portalglyphsInput';
	const glyphInputElement = globalElements.input![glyphInputId] as HTMLInputElement;
	const glyphs = glyphInputElement.value;
	const { isValid, error = '' } = checkGlyphs(glyphInputElement, true);

	if (!glyphs) return { status: '', output: '' };

	if (!isValid) return { status: 'Error:', output: error };

	const regionNum = getRegionNum(glyphs);
	const SIV = getSIV(glyphs);
	const tag = `[HUB${regionNum}-${SIV}]`;
	return { status: 'Your Hub Tag:', output: tag };
}

export function decodeTag(): OutputObj {
	const tagInputId = 'tagInput';
	const tagInputElement = globalElements.input![tagInputId] as HTMLInputElement;
	const input = tagInputElement.value.replaceAll(/[\[\]]/g, '').replaceAll('68+1', '69').trim();	// NoSonar the escape character is necessary
	if (!input) return { status: '', output: '' };
	const regions = Array.from(getRegions(galaxy));
	const [hub, sysIndex] = input.split('-');
	const regionNum = hub.replace('HUB', '');
	const regionIndex = parseInt(regionNum) - 1;
	const regionCode = regions[regionIndex];

	if (!sysIndex || !regionCode || !hub.startsWith('HUB')) {
		let errorMessage = '';
		if (!sysIndex) {
			errorMessage = 'Invalid Hub tag format (missing "-")';
		} else if (!regionCode || !hub.startsWith('HUB')) {
			errorMessage = 'Invalid Hub tag format (no "HUB" or wrong region ID)';
		}
		return { status: 'Error:', output: errorMessage };
	}

	const planetIndex = '0';
	const sysIndexStr = sysIndex.padStart(3, '0');
	const glyphStr = planetIndex + sysIndexStr + regionCode;

	return { status: 'Glyphs:', output: glyphStr };
}