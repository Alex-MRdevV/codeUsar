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

			if (file1) {
				const [errorFile1] = await UploadPhonesRequestRechazados(
					file1,
					"pedidos_no_planeados2"
				);

				if (errorFile1) {
					hasError = true;
				}
			}

			if (file2) {
				const [errorFile2] = await UploadPhonesRequestReasignados(
					file2,
					"pedidos_retrasados"
				);

				if (errorFile2) {
					hasError = true;
				}
			}

			if (file3) {
				const [errorFile3] = await UploadPhonesRequestBavariaNow(
					file3,
					"bavaria_now_confirmar"
				);

				if (errorFile3) {
					hasError = true;
				}
			}

			if (file4) {
				const [errorConsolidado] =
					await UploadPhonesRequestRutas(file4, "pedidosEnRUTADOS");

				if (errorConsolidado) {
					hasError = true;
				}
			}

			if (hasError) {
				setIsLoading(false);
				return;
			}

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
							<section className="flex gap-3 pt-4">
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
							</section>
						</form>
					</CardContent>
				</Card>
			</section>
		</article>
	);
};
