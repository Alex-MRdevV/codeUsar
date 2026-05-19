import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadZone } from "@/components/uploadFiles/uploadZone";
import { UploadPhonesRequestRechazados } from "@/utils/services/files/addMensajesRechazados";
import { UploadPhonesRequestRutas } from "@/utils/services/files/addMensajesRuta";
import { UploadPhonesRequestReasignados } from "@/utils/services/files/addReasinagdos";
import { UploadPhonesRequestLunesAplazados } from "@/utils/services/files/addLunesAplazados";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ViewUploadComplete = () => {
	const [fileNoPlaneados, setFileNoPlaneados] = useState<File | null>(null);
	const [fileRetrasados, setFileRetrasados] = useState<File | null>(null);
	const [fileEnRuta, setFileEnRuta] = useState<File | null>(null);
	const [fileLunesAplazados, setFileLunesAplazados] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleReset = () => {
		setFileNoPlaneados(null);
		setFileRetrasados(null);
		setFileEnRuta(null);
		setFileLunesAplazados(null);
		toast.info("Formulario reiniciado");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!fileNoPlaneados && !fileRetrasados && !fileEnRuta && !fileLunesAplazados) {
			toast.error("Por favor, sube al menos un archivo Excel");
			return;
		}

		setIsLoading(true);

		try {
			let hasError = false;

			if (fileNoPlaneados) {
				const [errorFile1] = await UploadPhonesRequestRechazados(
					fileNoPlaneados,
					"pedidos_no_planeados2"
				);

				if (errorFile1) {
					hasError = true;
				}
			}

			if (fileRetrasados) {
				const [errorFile2] = await UploadPhonesRequestReasignados(
					fileRetrasados,
					"pedidos_retrasados"
				);

				if (errorFile2) {
					hasError = true;
				}
			}

			if (fileEnRuta) {
				const [errorConsolidado] =
					await UploadPhonesRequestRutas(fileEnRuta, "pedidosenrutados");

				if (errorConsolidado) {
					hasError = true;
				}
			}

			if (fileLunesAplazados) {
				const [errorFile6] = await UploadPhonesRequestLunesAplazados(
					fileLunesAplazados,
					"lunes_aplazados"
				);

				if (errorFile6) {
					hasError = true;
				}
			}

			if (hasError) {
				setIsLoading(false);
				return;
			}

			toast.success("¡Proceso completado con éxito!");
			setFileNoPlaneados(null);
			setFileRetrasados(null);
			setFileEnRuta(null);
			setFileLunesAplazados(null);
		} catch (error) {
			toast.error("Error inesperado al procesar los archivos");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<article className="min-h-screen bg-gray-50 py-12 px-4">
			<section className="max-w-3xl mx-auto">
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
							Selecciona o arrastra al menos un archivo Excel. Puedes subir
							varios archivos.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<FileUploadZone
								label="Archivo para los pedidos no planeados (Opcional)"
								file={fileNoPlaneados}
								onFileChange={setFileNoPlaneados}
							/>
							<FileUploadZone
								label="Archivo para los pedidos retrasados (Opcional)"
								file={fileRetrasados}
								onFileChange={setFileRetrasados}
							/>
							<FileUploadZone
								label="Archivo Consolidado para los clientes en ruta (Opcional)"
								file={fileEnRuta}
								onFileChange={setFileEnRuta}
							/>
							<FileUploadZone
								label="Archivo para los pedidos con Lunes Aplazados (Opcional)"
								file={fileLunesAplazados}
								onFileChange={setFileLunesAplazados}
							/>
							<section className="flex gap-3 pt-4">
								<Button
									type="submit"
									className="flex-1"
									disabled={(!fileNoPlaneados && !fileRetrasados && !fileEnRuta && !fileLunesAplazados) || isLoading}
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
							</section>
						</form>
					</CardContent>
				</Card>
			</section>
		</article>
	);
};
