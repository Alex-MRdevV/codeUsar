import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface CreateUserFormData {
  email: string
  password: string
  nombre: string
}

interface UpdateUserFormData {
  id: string
  email: string
  password: string
  nombre: string
}

export function UserForms() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form state - Create
  const [createForm, setCreateForm] = useState<CreateUserFormData>({
    email: "",
    password: "",
    nombre: "",
  })

  // Form state - Update
  const [updateForm, setUpdateForm] = useState<UpdateUserFormData>({
    id: "",
    email: "",
    password: "",
    nombre: "",
  })

  // Handle create form changes
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle update form changes
  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUpdateForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle create submission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

  }

  // Handle update submission
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)


  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Crea nuevos usuarios o actualiza tus datos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Crear Usuario</TabsTrigger>
              <TabsTrigger value="update">Actualizar Usuario</TabsTrigger>
            </TabsList>

            {/* Create User Tab */}
            <TabsContent value="create" className="space-y-4 mt-6">
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
            </TabsContent>

            {/* Update User Tab */}
            <TabsContent value="update" className="space-y-4 mt-6">
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="update-id">ID del Usuario</Label>
                  <Input
                    id="update-id"
                    name="id"
                    type="text"
                    placeholder="ej: 550e8400-e29b-41d4-a716-446655440000"
                    value={updateForm.id}
                    onChange={handleUpdateChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="update-nombre">Nombre</Label>
                  <Input
                    id="update-nombre"
                    name="nombre"
                    type="text"
                    placeholder="Juan Pérez"
                    value={updateForm.nombre}
                    onChange={handleUpdateChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="update-email">Correo Electrónico</Label>
                  <Input
                    id="update-email"
                    name="email"
                    type="email"
                    placeholder="juan@example.com"
                    value={updateForm.email}
                    onChange={handleUpdateChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="update-password">
                    Contraseña <span className="text-muted-foreground text-sm">(opcional)</span>
                  </Label>
                  <Input
                    id="update-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={updateForm.password}
                    onChange={handleUpdateChange}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Actualizando..." : "Actualizar Usuario"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
