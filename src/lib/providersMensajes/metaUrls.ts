export const urlEnviarMensajeTexto = (numberPhoneId: string) =>
	`https://graph.facebook.com/v24.0/${numberPhoneId}/messages`;

export const urlCrearPlantilla = (wabaId: string) =>
	`https://graph.facebook.com/v24.0/${wabaId}/message_templates`;
