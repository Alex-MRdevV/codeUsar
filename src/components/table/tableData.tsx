import type { ColumnDef } from "@/utils/types/table";
import type { ReactNode } from "react";

interface TableDataProps<T> {
	visibleColumns: ColumnDef<T>[];
	paginatedData: T[];
	renderHeader: (column: ColumnDef<T>) => ReactNode;
	renderCell: (row: T, column: ColumnDef<T>) => ReactNode;
}

export const TableData = <T extends { id?: string | number }>({
	visibleColumns,
	paginatedData,
	renderHeader,
	renderCell,
}: TableDataProps<T>) => {
	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
							{visibleColumns.map((column) => (
								<th
									key={column.accessorKey as string}
									className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
								>
									{renderHeader(column)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{paginatedData.length > 0 ? (
							paginatedData.map((row, idx) => (
								<tr
									key={row.id || idx}
									className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									{visibleColumns.map((column) => (
										<td
											key={column.accessorKey as string}
											className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
										>
											{renderCell(row, column)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={visibleColumns.length}
									className="h-24 text-center text-gray-500 dark:text-gray-400"
								>
									No se encontraron resultados.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
