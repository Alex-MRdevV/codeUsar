import type { PropsNavMain } from "@/utils/types/sidebar";
import {
	History,
	LayoutDashboard,
	MessageSquareReply,
	Send,
	Upload,
} from "lucide-react";

export const sidebarDataItems: PropsNavMain = {
	items: [
		{ title: "Panel de control", url: "/users/index", icon: LayoutDashboard },
		{ title: "Historial Mensajes", url: "/users/historial", icon: History },
		{
			title: "Responder mensajes",
			url: "/users/reply",
			icon: MessageSquareReply,
		},
		{ title: "Enviar mensajes", url: "/users/send", icon: Send },
		{ title: "Cargar Archivo", url: "/users/upload", icon: Upload },
	],
};
