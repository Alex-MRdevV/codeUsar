import { FileSpreadsheet, FileSpreadsheetIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FileUploadZone } from "@/components/uploadFiles/uploadZone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { UploadConsolidadoRequest } from "@/utils/services/files/uploadConsolidado";
import { UploadBavariaNowRequest } from "@/utils/services/files/uploadavariaNowTemplate";

export const ViewUploadsFiles = () => {
	const [file1, setFile1] = useState<File>();
	const [file2, setFile2] = useState<File>();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const [] = UploadConsolidadoRequest(file1)
		const [] = UploadBavariaNowRequest(file2);

		if (!file1 || !file2) {
			toast.error("Por favor, sube ambos archivos Excel");
			return;
		}

		toast.success("Archivos cargados correctamente");

		// Ejemplo: crear FormData para enviar a una API
		const formData = new FormData();
		formData.append('file1', file1);
		formData.append('file2', file2);

		// Aquí puedes hacer el fetch a tu API
		// fetch('/api/upload', { method: 'POST', body: formData })
	};

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
						<FileSpreadsheetIcon className="w-8 h-8 text-primary" />
					</div>
					<h1 className="text-4xl font-bold text-foreground mb-2">
						Carga de Archivos Excel
					</h1>
					<p className="text-muted-foreground">
						Sube dos archivos Excel para procesarlos
					</p>
				</div>

				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle>Formulario de Carga</CardTitle>
						<CardDescription>
							Selecciona o arrastra los archivos Excel que deseas procesar
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<FileUploadZone
								label="Primer archivo Excel"
								file={file1}
								onFileChange={setFile1}
							/>

							<FileUploadZone
								label="Segundo archivo Excel"
								file={file2}
								onFileChange={setFile2}
							/>

							<div className="flex gap-3 pt-4">
								<Button
									type="submit"
									className="flex-1"
									disabled={!file1 || !file2}
								>
									Procesar Archivos
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={handleReset}
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
