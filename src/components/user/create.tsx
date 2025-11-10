import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const RegisterUser = () => {
	return (
		<form onSubmit={handleCreateSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="create-nombre">Nombre</Label>
				<Input
					id="create-nombre"
					name="nombre"
					type="text"
					placeholder="Juan Pérez"
					value={createForm.nombre}
					onChange={handleCreateChange}
					disabled={isLoading}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="create-email">Correo Electrónico</Label>
				<Input
					id="create-email"
					name="email"
					type="email"
					placeholder="juan@example.com"
					value={createForm.email}
					onChange={handleCreateChange}
					disabled={isLoading}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="create-password">Contraseña</Label>
				<Input
					id="create-password"
					name="password"
					type="password"
					placeholder="••••••••"
					value={createForm.password}
					onChange={handleCreateChange}
					disabled={isLoading}
					required
				/>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "Creando..." : "Crear Usuario"}
			</Button>
		</form>
	)
}
