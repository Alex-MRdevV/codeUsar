import { Edit, Trash } from "lucide-react";

interface EditDeleteButtonsProps {
	onEdit?: () => void;
	onDelete?: () => void;
}

export function EditDeleteButtons({ onEdit, onDelete }: EditDeleteButtonsProps) {
	return (
		<div className="flex gap-2">
			{onEdit && (
				<button
					onClick={onEdit}
					className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium flex items-center gap-2 transition-colors"
				>
					<Edit className="w-4 h-4" />
					Editar
				</button>
			)}
			{onDelete && (
				<button
					onClick={onDelete}
					className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex items-center gap-2 transition-colors"
				>
					<Trash className="w-4 h-4" />
					Eliminar
				</button>
			)}
		</div>
	);
}
