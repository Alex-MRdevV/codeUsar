import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadZone } from "@/components/uploadFiles/uploadZone";
import { UploadPhonesRequestBavariaNow } from "@/utils/services/files/addMensajeBavariaNow";
import { UploadPhonesRequestRechazados } from "@/utils/services/files/addMensajesRechazados";
import { UploadPhonesRequestRutas } from "@/utils/services/files/addMensajesRuta";
import { UploadPhonesRequestReasignados } from "@/utils/services/files/addReasinagdos";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ViewUploadComplete = () => {
	const [file1, setFile1] = useState<File | null>(null);
	const [file2, setFile2] = useState<File | null>(null);
	const [file3, setFile3] = useState<File | null>(null);
	const [file4, setFile4] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleReset = () => {
		setFile1(null);
		setFile2(null);
		setFile3(null);
		setFile4(null);
		toast.info("Formulario reiniciado");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!file1 && !file2 && !file3 && !file4) {
			toast.error("Por favor, sube al menos un archivo Excel");
			return;
		}

		setIsLoading(true);

		try {
			let hasError = false;
			let dataPhones1;
			let dataPhones2;
			let dataPhones3;

			// === 1. Procesar archivo 1 (Pedidos rechazados) ===
			if (file1) {
				const [errorFile1, parsedFile1] = await UploadPhonesRequestRechazados(file1, "pedidos_no_planeados");

				if (errorFile1) {
					toast.error("Error al cargar el archivo 1");
					hasError = true;
				} else {
					dataPhones1 = parsedFile1;
					toast.success("Archivo 1 procesado correctamente");
				}
			}

			// === 2. Procesar archivo 2 ===
			if (file2) {
				const [errorFile2, parsedFile2] = await UploadPhonesRequestReasignados(file2, "pedidos_retrasados");

				if (errorFile2) {
					toast.error("Error al cargar el archivo 2");
					hasError = true;
				} else {
					dataPhones2 = parsedFile2;
					toast.success("Archivo 2 procesado correctamente");
				}
			}

			// === 3. Procesar archivo 3 ===
			if (file3) {
				const [errorFile3, parsedFile3] = await UploadPhonesRequestBavariaNow(file3, "confirmar_pedido");

				if (errorFile3) {
					toast.error("Error al cargar el archivo");
					hasError = true;
				} else {
					dataPhones3 = parsedFile3;
					toast.success("Archivo 3 procesado correctamente");
				}
			}

			if (file4) {
				const [errorConsolidado, parsedConsolidado] = await UploadPhonesRequestRutas(file4, "confirmacion_de_pedido");

				if (errorConsolidado) {
					toast.error("Ocurrió un error inesperado");
					hasError = true;
				} else {
					dataPhones3 = parsedConsolidado;
					toast.success("Archivo 4 procesado correctamente");
				}
			}

			// Si hubo errores al cargar/parsing → no continuamos
			if (hasError) {
				setIsLoading(false);
				return;
			}

			// === 5. Guardar datos en la BD ===
			if (dataPhones1) {
				toast.success("Datos de pedidos rechazados guardados");
			}

			if (dataPhones2) {
				toast.success("Datos de pedidos reasignados guardados");
			}

			if (dataPhones3) {
				toast.success("Datos para promocionar Bavaria Now guardados");
			}

			// 🎉 TODO EXITOSO - Limpiar formulario
			toast.success("¡Proceso completado con éxito!");
			setFile1(null);
			setFile2(null);
			setFile3(null);
			setFile4(null);
		} catch (error) {
			toast.error("Error inesperado al procesar los archivos");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-3xl mx-auto">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
						<FileSpreadsheet className="w-8 h-8 text-blue-600" />
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Carga de Archivos Excel
					</h1>
					<p className="text-gray-600">
						Sube uno o más archivos Excel para procesarlos
					</p>
				</div>

				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle>Formulario de Carga</CardTitle>
						<CardDescription>
							Selecciona o arrastra al menos un archivo Excel. Puedes subir varios archivos.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							<FileUploadZone
								label="Archivo para los pedidos rechazados (Opcional)"
								file={file1}
								onFileChange={setFile1}
							/>
							<FileUploadZone
								label="Archivo para los pedidos re-asignados (Opcional)"
								file={file2}
								onFileChange={setFile2}
							/>
							<FileUploadZone
								label="Archivo para la promoción de BavariaNow (Opcional)"
								file={file3}
								onFileChange={setFile3}
							/>
							<FileUploadZone
								label="Archivo Consolidado para los clientes en ruta (Opcional)"
								file={file4}
								onFileChange={setFile4}
							/>
							<div className="flex gap-3 pt-4">
								<Button
									type="submit"
									className="flex-1"
									disabled={(!file1 && !file2 && !file3 && !file4) || isLoading}
								>
									{isLoading ? (
										<>
											<span className="animate-spin mr-2">⏳</span>
											Procesando...
										</>
									) : (
										"Procesar Archivos"
									)}
								</Button>

								<Button
									type="button"
									variant="outline"
									onClick={handleReset}
									disabled={isLoading}
								>
									Reiniciar
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
