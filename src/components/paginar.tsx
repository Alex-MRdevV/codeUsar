import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationAplicadaProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const PaginationAplicada: React.FC<PaginationAplicadaProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						className={
							currentPage === 1
								? "opacity-50 pointer-events-none"
								: ""
						}
						onClick={(e) => {
							e.preventDefault();
							if (currentPage > 1) onPageChange(currentPage - 1);
						}}
					>
						Anterior
					</PaginationPrevious>
				</PaginationItem>

				{/* Números de página */}
				{pages.map((page) => (
					<PaginationItem key={page}>
						<PaginationLink
							href="#"
							isActive={page === currentPage}
							onClick={(e) => {
								e.preventDefault();
								onPageChange(page);
							}}
						>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}

				{/* Elipsis si hay muchas páginas */}
				{totalPages > 5 && currentPage < totalPages - 2 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{/* Botón "Siguiente" */}
				<PaginationItem>
					<PaginationNext
						href="#"
						className={
							currentPage === totalPages
								? "opacity-50 pointer-events-none"
								: ""
						}
						onClick={(e) => {
							e.preventDefault();
							if (currentPage < totalPages) onPageChange(currentPage + 1);
						}}
					>
						Siguiente
					</PaginationNext>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
