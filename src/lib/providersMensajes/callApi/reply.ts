interface SendReplyRequest {
  messageId: string;
  to: string;
  message: string;
}

export const sendMessageReply = async (data: SendReplyRequest) => {
  const response = await fetch('/api/messages/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al enviar la respuesta');
  }

  return response.json();
};