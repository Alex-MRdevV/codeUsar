import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { ViewPasswordInput } from "@/components/viewPassword";
import { type FormValuesCreate } from "@/lib/schemas/user/register";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";

interface CreateUserTabProps {
	form: UseFormReturn<FormValuesCreate>;
	onSubmit: SubmitHandler<FormValuesCreate>;
	isLoading: boolean;
}
export const CreateUserTab = ({ form, onSubmit, isLoading }: CreateUserTabProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = form;

	return (
		<TabsContent value="create" className="space-y-4 mt-6">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="create-nombre">Nombre</Label>
					<Input
						id="create-nombre"
						placeholder="Juan Pérez"
						disabled={isLoading}
						{...register("nombre")}
					/>
					{errors.nombre && (
						<p className="text-sm text-destructive">{errors.nombre.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="create-email" className="text-gray-700 dark:text-gray-300">
						Correo electrónico
					</Label>
					<Input
						type="email"
						placeholder="juan@example.com"
						id="create-email"
						disabled={isLoading}
						{...register("email")}
						className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
					/>
					{errors.email?.message && (
						<p className="text-sm text-red-600 dark:text-red-400 pt-1 max-w-xs overflow-hidden text-ellipsis">
							{errors.email.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="create-rol">Rol</Label>
					<select
						id="create-rol"
						disabled={isLoading}
						{...register("rol")}
						className="w-full h-10 px-3 rounded-md border border-input bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
					>
						<option value="user">Usuario</option>
					</select>
					{errors.rol && (
						<p className="text-sm text-destructive">{errors.rol.message}</p>
					)}
				</div>

				<ViewPasswordInput
					htmlForNombre="create-password"
					labelNombre="Contraseña"
					placeholder="Escribe tu contraseña"
					register={register}
					errors={errors}
					valueRegister="password"
					resetPassword={false}
				/>

				<ViewPasswordInput
					htmlForNombre="create-confirmPassword"
					labelNombre="Confirmar Contraseña"
					placeholder="Confirma tu contraseña"
					register={register}
					errors={errors}
					valueRegister="confirmPassword"
					resetPassword={false}
				/>

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Creando..." : "Crear Usuario"}
				</Button>
			</form>
		</TabsContent>
	);
};
