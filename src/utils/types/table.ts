export interface ColumnDef<T> {
	accessorKey: keyof T;
	header: string | ((context: { column: ColumnContext }) => React.ReactNode);
	cell?: (context: { row: RowContext<T> }) => React.ReactNode;
}

export interface ColumnContext {
	toggleSorting: () => void;
	getIsSorted: () => false | "asc" | "desc";
}

export interface RowContext<T> {
	getValue: (key: keyof T) => any;
	original: T;
}

export interface GenericDataTableProps<T> {
	data: T[];
	columns: ColumnDef<T>[];
	searchColumn?: keyof T;
	searchPlaceholder?: string;
	title?: string;
	description?: string;
	onAdd?: () => void;
	onImport?: () => void;
	onExport?: () => void;
	showActions?: boolean;
	pageSize?: number;
}
