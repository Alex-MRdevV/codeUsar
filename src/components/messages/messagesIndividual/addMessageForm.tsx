import { useState } from "react";
import { Plus, Phone, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface AddMessageFormProps {
  onAdd: (phone: string, name: string, content: string) => void;
  messageCount: number;
  maxMessages: number;
}

export const AddMessageForm = ({ onAdd, messageCount, maxMessages }: AddMessageFormProps) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error("El teléfono es requerido");
      return;
    }

    if (!content.trim()) {
      toast.error("El mensaje es requerido");
      return;
    }

    if (messageCount >= maxMessages) {
      toast.error(`Máximo ${maxMessages} mensajes permitidos`);
      return;
    }

    onAdd(phone.trim(), name.trim() || "Sin nombre", content.trim());
    setPhone("");
    setName("");
    setContent("");
    toast.success("Mensaje agregado");
  };

  const isDisabled = messageCount >= maxMessages;

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Plus className="w-5 h-5 text-primary" />
          Agregar Mensaje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Phone className="w-3.5 h-3.5 text-primary" />
                Teléfono *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+52 123 456 7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background border-input focus:ring-primary"
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Nombre (opcional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Nombre del contacto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background border-input focus:ring-primary"
                disabled={isDisabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              Mensaje *
            </Label>
            <Textarea
              id="content"
              placeholder="Escribe el contenido del mensaje..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-background border-input focus:ring-primary min-h-[100px] resize-none"
              disabled={isDisabled}
            />
          </div>

          <Button
            type="submit"
            disabled={isDisabled}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar a la lista
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
