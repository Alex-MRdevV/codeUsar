import type { SendGroupedOrdersPayload } from "@/utils/types/bavariaNowData";
import type { InsertOrdersResponse } from "@/utils/types/orders";

export const CreateOrders = async (
	dataUsar: SendGroupedOrdersPayload
): Promise<[Error, null] | [null, InsertOrdersResponse]> => {
	try {
		const response = await fetch(`/api/order/add`, {
			method: "POST",
			body: JSON.stringify(dataUsar),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			return [new Error(errorData.message), null];
		}

		const data: InsertOrdersResponse = await response.json();
		return [null, data];
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return [new Error(errorMessage), null];
	}
};
