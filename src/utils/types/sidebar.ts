import {
	Bell,
	History,
	LayoutDashboard,
	MessageCircle,
	MessageSquareReply,
	Send,
	UploadCloud,
	type LucideIcon,
} from "lucide-react";

export interface PropsNavMain {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		color?: string;
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
		{
			title: "Panel de control",
			url: "/users/",
			icon: LayoutDashboard,
			color: "text-indigo-500",
		},
		{
			title: "Historial",
			url: "/users/history",
			icon: History,
			color: "text-slate-500",
		},
		{
			title: "Notificaciones",
			url: "/users/notifications",
			icon: Bell,
			color: "text-yellow-500",
		},
		{
			title: "Responder mensajes",
			url: "/users/reply",
			icon: MessageSquareReply,
			color: "text-emerald-500",
		},
		{
			title: "Carga de archivos",
			url: "/users/upload",
			icon: UploadCloud,
			color: "text-sky-500",
		},
		{
			title: "Enviar mensajes",
			url: "/users/send",
			icon: Send,
			color: "text-violet-500",
		},
		{
			title: "Mensajes directos",
			url: "/users/sendDirect",
			icon: MessageCircle,
			color: "text-pink-500",
		},
	],
};
