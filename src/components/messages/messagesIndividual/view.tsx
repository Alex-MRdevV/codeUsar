import { LoadingWrapper } from "@/components/loading/wrapper";
import { AddMessageFormContainer } from "@/components/messages/messagesIndividual/addMessageContainer";
import { getTemplates } from "@/utils/services/templates/all";
import { getTargetStatusForTemplate } from "@/utils/types/messages";
import type { Template } from "@/utils/types/templates";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const SendMessagesView = () => {
	const [data, setData] = useState<Template[] | null>(null);

	useEffect(() => {
		async function load() {
			try {
				const templates = await getTemplates();
				setData(templates);

			} catch (err) {
				toast.error("Ocurrió un error imprevisto");
			}
		}

		load();
	}, []);

	if (!data) {
		return <LoadingWrapper isLoading={true} message="Cargando..." />
	}

	return (
		<AddMessageFormContainer
			templates={data}
			getTargetStatusForTemplate={getTargetStatusForTemplate}
		/>
	)
}
