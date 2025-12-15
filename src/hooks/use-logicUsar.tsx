import type { UseMessagesLogicProps } from "@/utils/types/send";
import { useMessagesLogicTemplates } from "@/hooks/use-logicMessageByTemplates";
import { useMessagesLogicText } from "@/hooks/use-logicMessageByText";

export const useMessagesLogic = (props: UseMessagesLogicProps) => {
	const templateLogic = useMessagesLogicTemplates(
		props.type === "template" ? props : null
	);

	const textLogic = useMessagesLogicText(
		props.type === "text" ? props : null
	);

	if (props.type === "template") {
		return {
			messageType: "template" as const,
			buildPayload: templateLogic.buildPayload,
			canSend: templateLogic.canSend,
			getRecipientCount: templateLogic.getRecipientCount,
			recipients: templateLogic.recipients
		};
	}

	return {
		messageType: "text" as const,
		buildPayload: textLogic.buildPayload,
		canSend: textLogic.canSend,
		getRecipientCount: textLogic.getRecipientCount,
		recipients: textLogic.validRecipients
	};
};
