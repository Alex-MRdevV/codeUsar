import { useThemeSync } from "@/hooks/common/use-themeSync";
import { themeStore } from "@/stores/themes";
import { useStore } from '@nanostores/react';
import { Toaster } from "sonner";

interface Props {
	children: React.ReactNode;
}

export const AppWrapper = ({ children }: Props) => {
	const theme = useStore(themeStore);
	useThemeSync(theme);

	return <>
		<Toaster richColors theme={theme === "dark" ? "dark" : "light"} />
		{children}
	</>
};
