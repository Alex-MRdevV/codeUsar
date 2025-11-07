import type { ColumnVisibilityToggleProps } from "@/utils/types/table";
import { useEffect, useRef, useState } from "react";

export function ColumnVisibilityToggle<T>({
	columns,
	hiddenColumns,
	setHiddenColumns,
}: ColumnVisibilityToggleProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Cerrar al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleColumn = (key: keyof T) => {
		setHiddenColumns((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(key)) {
				newSet.delete(key);
			} else {
				newSet.add(key);
			}
			return newSet;
		});
	};

	const visibleCount = columns.length - hiddenColumns.size;

	return (
		<div className="relative inline-block" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
				</svg>
				<span>Columnas ({visibleCount})</span>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
					<div className="p-2">
						<div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">
							Mostrar/Ocultar Columnas
						</div>
						{columns.map((column) => {
							const isVisible = !hiddenColumns.has(column.accessorKey as keyof T);
							const headerText = typeof column.header === "string"
								? column.header
								: String(column.accessorKey);

							return (
								<label
									key={String(column.accessorKey)}
									className="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors"
								>
									<input
										type="checkbox"
										checked={isVisible}
										onChange={() => toggleColumn(column.accessorKey as keyof T)}
										className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
									/>
									<span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
										{headerText}
									</span>
								</label>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
