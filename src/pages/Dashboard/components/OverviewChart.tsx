
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const OverviewChart = () => {
  const { state, formatCurrency } = useFinance();

  const getLastSixMonths = () => {
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push({
        name: month.toLocaleDateString('pt-BR', { month: 'short' }),
        month: month.getMonth(),
        year: month.getFullYear(),
      });
    }
    return result;
  };

  const monthlyData = getLastSixMonths().map(monthObj => {
    const monthIncome = state.transactions
      .filter(t => !t.isExpense && 
        new Date(t.date).getMonth() === monthObj.month && 
        new Date(t.date).getFullYear() === monthObj.year)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthExpenses = state.transactions
      .filter(t => t.isExpense && 
        new Date(t.date).getMonth() === monthObj.month && 
        new Date(t.date).getFullYear() === monthObj.year)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: monthObj.name,
      income: monthIncome,
      expenses: monthExpenses,
    };
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Visão Geral</CardTitle>
        <CardDescription>
          Análise de receitas e despesas dos últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000)}K`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), ""]}
                labelStyle={{ color: "black" }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name="Receitas"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                name="Despesas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewChart;
