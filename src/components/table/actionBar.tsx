import { Search } from "lucide-react";
import React from "react";

interface ActionBarProps {
	showActions: boolean;
	searchColumn?: boolean;
	searchTerm?: string;
	setSearchTerm?: (value: string) => void;
	setCurrentPage?: (page: number) => void;
	searchPlaceholder?: string;
}

export const ActionBar: React.FC<ActionBarProps> = ({
	showActions,
	searchColumn = false,
	searchTerm = "",
	setSearchTerm = () => { },
	setCurrentPage = () => { },
	searchPlaceholder = "Buscar...",
}) => {
	if (!showActions) return null;

	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Search Input */}
				{searchColumn && (
					<div className="flex-1 relative">
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
							aria-hidden="true"
						/>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(0); // Reinicia la paginación al buscar
							}}
							placeholder={searchPlaceholder}
							className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
							aria-label="Buscar"
						/>
					</div>
				)}
			</div>
		</div>
	);
};
