import { Button } from "@/components/ui/button";
import type { EmptyStateProps, SuccessStateProps } from "@/utils/types/files";
import { AlertCircle, FileCheck, Upload, X } from "lucide-react";

export const EmptyState = ({ fileType, isDragActive }: EmptyStateProps) => {
	return (
		<>
			<section className="rounded-full bg-primary/10 p-3">
				<Upload className="h-6 w-6 text-primary" />
			</section>
			<section className="space-y-1">
				<p className="text-sm font-medium text-foreground">
					{isDragActive ? "Suelta el archivo aquí" : `Subir ${fileType.name}`}
				</p>
				<p className="text-xs text-muted-foreground">Arrastra y suelta o haz clic para seleccionar</p>
			</section>
		</>
	)
}

export const SuccessState = ({ uploadedFile, onRemove }: SuccessStateProps) => (
	<>
		<div className="rounded-full bg-success/10 p-3">
			<FileCheck className="h-6 w-6 text-success" />
		</div>
		<div className="space-y-1 flex-1">
			<p className="text-sm font-medium text-foreground">{uploadedFile.file.name}</p>
			<p className="text-xs text-success">{uploadedFile.data.length} registros cargados</p>
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
);

export const ErrorState = ({ uploadedFile, onRemove }: SuccessStateProps) => (
	<>
		<div className="rounded-full bg-destructive/10 p-3">
			<AlertCircle className="h-6 w-6 text-destructive" />
		</div>
		<div className="space-y-1 flex-1">
			<p className="text-sm font-medium text-foreground">{uploadedFile.file.name}</p>
			<div className="space-y-1">
				{uploadedFile.errors.map((error, idx) => (
					<p key={idx} className="text-xs text-destructive">{error}</p>
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
);
