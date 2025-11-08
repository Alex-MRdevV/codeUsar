export const hashPassword = async (
	password: string,
	providedSalt?: Uint8Array
): Promise<{ hash: string; salt: string }> => {
	// Validaciones de entrada
	if (!password || password.length < 1) {
		throw new Error("Password must not be empty");
	}

	const encoder = new TextEncoder();
	const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16));

	try {
		// Importar la contraseña como material criptográfico
		const materialKey = await crypto.subtle.importKey(
			"raw",
			encoder.encode(password),
			{ name: "PBKDF2" },
			false,
			["deriveBits"]
		);

		// Derivar bits directamente en lugar de una clave AES
		const derivedBits = await crypto.subtle.deriveBits(
			{
				name: "PBKDF2",
				//@ts-ignore
				salt: salt,
				iterations: 100000,
				hash: "SHA-256",
			},
			materialKey,
			256 // 32 bytes / 256 bits
		);

		const hashHex = convertBufferToHex(new Uint8Array(derivedBits));
		const saltHex = convertBufferToHex(salt);

		return {
			hash: hashHex,
			salt: saltHex,
		};
	} catch (error) {
		// Manejo de errores más específico
		if (error instanceof Error) {
			throw new Error(
				`La contraseña no pudo ser convertida a hash: ${error.message}`
			);
		}
		throw new Error("La contraseña no pudo ser convertida a hash");
	}
};

const convertBufferToHex = (buffer: Uint8Array): string => {
	return Array.from(buffer)
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
};
