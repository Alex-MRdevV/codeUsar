import { cn } from "@/lib/utils"
import { useEffect, useEffectEvent, useState, useTransition } from "react"

interface LoadingWrapperProps {
	isLoading: boolean
	message?: string
	spinnerSize?: "sm" | "md" | "lg"
	fullScreen?: boolean
	className?: string
}

export function LoadingWrapper({
	isLoading,
	message,
	spinnerSize = "md",
	fullScreen = false,
	className,
}: LoadingWrapperProps) {
	const [visible, setVisible] = useState(isLoading)
	const [isPending, startTransition] = useTransition()

	const hideWithDelay = useEffectEvent(() => {
		const timer = setTimeout(() => {
			startTransition(() => setVisible(false))
		}, 300)
		return () => clearTimeout(timer)
	})

	useEffect(() => {
		if (isLoading) {
			setVisible(true)
		} else {
			return hideWithDelay()
		}
	}, [isLoading])

	if (!visible) return null

	const sizeClasses = {
		sm: "w-8 h-8",
		md: "w-12 h-12",
		lg: "w-16 h-16",
	}

	const loadingContent = (
		<div className="flex flex-col items-center justify-center gap-3">
			<div className="relative">
				<div className={`${sizeClasses[spinnerSize]} rounded-full border-4 border-border animate-pulse`} />

				<div
					className={`${sizeClasses[spinnerSize]} rounded-full border-4 border-transparent border-t-primary border-r-primary absolute inset-0 animate-spin`}
					style={{ animationDuration: "1.2s" }}
				/>

				<div className="absolute inset-0 flex items-center justify-center">
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="absolute w-1.5 h-1.5 bg-accent rounded-full"
							style={{
								animation: `orbit 2s linear infinite`,
								animationDelay: `${i * 0.67}s`,
							}}
						/>
					))}
				</div>
			</div>

			{message && (
				<p className="text-sm font-medium text-foreground animate-pulse text-center">
					{message}
				</p>
			)}

			<div className="flex gap-1">
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						className="w-1 h-1 bg-muted-foreground rounded-full"
						style={{
							animation: `bounce 1.4s infinite`,
							animationDelay: `${i * 0.2}s`,
						}}
					/>
				))}
			</div>
		</div>
	)

	const motion = isLoading
		? "opacity-100 scale-100"
		: "opacity-0 scale-95 pointer-events-none"

	const containerClasses = cn(
		"transition-all duration-300",
		motion,
		className,
	)

	if (fullScreen) {
		return (
			<div
				className={cn(
					"fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50 transition-all duration-300",
					motion,
				)}
			>
				<div
					className={cn(
						"flex flex-col items-center gap-4 p-8 bg-card rounded-lg shadow-lg transition-all duration-300",
						motion,
					)}
				>
					{loadingContent}
				</div>
			</div>
		)
	}

	return <div className={containerClasses}>{loadingContent}</div>
}
