import { ALIGN_CLASSES, type ColumnDef, DEFAULT_CLASSES, type TableDataProps } from "@/utils/types/table";

export const TableData = <T extends { id?: string | number }>({
	columns,
	data,
	renderCell,
	renderHeader,
	enableHiddenColumns = false,
	classNames = {},
	emptyStateMessage = 'No se encontraron resultados.',
}: TableDataProps<T>) => {
	const visibleColumns = enableHiddenColumns
		? columns.filter(col => !col.hidden)
		: columns;

	const getClassName = (key: keyof typeof DEFAULT_CLASSES) =>
		classNames[key] || DEFAULT_CLASSES[key];

	const getAlignClass = (align: ColumnDef<T>['align'] = 'left') =>
		ALIGN_CLASSES[align];

	const renderHeaderContent = (column: ColumnDef<T>) =>
		renderHeader ? renderHeader(column) : column.header;

	return (
		<div className={getClassName('container')}>
			<div className={getClassName('wrapper')}>
				<table className={getClassName('table')}>
					<thead>
						<tr className={getClassName('theadRow')}>
							{visibleColumns.map(column => (
								<th
									key={column.accessorKey}
									className={`${getClassName('th')} ${getAlignClass(column.align)}`}
								>
									{renderHeaderContent(column)}
								</th>
							))}
						</tr>
					</thead>
					<tbody className={classNames.tbody}>
						{data.length > 0 ? (
							data.map((row, idx) => (
								<tr
									key={row.id ?? idx}
									className={getClassName('tbodyRow')}
								>
									{visibleColumns.map(column => (
										<td
											key={column.accessorKey as keyof T}
											className={`${getClassName('td')} ${getAlignClass(column.align)}`}
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
									className={getClassName('emptyState')}
								>
									{emptyStateMessage}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
