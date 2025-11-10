export const logoutResponse = async () => {
  try {
    const response = await fetch(`api/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      // capturar el error que devuelve el backend
      const errorData = await response.json();
      return [new Error(errorData.message), null];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
