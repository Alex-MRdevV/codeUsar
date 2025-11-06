import { Header } from "@/components/header";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { themeStore } from "@/stores/themes";
import { useStore } from "@nanostores/react";

interface Props {
	children: React.ReactNode;
}

export const SidebarLayout = ({ children }: Props) => {
	const theme = useStore(themeStore);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<Header />
				<div className="flex flex-col flex-1">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
