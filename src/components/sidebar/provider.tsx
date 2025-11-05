//import { AppSidebar } from "@/components/sideBar/appSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header";

interface Props {
	children: React.ReactNode;
}

export const SidebarLayout = ({ children }: Props) => {
	return (
		<SidebarProvider>
			<SidebarInset>
				<Header />
				<div className="flex flex-col flex-1">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
