
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getCategoryLabel, getCategoryColor } from "@/utils/categoryUtils";

const CategorySpending = () => {
  const { state, formatCurrency } = useFinance();

  const categorySpending = state.transactions
    .filter(t => t.isExpense)
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const categorySpendingData = Object.entries(categorySpending)
    .map(([category, amount]) => ({
      category,
      amount,
      name: getCategoryLabel(category as any),
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
        <CardDescription>
          Como seus gastos estão distribuídos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categorySpendingData.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhuma despesa registrada ainda.
          </p>
        ) : (
          <>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpendingData}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categorySpendingData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getCategoryColor(entry.category as any).replace('bg-', '')}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), ""]}
                    contentStyle={{ borderRadius: '8px' }}
                    itemStyle={{ color: '#555' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categorySpendingData.slice(0, 4).map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getCategoryColor(item.category as any)}`} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySpending;
