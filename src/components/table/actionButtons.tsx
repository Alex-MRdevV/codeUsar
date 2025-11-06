import { Download, Plus, Upload } from "lucide-react";

interface ActionsButtonsProps {
	onAdd?: () => void;
	onImport?: () => void;
	onExport?: () => void;
}

export function ActionsButtons({
	onAdd,
	onImport,
	onExport,
}: ActionsButtonsProps) {
	return (
		<div className="flex gap-2">
			{onAdd && (
				<button
					onClick={onAdd}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center gap-2 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Nuevo
				</button>
			)}
			{onImport && (
				<button
					onClick={onImport}
					className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-medium flex items-center gap-2 transition-colors"
				>
					<Upload className="w-4 h-4" />
					Importar
				</button>
			)}
			{onExport && (
				<button
					onClick={onExport}
					className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-medium flex items-center gap-2 transition-colors"
				>
					<Download className="w-4 h-4" />
					Exportar
				</button>
			)}
		</div>
	);
}
