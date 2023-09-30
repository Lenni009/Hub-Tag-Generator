import { coords2Glyphs } from './coordConversion';
import { assignFunction, ElementFunctions } from './elementFunctions';
import { globalElements } from './elementStore';
import { regionGlyphs } from './regions';

const validPortalKeys = '0123456789ABCDEF';
const maxIndex = 767;
const regionGlyphStart = 4;
const expectedGlyphLength = 12;

// adds the portal buttons
const wrapper = document.querySelector('.portal-buttons') as HTMLElement;
const codeStore: string[] = [];
const functionArray: ElementFunctions[] = [];
for (let i = 0; i < validPortalKeys.length; i++) {
	const funcObj = {
		element: 'glyphButton' + i.toString(),
		handler: 'click',
		func: function () { glyphOnClick(this as unknown as HTMLButtonElement) }
	}
	const character = validPortalKeys[i];
	const button = `<button class="button glyphs" type="button" id="glyphButton${i}" value="${character}">${character}</button>`;
	codeStore.push(button);
	functionArray.push(funcObj);
}
wrapper.innerHTML = codeStore.join('');

for (const obj of functionArray) {
	assignFunction(obj);
}

export function glyphInputOnChange(input: HTMLInputElement) {
	const intermediateValue = input?.value?.toUpperCase();
	if (intermediateValue == null) return;

	const newValue = intermediateValue
		.split('')
		.filter(char => (validPortalKeys + ':').includes(char))
		.join('')
		.substring(0);
	input.value = newValue;
	checkGlyphs(input);
}

function showGlyphs(glyphs: string | undefined = undefined) {
	const glyphInputId = 'portalglyphsInput';
	const glyphOutputId = 'glyphDisplay';
	const glyphInput = globalElements.input?.[glyphInputId];
	const glyphOutput = globalElements.output?.[glyphOutputId];
	if (!(glyphInput instanceof HTMLInputElement && glyphOutput instanceof HTMLOutputElement)) return;
	glyphOutput.innerText = glyphs ?? glyphInput.value;
}

// makes glyph buttons clickable and adds their value to input field
function glyphOnClick(button: HTMLButtonElement) {
	const inputId = 'portalglyphsInput';
	const input = globalElements.input![inputId] as HTMLInputElement;
	const portalCode = input.value;

	if (portalCode.length < expectedGlyphLength) {
		input.value += button.value;
	}

	showGlyphs();
	checkGlyphs(input);
}

// deletes last character of a string
export function deleteCharacter(inputId: string) {
	const input = document.getElementById(inputId) as HTMLInputElement;
	const editedText = input.value.slice(0, -1);

	input.value = editedText;
	showGlyphs();
	checkGlyphs(input);
}

export function checkGlyphs(inputElement: HTMLInputElement, enableLengthCheck: boolean = false): {
	isValid: boolean;
	error?: string;
} {
	const glyphs = coords2Glyphs(inputElement.value);
	showGlyphs(glyphs);
	const regionGlyphSubstring = glyphs.substring(regionGlyphStart);
	const systemIndex = glyphs.substring(1, regionGlyphStart);
	// this removes leading zeros
	const decSIV = parseInt(systemIndex, 16);

	const correctLength = glyphs.length === expectedGlyphLength;
	const regionInEV = regionGlyphs.includes(regionGlyphSubstring);
	const reachable = (decSIV && decSIV < (maxIndex + 1)) as boolean;
	const isValid = (() => {
		if (enableLengthCheck || glyphs.length == expectedGlyphLength) {
			return correctLength && regionInEV && reachable;
		}

		if (glyphs.length != expectedGlyphLength) {
			return true;
		}

		return false;
	})();

	inputElement.classList[isValid ? 'remove' : 'add']('error');

	if (!isValid) {
		if (!correctLength) return { isValid: false, error: 'Invalid glyph sequence: Incorrect length' };

		if (!regionInEV) return { isValid: false, error: 'Invalid glyph sequence: No Eisvana region' };

		if (!reachable) return { isValid: false, error: 'Invalid glyph sequence: Not reachable via portal' };
	}

	return { isValid: true };
}

// returns region nr
export function getRegionNum(glyphs: string): number {
	const regionGlyphSubstring = coords2Glyphs(glyphs).substring(regionGlyphStart);
	const index = regionGlyphs.indexOf(regionGlyphSubstring);
	return index > -1 ? index + 1 : 0;
}

// returns System Index Value
export function getSIV(glyphs: string): string {
	const systemIndex = coords2Glyphs(glyphs).substring(1, regionGlyphStart);
	// this removes leading zeros
	const decSIV = parseInt(systemIndex, 16);
	// return false if system is not reachable via portal (max system index is 2FF, which is 767 in dec)
	if (!decSIV || decSIV > maxIndex) return '';
	const hexSIV = decSIV.toString(16).toUpperCase();	// NoSonar this is dec to hex
	return hexSIV.replace('69', '68+1');	// replace 69 with 68+1, because the profanity filter flags it
}