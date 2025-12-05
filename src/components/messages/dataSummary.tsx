import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResultadoAgrupado } from "@/types/batch";
import {
  Users,
  Package,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataSummaryCardProps {
  data: ResultadoAgrupado;
  className?: string;
}

export const DataSummaryCard = ({ data, className }: DataSummaryCardProps) => {
  const { summary, invalidRows } = data;

  const stats = [
    {
      label: "Clientes",
      value: summary.clientes,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Pedidos",
      value: summary.pedidos,
      icon: ShoppingCart,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      label: "Productos",
      value: summary.referenciaProducto,
      icon: Box,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <Card className={cn("p-4 space-y-4", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-card-foreground">
            Resumen de Datos
          </h3>
          <p className="text-sm text-muted-foreground">
            Información de envío masivo
          </p>
        </div>
        <Package className="size-5 text-muted-foreground" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50"
            >
              <div className={cn("p-2 rounded-full", stat.bgColor)}>
                <Icon className={cn("size-4", stat.color)} />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-card-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation Status */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-success" />
          <span className="text-sm font-medium text-success">
            {summary.valid} válidos
          </span>
        </div>

        {summary.invalid > 0 && (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="size-3" />
            {summary.invalid} inválidos
          </Badge>
        )}
      </div>

      {/* Invalid Rows Warning */}
      {invalidRows.length > 0 && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-xs text-destructive font-medium">
            ⚠️ {invalidRows.length} filas con errores detectadas
          </p>
        </div>
      )}
    </Card>
  );
};
