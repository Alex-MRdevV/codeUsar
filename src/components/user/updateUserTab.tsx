import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { ViewPasswordInput } from "@/components/viewPassword";
import { type FormValuesUpdate } from "@/lib/schemas/user/register";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";

interface UpdateUserTabProps {
	form: UseFormReturn<FormValuesUpdate>;
	onSubmit: SubmitHandler<FormValuesUpdate>;
	isLoading: boolean;
}

export const UpdateUserTab = ({ form, onSubmit, isLoading }: UpdateUserTabProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = form;

	return (
		<TabsContent value="update" className="space-y-4 mt-6">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="update-id">ID de Usuario</Label>
					<Input
						id="update-id"
						placeholder="ID del usuario a actualizar"
						disabled={isLoading}
						{...register("id")}
					/>
					{errors.id && (
						<p className="text-sm text-destructive">{errors.id.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="update-nombre">Nombre</Label>
					<Input
						id="update-nombre"
						placeholder="Juan Pérez"
						disabled={isLoading}
						{...register("nombre")}
					/>
					<p className="text-sm text-muted-foreground">
						Deja vacío si no deseas cambiar
					</p>
					{errors.nombre && (
						<p className="text-sm text-destructive">{errors.nombre.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="update-email" className="text-gray-700 dark:text-gray-300">
						Correo electrónico
					</Label>
					<Input
						type="email"
						placeholder="juan@example.com"
						id="update-email"
						disabled={isLoading}
						{...register("email")}
						className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
					/>
					<p className="text-sm text-muted-foreground">
						Deja vacío si no deseas cambiar
					</p>
					{errors.email?.message && (
						<p className="text-sm text-red-600 dark:text-red-400 pt-1 max-w-xs overflow-hidden text-ellipsis">
							{errors.email.message}
						</p>
					)}
				</div>

				<ViewPasswordInput
					htmlForNombre="update-password"
					labelNombre="Nueva Contraseña"
					placeholder="Escribe tu nueva contraseña (opcional)"
					register={register}
					errors={errors}
					valueRegister="password"
					resetPassword={false}
				/>

				<div className="pt-2">
					<p className="text-sm text-muted-foreground mb-4">
						Los campos son opcionales. Completa solo los que deseas actualizar.
					</p>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Actualizando..." : "Actualizar Usuario"}
					</Button>
				</div>
			</form>
		</TabsContent>
	);
};
