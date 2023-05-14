import { assignFunction, ElementFunctions } from './elementFunctions';
import { globalElements } from './elementStore';
import { getRegions } from './getRegions';
import { galaxy } from './main';

const validPortalKeys = '0123456789ABCDEF';

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
	const intermediateValue = input?.value?.toUpperCase?.();
	if (intermediateValue == null) return;

	const newValue = intermediateValue
		.split('')
		.filter(char => validPortalKeys.includes(char))
		.join('')
		.substring(0, 12);
	input.value = newValue;
	showGlyphs();
	checkGlyphs(input);
}

function showGlyphs() {
	const glyphInputId = 'portalglyphsInput';
	const glyphOutputId = 'glyphDisplay';
	const glyphInput = globalElements.input![glyphInputId] as HTMLInputElement;
	const glyphOutput = globalElements.output![glyphOutputId] as HTMLOutputElement;
	glyphOutput.innerText = glyphInput.value;
}

// makes glyph buttons clickable and adds their value to input field
function glyphOnClick(button: HTMLButtonElement) {
	const inputId = 'portalglyphsInput';
	const input = globalElements.input![inputId] as HTMLInputElement;
	const portalCode = input.value;

	if (portalCode.length < 12) {
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
	const glyphs = inputElement.value;
	const regionGlyphs = glyphs.substring(4);
	const systemIndex = glyphs.substring(1, 4);
	// this removes leading zeros
	const decSIV = Number('0x' + systemIndex);
	const regions = getRegions(galaxy);

	const correctLength = glyphs.length == 12;
	const regionInHub = regions.has(regionGlyphs);
	const reachable = (decSIV && decSIV < 768) as boolean;

	const isValid = (() => {
		if (enableLengthCheck || glyphs.length == 12) {
			return correctLength && regionInHub && reachable;
		}

		if (glyphs.length != 12) {
			return true;
		}

		return false;
	})();

	inputElement.classList[isValid ? 'remove' : 'add']('error');

	if (!isValid) {
		if (!correctLength) {
			return { isValid: false, error: 'Invalid glyph sequence: Incorrect length' };
		}

		if (!regionInHub) {
			return { isValid: false, error: 'Invalid glyph sequence: No Hub region' };
		}

		if (!reachable) {
			return { isValid: false, error: 'Invalid glyph sequence: Not reachable via portal' };
		}
	}

	return { isValid: true };
}

// returns Hub nr
export function getRegionNum(glyphs: string): number {
	const regionGlyphs = glyphs.substring(4);
	const regArray = Array.from(getRegions(galaxy))
	const index = regArray.indexOf(regionGlyphs);
	return index > -1 ? index + 1 : 0;
}

// returns System Index Value
export function getSIV(glyphs: string): string {
	const systemIndex = glyphs.substring(1, 4);
	// this removes leading zeros
	const decSIV = Number('0x' + systemIndex);
	// return false if system is not reachable via portal (max system index is 2FF, which is 767 in dec)
	if (!decSIV || decSIV > 767) return '';
	const hexSIV = decSIV.toString(16).toUpperCase();
	return hexSIV.replace('69', '68+1');	// replace 69 with 68+1, because the profanity filter flags it
}