import { decodeTag, generateTag, getSectionId } from "./main";

export interface OutputObj {
	status: string;
	output: string;
}

// puts text into the output element
export function submit(element: HTMLButtonElement): void {
	const sectionId = getSectionId(element);
	const sectionOutputWrapper = document.querySelector(`#${sectionId} .output`) as HTMLElement;
	const sectionOutput = sectionOutputWrapper.querySelector(`output`) as HTMLElement;
	const sectionStatusOutput = sectionOutputWrapper.querySelector(`.status`) as HTMLElement;

	const sectionFunctions: {
		[key: string]: () => OutputObj;
	} = {
		generator: () => generateTag(),
		decoder: () => decodeTag(),
	}
	const { status: outputStatus = '', output: outputContent = '' } = sectionFunctions[sectionId]();

	const isError = outputStatus.includes('Error');
	sectionOutputWrapper.classList[isError ? 'add' : 'remove']('error');
	sectionStatusOutput.innerText = outputStatus;
	sectionOutput.innerText = outputContent;
}

// clears input values
export function reset(element: HTMLButtonElement): void {
	const section = getSectionId(element);
	const sectionElement = document.getElementById(section);
	const input = sectionElement!.querySelector('input') as HTMLInputElement;
	const outputs: HTMLElement[] = Array.from(sectionElement!.querySelectorAll(`output, .output>*`));
	const errorElements: HTMLElement[] = Array.from(sectionElement!.querySelectorAll('.error'));
	for (const element of errorElements) {
		element.classList.remove('error');
	}
	for (const output of outputs) {
		output.innerHTML = '';
	}
	input.value = '';
}