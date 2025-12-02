import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/uploadFiles/uploadZone";
import { addDataBavariaNow } from "@/utils/services/dataTransitoria/addBavarianow";
import { addDataConsolidado } from "@/utils/services/dataTransitoria/addConsolidado";
import { UploadConsolidadoRequest } from "@/utils/services/files/uploadConsolidado";
import { UploadBavariaNowRequest } from "@/utils/services/files/uploadavariaNowTemplate";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const ViewUploadsFiles = () => {
	const [file1, setFile1] = useState<File | null>(null);
	const [file2, setFile2] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!file1 && !file2) {
			toast.error("Por favor, sube al menos un archivo Excel");
			return;
		}

		setIsLoading(true);

		try {
			let hasError = false;
			let dataConsolidado;
			let dataBavaria;

			// === 1. Procesar archivo consolidado ===
			if (file1) {
				const [errorConsolidado, parsedConsolidado] = await UploadConsolidadoRequest(file1);
				if (errorConsolidado) {
					toast.error(`Error en archivo consolidado: ${errorConsolidado.message}`);
					hasError = true;
				} else if (parsedConsolidado) {
					dataConsolidado = parsedConsolidado;
					toast.success("Archivo consolidado cargado correctamente");
				}
			}

			// === 2. Procesar archivo Bavaria ===
			if (file2) {
				const [errorBavaria, parsedBavaria] = await UploadBavariaNowRequest(file2);
				if (errorBavaria) {
					toast.error(`Error en archivo Bavaria: ${errorBavaria.message}`);
					hasError = true;
				} else if (parsedBavaria) {
					dataBavaria = parsedBavaria;
					toast.success("Archivo Bavaria cargado correctamente");
				}
			}

			// Si hubo errores al cargar/parsing → no continuamos
			if (hasError) {
				setIsLoading(false);
				return;
			}

			// === 3. Guardar datos en la BD ===
			if (dataConsolidado) {
				try {
					await addDataConsolidado(dataConsolidado);
					toast.success("Datos de consolidado guardados");
				} catch {
					toast.error("Error guardando consolidado en BD");
					setIsLoading(false);
					return;
				}
			}

			if (dataBavaria) {
				try {
					await addDataBavariaNow(dataBavaria);
					toast.success("Datos de Bavaria guardados");
				} catch {
					toast.error("Error guardando Bavaria en BD");
					setIsLoading(false);
					return;
				}
			}

			// === 4. Redirigir ===
			toast.success("Datos guardados exitosamente");
			setTimeout(() => (window.location.href = "/users/send"), 800);

		} catch (error) {
			toast.error("Error inesperado al procesar los archivos");
			setIsLoading(false);
		}
	}; // ← FALTABA ESTE CIERRE

	const handleReset = () => {
		setFile1(null);
		setFile2(null);
		toast.info("Formulario reiniciado");
	};

	return (
		<div className="min-h-screen bg-background py-12 px-4">
			<div className="max-w-3xl mx-auto">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
						<FileSpreadsheet className="w-8 h-8 text-primary" />
					</div>
					<h1 className="text-4xl font-bold text-foreground mb-2">
						Carga de Archivos Excel
					</h1>
					<p className="text-muted-foreground">
						Sube uno o ambos archivos Excel para procesarlos
					</p>
				</div>

				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle>Formulario de Carga</CardTitle>
						<CardDescription>
							Selecciona o arrastra al menos un archivo Excel. Puedes subir ambos o solo uno.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<FileUploadZone
								label="Archivo Consolidado (Opcional)"
								file={file1}
								onFileChange={setFile1}
							/>

							<FileUploadZone
								label="Archivo Bavaria Now (Opcional)"
								file={file2}
								onFileChange={setFile2}
							/>

							<div className="flex gap-3 pt-4">
								<Button
									type="submit"
									className="flex-1"
									disabled={(!file1 && !file2) || isLoading}
								>
									{isLoading ? (
										<>
											<span className="animate-spin mr-2">⏳</span>
											Procesando...
										</>
									) : (
										'Procesar Archivos'
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
