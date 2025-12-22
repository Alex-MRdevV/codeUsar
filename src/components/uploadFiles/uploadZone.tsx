import { Upload, File, X } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
	label: string;
	onFileChange: (file: File | null) => void;
	file: File | null;
}

export const FileUploadZone = ({ label, onFileChange, file }: FileUploadZoneProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile && isValidExcelFile(droppedFile)) {
			onFileChange(droppedFile);
		}
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile && isValidExcelFile(selectedFile)) {
			onFileChange(selectedFile);
		}
	};

	const isValidExcelFile = (file: File) => {
		const validTypes = [
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'text/csv'
		];
		const validExtensions = ['.xlsx', '.xls', '.csv', 'xlsm'];

		return validTypes.includes(file.type) ||
			validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
	};

	const removeFile = () => {
		onFileChange(null);
		if (inputRef.current) {
			inputRef.current.value = '';
		}
	};

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium text-foreground">
				{label}
			</label>

			{!file ? (
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={() => inputRef.current?.click()}
					className={cn(
						"relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer",
						"hover:border-primary hover:bg-primary/5",
						isDragging ? "border-primary bg-primary/10" : "border-border"
					)}
				>
					<input
						ref={inputRef}
						type="file"
						accept=".xlsx,.xls,.csv, .xlsm"
						onChange={handleFileInput}
						className="hidden"
					/>

					<div className="flex flex-col items-center gap-3 text-center">
						<div className="p-3 rounded-full bg-secondary">
							<Upload className="w-6 h-6 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium text-foreground">
								Arrastra tu archivo aquí o haz clic para seleccionar
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								Formatos aceptados: .xlsx, .xls, .csv
							</p>
						</div>
					</div>
				</div>
			) : (
				<div className="border border-border rounded-lg p-4 bg-card">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-success/10">
								<File className="w-5 h-5 text-success" />
							</div>
							<div>
								<p className="text-sm font-medium text-foreground">
									{file.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{(file.size / 1024).toFixed(2)} KB
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={removeFile}
							className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
