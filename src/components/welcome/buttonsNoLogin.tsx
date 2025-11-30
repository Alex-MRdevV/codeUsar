import { SignInButton } from '@clerk/astro/react';
import { Button } from "@/components/ui/button"

export default function CustomSignInButton() {
	return (
		<SignInButton mode="modal">
			<section className="flex gap-3 pt-4">
				<Button>Empezar a usar</Button>
			</section>
		</SignInButton>
	);
}
