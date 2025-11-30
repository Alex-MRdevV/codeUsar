import { AppSidebar } from "@/components/sidebar/appSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { sidebarDataItems } from "@/utils/types/sidebar";

interface Props {
	children: React.ReactNode;
}

export const SidebarLayout = ({ children }: Props) => {
	return (
		<SidebarProvider>
			<AppSidebar
				items={sidebarDataItems}
			/>
			<SidebarInset>
				<div className="flex flex-col flex-1">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
