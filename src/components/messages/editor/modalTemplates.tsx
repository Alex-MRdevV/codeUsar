import { Button } from "@/components/ui/button";
import { createWhatsAppTemplate } from "@/lib/providersMensajes/callApi/useApiTemplates";
import type { CreateTemplateModalProps } from "@/utils/types/editorMessages";
import type { Template } from "@/utils/types/templates";
import { useState } from "react";

export const CreateTemplateModal = ({ onClose, onSuccess }: CreateTemplateModalProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Form states
	const [name, setName] = useState("");
	const [metaTemplateName, setMetaTemplateName] = useState("");
	const [icon, setIcon] = useState("💬");
	const [color, setColor] = useState("#3B82F6");
	const [language, setLanguage] = useState("es");
	const [bodyText, setBodyText] = useState("");
	const [headerText, setHeaderText] = useState("");
	const [footerText, setFooterText] = useState("");
	const [hasHeader, setHasHeader] = useState(false);
	const [hasFooter, setHasFooter] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			// Construir la estructura
			const structure: Template["structure"] = {
				body: {
					text: bodyText,
				}
			};

			if (hasHeader && headerText) {
				structure.header = {
					type: "TEXT",
					text: headerText,
				};
			}

			if (hasFooter && footerText) {
				structure.footer = {
					text: footerText,
				};
			}

			const [err, response] = await createWhatsAppTemplate({
				name,
				icon,
				color,
				content: bodyText,
				metaTemplateName,
				language,
				structure,
			});

			if (err || !response?.data) {
				setError(err?.message || "Error al crear la plantilla");
				setIsSubmitting(false);
				return;
			}

			// Crear el objeto Template completo para agregar a la lista
			const newTemplate: Template = {
				id: response.data.id,
				name,
				metaTemplateName,
				language,
				structure,
			};

			onSuccess(newTemplate);
		} catch (err) {
			setError((err as Error).message);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6 border-b border-border flex items-center justify-between">
					<h2 className="text-2xl font-bold text-foreground">Nueva Plantilla</h2>
					<button
						onClick={onClose}
						className="text-muted-foreground hover:text-foreground"
					>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{error && (
						<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
							<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
						</div>
					)}

					{/* Información básica */}
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">Información Básica</h3>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Nombre de la plantilla
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="Ej: Bienvenida"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Nombre en Meta
								</label>
								<input
									type="text"
									value={metaTemplateName}
									onChange={(e) => setMetaTemplateName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
									required
									className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="ej: bienvenida_clientes"
								/>
								<p className="text-xs text-muted-foreground mt-1">Solo minúsculas y guiones bajos</p>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Icono
								</label>
								<input
									type="text"
									value={icon}
									onChange={(e) => setIcon(e.target.value)}
									required
									className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-2xl text-center"
									placeholder="💬"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Color
								</label>
								<input
									type="color"
									value={color}
									onChange={(e) => setColor(e.target.value)}
									className="w-full h-10 px-1 py-1 bg-background border border-border rounded-lg cursor-pointer"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Idioma
								</label>
								<select
									value={language}
									onChange={(e) => setLanguage(e.target.value)}
									className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="es">Español</option>
									<option value="es_MX">Español (México)</option>
									<option value="es_CO">Español (Colombia)</option>
									<option value="en">English</option>
									<option value="en_US">English (US)</option>
								</select>
							</div>
						</div>
					</div>

					{/* Estructura del mensaje */}
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">Estructura del Mensaje</h3>

						{/* Header opcional */}
						<div>
							<label className="flex items-center gap-2 mb-2">
								<input
									type="checkbox"
									checked={hasHeader}
									onChange={(e) => setHasHeader(e.target.checked)}
									className="w-4 h-4"
								/>
								<span className="text-sm font-medium text-foreground">Agregar encabezado</span>
							</label>
							{hasHeader && (
								<input
									type="text"
									value={headerText}
									onChange={(e) => setHeaderText(e.target.value)}
									className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="Texto del encabezado"
								/>
							)}
						</div>

						{/* Body (obligatorio) */}
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Cuerpo del mensaje *
							</label>
							<textarea
								value={bodyText}
								onChange={(e) => setBodyText(e.target.value)}
								required
								rows={4}
								className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
								placeholder="Escribe el contenido del mensaje aquí..."
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Usa {`{{1}}`}, {`{{2}}`}, etc. para variables
							</p>
						</div>

						{/* Footer opcional */}
						<div>
							<label className="flex items-center gap-2 mb-2">
								<input
									type="checkbox"
									checked={hasFooter}
									onChange={(e) => setHasFooter(e.target.checked)}
									className="w-4 h-4"
								/>
								<span className="text-sm font-medium text-foreground">Agregar pie de página</span>
							</label>
							{hasFooter && (
								<input
									type="text"
									value={footerText}
									onChange={(e) => setFooterText(e.target.value)}
									className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="Texto del pie de página"
								/>
							)}
						</div>
					</div>

					{/* Información sobre aprobación */}
					<div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
						<p className="text-sm text-blue-600 dark:text-blue-400">
							ℹ️ Las plantillas requieren aprobación de Meta. Esto puede tardar hasta 24 horas.
						</p>
					</div>

					{/* Botones */}
					<div className="flex gap-3 justify-end">
						<Button
							type="button"
							onClick={onClose}
							variant="outline"
							disabled={isSubmitting}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-primary hover:bg-primary/90 text-primary-foreground"
						>
							{isSubmitting ? "Creando..." : "Crear Plantilla"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
