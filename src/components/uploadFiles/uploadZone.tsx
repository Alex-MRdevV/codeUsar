import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FileUploadZoneProps } from "@/utils/types/file";
import { AlertCircle, FileCheck, Upload, X } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const FileUploadZone = ({
	fileType,
	uploadedFile,
	onFileSelect,
	onRemove,
	disabled,
}: FileUploadZoneProps) => {
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				onFileSelect(acceptedFiles[0]);
			}
		},
		[onFileSelect]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
			"application/vnd.ms-excel": [".xls"],
		},
		maxFiles: 1,
		disabled,
	});

	return (
		<Card
			{...getRootProps()}
			className={cn(
				"border-2 border-dashed transition-all cursor-pointer",
				isDragActive && "border-primary bg-upload-zone-hover scale-[1.02]",
				!uploadedFile && "border-upload-zone-border bg-upload-zone hover:bg-upload-zone-hover hover:border-primary",
				uploadedFile?.isValid && "border-success bg-success/5",
				uploadedFile && !uploadedFile.isValid && "border-destructive bg-destructive/5",
				disabled && "opacity-50 cursor-not-allowed"
			)}
		>
			<CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
				<input {...getInputProps()} />

				{!uploadedFile ? (
					<>
						<div className="rounded-full bg-primary/10 p-3">
							<Upload className="h-6 w-6 text-primary" />
						</div>
						<div className="space-y-1">
							<p className="text-sm font-medium text-foreground">
								{isDragActive ? "Suelta el archivo aquí" : `Subir ${fileType.name}`}
							</p>
							<p className="text-xs text-muted-foreground">
								Arrastra y suelta o haz clic para seleccionar
							</p>
						</div>
					</>
				) : uploadedFile.isValid ? (
					<>
						<div className="rounded-full bg-success/10 p-3">
							<FileCheck className="h-6 w-6 text-success" />
						</div>
						<div className="space-y-1 flex-1">
							<p className="text-sm font-medium text-foreground">{uploadedFile.file.name}</p>
							<p className="text-xs text-success">
								{uploadedFile.data.length} registros cargados
							</p>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onRemove();
							}}
							className="absolute top-2 right-2"
						>
							<X className="h-4 w-4" />
						</Button>
					</>
				) : (
					<>
						<div className="rounded-full bg-destructive/10 p-3">
							<AlertCircle className="h-6 w-6 text-destructive" />
						</div>
						<div className="space-y-1 flex-1">
							<p className="text-sm font-medium text-foreground">{uploadedFile.file.name}</p>
							<div className="space-y-1">
								{uploadedFile.errors.map((error, idx) => (
									<p key={idx} className="text-xs text-destructive">
										{error}
									</p>
								))}
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onRemove();
							}}
							className="absolute top-2 right-2"
						>
							<X className="h-4 w-4" />
						</Button>
					</>
				)}
			</CardContent>
		</Card>
	);
}
