// DOM elements
export const battleInfo = document.querySelector('#battleInfo');
export const battleTextBox = document.querySelector('#textBox');

export const attackButton = document.querySelector('#attackBtn');
export const healButton = document.querySelector('#healBtn');
export const quitButton = document.querySelector('#quitBtn');

export function updateBattleText(text) {
  battleTextBox.textContent = text;
}

export function updateBattleInfo(text) {
  battleInfo.textContent = text;
}
