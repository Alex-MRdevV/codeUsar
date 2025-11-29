import {
	uploadDataConsolidada,
	type dataConsolidada,
} from "@/lib/schemas/files/consolidado";
import { safeParse } from "valibot";

export const validateAndFilterData = (rows: unknown[]) => {
	const validRows: dataConsolidada[] = [];
	const invalidRows: {
		row: number;
		data: unknown;
		errors: string[];
	}[] = [];

	// Pre-allocate arrays with estimated sizes for better performance
	const estimatedSize = Math.max(1, Math.floor(rows.length * 0.7));
	validRows.length = estimatedSize;

	const enRuta: dataConsolidada[] = [];
	const segundoViaje: dataConsolidada[] = [];
	const aplazado: dataConsolidada[] = [];

	// Pre-compile phone validation regex
	const phoneRegex = /^\d{10}$/;

	let validIndex = 0;

	for (let index = 0; index < rows.length; index++) {
		const rawRow = rows[index];
		const rowNumber = index + 2;

		try {
			const normalizedRow = rawRow as Record<string, unknown>;
			const result = safeParse(uploadDataConsolidada, normalizedRow);

			if (!result.success) {
				// Parsing failed - handle invalid row
				const errores = result.issues.map((issue) => {
					const path = issue.path?.map((p) => p.key).join(".") || "Campo";
					return `${path}: ${issue.message}`;
				});

				invalidRows.push({
					row: rowNumber,
					data: rawRow,
					errors: errores,
				});
				continue;
			}

			const data = result.output;
			const additionalErrors: string[] = [];

			// Optimized phone validation - treat phones as independent fields
			let phoneToUse: string | null = null;
			const hasValidPrimaryPhone =
				data.phoneNumber !== "0" && phoneRegex.test(data.phoneNumber);
			const hasValidSecondaryPhone =
				data.phoneNumberConfirmar !== "0" &&
				phoneRegex.test(data.phoneNumberConfirmar);

			if (hasValidPrimaryPhone) {
				phoneToUse = data.phoneNumber;
			} else if (hasValidSecondaryPhone) {
				phoneToUse = data.phoneNumberConfirmar;
			}

			// Only validate phone mismatch if client ID is the same AND both phones are valid
			if (
				hasValidPrimaryPhone &&
				hasValidSecondaryPhone &&
				data.phoneNumber !== data.phoneNumberConfirmar
			) {
				// This is just a warning, not a critical error
				console.warn(
					`Fila ${rowNumber}: Teléfonos diferentes para mismo cliente. phoneNumber: ${data.phoneNumber}, phoneNumberConfirmar: ${data.phoneNumberConfirmar}. Se usará: ${phoneToUse}`
				);
			}

			if (!phoneToUse) {
				additionalErrors.push(
					`No hay ningún teléfono válido. phoneNumber: ${data.phoneNumber}, phoneNumberConfirmar: ${data.phoneNumberConfirmar}`
				);
			}

			// Optimized time comparison - avoid string replacement and parsing when possible
			let timeError = false;
			if (data.horaInicial && data.horaFinal) {
				// Direct string comparison for same format times
				if (data.horaInicial.length === data.horaFinal.length) {
					timeError = data.horaInicial >= data.horaFinal;
				} else {
					// Fallback to numeric comparison only if necessary
					const horaInicialNum = parseFloat(
						data.horaInicial.replace(/:/g, ".")
					);
					const horaFinalNum = parseFloat(data.horaFinal.replace(/:/g, "."));
					timeError =
						!isNaN(horaInicialNum) &&
						!isNaN(horaFinalNum) &&
						horaInicialNum >= horaFinalNum;
				}

				if (timeError) {
					additionalErrors.push(
						`horaInicial (${data.horaInicial}) debe ser menor que horaFinal (${data.horaFinal})`
					);
				}
			}

			if (additionalErrors.length > 0) {
				invalidRows.push({
					row: rowNumber,
					data: rawRow,
					errors: additionalErrors,
				});
				continue;
			}

			// Create valid data with selected phone
			const validData: dataConsolidada = {
				...data,
				phoneNumber: phoneToUse!,
			};

			// Use pre-allocated array
			validRows[validIndex++] = validData;

			// Direct grouping without function call overhead
			switch (validData.status) {
				case "EN RUTA":
					enRuta.push(validData);
					break;
				case "SEGUNDO VIAJE":
					segundoViaje.push(validData);
					break;
				case "APLAZADO":
					aplazado.push(validData);
					break;
			}
		} catch (error) {
			invalidRows.push({
				row: rowNumber,
				data: rawRow,
				errors: [error instanceof Error ? error.message : "Error desconocido"],
			});
		}
	}

	// Trim the pre-allocated array to actual size
	validRows.length = validIndex;

	// Optimized helper function to avoid multiple iterations
	const createStatusData = (items: dataConsolidada[]) => ({
		count: items.length,
		phoneNumbers: items.map((item) => item.phoneNumber),
		clientIds: items.map((item) => item.idCliente),
		fullData: items,
	});

	return {
		validRows,
		invalidRows,
		grouped: {
			enRuta,
			segundoViaje,
			aplazado,
		},
		byStatus: {
			enRuta: createStatusData(enRuta),
			segundoViaje: createStatusData(segundoViaje),
			aplazado: createStatusData(aplazado),
		},
		summary: {
			total: rows.length,
			valid: validIndex,
			invalid: invalidRows.length,
			enRuta: enRuta.length,
			segundoViaje: segundoViaje.length,
			aplazado: aplazado.length,
		},
	};
};
