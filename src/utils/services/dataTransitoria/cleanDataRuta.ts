export const cleanDataRuta = async () => {
	try {
		const response = await fetch("/api/data/cleanDataRuta", {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};
