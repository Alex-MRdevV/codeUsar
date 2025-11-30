import { SignedIn } from "@clerk/astro/react"
import { Button } from "@/components/ui/button"

export const CustomSignedIn = () => {
	return (
		<SignedIn>
			<section className="flex gap-3 pt-4">
				<Button className="px-6 py-2 bg-violet-600 dark:bg-violet-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"><a href="/user/index">Ir al panel</a></Button>
			</section>
		</SignedIn>
	)
}
