import {
	History,
	LayoutDashboard,
	MessageCircle,
	Send,
	Upload,
	type LucideIcon,
} from "lucide-react";

export interface PropsNavMain {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
	}[];
}

export interface dataUserSidebar {
	items: PropsNavMain;
}

export const appConfig = {
	name: "SendFlow",
	Icon: MessageCircle,
};

export const sidebarDataItems: PropsNavMain = {
	items: [
		{ title: "Panel de control", url: "/users/", icon: LayoutDashboard },
		{ title: "Cargar de archivos", url: "/users/upload", icon: Upload },
		{ title: "Historial general", url: "/users/history", icon: History },
		{ title: "Enviar mensajes", url: "/users/send", icon: Send },
	],
};
