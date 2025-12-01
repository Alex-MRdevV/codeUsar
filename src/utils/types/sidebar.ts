import {
	History,
	LayoutDashboard,
	MessageCircle,
	MessageSquareReply,
	Send,
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
		{ title: "Panel de control", url: "/users/index", icon: LayoutDashboard },
		{ title: "Historial general", url: "/users/history", icon: History },
		{
			title: "Responder mensajes",
			url: "/users/reply",
			icon: MessageSquareReply,
		},
		{ title: "Enviar mensajes", url: "/users/send", icon: Send },
	],
};
