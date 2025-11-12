import type { PropsNavMain } from "@/utils/types/sidebar";
import {
	History,
	LayoutDashboard,
	MessageSquareReply,
	Send,
} from "lucide-react";

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
