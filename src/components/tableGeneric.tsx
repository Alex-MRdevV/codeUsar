import { PaginationAplicada } from "@/components/paginar";
import { ActionBar } from "@/components/table/actionBar";
import { ActionsButtons } from "@/components/table/actionButtons";
import { ColumnVisibilityToggle } from "@/components/table/hiddenColumns";
import { TableData } from "@/components/table/tableData";
import { useSearchWithDebounce } from "@/hooks/common/use-searchDebounce";
import type { SearchableItem } from "@/utils/types/common";
import type { ColumnDef, GenericDataTableProps } from "@/utils/types/table";
import { useCallback, useMemo, useState } from "react";

interface Prev<T> {
	key: keyof T | null;
	direction: "asc" | "desc" | null;
}

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
	const [sortConfig, setSortConfig] = useState<Prev<T>>({
		key: null,
		direction: null,
	});
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [hiddenColumns, setHiddenColumns] = useState<Set<keyof T>>(new Set());
	const searchResults = useSearchWithDebounce(
		searchTerm,
		data,
		searchColumn as keyof T,
		300
	);

	const dataToSort = (searchTerm && searchColumn) ? searchResults : data;
	const sortedData = useMemo(() => {
		if (!sortConfig.key) return dataToSort;

		return [...dataToSort].sort((a, b) => {
			const aValue = a[sortConfig.key!];
			const bValue = b[sortConfig.key!];

			if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
			if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
	}, [dataToSort, sortConfig]);

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
			setSortConfig((prev: Prev<T>) => {
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

			{/* Actions Bar con el nuevo componente */}
			<div className="flex items-center justify-between gap-4">
				<ActionBar
					showActions={showActions}
					searchColumn={!!searchColumn}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					setCurrentPage={setCurrentPage}
					searchPlaceholder={searchPlaceholder}
				/>

				{/* ✅ AGREGAR: Toggle de visibilidad de columnas */}
				<ColumnVisibilityToggle
					columns={columns}
					hiddenColumns={hiddenColumns}
					setHiddenColumns={setHiddenColumns}
				/>
			</div>

			<ActionsButtons onAdd={onAdd} onImport={onImport} onExport={onExport} />

			{/* ✅ USAR visibleColumns */}
			<TableData
				visibleColumns={visibleColumns}
				paginatedData={paginatedData}
				renderHeader={renderHeader}
				renderCell={renderCell}
			/>

			<PaginationAplicada
				currentPage={currentPage + 1}
				totalPages={totalPages}
				onPageChange={(page) => setCurrentPage(page - 1)}
			/>
		</div>
	);
}
