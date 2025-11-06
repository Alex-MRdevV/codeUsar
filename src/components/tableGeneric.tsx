import { ActionBar } from "@/components/table/actionBar";
import { ActionsButtons } from "@/components/table/actionButtons";
import { TableData } from "@/components/table/tableData";
import type { ColumnDef, GenericDataTableProps } from "@/utils/types/table";
import { useCallback, useMemo, useState } from "react";
import { PaginationAplicada } from "@/components/paginar";
import { useSearchWithDebounce } from "@/hooks/common/use-searchDebounce";
import type { SearchableItem } from "@/utils/types/common";

export function GenericDataTable<T extends SearchableItem>({
	data = [],
	columns = [],
	searchColumn,
	searchPlaceholder = "Buscar...",
	title,
	description,
	onAdd,
	onImport,
	onExport,
	showActions = true,
	pageSize = 10,
}: GenericDataTableProps<T>) {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [sortConfig, setSortConfig] = useState<{
		key: string | null;
		direction: "asc" | "desc" | null;
	}>({ key: null, direction: null });
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [hiddenColumns, setHiddenColumns] = useState<Set<keyof T>>(new Set());

	// Usar el hook de búsqueda con debounce
	const searchResults = useSearchWithDebounce(
		searchTerm,
		data,
		searchColumn as keyof T,
		300
	);

	// Filtrar datos: usa searchResults si hay término de búsqueda, sino usa todos los datos
	const filteredData = useMemo(() => {
		if (!searchTerm || !searchColumn) return data;
		return searchResults;
	}, [data, searchTerm, searchColumn, searchResults]);

	// Ordenar datos
	const sortedData = useMemo(() => {
		if (!sortConfig.key) return filteredData;

		return [...filteredData].sort((a, b) => {
			const aValue = a[sortConfig.key];
			const bValue = b[sortConfig.key];

			if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
			if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredData, sortConfig]);

	// Paginar datos
	const paginatedData = useMemo(() => {
		const start = currentPage * pageSize;
		return sortedData.slice(start, start + pageSize);
	}, [sortedData, currentPage, pageSize]);

	// Calcular total de páginas
	const totalPages = Math.ceil(sortedData.length / pageSize);

	// Manejar ordenamiento
	const handleSort = useCallback(
		(key: keyof T) => {
			setSortConfig((prev) => {
				if (prev.key === key) {
					if (prev.direction === "asc") return { key, direction: "desc" };
					if (prev.direction === "desc") return { key: null, direction: null };
				}
				return { key, direction: "asc" };
			});
		},
		[setSortConfig]
	);

	// Columnas visibles
	const visibleColumns = useMemo(
		() => columns.filter((col) => !hiddenColumns.has(col.accessorKey)),
		[columns, hiddenColumns]
	);

	// Renderizar celda
	const renderCell = useCallback(
		(row: T, column: ColumnDef<T>) => {
			if (column.cell) {
				return column.cell({ row: { getValue: (key) => row[key], original: row } });
			}
			return String(row[column.accessorKey] ?? "");
		},
		[]
	);

	// Renderizar header
	const renderHeader = useCallback(
		(column: ColumnDef<T>) => {
			if (typeof column.header === "function") {
				return column.header({
					column: {
						toggleSorting: () => handleSort(column.accessorKey),
						getIsSorted: () => {
							if (sortConfig.key !== column.accessorKey) return false;
							return sortConfig.direction || false;
						},
					},
				});
			}
			return column.header;
		},
		[handleSort, sortConfig]
	);

	return (
		<div className="w-full space-y-4">
			{/* Header */}
			{(title || description) && (
				<div>
					{title && <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h1>}
					{description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}
				</div>
			)}

			{/* Actions Bar */}
			<ActionBar
				showActions={showActions}
				searchColumn={!!searchColumn}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				setCurrentPage={setCurrentPage}
				searchPlaceholder={searchPlaceholder}
			/>

			{/* Action Buttons */}
			<ActionsButtons onAdd={onAdd} onImport={onImport} onExport={onExport} />

			{/* Table */}
			<TableData
				visibleColumns={visibleColumns}
				paginatedData={paginatedData}
				renderHeader={renderHeader}
				renderCell={renderCell}
			/>

			{/* Pagination */}
			<PaginationAplicada
				currentPage={currentPage + 1} // Ajustar para que sea 1-based
				totalPages={totalPages}
				onPageChange={(page) => setCurrentPage(page - 1)} // Ajustar para que sea 0-based
			/>
		</div>
	);
}
