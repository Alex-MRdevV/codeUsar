import * as v from "valibot";

export const OrderStatusEnum = v.picklist([
	"Rechazado",
	"Confirmado",
	"Pendiente",
	"Aplazado",
]);

// Enum para códigos de rechazo
export const RejectionCodeEnum = v.picklist([
	"ZP",
	"Z6",
	"ZR",
	"ZH",
	"ZL",
	"Z4",
	"99",
	"ZS",
	"ZE",
	"Z3",
	"16",
	"10",
	"MC",
	"MT",
]);

export const CreateOrderSchema = v.pipe(
	v.object({
		id: v.pipe(v.string(), v.maxLength(191), v.minLength(1)),
		clientId: v.optional(v.nullable(v.pipe(v.string(), v.maxLength(191)))),
		orderNumber: v.pipe(v.string(), v.maxLength(50), v.minLength(1)),
		totalAmount: v.pipe(
			v.string(),
			v.regex(
				/^\d+(\.\d{1,2})?$/,
				"Debe ser un decimal válido (máx 2 decimales)"
			)
		),
		status: v.optional(OrderStatusEnum, "Pendiente"),
		rejectionCode: v.optional(v.nullable(RejectionCodeEnum)),
		orderDate: v.pipe(v.string(), v.isoTimestamp()),
		deliveryDate: v.optional(v.nullable(v.pipe(v.string(), v.isoTimestamp()))),
		notes: v.optional(v.nullable(v.string())),
	}),
	// Validación: si status es "Rechazado" debe tener rejectionCode
	v.check((data) => {
		if (data.status === "Rechazado" && !data.rejectionCode) {
			return false;
		}
		if (data.status && data.status !== "Rechazado" && data.rejectionCode) {
			return false;
		}
		return true;
	}, "Si el status es 'Rechazado', debe incluir un rejection_code. Si no es 'Rechazado', rejection_code debe ser null.")
);

export const UpdateOrderSchema = v.pipe(
	v.object({
		id: v.pipe(v.string(), v.maxLength(191)),
		clientId: v.optional(v.nullable(v.pipe(v.string(), v.maxLength(191)))),
		orderNumber: v.optional(
			v.pipe(v.string(), v.maxLength(50), v.minLength(1))
		),
		totalAmount: v.optional(
			v.pipe(
				v.string(),
				v.regex(
					/^\d+(\.\d{1,2})?$/,
					"Debe ser un decimal válido (máx 2 decimales)"
				)
			)
		),
		status: v.optional(OrderStatusEnum),
		rejectionCode: v.optional(v.nullable(RejectionCodeEnum)),
		orderDate: v.optional(v.pipe(v.string(), v.isoTimestamp())),
		deliveryDate: v.optional(v.nullable(v.pipe(v.string(), v.isoTimestamp()))),
		notes: v.optional(v.nullable(v.string())),
	}),
	// Validación personalizada: coherencia entre status y rejectionCode
	v.check((data) => {
		if (data.status === "Rechazado" && !data.rejectionCode) {
			return false;
		}
		if (data.status && data.status !== "Rechazado" && data.rejectionCode) {
			return false;
		}
		return true;
	}, "Si el status es 'Rechazado', debe incluir un rejection_code. Si no es 'Rechazado', rejection_code debe ser null.")
);

// Schema para ELIMINAR Orders (solo requiere ID)
export const DeleteOrderSchema = v.object({
	id: v.pipe(v.string(), v.maxLength(191), v.minLength(1)),
});

// ORDER ITEMS - Esquemas de validación
export const CreateOrderItemSchema = v.object({
	id: v.pipe(v.string(), v.maxLength(191), v.minLength(1)),
	orderId: v.optional(v.nullable(v.pipe(v.string(), v.maxLength(191)))),
	name: v.pipe(v.string(), v.maxLength(191), v.minLength(1)),
	quantity: v.optional(
		v.nullable(v.pipe(v.number(), v.integer(), v.minValue(0)))
	),
	notes: v.optional(v.nullable(v.string())),
});

export const UpdateOrderItemSchema = v.object({
	id: v.pipe(v.string(), v.maxLength(191)),
	orderId: v.optional(v.nullable(v.pipe(v.string(), v.maxLength(191)))),
	name: v.optional(v.pipe(v.string(), v.maxLength(191), v.minLength(1))),
	quantity: v.optional(
		v.nullable(v.pipe(v.number(), v.integer(), v.minValue(0)))
	),
	notes: v.optional(v.nullable(v.string())),
});

export const DeleteOrderItemSchema = v.object({
	id: v.pipe(v.string(), v.maxLength(191), v.minLength(1)),
});

export type CreateOrderInput = v.InferInput<typeof CreateOrderSchema>;
export type CreateOrderOutput = v.InferOutput<typeof CreateOrderSchema>;

export type CreateOrderItemInput = v.InferInput<typeof CreateOrderItemSchema>;
export type CreateOrderItemOutput = v.InferOutput<typeof CreateOrderItemSchema>;

export type UpdateOrderInput = v.InferInput<typeof UpdateOrderSchema>;
export type UpdateOrderOutput = v.InferOutput<typeof UpdateOrderSchema>;

export type DeleteOrderInput = v.InferInput<typeof DeleteOrderSchema>;
export type DeleteOrderOutput = v.InferOutput<typeof DeleteOrderSchema>;

export type UpdateOrderItemInput = v.InferInput<typeof UpdateOrderItemSchema>;
export type UpdateOrderItemOutput = v.InferOutput<typeof UpdateOrderItemSchema>;

export type DeleteOrderItemInput = v.InferInput<typeof DeleteOrderItemSchema>;
export type DeleteOrderItemOutput = v.InferOutput<typeof DeleteOrderItemSchema>;
