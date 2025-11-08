import { PaginationAplicada } from "@/components/paginar";
import { TableData } from "@/components/table/tableData";
import type { PaginatedTableProps } from "@/utils/types/table";
import { useMemo, useState } from "react";

export const PaginatedTable = <T extends { id?: string | number }>({
	columns,
	data,
	renderCell,
	renderHeader,
	enableHiddenColumns = false,
	classNames = {},
	emptyStateMessage = 'No se encontraron resultados.',
	itemsPerPage = 10,
	showPagination = true,
}: PaginatedTableProps<T>) => {
	const [currentPage, setCurrentPage] = useState(1);

	// Calcular datos paginados
	const paginatedData = useMemo(() => {
		if (!showPagination) return data;

		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return data.slice(startIndex, endIndex);
	}, [data, currentPage, itemsPerPage, showPagination]);

	// Calcular total de páginas
	const totalPages = useMemo(() => {
		return Math.ceil(data.length / itemsPerPage);
	}, [data.length, itemsPerPage]);

	useMemo(() => {
		setCurrentPage(1);
	}, [data.length]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Opcional: scroll hacia arriba al cambiar de página
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className="space-y-4">
			<TableData
				columns={columns}
				data={paginatedData}
				renderCell={renderCell}
				renderHeader={renderHeader}
				enableHiddenColumns={enableHiddenColumns}
				classNames={classNames}
				emptyStateMessage={emptyStateMessage}
			/>

			{showPagination && totalPages > 1 && (
				<div className={classNames.paginationWrapper || 'flex justify-center mt-4'}>
					<PaginationAplicada
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			)}

			{/* Opcional: Mostrar información de registros */}
			{showPagination && data.length > 0 && (
				<div className="text-sm text-gray-600 text-center">
					Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, data.length)} de {data.length} resultados
				</div>
			)}
		</div>
	);
};
