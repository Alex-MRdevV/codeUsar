import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginResponse } from "@/lib/auth/authUsersApi";
import { rolesUtilizar } from "@/schemas/auth/roles";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { userLogin } from "@/lib/typesForAuth";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Toaster, toast } from "sonner";
import type { InputEmailProps } from "@/utils/types/common";
import { useRedirigir } from "@/hooks/common/use-redirigir";
import {ViewPasswordInput} from "@/"

export function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InputEmailProps>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rol: "",
		},
	});

	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	const roles = Object.entries(rolesUtilizar).map(([key, value]) => (
		<option key={key} value={value}>

		</option>
	));

	// Usar el hook para redirigir al usuario


	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const loadingToast = toast.loading("Iniciando sesión...");
		const [err, userAccess] = await loginResponse(data);

		toast.dismiss(loadingToast);

		if (err) {
			setMessage(err);
			toast.error(err.message);
		} else if (userAccess) {
			setUser(userAccess);
			setMessage(userAccess);
			toast.success("Inicio de sesión exitoso!");
		}
	};

	return (
		<div className="flex justify-center p-4 flex-row min-h-[90vh] mx-auto px-[100px] pt-[550px] space-x-16 items-center">
			<Card className="shadow-2xl max-w-md w-full">
				{ }
				<CardHeader className="text-center">
					{message && (
						<div
							className={`p-4 mb-4 rounded text-center max-w-md w-full ${message instanceof Error
									? "bg-red-100 text-red-700"
									: "bg-green-100 text-green-700"
								}`}
						>
							{message instanceof Error
								? message.message
								: "Inicio de sesión exitoso!"}
						</div>
					)}
					<CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<Label htmlFor="email">Correo electrónico</Label>
							<Input
								type="email"
								placeholder="Escribe tu correo"
								id="email"
								{...register("email")}
								className="w-full mt-1"
							/>
							{errors.email?.message && (
								<p className="text-sm text-red-600 max-w-xs overflow-hidden text-ellipsis">
									{errors.email.message}
								</p>
							)}
						</div>
						<ViewPasswordInput />
						<Button className="w-full py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all">
							Enviar
						</Button>
					</form>
				</CardContent>
				<CardFooter>
					<p className="flex justify-center text-slate-950">
						¿No tienes cuenta?&nbsp;
						<a href="/register" className="text-sky-700">
							Regístrate
						</a>
					</p>
				</CardFooter>
			</Card>
			<Toaster theme="system" richColors position="top-right" />
		</div>
	);
}
