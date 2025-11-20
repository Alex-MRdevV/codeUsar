import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ExcelFileType } from "@/utils/types/file";
import { AlertCircle, FileSpreadsheet } from "lucide-react";

interface ExcelTemplatePreviewProps {
	fileType: ExcelFileType;
}

export const TemplatePreview = ({ fileType }: ExcelTemplatePreviewProps) => {
	return (
		<Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
			<CardHeader className="space-y-1 pb-4">
				<div className="flex items-center gap-2">
					<FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
					<CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
						{fileType.name}
					</CardTitle>
				</div>
				<CardDescription className="text-sm text-slate-600 dark:text-slate-400">
					{fileType.description}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Nota sobre propiedades ignoradas */}
				<section className={`rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30`}>
					<div className="flex gap-2">
						<AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
						<div className={`text-sm text-amber-800 dark:text-amber-200`}>
							Solo las columnas requeridas serán procesadas. Las demás propiedades presentes en el archivo serán ignoradas.
						</div>
					</div>
				</section>

				{/* Columnas requeridas */}
				<section className="space-y-2">
					<p className="text-sm font-medium text-slate-900 dark:text-slate-100">
						Columnas requeridas:
					</p>
					<div className="flex flex-wrap gap-2">
						{fileType.requiredColumns.map((column) => (
							<Badge key={column} variant="secondary" className="text-xs">
								{column}
							</Badge>
						))}
					</div>
				</section>

				{/* Ejemplo de datos */}
				<section className="space-y-2">
					<p className="text-sm font-medium text-slate-900 dark:text-slate-100">
						Ejemplo de datos:
					</p>
					<div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/50">
									{fileType.requiredColumns.map((column) => (
										<TableHead key={column} className="font-semibold text-xs">
											{column}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{fileType.exampleData.map((row, idx) => (
									<TableRow key={idx} className="text-xs">
										{fileType.requiredColumns.map((column) => (
											<TableCell key={column} className="py-2">
												{row[column]}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</section>
			</CardContent>
		</Card>
	);
}
