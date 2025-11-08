import { type userDevolver } from "@/utils/types/user";
import { SignJWT } from "jose";

export function accessToken(payload: userDevolver): Promise<string> {
  return new Promise((resolve, reject) => {
    new SignJWT({ payload })
      .setExpirationTime("7d")
      .sign(import.meta.env.SECRET_KEY_JWT)
      .then((token) => {
        resolve(token);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
