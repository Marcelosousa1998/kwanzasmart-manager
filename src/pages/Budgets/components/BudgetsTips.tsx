
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const BudgetsTips = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dicas de Orçamento</CardTitle>
        <CardDescription>
          Regra 50/30/20 adaptada para Angola
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          A regra 50/30/20 é uma estratégia popular de orçamento que aloca seu rendimento em três categorias:
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-medium">60% - Necessidades</span>
            </div>
            <Progress value={60} className="w-32 h-2" />
          </div>
          <p className="text-xs text-muted-foreground pl-5">
            Despesas essenciais como aluguel, alimentação, transporte, educação básica
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="font-medium">20% - Desejos</span>
            </div>
            <Progress value={20} className="w-32 h-2" />
          </div>
          <p className="text-xs text-muted-foreground pl-5">
            Gastos não essenciais como entretenimento, jantar fora, compras
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="font-medium">20% - Poupança e Dívidas</span>
            </div>
            <Progress value={20} className="w-32 h-2" />
          </div>
          <p className="text-xs text-muted-foreground pl-5">
            Poupança para emergências, metas futuras e pagamento de dívidas
          </p>
        </div>
        
        <Separator className="my-4" />
        
        <p className="text-sm">
          <strong>Nota:</strong> Esta regra foi adaptada à realidade angolana, onde os custos de necessidades
          básicas geralmente representam uma parcela maior do rendimento.
        </p>
      </CardContent>
    </Card>
  );
};

export default BudgetsTips;
