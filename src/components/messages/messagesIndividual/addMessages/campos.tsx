import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Phone, User } from "lucide-react";

export const ContactFields = ({
	phone,
	setPhone,
	name,
	setName
}: {
	phone: string;
	setPhone: (value: string) => void;
	name: string;
	setName: (value: string) => void;
}) => (
	<section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<div className="space-y-2">
			<Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium">
				<Phone className="w-3.5 h-3.5 text-primary" />
				Teléfono
				<span className="text-destructive">*</span>
			</Label>
			<Input
				id="phone"
				type="tel"
				placeholder="+57 300 123 4567"
				value={phone}
				onChange={(e) => setPhone(e.target.value)}
				className="bg-background border-input focus:ring-2 focus:ring-primary/20 transition-all"
				required
			/>
		</div>

		<div className="space-y-2">
			<Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium">
				<User className="w-3.5 h-3.5 text-muted-foreground" />
				Nombre
				<span className="text-xs text-muted-foreground ml-1">(opcional)</span>
			</Label>
			<Input
				id="name"
				type="text"
				placeholder="Nombre del contacto"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="bg-background border-input focus:ring-2 focus:ring-primary/20 transition-all"
			/>
		</div>
	</section>
);

export const ManualMessageField = ({
	content,
	setContent
}: {
	content: string;
	setContent: (value: string) => void;
}) => (
	<section className="space-y-2">
		<Label htmlFor="content" className="flex items-center gap-1.5 text-sm font-medium">
			<MessageSquare className="w-3.5 h-3.5 text-primary" />
			Mensaje
			<span className="text-destructive">*</span>
		</Label>
		<Textarea
			id="content"
			placeholder="Escribe el contenido del mensaje..."
			value={content}
			onChange={(e) => setContent(e.target.value)}
			className="bg-background border-input min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 transition-all"
			required
		/>
	</section>
);
