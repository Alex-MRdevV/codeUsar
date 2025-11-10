import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfigurarRegister } from "@/components/user/configurarRegister";
import { ConfigurarUpdate } from "@/components/user/configurarUpdate";
import { CreateUserTab } from "@/components/user/createUserTab";
import { UpdateUserTab } from "@/components/user/updateUserTab";
import { registerSchema, updateSchema, type FormValuesCreate, type FormValuesUpdate } from "@/lib/schemas/user/register";
import { registerResponse } from "@/utils/services/user/register";
import { updateResponse } from "@/utils/services/user/update";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

export const UserForms = () => {
	const { createHandler, isSubmitting: isCreating } = ConfigurarRegister();
	const { createHandler: createHandlerUpdate, isSubmitting: isUpdating } = ConfigurarUpdate();

	// Form for creating users - Obtener el form completo
	const createForm = useForm<FormValuesCreate>({
		resolver: valibotResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			nombre: "",
			rol: "user",
		},
	});

	// Form for updating users - Obtener el form completo
	const updateForm = useForm<FormValuesUpdate>({
		resolver: valibotResolver(updateSchema),
		defaultValues: {
			id: "",
			nombre: "",
			email: "",
			password: "",
		},
	});

	const onCreateSubmit = createHandler(async (data: FormValuesCreate) => {
		const response = await registerResponse(data);

		if (!response[0]) {
			// Reset form on success
			createForm.reset();
		}

		return response;
	});

	const onUpdateSubmit = createHandlerUpdate(async (data: FormValuesUpdate) => {
		// Filtra solo los campos que tienen valor (excepto id que siempre se incluye)
		const updateData = Object.fromEntries(
			Object.entries(data).filter(([key, value]) => {
				if (key === 'id') return true;
				return value !== undefined && value !== "";
			})
		) as FormValuesUpdate;

		const response = await updateResponse(updateData);

		if (!response[0]) {
			// Reset form on success
			updateForm.reset();
		}

		return response;
	});

	return (
		<div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
			<div className="w-full max-w-2xl">
				<Card className="shadow-lg mt-[87px]">
					<CardHeader>
						<CardTitle className="text-2xl">Gestión de Usuarios</CardTitle>
						<CardDescription>
							Crea nuevos usuarios o actualiza tus datos
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="create" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="create">Crear Usuario</TabsTrigger>
								<TabsTrigger value="update">Actualizar Usuario</TabsTrigger>
							</TabsList>

							{/* Create User Tab */}
							<CreateUserTab
								form={createForm}
								onSubmit={onCreateSubmit}
								isLoading={isCreating}
							/>

							{/* Update User Tab */}
							<UpdateUserTab
								form={updateForm}
								onSubmit={onUpdateSubmit}
								isLoading={isUpdating}
							/>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
