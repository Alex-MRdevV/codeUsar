import { AlertCircle, CheckCircle, Copy } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export function PhoneConfig() {
  const phones = useStore(phonesStore);
  const selectedId = useStore(selectedPhoneId);

  // Cargar teléfonos desde la API
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await fetch('/api/phones');
        const data = await response.json();
        setPhones(data);
      } catch (error) {
        console.error('Error al cargar teléfonos:', error);
      }
    };

    fetchPhones();
  }, []);

  const handleSelectPhone = (id: string) => {
    selectPhone(id);
  };

  const handleCopyPhone = (number: string) => {
    navigator.clipboard.writeText(number);
  };

  const selectedPhone = phones.find(p => p.id === selectedId);

  const typeColors = {
    production: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    preview: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    development: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Configuración de Teléfonos</h1>
        <p className="text-muted-foreground">Gestiona tus números de teléfono para producción, prueba y desarrollo</p>
      </div>

      {/* Current Selection */}
      {selectedPhone && (
        <Card className="bg-card border-border p-6 border-primary/30 bg-primary/5">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            Número Actualmente Seleccionado
          </h2>
          <div className="bg-background/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">{selectedPhone.name}</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-foreground font-mono">
                {selectedPhone.number}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyPhone(selectedPhone.number)}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Phone List by Type */}
      {["production", "preview", "development"].map((type) => {
        const typePhones = phones.filter((p) => p.type === type);
        if (typePhones.length === 0) return null;

        const typeLabels = {
          production: "Producción",
          preview: "Vista Previa",
          development: "Desarrollo/Prueba",
        };

        return (
          <div key={type}>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  type === "production" ? "bg-green-500" : type === "preview" ? "bg-blue-500" : "bg-orange-500"
                }`}
              />
              {typeLabels[type as keyof typeof typeLabels]}
            </h3>

            <div className="space-y-3">
              {typePhones.map((phone) => (
                <Card
                  key={phone.id}
                  className={cn(
                    "bg-card border-border p-4 transition-all cursor-pointer hover:border-primary/50",
                    phone.id === selectedId && "border-primary/50 bg-primary/5",
                  )}
                  onClick={() => handleSelectPhone(phone.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{phone.name}</h4>
                        <Badge variant="secondary" className={typeColors[phone.type]}>
                          {phone.type === "production"
                            ? "Producción"
                            : phone.type === "preview"
                              ? "Preview"
                              : "Desarrollo"}
                        </Badge>
                        {phone.id === selectedId && (
                          <Badge className="bg-green-600 text-white dark:bg-green-700">Activo</Badge>
                        )}
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">{phone.number}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPhone(phone.number);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Info Box */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-1">Información sobre números</p>
            <p>
              Selecciona el número que deseas usar por defecto para enviar mensajes. Este se guardará automáticamente.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
