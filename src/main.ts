import '@picocss/pico';
import './styles.css';
// the order of the CSS imports is IMPORTANT, DO NOT change it!!!
import { regionGlyphs } from './regions';
import { checkGlyphs, getRegionNum, getSIV } from './glyphLogic';
import { globalElements } from './elementStore';
import { OutputObj } from './formActions';

export let galaxy: string;
const systemIndexLength = 3;

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
	const tag = `EV${regionNum}-${SIV}]`;
	return { status: 'System Name Prefix:', output: tag };
}

export function decodeTag(): OutputObj {
	const tagInputId = 'tagInput';
	const tagInputElement = globalElements.input![tagInputId] as HTMLInputElement;
	const input = tagInputElement.value.replaceAll(/[\[\]]/g, '').replaceAll('68+1', '69').trim();	// NoSonar the escape character is necessary
	if (!input) return { status: '', output: '' };
	const [regNr, sysIndex] = input.split('-');
	const regionNum = regNr.replace('EV', '');
	const regionIndex = parseInt(regionNum) - 1;
	const regionCode = regionGlyphs[regionIndex];

	if (!sysIndex || !regionCode || !regNr.startsWith('EV')) {
		let errorMessage = '';
		if (!sysIndex) {
			errorMessage = 'Invalid prefix format (missing "-")';
		} else if (!regionCode || !regNr.startsWith('EV')) {
			errorMessage = 'Invalid prefix format (no "EV" or wrong region ID)';
		}
		return { status: 'Error:', output: errorMessage };
	}

	const planetIndex = '0';
	const sysIndexStr = sysIndex.padStart(systemIndexLength, '0');
	const glyphStr = planetIndex + sysIndexStr + regionCode;

	return { status: 'Glyphs:', output: glyphStr };
}