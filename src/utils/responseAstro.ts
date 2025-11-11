export const res = (
	body: string | Record<string, unknown> | Array<unknown> | null,
	{
		status = 200,
		statusText,
		headers = new Headers({ "Content-Type": "application/json" }),
	}: { status?: number; statusText?: string; headers?: Headers }
) => {
	const responseBody =
		body && typeof body === "object"
			? JSON.stringify(body)
			: (body as BodyInit);

	if (status === 204) {
		return new Response(null, { status, statusText, headers });
	}

	return new Response(responseBody, { status, statusText, headers });
};
