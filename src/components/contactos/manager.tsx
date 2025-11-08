import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { PaginatedTable } from "@/components/table/tablaPaginada";
import { Actions } from "@/components/contactos/actions";
import { GruposSection } from "@/components/contactos/grupos";

interface Contact {
	id: string;
	name: string;
	phone: string;
	email: string;
	group: string;
}

interface Group {
	id: string;
	cantidadContactos: string;
	nombre: string;
}

interface Stats {
	label: string;
	value: string;
}

interface Props {
	contacts: Contact[];
	groups: Group[];
	stats: Stats[];
	onAddContact: () => void;
	onImportContacts: () => void;
	onExportContacts: () => void;
	onViewGroup: (groupId: string) => void;
	onEditGroup: (groupId: string) => void;
}

export const ManagerContactos = ({
	contacts,
	groups,
	stats,
	onAddContact,
	onImportContacts,
	onExportContacts,
	onViewGroup,
	onEditGroup,
}: Props) => {
	const [searchTerm, setSearchTerm] = useState("");

	// Filtrar contactos según el término de búsqueda
	const filteredContacts = useMemo(() => {
		return contacts.filter(
			(contact) =>
				contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
				contact.email.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [contacts, searchTerm]);

	// Definir columnas para la tabla
	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Nombre",
				cell: ({ row }: { row: { getValue: (key: string) => string } }) => (
					<span className="text-sm text-foreground font-medium">
						{row.getValue("name")}
					</span>
				),
			},
			{
				accessorKey: "phone",
				header: "Teléfono",
				cell: ({ row }: { row: { getValue: (key: string) => string } }) => (
					<span className="text-sm text-muted-foreground">
						{row.getValue("phone")}
					</span>
				),
			},
			{
				accessorKey: "email",
				header: "Email",
				cell: ({ row }: { row: { getValue: (key: string) => string } }) => (
					<span className="text-sm text-muted-foreground">
						{row.getValue("email")}
					</span>
				),
			},
			{
				accessorKey: "group",
				header: "Grupo",
				cell: ({ row }: { row: { getValue: (key: string) => string } }) => (
					<span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
						{row.getValue("group")}
					</span>
				),
			},
			{
				accessorKey: "actions",
				header: "Acciones",
				cell: ({ row }: { row: { original: Contact } }) => (
					<div className="flex justify-end gap-2">
						<button
							className="text-primary hover:bg-primary/10 p-2 rounded"
							onClick={() => console.log("Edit", row.original.id)}
						>
							Editar
						</button>
						<button
							className="text-destructive hover:bg-destructive/10 p-2 rounded"
							onClick={() => console.log("Delete", row.original.id)}
						>
							Eliminar
						</button>
					</div>
				),
			},
		],
		[]
	);

	return (
		<>
			{/* Sección de estadísticas */}
			<section className="mb-8">
				<h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">
					Gestión de Contactos
				</h1>
				<p className="text-muted-foreground dark:text-muted-foreground-dark">
					Administra tus contactos y grupos de distribución
				</p>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
				{stats.map((stat, idx) => (
					<Card
						key={idx}
						className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-4"
					>
						<p className="text-muted-foreground dark:text-muted-foreground-dark text-sm mb-2">
							{stat.label}
						</p>
						<p className="text-2xl font-bold text-foreground dark:text-foreground-dark">
							{stat.value}
						</p>
					</Card>
				))}
			</section>

			{/* Acciones */}
			<Actions
				onAddContact={onAddContact}
				onImportContacts={onImportContacts}
				onExportContacts={onExportContacts}
			/>

			{/* Tabla paginada */}
			<PaginatedTable
				columns={columns}
				data={filteredContacts}
				renderCell={(row, column) => column.cell?.({ row }) ?? null}
				renderHeader={(column) => column.header}
				itemsPerPage={10}
				enableHiddenColumns={false}
				emptyStateMessage="No se encontraron contactos."
			/>

			{/* Grupos de distribución */}
			<GruposSection
				data={groups}
				onView={onViewGroup}
				onEdit={onEditGroup}
			/>
		</>
	);
};
