import { TemplatePreview } from "@/components/files/previewTemplates";
import { FileUploadZone } from "@/components/files/uploadZone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ExcelFileType, UploadedFile } from "@/utils/types/files";

export const FileTabs = ({
	fileTypes,
	uploadedFiles,
	isProcessing,
	onFileSelect,
	onRemoveFile,
}: {
	fileTypes: ExcelFileType[];
	uploadedFiles: Map<string, UploadedFile>;
	isProcessing: boolean;
	onFileSelect: (file: File, id: string) => void;
	onRemoveFile: (id: string) => void;
}) => (
	<Tabs defaultValue={fileTypes[0].id} className="space-y-6">
		<TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-muted/50 p-1">
			{fileTypes.map((fileType) => {
				const uploaded = uploadedFiles.get(fileType.id);
				return (
					<TabsTrigger
						key={fileType.id}
						value={fileType.id}
						className="relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
					>
						{fileType.name}
						{uploaded?.isValid && (
							<span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-success" />
						)}
					</TabsTrigger>
				);
			})}
		</TabsList>

		{fileTypes.map((fileType) => (
			<TabsContent key={fileType.id} value={fileType.id} className="space-y-6">
				<section className="grid gap-6 lg:grid-cols-2">
					<TemplatePreview fileType={fileType} />
					<FileUploadZone
						fileType={fileType}
						uploadedFile={uploadedFiles.get(fileType.id)}
						onFileSelect={(file) => onFileSelect(file, fileType.id)}
						onRemove={() => onRemoveFile(fileType.id)}
						disabled={isProcessing}
					/>
				</section>
			</TabsContent>
		))}
	</Tabs>
);
