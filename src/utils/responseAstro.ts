export const res = <T = unknown>(
	body: T | BodyInit | null,
	{
		status = 200,
		statusText,
		headers,
		raw = false,
	}: {
		status?: number;
		statusText?: string;
		headers?: Headers;
		raw?: boolean;
	}
) => {
	let responseBody: BodyInit | null = null;

	if (status !== 204 && body !== null) {
		if (raw) {
			responseBody = body as BodyInit;
		} else if (
			typeof body === "object" &&
			!(body instanceof ArrayBuffer) &&
			!(body instanceof Blob) &&
			!(body instanceof FormData)
		) {
			responseBody = JSON.stringify(body);
		} else {
			responseBody = body as BodyInit;
		}
	}

	return new Response(responseBody, {
		status,
		statusText,
		headers:
			headers ??
			(!raw ? new Headers({ "Content-Type": "application/json" }) : undefined),
	});
};
