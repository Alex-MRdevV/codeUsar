import { HeaderApp } from "@/components/headers/definir";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Props {
	children: React.ReactNode;
}

export const SidebarLayout = ({ children }: Props) => {
	return (
		<SidebarProvider >
			<AppSidebar />
			<SidebarInset>
				<HeaderApp />
				<div className="flex flex-col flex-1">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
