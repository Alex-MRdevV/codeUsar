import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ViewPasswordProps } from "@/utils/types/common";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export const ViewPasswordInput = ({ register,
	errors,
	labelNombre,
	htmlForNombre,
	placeholder,
	valueRegister,
	resetPassword, }: ViewPasswordProps) => {
	const [visible, setVisible] = useState(false);

	const toggleVisibility = () => {
		setVisible(!visible);
	};

	return (
		<>
			<section>
				<Label htmlFor={htmlForNombre}>{labelNombre}</Label>
				<div className="relative w-full">
					<Input
						type={visible ? "text" : "password"}
						placeholder={placeholder}
						id={htmlForNombre}
						{...register(valueRegister)}
						className="w-full mt-1 pr-10"
					/>
					<button
						type="button"
						onClick={toggleVisibility}
						className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-700"
					>
						{visible ? <Eye /> : <EyeClosed />}
					</button>
				</div>
				{typeof errors[valueRegister]?.message === "string" && (
					<p className="text-sm text-red-600 pt-1 max-w-xs overflow-hidden text-ellipsis">
						{errors[valueRegister]?.message}
					</p>
				)}
			</section>
			{resetPassword && ( // Solo mostrar si se quiere recuperar la contraseña
				<section>
					<div className="flex justify-between text-xs">
						<p className="text-slate-950">¿Olvidaste tu contraseña?</p>
						<a href="/resetPassword" className="text-red-600 ">
							Restablecer
						</a>
					</div>
				</section>
			)}
		</>
	);
};
