import type {
	OrderStatusEnum,
	RejectionCodeEnum,
} from "@/lib/schemas/order/validar";
import * as v from "valibot";

export type statusPedidos = v.InferOutput<typeof OrderStatusEnum>;
export type rejectCodes = v.InferOutput<typeof RejectionCodeEnum>;
