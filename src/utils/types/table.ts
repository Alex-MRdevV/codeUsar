import type { ReactNode } from "react";

export interface ActionBarProps {
	showActions: boolean;
	searchColumn?: boolean;
	searchTerm?: string;
	setSearchTerm?: (value: string) => void;
	setCurrentPage?: (page: number) => void;
	searchPlaceholder?: string;
}

export interface PaginatedTableProps<T extends { id?: string | number }> {
	columns: ColumnDef<T>[];
	data: T[];
	renderCell: (row: T, column: ColumnDef<T>) => React.ReactNode;
	renderHeader?: (column: ColumnDef<T>) => React.ReactNode;
	enableHiddenColumns?: boolean;
	classNames?: {
		container?: string;
		wrapper?: string;
		table?: string;
		theadRow?: string;
		th?: string;
		tbody?: string;
		tbodyRow?: string;
		td?: string;
		emptyState?: string;
		paginationWrapper?: string;
	};
	emptyStateMessage?: string;
	itemsPerPage?: number;
	showPagination?: boolean;
}

export const ALIGN_CLASSES = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
} as const;

export const DEFAULT_CLASSES = {
	container:
		"bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden",
	wrapper: "overflow-x-auto",
	table: "w-full",
	theadRow:
		"border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900",
	th: "px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100",
	tbodyRow:
		"border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
	td: "px-6 py-4 text-sm text-gray-900 dark:text-gray-100",
	emptyState: "h-24 text-center text-gray-500 dark:text-gray-400",
} as const;

export interface ColumnVisibilityToggleProps<T> {
	columns: ColumnDef<T>[];
	hiddenColumns: Set<keyof T>;
	setHiddenColumns: React.Dispatch<React.SetStateAction<Set<keyof T>>>;
}

export interface ColumnDef<T> {
	accessorKey: keyof T;
	header: string | ((context: { column: ColumnContext }) => React.ReactNode);
	cell?: (context: { row: RowContext<T> }) => React.ReactNode;
	align?: "left" | "center" | "right";
	hidden?: boolean;
}

export interface TableDataProps<T> {
	columns: ColumnDef<T>[];
	data: T[];
	renderCell: (row: T, column: ColumnDef<T>) => ReactNode;
	renderHeader?: (column: ColumnDef<T>) => ReactNode;
	enableHiddenColumns?: boolean;
	classNames?: {
		container?: string;
		wrapper?: string;
		table?: string;
		thead?: string;
		theadRow?: string;
		th?: string;
		tbody?: string;
		tbodyRow?: string;
		td?: string;
		emptyState?: string;
	};
	emptyStateMessage?: string;
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
