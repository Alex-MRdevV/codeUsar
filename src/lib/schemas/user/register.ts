import * as v from "valibot";
import { roles } from "@/utils/types/user";

// Esquema base sin refinamiento
const baseSchema = v.object({
    email: v.pipe(
        v.string("El email debe ser un texto"),
        v.email("Debe ser un correo válido")
    ),
    nombre: v.pipe(
        v.string("El nombre no puede ser null"),
        v.minLength(1, "El nombre no puede estar vacío")
    ),
    rol: v.pipe(
        v.picklist(roles, "El rol debe ser una de las opciones")
    ),
    password: v.pipe(
        v.string("La contraseña no puede ser null"),
        v.minLength(8, "La contraseña debe tener al menos 8 caracteres"),
        v.maxLength(40, "La contraseña no puede tener más de 40 caracteres"),
        v.regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial !@#$%^&*"
        )
    ),
    confirmPassword: v.pipe(
        v.string("Confirma tu contraseña"),
        v.minLength(8, "La contraseña debe tener al menos 8 caracteres"),
        v.maxLength(40, "La contraseña no puede tener más de 40 caracteres"),
        v.regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial !@#$%^&*"
        )
    ),
});

// Aplica el refinamiento después de crear el esquema base
export const registerSchema = v.pipe(
    baseSchema,
    v.forward(
        v.partialCheck(
            [["password"], ["confirmPassword"]],
            (input) => input.password === input.confirmPassword,
            "Las contraseñas deben coincidir"
        ),
        ["confirmPassword"]
    )
);

export type FormValuesCreate = v.InferOutput<typeof registerSchema>;

// Crea el esquema de actualización usando partial
export const updateSchema = v.object({
    id: v.pipe(
        v.string("El id debe ser un texto"),
        v.minLength(1, "El id es requerido")
    ),
    nombre: v.optional(
        v.pipe(
            v.string("El nombre debe ser un texto"),
            v.minLength(1, "El nombre no puede estar vacío")
        )
    ),
    email: v.optional(
        v.pipe(
            v.string("El email debe ser un texto"),
            v.email("Debe ser un correo válido")
        )
    ),
    password: v.optional(
        v.pipe(
            v.string("La contraseña debe ser un texto"),
            v.minLength(8, "La contraseña debe tener al menos 8 caracteres"),
            v.maxLength(40, "La contraseña no puede tener más de 40 caracteres"),
            v.regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial !@#$%^&*"
            )
        )
    ),
});

export type FormValuesUpdate = v.InferOutput<typeof updateSchema>;

// Esquema para eliminar usuario
export const removeSchema = v.object({
    id: v.pipe(
        v.string("El id debe ser un texto"),
        v.minLength(1, "El id es requerido")
    ),
});

export type FormValuesRemove = v.InferOutput<typeof removeSchema>;

// Esquema para regenerar token
export const regenerateTokenSchema = v.object({
    id: v.pipe(
        v.string("El id debe ser un texto"),
        v.uuid("ID de usuario inválido")
    ),
    email: v.pipe(
        v.string("El email debe ser un texto"),
        v.email("Debe ser un correo válido")
    ),
});

export type FormValuesRegenerateToken = v.InferOutput<typeof regenerateTokenSchema>;
