import { hashPassword } from "@/utils/password/hashPassword";

export const verifyPassword = async (
	storedHash: string,
	passwordAttempt: string
): Promise<boolean> => {
	// Validación de entradas
	if (!storedHash || !passwordAttempt) {
		throw new Error("Se requieren los parámetros de entrada");
	}

	try {
		const [saltHex, originalHash] = storedHash.split(":");

		// Validación más específica
		if (!saltHex || !originalHash) {
			throw new Error("Formato invalido");
		}

		// Validación del formato hexadecimal
		if (
			!/^[0-9a-fA-F]+$/.test(saltHex) ||
			!/^[0-9a-fA-F]+$/.test(originalHash)
		) {
			throw new Error("Formato no válido");
		}

		// Uso de una función auxiliar para la conversión
		const salt = hexToUint8Array(saltHex);

		// Obtener el hash del intento usando la nueva estructura
		const { hash: attemptHash } = await hashPassword(passwordAttempt, salt);

		return timingSafeEqual(attemptHash, originalHash);
	} catch (error) {
		if (error instanceof Error) {
			// Propagar el error específico, pero sin detalles sensibles
			throw new Error("La verificación de contraseña falló");
		}
		throw new Error("La verificación de contraseña falló");
	}
};

// Función auxiliar para convertir hex a Uint8Array de manera segura
const hexToUint8Array = (hex: string): Uint8Array => {
	const matches = hex.match(/.{2}/g);
	if (!matches) {
		throw new Error("Formato no válido");
	}
	return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};

// Implementación de comparación timing-safe
const timingSafeEqual = (a: string, b: string): boolean => {
	if (a.length !== b.length) {
		return false;
	}

	let result = 0;
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return result === 0;
};
