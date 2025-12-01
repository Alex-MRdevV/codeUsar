import { EmptyState, ErrorState, SuccessState } from "@/components/files/emptyState";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FileUploadZoneProps } from "@/utils/types/file";
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
		<Card {...getRootProps()} className={cn("border-2 border-dashed transition-all cursor-pointer")}>
			<CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
				<input {...getInputProps()} />
				{!uploadedFile && <EmptyState fileType={fileType} isDragActive={isDragActive} />}
				{uploadedFile?.isValid && <SuccessState uploadedFile={uploadedFile} onRemove={onRemove} />}
				{uploadedFile && !uploadedFile.isValid && <ErrorState uploadedFile={uploadedFile} onRemove={onRemove} />}
			</CardContent>
		</Card>
	);
}
