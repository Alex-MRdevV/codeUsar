import LogoUsar from "@/assets/logito (1).png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfigurarInicio } from "@/components/user/configurarInicio";
import { ViewPasswordInput } from "@/components/viewPassword";
import { useMessage } from "@/hooks/common/use-sendMessage";
import { loginSchema } from "@/lib/schemas/user/auth";
import { loginResponse } from "@/utils/services/user/loginResponse";
import type { responseMessage, userDataLogin } from "@/utils/types/user";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const LoginForm = () => {
	const { message, setMessage } = useMessage<Error | null>(null);
	const { createHandler } = ConfigurarInicio();
	const [user, setUser] = useState<responseMessage | null>();

	useEffect(() => {
		const redirigirUser = () => {
			if (user) {
				// Solo dispara el evento si no hay error y hay datos de usuario
				window.dispatchEvent(
					new CustomEvent("userAuthenticate", { detail: user }),
				);
			}
		};

		redirigirUser();
	}, [user]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<userDataLogin>({
		resolver: valibotResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rol: "user",
		},
	});

	const onSubmit = createHandler(async (data: userDataLogin) => {
		const response = await loginResponse(data);
		if (response[0]) setMessage(response[0])
		if (response[1]) setUser(response[1]);
		return response;
	});

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
			<Card className="shadow-2xl max-w-md w-full mt-[-50px] bg-white dark:bg-gray-800">
				<CardHeader className="text-center">
					<div className="mb-4">
						<img
							src={LogoUsar.src}
							alt="Logo"
							className="mx-auto h-16 w-16"
						/>
					</div>
					{/* Mensaje de error o éxito */}
					{message && (
						<div
							className={`p-4 mb-4 rounded text-center max-w-md w-full ${message instanceof Error
								? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
								: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
								}`}
						>
							{message.message}
						</div>
					)}
					<CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						Iniciar Sesión
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
								Correo electrónico
							</Label>
							<Input
								type="email"
								placeholder="Escribe tu correo"
								id="email"
								{...register("email")}
								className="w-full mt-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
							/>
							{errors.email?.message && (
								<p className="text-sm text-red-600 dark:text-red-400 max-w-xs overflow-hidden text-ellipsis">
									{errors.email.message}
								</p>
							)}
						</div>
						<ViewPasswordInput
							htmlForNombre="password"
							labelNombre="Contraseña"
							placeholder="Escribe tu contraseña"
							register={register}
							errors={errors}
							valueRegister="password"
							resetPassword={true}
						/>
						<div className="flex justify-center">
							<Button className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all hover:cursor-pointer">
								Enviar
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
