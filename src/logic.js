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

function generateTag() {
	const glyphInputId = 'portalglyphsInput';
	const glyphInputElement = document.getElementById(glyphInputId);
	const glyphs = glyphInputElement.value;
	checkGlyphs(glyphInputElement, true);
	if (!glyphs) return;
	const regionNum = getRegionNum(glyphs);
	const SIV = getSIV(glyphs);
	if (!regionNum || !SIV) return { status: 'Error:', output: 'Invalid System' };
	const tag = `[HUB${regionNum}-${SIV}]`;
	return { status: 'Your Hub Tag:', output: tag };
}

// returns Hub nr
function getRegionNum(glyphs) {
	const regionGlyphs = glyphs.substring(4);
	const regArray = Array.from(getRegions(galaxy))
	const index = regArray.indexOf(regionGlyphs);
	// return false if region doesn't exist
	return index > -1 ? index + 1 : false;
}

// returns System Index Value
function getSIV(glyphs) {
	const systemIndex = glyphs.substring(1, 4);
	// this removes leading zeros
	const decSIV = Number('0x' + systemIndex);
	// return false if system is not reachable via portal (max system index is 2FF, which is 767 in dec)
	if (!decSIV || decSIV > 767) return false;
	const hexSIV = decSIV.toString(16).toUpperCase();
	return hexSIV.replace('69', '68+1');	// replace 69 with 68+1, because the profanity filter flags it
}

function checkGlyphs(inputElement, enableLengthCheck = false) {
	const glyphs = inputElement.value;
	const regionGlyphs = glyphs.substring(4);
	const regions = getRegions(galaxy);
	const correctLength = enableLengthCheck ? glyphs.length == 12 : true;
	const regionInHub = regions.has(regionGlyphs) || glyphs.length != 12;

	inputElement.style.backgroundColor = (correctLength && regionInHub) || !glyphs.length ? '' : 'lightcoral';
}


function submitTag(galaxy_inputId, tag_inputId, glyph_codeId, error) {
	const errorElement = document.getElementById(error);
	const glyphElement = document.getElementById(glyph_codeId);
	const galaxy = document.getElementById(galaxy_inputId).value;
	const input = document.getElementById(tag_inputId).value.replaceAll('[', '').replaceAll(']', '').replaceAll('68+1', '69');
	const HubNr = input.split('-')[0].substring(3);
	const RegCode = Object.keys(regions[galaxy])[(parseInt(HubNr) - 1)]
	if (input.split('-').length == 1) {
		errorfunc(tag_inputId, glyph_codeId, error, 'Invalid Hub tag format (missing "-")');
		return
	}
	const sysIndex = input.split('-')[1].substring(0, 3).padStart(3, '0')
	const regionGlyphs = Object.keys(regions[galaxy])

	const regionCorrect = HubNr > 0 && HubNr <= regionGlyphs.length;

	errorElement.parentElement.style.display = regionCorrect ? 'none' : '';
	glyphElement.closest('#output').style.display = regionCorrect ? '' : 'none';
	if (regionCorrect) {
		glyphElement.innerText = sysIndex + RegCode;
	} else {
		errorElement.innerText = 'Wrong region ID';
	}
}






function switchTheme(theme = null) {
	const currentTheme = document.documentElement.dataset.theme;
	const computedNewTheme = currentTheme == 'dark' ? 'light' : 'dark';
	const newTheme = theme ?? computedNewTheme;
	document.documentElement.dataset.theme = newTheme;
}