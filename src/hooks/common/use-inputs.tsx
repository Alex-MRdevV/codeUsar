import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InputEmailProps } from "@/utils/types/common";

export const useInputs = ({ register,
	errors,
	labelNombre,
	htmlForNombre,
	placeholder,
	valueRegister, typeInput }: InputEmailProps) => {
	return (
		<section>
			<Label htmlFor={htmlForNombre}>{labelNombre}</Label>
			<Input
				type={typeInput}
				placeholder={placeholder}
				id={htmlForNombre}
				{...register(valueRegister)}
				className="w-full mt-1"
			/>
			{typeof errors[valueRegister]?.message === "string" && (
				<p className="text-sm text-red-600 pt-1 max-w-xs overflow-hidden text-ellipsis">
					{errors[valueRegister]?.message}
				</p>
			)}
		</section>
	);
}
