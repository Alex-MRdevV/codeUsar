import { RequestGetDataSendMessage } from "@/utils/services/getDataForMessages";
import type { dataUsarMessages } from "@/utils/types/messages";

export async function useDataMessages(): Promise<dataUsarMessages> {
	const [error, data] = await RequestGetDataSendMessage();

	if (error) {
		throw error;
	}

	return data!;
}
