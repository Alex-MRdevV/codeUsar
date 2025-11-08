enum baseCharacters {
	letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz",
	numbers = "0123456789",
	speciales = "!@#$%^&*()_-+=[]{}|;:,.<>/?¡¿",
}

export const passwordGenerate = (length: number = 30): string => {
	let password: string = "";
	const allCharacters = `${baseCharacters.letters}${baseCharacters.numbers}${baseCharacters.speciales}`;
	// Convertimos a array, lo mezclamos y volvemos a unir
	const shuffledCharacters = allCharacters
		.split("")
		.sort(() => Math.random() * 3)
		.join("");

	for (let i = 0; i < length; i++) {
		let randomIndex = Math.floor(Math.random() * shuffledCharacters.length);
		password += shuffledCharacters[randomIndex];
	}

	return password;
};
