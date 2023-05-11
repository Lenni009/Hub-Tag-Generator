const validPortalKeys = '0123456789ABCDEF';
let galaxy;

(() => {
	// determine preferred theme and update the html element with the respective tag
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	switchTheme(prefersDark ? 'dark' : 'light');

	// hides the main element if no galaxy is given
	hideMain();

	// adds the portal buttons
	const wrapper = document.querySelector('.portal-buttons');
	if (!wrapper) return;
	const codeStore = new Array;
	for (const character of validPortalKeys) {
		const button = `<button class="button glyphs" type="button" value="${character}" onclick="glyphOnClick(this)">${character}</button>`
		codeStore.push(button);
	}
	wrapper.innerHTML = codeStore.join('');
})();

function getRegions(galaxy) {
	const regionGlyphs = [
		'F9556C30',
		'F9555C30',
		'F9555C31',
		'F9556C31',
		'F9557C31',
		'F9557C30',
		'F9557C2F',
		'F9556C2F',
		'F9555C2F',
		'FA556C30',
		'F8556C30',
	]

	const EisHubGlyphs = [
		'FA556C30',
		'FA555C30',
		'FA555C31',
		'FA556C31',
		'FA557C31',
		'FA557C30',
		'FA557C2F',
		'FA556C2F',
		'FA555C2F',
		'F8556C30',
		'F8555C30',
		'F8555C31',
		'F8556C31',
		'F8557C31',
		'F8557C30',
		'F8557C2F',
		'F8556C2F',
		'F8555C2F',
	]
	if (galaxy == 'Eissentam') regionGlyphs.splice(-2, 2, ...EisHubGlyphs);
	return new Set(regionGlyphs);
}

// hides the main element if no galaxy is given
function hideMain() {
	const dropdownId = 'galaxyInput';
	const tocId = 'toc';
	const dropdownElement = document.getElementById(dropdownId);
	const tocElement = document.getElementById(tocId);
	const mainElement = document.querySelector('main');
	galaxy = dropdownElement.value;
	mainElement.style.display = galaxy ? '' : 'none';
	tocElement.style.visibility = galaxy ? '' : 'hidden';
}

// gets section of clicked element
function getSectionId(element) {
	return element.closest('section').id;
}

// clears input values
function reset(element) {
	const section = getSectionId(element);
	const sectionElement = document.getElementById(section);
	const input = sectionElement.querySelector('input');
	const outputs = sectionElement.querySelectorAll(`output, .output>*`);
	for (const output of outputs) {
		output.innerHTML = '';
	}
	input.value = '';
}

// deletes last character of a string
function deleteCharacter(inputId) {
	const input = document.getElementById(inputId);
	const editedText = input.value.slice(0, -1);

	input.value = editedText;
	showGlyphs();
	checkGlyphs(input);
}

// makes glyph buttons clickable and adds their value to input field
function glyphOnClick(button) {
	const inputId = 'portalglyphsInput';
	const input = document.getElementById(inputId);
	const portalCode = input.value;

	if (portalCode.length < 12) {
		input.value += button.value;
	}

	showGlyphs();
	checkGlyphs(input);
}

function glyphInputOnChange(input) {
	const intermediateValue = input?.value?.toUpperCase?.();
	if (intermediateValue == null) return;

	const newValue = intermediateValue
		.split('')
		.filter(char => validPortalKeys.includes(char))
		.join('')
		.substr(0, 12);
	input.value = newValue;
	showGlyphs();
	checkGlyphs(input);
}

function showGlyphs() {
	const glyphInputId = 'portalglyphsInput';
	const glyphOutputId = 'glyphDisplay';
	const glyphInput = document.getElementById(glyphInputId);
	const glyphOutput = document.getElementById(glyphOutputId);
	glyphOutput.innerText = glyphInput.value;
}

// puts text into the output element
function submit(element) {
	const sectionId = getSectionId(element);
	const sectionOutputWrapper = document.querySelector(`#${sectionId} .output`);
	const sectionOutput = sectionOutputWrapper.querySelector(`output`);
	const sectionStatusOutput = sectionOutputWrapper.querySelector(`.status`);
	const sectionFunctions = {
		generator: () => generateTag(),
		decoder: () => decodeTag(),
	}
	const outputObject = sectionFunctions[sectionId]() || { status: '', output: '' };

	const outputStatus = outputObject.status;
	const outputContent = outputObject.output;
	const isError = outputStatus.includes('Error');

	sectionOutputWrapper.style.backgroundColor = isError ? 'red' : '';
	sectionStatusOutput.innerText = outputStatus;
	sectionOutput.innerText = outputContent;
}

function generateTag() {
	const glyphInputId = 'portalglyphsInput';
	const glyphInputElement = document.getElementById(glyphInputId);
	const glyphs = glyphInputElement.value;
	const { valid, error } = checkGlyphs(glyphInputElement, true);

	if (!glyphs) return;

	if (!valid) return { status: 'Error:', output: error };

	const regionNum = getRegionNum(glyphs);
	const SIV = getSIV(glyphs);
	const tag = `[HUB${regionNum}-${SIV}]`;
	return { status: 'Your Hub Tag:', output: tag };
}

// returns Hub nr
function getRegionNum(glyphs) {
	const regionGlyphs = glyphs.substring(4);
	const regArray = Array.from(getRegions(galaxy))
	const index = regArray.indexOf(regionGlyphs);
	if (index > -1) return index + 1;
}

// returns System Index Value
function getSIV(glyphs) {
	const systemIndex = glyphs.substring(1, 4);
	// this removes leading zeros
	const decSIV = Number('0x' + systemIndex);
	// return false if system is not reachable via portal (max system index is 2FF, which is 767 in dec)
	if (!decSIV || decSIV > 767) return;
	const hexSIV = decSIV.toString(16).toUpperCase();
	return hexSIV.replace('69', '68+1');	// replace 69 with 68+1, because the profanity filter flags it
}

function checkGlyphs(inputElement, enableLengthCheck = false) {
	const glyphs = inputElement.value;
	const regionGlyphs = glyphs.substring(4);
	const systemIndex = glyphs.substring(1, 4);
	// this removes leading zeros
	const decSIV = Number('0x' + systemIndex);
	const regions = getRegions(galaxy);
	const correctLength = enableLengthCheck ? glyphs.length == 12 : true;
	const regionInHub = regions.has(regionGlyphs) || glyphs.length != 12;
	const reachable = decSIV && decSIV < 768;
	const valid = (correctLength && regionInHub && reachable) || !glyphs.length;

	inputElement.style.backgroundColor = valid ? '' : 'lightcoral';

	if (!valid) {
		if (!correctLength) {
			return { valid: false, error: 'Invalid glyph sequence: Incorrect length' };
		}

		if (!regionInHub) {
			return { valid: false, error: 'Invalid glyph sequence: No Hub region' };
		}

		if (!reachable) {
			return { valid: false, error: 'Invalid glyph sequence: Not reachable via portal' };
		}
	}

	return { valid: true };
}

function decodeTag() {
	const tagInputId = 'tagInput';
	const tagInputElement = document.getElementById(tagInputId);
	const input = tagInputElement.value.replaceAll(/[\[\]]/g, '').replaceAll('68+1', '69').trim();	// NoSonar the escape character is necessary
	if (!input) return;
	console.log(input)
	const regions = Array.from(getRegions(galaxy));
	const [hub, sysIndex] = input.split('-');
	const regionIndex = hub.replace('HUB', '') - 1;
	const regionCode = regions[regionIndex];

	if (!sysIndex || regionIndex < 0 || !hub.startsWith('HUB')) {
		let errorMessage;
		if (!sysIndex) {
			errorMessage = 'Invalid Hub tag format (missing "-")';
		} else if (regionIndex < 0 || !hub.startsWith('HUB')) {
			errorMessage = 'Invalid Hub tag format (no "HUB" or wrong region ID)';
		}
		return { status: 'Error:', output: errorMessage };
	}

	const planetIndex = '0';
	const sysIndexStr = sysIndex.padStart(3, '0');
	const glyphStr = planetIndex + sysIndexStr + regionCode;

	return { status: 'Glyphs:', output: glyphStr };
}

function switchTheme(theme = null) {
	const currentTheme = document.documentElement.dataset.theme;
	const computedNewTheme = currentTheme == 'dark' ? 'light' : 'dark';
	const newTheme = theme ?? computedNewTheme;
	document.documentElement.dataset.theme = newTheme;
}