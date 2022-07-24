const GHubRegions = {
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
};
const HilHubRegions = {
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
};
const CalHubRegions = {
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
};
const BudHubRegions = {
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
};
const EisHubRegions = {
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
};

const HubGalaxies = {
	'Euclid': GHubRegions,
	'Hilbert': HilHubRegions,
	'Calypso': CalHubRegions,
	'Budullangr': BudHubRegions,
	'Eissentam': EisHubRegions,
};

const validPortalKeys = '0123456789ABCDEF'

// deletes last character of a string
function deleteCharacter(codeId) {
	const input = document.getElementById(codeId);
	const editedText = input.value.slice(0, -1);

	input.value = editedText;
	showGlyphs();
}

// assigns the region based on glyphs
function glyphRegion(glyph_inputId, galaxy_inputId) {
	let glyphElement = document.getElementById(glyph_inputId)
	let glyphs = document.getElementById(glyph_inputId).value
	let civ = document.getElementById(galaxy_inputId).value
	if (glyphs.length == 12) {
		let region;
		let regionGlyphs = glyphs.substring(4);
		switch (civ) {
			case "GHub":
				region = GHubRegions[regionGlyphs]
				break

			case "CalHub":
				region = CalHubRegions[regionGlyphs]
				break

			case "EisHub":
				region = EisHubRegions[regionGlyphs]
				break
		}
		if (region == undefined) {
			document.getElementById(region_codeId).style.backgroundColor = 'red';
			region = 'No valid Hub region'
			glyphElement.style.backgroundColor = 'red'
		} else {
			document.getElementById(region_codeId).style.backgroundColor = '';
			glyphElement.style.backgroundColor = ''
		}
	}
	setOutput(region_codeId, region);
}

// makes glyph buttons clickable and adds their value to input field
function glyphOnClick(button, inputId) {

	const input = document.getElementById(inputId);
	const portalCode = input.value;

	if (portalCode.length < 12) {
		input.value += button.value;
	}
	showGlyphs()
}

function glyphInputOnChange(input) {
	const intermediateValue = input?.value?.toUpperCase?.();
	if (intermediateValue == null) return;

	const newValue = intermediateValue
		.split('')
		.filter(char => validPortalKeys.includes(char))
		.join('')
		.substr(0, 12);
	input.value = newValue
	return newValue
}

// clears value of an input
function clearValues(inputArray) {
	for (const ID of inputArray) {
		document.getElementById(ID).value = ''
	}
}

function hideGlyphs(input, target) {
	const names = document.getElementsByClassName(target);
	if (input.value == '') {
		for (const name of names) {
			name.style.display = 'none'
		}
	} else {
		for (const name of names) {
			name.style.display = ''
		}
	}
}

// returns Hub nr
function getHubNumber(galaxy_inputId, glyph_inputId) {
	let check = document.getElementById(galaxy_inputId).value;
	let glyphs = document.getElementById(glyph_inputId).value;
	let index;
	let regArray = [];
	regArray = Object.keys(HubGalaxies[check]);

	glyphs = glyphs.substring(4);
	index = regArray.indexOf(glyphs);
	index++

	return index
}

function submitGlyphs(galaxy_inputId, glyph_inputId, Nr, SSI, error) {
	const HubNr = getHubNumber(galaxy_inputId, glyph_inputId);
	let SysIndex = parseInt(document.getElementById(glyph_inputId).value.substring(1, 4), 16).toString(16).toUpperCase()
	if (HubNr > 0 && parseInt(SysIndex, 16) > 0 && parseInt(SysIndex, 16) < 768) {
		document.getElementById(Nr).parentElement.parentElement.style.display = ''
		document.getElementById(error).parentElement.style.display = 'none';
		document.getElementById(glyph_inputId).style.backgroundColor = '';
		document.getElementById(Nr).innerHTML = HubNr;
		if (SysIndex == 69) {
			SysIndex = '68+1'
		}
		document.getElementById(SSI).innerHTML = SysIndex;
	} else if (!HubNr > 0) {
		document.getElementById(Nr).parentElement.parentElement.style.display = 'none'
		document.getElementById(glyph_inputId).style.backgroundColor = 'lightcoral';
		document.getElementById(error).parentElement.style.display = '';
		document.getElementById(error).innerHTML = 'Wrong region glyphs (glyphs 5-12)'
	} else {
		document.getElementById(Nr).parentElement.parentElement.style.display = 'none'
		document.getElementById(glyph_inputId).style.backgroundColor = 'lightcoral';
		document.getElementById(error).parentElement.style.display = '';
		document.getElementById(error).innerHTML = 'Wrong system index (glyphs 2-4)'
	}
}

function submitTag(galaxy_inputId, tag_inputId, glyph_codeId, error) {
	const galaxy = document.getElementById(galaxy_inputId).value;
	const input = document.getElementById(tag_inputId).value.replaceAll('[', '').replaceAll(']', '').replaceAll('68+1', '69');
	const HubNr = input.split('-')[0].substring(3)
	const RegCode = Object.keys(HubGalaxies[galaxy])[(parseInt(HubNr) - 1)]
	const SysIndex = input.split('-')[1].padStart(3, '0')
	const Array = Object.keys(HubGalaxies[galaxy])
	if (HubNr > 0 && HubNr <= Array.length) {
		document.getElementById(error).parentElement.style.display = 'none'
		document.getElementById(glyph_codeId).parentElement.parentElement.style.display = ''
		document.getElementById(glyph_codeId).innerHTML = SysIndex + RegCode;
	} else {
		document.getElementById(glyph_codeId).parentElement.parentElement.style.display = 'none'
		document.getElementById(error).parentElement.style.display = ''
		document.getElementById(error).innerHTML = 'Wrong region ID'
	}
}

// error checking when length is 12
function errorCheck(glyphs_inputId, galaxy_inputId, outputDiv) {
	const glyphs = document.getElementById(glyphs_inputId);
	const galaxy = document.getElementById(galaxy_inputId).value;
	if (glyphs.value.length == 12 && !Object.keys(HubGalaxies[galaxy]).includes(glyphs.value.substring(4))) {
		document.getElementById(outputDiv).style.display = 'none'
		document.getElementById(glyphs_inputId).style.backgroundColor = 'lightcoral';
	} else {
		document.getElementById(glyphs_inputId).style.backgroundColor = '';
	}
}