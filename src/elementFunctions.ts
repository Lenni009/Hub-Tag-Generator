import { getElement, GlobalElement, globalElements, GlobalElements } from './elementStore';
import { reset, submit } from './formActions';
import { deleteCharacter, glyphInputOnChange } from './glyphLogic';
import { switchTheme } from './themeSwitch';

export interface ElementFunctions {
	element: string;
	handler: string;
	func: () => void;
}

const elementFunctions: ElementFunctions[] = [
	{
		element: 'themeswitcher',
		handler: 'click',
		func: function () { switchTheme() }
	},
	{
		element: 'portalglyphsInput',
		handler: 'input',
		func: function () { glyphInputOnChange(this as unknown as HTMLInputElement) }
	},
	{
		element: 'delButton',
		handler: 'click',
		func: function () { deleteCharacter('portalglyphsInput') }
	},
	{
		element: 'tagInput',
		handler: 'input',
		func: function () { (this as unknown as HTMLInputElement).value = (this as unknown as HTMLInputElement).value.toUpperCase() }
	},
	{
		element: 'submitBtnGen',
		handler: 'click',
		func: function () { submit(this as unknown as HTMLButtonElement) }
	},
	{
		element: 'resetBtnGen',
		handler: 'click',
		func: function () { reset(this as unknown as HTMLButtonElement) }
	},
	{
		element: 'submitBtnDec',
		handler: 'click',
		func: function () { submit(this as unknown as HTMLButtonElement) }
	},
	{
		element: 'resetBtnDec',
		handler: 'click',
		func: function () { reset(this as unknown as HTMLButtonElement) }
	},
]

for (const functionObject of elementFunctions) {
	assignFunction(functionObject);
}

export function assignFunction(dataObject: ElementFunctions): void {
	const { handler, func } = dataObject;
	const elementId = dataObject.element as keyof GlobalElements;
	const element = (() => {
		if (globalElements[elementId]) return globalElements[elementId];

		return getElement(elementId);
	})() as GlobalElement;
	if (Array.isArray(element)) {
		element.forEach(element => element.addEventListener(handler, func));
	} else {
		element.addEventListener(handler, func);
	}
}