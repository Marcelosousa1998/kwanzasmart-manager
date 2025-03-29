
import React from "react";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  PlusCircle, 
  History 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import Layout from "@/components/Layout";
import TransactionForm from "@/components/TransactionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCategoryLabel, getCategoryColor } from "@/utils/categoryUtils";
import CategoryIcon from "@/components/CategoryIcon";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const { 
    state, 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance, 
    formatCurrency 
  } = useFinance();
  const [openTransactionDialog, setOpenTransactionDialog] = React.useState(false);

  // Get the last 5 transactions, sorted by date (newest first)
  const recentTransactions = [...state.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate spending by category
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

  // Generate income/expense data for the line chart over time
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

  // Calculate budget progress
  const budgetProgress = state.budgets.map(budget => {
    const percentUsed = (budget.spent / budget.amount) * 100;
    const isOverBudget = percentUsed > 100;
    return {
      ...budget,
      percentUsed,
      isOverBudget,
    };
  }).sort((a, b) => b.percentUsed - a.percentUsed);

  const totalBudgetedExpenses = state.budgets.reduce(
    (total, budget) => total + budget.amount,
    0
  );

  const totalActualExpenses = getTotalExpenses();
  const budgetedVsActualPercentage = totalBudgetedExpenses > 0
    ? (totalActualExpenses / totalBudgetedExpenses) * 100
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Financial Summary Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(getBalance())}</div>
              <p className="text-xs text-muted-foreground">
                Atualizado em {new Date().toLocaleDateString('pt-BR')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(getTotalIncome())}</div>
              <p className="text-xs text-muted-foreground">
                Total de receitas registradas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatCurrency(getTotalExpenses())}</div>
              <p className="text-xs text-muted-foreground">
                Total de despesas registradas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Dialog open={openTransactionDialog} onOpenChange={setOpenTransactionDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Nova Transação</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Transação</DialogTitle>
                <DialogDescription>
                  Registre uma nova receita ou despesa em sua conta.
                </DialogDescription>
              </DialogHeader>
              <TransactionForm onSuccess={() => setOpenTransactionDialog(false)} />
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link to="/transactions">
              <History className="h-4 w-4" />
              <span>Ver Histórico</span>
            </Link>
          </Button>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Left Column */}
          <div className="col-span-2 grid gap-4 lg:col-span-2">
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Orçamento vs. Despesas</CardTitle>
                <CardDescription>
                  {formatCurrency(totalActualExpenses)} de {formatCurrency(totalBudgetedExpenses)} (
                  {Math.round(budgetedVsActualPercentage)}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={budgetedVsActualPercentage > 100 ? 100 : budgetedVsActualPercentage} 
                  className={budgetedVsActualPercentage > 100 ? "bg-red-200" : ""}
                  indicatorClassName={budgetedVsActualPercentage > 100 ? "bg-red-500" : ""}
                />
                
                <div className="space-y-2 mt-4">
                  {budgetProgress.slice(0, 3).map((budget) => (
                    <div key={budget.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <CategoryIcon category={budget.category} className="h-4 w-4" />
                          <span>{getCategoryLabel(budget.category)}</span>
                        </div>
                        <span className={budget.isOverBudget ? "text-red-500" : ""}>
                          {formatCurrency(budget.spent)}/{formatCurrency(budget.amount)}
                        </span>
                      </div>
                      <Progress 
                        value={budget.percentUsed > 100 ? 100 : budget.percentUsed} 
                        className={budget.isOverBudget ? "bg-red-200" : ""}
                        indicatorClassName={budget.isOverBudget ? "bg-red-500" : ""}
                      />
                    </div>
                  ))}
                </div>
                
                {state.budgets.length > 3 && (
                  <div className="mt-3 text-center">
                    <Button variant="link" asChild>
                      <Link to="/budgets">Ver todos os orçamentos</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-2 grid gap-4 lg:col-span-1">
            <Tabs defaultValue="recent" className="col-span-2 lg:col-span-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recent">Transações Recentes</TabsTrigger>
                <TabsTrigger value="categories">Despesas por Categoria</TabsTrigger>
              </TabsList>
              <TabsContent value="recent" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transações Recentes</CardTitle>
                    <CardDescription>
                      Suas últimas 5 transações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                          Nenhuma transação registrada ainda.
                        </p>
                      ) : (
                        recentTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${
                                transaction.isExpense ? 
                                  getCategoryColor(transaction.category) : 
                                  "bg-green-500"
                              }`}>
                                <CategoryIcon 
                                  category={transaction.category} 
                                  className="h-4 w-4 text-white" 
                                />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-medium">
                                  {transaction.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <div className={`text-sm font-medium ${
                              transaction.isExpense ? "text-red-500" : "text-green-500"
                            }`}>
                              {transaction.isExpense ? "-" : "+"}{formatCurrency(transaction.amount)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {recentTransactions.length > 0 && (
                      <div className="mt-4 text-center">
                        <Button variant="link" asChild>
                          <Link to="/transactions">Ver todas as transações</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="categories">
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
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Metas de Poupança</CardTitle>
                <CardDescription>
                  Progresso das suas metas financeiras
                </CardDescription>
              </CardHeader>
              <CardContent>
                {state.goals.length === 0 ? (
                  <div className="text-center space-y-3">
                    <p className="text-muted-foreground">
                      Você ainda não tem metas definidas.
                    </p>
                    <Button asChild>
                      <Link to="/goals">Criar Meta</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.goals.slice(0, 3).map((goal) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      return (
                        <div key={goal.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{goal.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                            </span>
                          </div>
                          <Progress value={progress} />
                          <p className="text-xs text-muted-foreground">
                            Meta para {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      );
                    })}
                    {state.goals.length > 3 && (
                      <div className="text-center">
                        <Button variant="link" asChild>
                          <Link to="/goals">Ver todas as metas</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
