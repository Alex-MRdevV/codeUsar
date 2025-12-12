import {
	History,
	LayoutDashboard,
	MessageCircle,
	Send,
	Target,
	Upload,
	Reply,
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
		{ title: "Historial general", url: "/users/history", icon: History },
		{ title: "Notificaciones", url: "/users/notifications", icon: Reply },
		{ title: "Responder mensajes", url: "/users/reply", icon: Reply },
		{ title: "Cargar de archivos", url: "/users/upload", icon: Upload },
		{ title: "Enviar mensajes", url: "/users/send", icon: Send },
		{
			title: "Enviar mensajes Directos",
			url: "/users/sendDirect",
			icon: Target,
		},
	],
};
