
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const TipsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dicas para Poupar</CardTitle>
        <CardDescription>
          Estratégias para alcançar suas metas financeiras
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Regra dos 72h</h3>
          <p className="text-sm text-muted-foreground">
            Espere 72 horas antes de fazer compras não essenciais. Isso ajuda a evitar 
            compras por impulso e dá tempo para refletir se realmente necessita do item.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Automatize sua poupança</h3>
          <p className="text-sm text-muted-foreground">
            Defina transferências automáticas para sua conta poupança logo após receber 
            seu salário, para garantir que você poupe antes de gastar.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Método 30-30-30-10</h3>
          <p className="text-sm text-muted-foreground">
            Distribua seu salário: 30% para habitação, 30% para necessidades, 30% para objetivos
            financeiros e 10% para lazer. Adapte essas percentagens conforme sua realidade.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TipsCard;
