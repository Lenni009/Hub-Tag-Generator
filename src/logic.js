const regions = {
	Euclid: {
		'F9556C30': 'The Arm of Vezitinen',
		'F9555C30': 'Canthian',
		'F9555C31': 'Dexterf Sector',
		'F9556C31': 'The Arm of Katteus',
		'F9557C31': 'Nugsdor Adjunct',
		'F9557C30': 'Uefert Nebula',
		'F9557C2F': 'Widraik',
		'F9556C2F': 'Airnaka Conflux',
		'F9555C2F': 'Sivess Instability',
		'FA556C30': 'Savenix Instability',
		'F8556C30': 'Nonlopsi Instability'
	},
	Hilbert: {
		'F9556C30': 'Nuwardia',
		'F9555C30': 'Arm of Orphaea',
		'F9555C31': 'Oulvill',
		'F9556C31': 'Sea of Femanau',
		'F9557C31': 'Logalurug Expanse',
		'F9557C30': 'Doikawis',
		'F9557C2F': 'Ijortu Spur',
		'F9556C2F': 'Bayores Shallows',
		'F9555C2F': 'Meveldrun Expanse',
		'FA556C30': 'Kossiza',
		'F8556C30': 'Lorishup'
	},
	Calypso: {
		'F9556C30': 'Uisaor Spur',
		'F9555C30': 'The Arm of Kiffeyn',
		'F9555C31': 'Ilongl Cloud',
		'F9556C31': 'The Arm of Taticale',
		'F9557C31': 'Egerap Anomaly',
		'F9557C30': 'Wakestones Expanse',
		'F9557C2F': 'Erhahn Fringe',
		'F9556C2F': 'Imrikians Terminus',
		'F9555C2F': 'Imedeili',
		'FA556C30': 'Kovasu Adjunct',
		'F8556C30': 'Lossians Boundary'
	},
	Budullangr: {
		'F9556C30': 'The Arm of Mupkean',
		'F9555C30': 'Uslogo Boundry',
		'F9555C31': 'Chmida Boundry',
		'F9556C31': 'Lawaik Void',
		'F9557C31': 'Tuorng',
		'F9557C30': 'Rorfinko Sector',
		'F9557C2F': 'Nudyrok Nebula',
		'F9556C2F': 'Gushener Terminus',
		'F9555C2F': 'Layhyimpia Adjunct',
		'FA556C30': 'Wodaabil Expanse',
		'F8556C30': 'Baksan Adjunct'
	},
	Eissentam: {
		'F9556C30': 'Riwala',
		'F9555C30': 'Omskio Instability',
		'F9555C31': 'Marcki',
		'F9556C31': 'Anolamga Spur',
		'F9557C31': 'Sea of Zonyayp',
		'F9557C30': 'Rayuyar Band',
		'F9557C2F': 'Umaton Instability',
		'F9556C2F': 'Exramb Adjunct',
		'F9555C2F': 'Ologowe Fringe',
		'FA556C30': 'Yatrifex',
		'FA555C30': 'Yeiada Sector',
		'FA555C31': 'Iptrevs Fringe',
		'FA556C31': 'Yamiraith Sector',
		'FA557C31': 'Wedragi Spur',
		'FA557C30': 'Rezhensk',
		'FA557C2F': 'Sobert Cloud',
		'FA556C2F': 'Umtats Anomaly',
		'FA555C2F': 'Tavill',
		'F8556C30': 'Qangew Expanse',
		'F8555C30': 'Nijhwal Boundary',
		'F8555C31': 'Usband Cluster',
		'F8556C31': 'Ejongaa Anomaly',
		'F8557C31': 'Zahrel Expanse',
		'F8557C30': 'The Arm of Fupand',
		'F8557C2F': 'Cuculta',
		'F8556C2F': 'Etmarao',
		'F8555C2F': 'Otreie Void'
	}
}

const validPortalKeys = '0123456789ABCDEF'

// deletes last character of a string
function deleteCharacter(codeId) {
	const input = document.getElementById(codeId);
	const editedText = input.value.slice(0, -1);

	input.value = editedText;
	showGlyphs();
}

// makes glyph buttons clickable and adds their value to input field
function glyphOnClick(button, inputId) {

	const input = document.getElementById(inputId);
	const portalCode = input.value;

	if (portalCode.length < 12) {
		input.value += button.value;
	}
	showGlyphs();
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
	return newValue;
}

// clears value of an input
function clearValues(inputArray) {
	for (const ID of inputArray) {
		document.getElementById(ID).value = '';
	}
}

function hideGlyphs(input, target) {
	const names = document.getElementsByClassName(target);
	for (const name of names) {
		name.style.display = input.value ? '' : 'none';
	}
}

// returns Hub nr
function getHubNumber(galaxy_inputId, glyph_inputId) {
	const check = document.getElementById(galaxy_inputId).value;
	const glyphs = document.getElementById(glyph_inputId).value;
	const regionGlyphs = glyphs.substring(4);
	const regArray = Object.keys(regions[check]);
	const index = regArray.indexOf(regionGlyphs);
	return index + 1;
}

function errorfunc(inputId, output_codeId, error_codeId, error) {
	document.getElementById(output_codeId).parentElement.parentElement.style.display = 'none';
	document.getElementById(inputId).style.backgroundColor = 'lightcoral';
	document.getElementById(error_codeId).parentElement.style.display = '';
	document.getElementById(error_codeId).innerText = error;
}

function submitGlyphs(galaxy_inputId, glyph_inputId, Nr, SSI, error) {
	const glyphInput = document.getElementById(glyph_inputId);
	const hubNrOutput = document.getElementById(Nr);
	const HubNr = getHubNumber(galaxy_inputId, glyph_inputId);
	let SysIndex = parseInt(glyphInput.value.substring(1, 4), 16).toString(16).toUpperCase();
	if (HubNr > 0 && parseInt(SysIndex, 16) > 0 && parseInt(SysIndex, 16) < 768) {
		hubNrOutput.closest('#output').style.display = '';
		document.getElementById(error).parentElement.style.display = 'none';
		glyphInput.style.backgroundColor = '';
		hubNrOutput.innerText = HubNr;
		if (SysIndex == 69) {
			SysIndex = '68+1'
		}
		document.getElementById(SSI).innerText = SysIndex;
	} else {
		const errorMessage = HubNr > 0 ? 'Wrong system index (glyphs 2-4)' : 'Wrong region glyphs (glyphs 5-12)';
		errorfunc(glyph_inputId, Nr, error, errorMessage);
	}
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

// error checking when length is 12
function errorCheck(glyphs_inputId, galaxy_inputId, outputDiv) {
	const glyphs = document.getElementById(glyphs_inputId);
	const galaxy = document.getElementById(galaxy_inputId).value;
	if (glyphs.value.length == 12 && !Object.keys(regions[galaxy]).includes(glyphs.value.substring(4))) {
		document.getElementById(outputDiv).style.display = 'none'
		glyphs.style.backgroundColor = 'lightcoral';
	} else {
		glyphs.style.backgroundColor = '';
	}
}