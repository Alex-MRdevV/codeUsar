import { Header } from "@/components/header";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { dataUserSidebar } from "@/utils/types/sidebar";

interface Props {
	data: dataUserSidebar
	children: React.ReactNode;
}

export const SidebarLayout = ({ children, data }: Props) => {
	return (
		<SidebarProvider>
			<AppSidebar
				items={data.items}
				user={data.user}
			/>
			<SidebarInset>
				<Header />
				<div className="flex flex-col flex-1">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
