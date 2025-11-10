export const urlEnviarMensajeTexto = (numberPhoneId: string) =>
	`https://graph.facebook.com/v24.0/${numberPhoneId}/messages`;
