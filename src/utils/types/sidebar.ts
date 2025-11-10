import { Mail, type LucideIcon } from "lucide-react"

export interface PropsUserOptions {
	name: string
	email: string
}

export interface PropsNavMain {
	items: {
		title: string
		url: string
		icon?: LucideIcon
	}[]
}

export interface dataUserSidebar {
	items: PropsNavMain
	user: PropsUserOptions
}

export const appConfig = {
  name: 'Ping',
  Icon: Mail,
};
