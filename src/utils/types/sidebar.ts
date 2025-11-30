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
		{ title: "Panel de control", url: "/user/index", icon: LayoutDashboard },
		{ title: "Historial Mensajes", url: "/user/historial", icon: History },
		{
			title: "Responder mensajes",
			url: "/user/responder",
			icon: MessageSquareReply,
		},
		{ title: "Enviar mensajes", url: "/user/send", icon: Send },
	],
};
