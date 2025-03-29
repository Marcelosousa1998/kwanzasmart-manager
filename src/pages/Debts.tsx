
import React, { useState } from "react";
import { Calculator, PlusCircle, Trash2 } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Debts = () => {
  const { state, addDebt, updateDebt, deleteDebt, formatCurrency } = useFinance();
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [remainingPayments, setRemainingPayments] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  
  // For calculator
  const [loanAmount, setLoanAmount] = useState("");
  const [loanInterestRate, setLoanInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Nome necessário",
        description: "Por favor, adicione um nome para a dívida",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }

    if (!interestRate || parseFloat(interestRate) < 0) {
      toast({
        title: "Taxa de juros inválida",
        description: "Por favor, insira uma taxa de juros válida",
        variant: "destructive",
      });
      return;
    }

    if (!minimumPayment || parseFloat(minimumPayment) <= 0) {
      toast({
        title: "Pagamento mínimo inválido",
        description: "Por favor, insira um valor de pagamento mínimo válido",
        variant: "destructive",
      });
      return;
    }

    if (!remainingPayments || parseInt(remainingPayments) <= 0) {
      toast({
        title: "Número de pagamentos inválido",
        description: "Por favor, insira um número válido de pagamentos restantes",
        variant: "destructive",
      });
      return;
    }

    const newDebt = {
      name,
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate),
      minimumPayment: parseFloat(minimumPayment),
      remainingPayments: parseInt(remainingPayments),
    };

    addDebt(newDebt);
    
    toast({
      title: "Dívida adicionada",
      description: `Dívida de ${formatCurrency(parseFloat(amount))} para "${name}" foi adicionada.`,
    });

    // Reset form
    setName("");
    setAmount("");
    setInterestRate("");
    setMinimumPayment("");
    setRemainingPayments("");
    setOpenAddDialog(false);
  };

  const handleConfirmDelete = (id: string) => {
    setDebtToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (debtToDelete) {
      deleteDebt(debtToDelete);
      setDeleteDialogOpen(false);
      toast({
        title: "Dívida removida",
        description: "A dívida foi removida com sucesso",
      });
    }
  };

  const handlePayment = (debtId: string) => {
    setSelectedDebt(debtId);
    setPaymentAmount("");
    setPaymentDialogOpen(true);
  };

  const handleAddPayment = () => {
    if (!selectedDebt) return;
    
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }
    
    const debt = state.debts.find(d => d.id === selectedDebt);
    if (!debt) return;
    
    // Calculate new remaining payments based on payment amount
    const remainingPrincipal = debt.amount - amount;
    let newRemainingPayments = debt.remainingPayments;
    
    if (remainingPrincipal <= 0) {
      // Debt is fully paid
      newRemainingPayments = 0;
    } else {
      // Recalculate remaining payments based on minimum payment
      newRemainingPayments = Math.ceil(remainingPrincipal / debt.minimumPayment);
    }
    
    const updatedDebt = {
      ...debt,
      amount: Math.max(0, remainingPrincipal),
      remainingPayments: newRemainingPayments,
    };
    
    updateDebt(updatedDebt);
    
    toast({
      title: "Pagamento registrado",
      description: `Pagamento de ${formatCurrency(amount)} registrado para "${debt.name}"`,
    });
    
    setPaymentDialogOpen(false);
  };

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(loanInterestRate) / 100 / 12; // Monthly interest rate
    const term = parseInt(loanTerm); // Total months
    
    if (isNaN(principal) || isNaN(rate) || isNaN(term) || term <= 0) {
      toast({
        title: "Valores inválidos",
        description: "Por favor, verifique os valores inseridos",
        variant: "destructive",
      });
      return;
    }
    
    // Monthly payment formula: P × r(1 + r)^n / ((1 + r)^n - 1)
    const monthlyPaymentValue = principal * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
    const totalPaymentValue = monthlyPaymentValue * term;
    const totalInterestValue = totalPaymentValue - principal;
    
    setMonthlyPayment(monthlyPaymentValue);
    setTotalPayment(totalPaymentValue);
    setTotalInterest(totalInterestValue);
  };

  // Calculate total debt
  const totalDebt = state.debts.reduce((total, debt) => total + debt.amount, 0);
  
  // Order debts by highest interest rate (for debt avalanche method)
  const debtsByInterestRate = [...state.debts].sort((a, b) => b.interestRate - a.interestRate);
  
  // Order debts by smallest balance (for debt snowball method)
  const debtsByBalance = [...state.debts].sort((a, b) => a.amount - b.amount);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Dívidas</h1>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nova Dívida
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Nova Dívida</DialogTitle>
                  <DialogDescription>
                    Adicione uma dívida para monitorar seu pagamento.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Dívida</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Empréstimo Pessoal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor Restante (Kz)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Taxa de Juros Anual (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      placeholder="0"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumPayment">Pagamento Mínimo Mensal (Kz)</Label>
                    <Input
                      id="minimumPayment"
                      type="number"
                      placeholder="0"
                      value={minimumPayment}
                      onChange={(e) => setMinimumPayment(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remainingPayments">Pagamentos Restantes</Label>
                    <Input
                      id="remainingPayments"
                      type="number"
                      placeholder="0"
                      value={remainingPayments}
                      onChange={(e) => setRemainingPayments(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Adicionar Dívida</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total de Dívidas</CardTitle>
            <CardDescription>
              Resumo de todas as suas dívidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{formatCurrency(totalDebt)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {state.debts.length} {state.debts.length === 1 ? 'dívida ativa' : 'dívidas ativas'}
            </p>
          </CardContent>
        </Card>

        {/* Debt Strategy Tabs */}
        <Tabs defaultValue="debts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="debts">Minhas Dívidas</TabsTrigger>
            <TabsTrigger value="strategies">Estratégias</TabsTrigger>
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          </TabsList>
          
          <TabsContent value="debts">
            {state.debts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Calculator className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">Nenhuma dívida registrada</h2>
                  <p className="text-muted-foreground text-center mb-4">
                    Registre suas dívidas para acompanhar o progresso e criar um plano de pagamento.
                  </p>
                  <Button onClick={() => setOpenAddDialog(true)}>
                    Adicionar Dívida
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {state.debts.map((debt) => {
                  const totalPayment = debt.minimumPayment * debt.remainingPayments;
                  const progress = debt.remainingPayments > 0 
                    ? 100 - (debt.remainingPayments / (totalPayment / debt.minimumPayment) * 100)
                    : 100;
                    
                  return (
                    <Card key={debt.id}>
                      <CardHeader>
                        <CardTitle>{debt.name}</CardTitle>
                        <CardDescription>
                          Taxa de juros: {debt.interestRate}% ao ano
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Progresso</span>
                            <span className="text-sm font-medium">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Saldo Devedor</p>
                            <p className="text-lg font-medium text-red-500">{formatCurrency(debt.amount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Pagamento Mensal</p>
                            <p className="text-lg font-medium">{formatCurrency(debt.minimumPayment)}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Pagamentos Restantes</p>
                          <p className="text-lg font-medium">{debt.remainingPayments}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => handlePayment(debt.id)}
                        >
                          Registrar Pagamento
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleConfirmDelete(debt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="strategies">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Método Avalanche</CardTitle>
                  <CardDescription>
                    Priorize dívidas com maior taxa de juros
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    O método avalanche foca em pagar primeiro as dívidas com maior taxa de juros, 
                    enquanto faz apenas o pagamento mínimo nas demais. Esta estratégia minimiza o 
                    valor total pago em juros.
                  </p>
                  
                  {debtsByInterestRate.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      Adicione dívidas para ver sua ordem de prioridade.
                    </p>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <h3 className="font-medium">Sua Ordem de Prioridade:</h3>
                      {debtsByInterestRate.map((debt, index) => (
                        <div key={debt.id} className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{debt.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(debt.amount)} • {debt.interestRate}% juros
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Método Bola de Neve</CardTitle>
                  <CardDescription>
                    Priorize dívidas com menor saldo devedor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    O método bola de neve foca em pagar primeiro as dívidas com menor saldo, 
                    enquanto faz apenas o pagamento mínimo nas demais. Esta estratégia gera 
                    vitórias rápidas e motivação psicológica.
                  </p>
                  
                  {debtsByBalance.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      Adicione dívidas para ver sua ordem de prioridade.
                    </p>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <h3 className="font-medium">Sua Ordem de Prioridade:</h3>
                      {debtsByBalance.map((debt, index) => (
                        <div key={debt.id} className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{debt.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(debt.amount)} • {debt.remainingPayments} pagamentos restantes
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Dicas para Pagamento de Dívidas</CardTitle>
                  <CardDescription>
                    Estratégias eficazes para eliminar dívidas
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-medium">Crie um Fundo de Emergência</h3>
                    <p className="text-sm text-muted-foreground">
                      Antes de focar intensamente nas dívidas, tenha um pequeno fundo de emergência 
                      (1-3 meses de despesas) para evitar novos endividamentos em caso de imprevistos.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Negocie Melhores Condições</h3>
                    <p className="text-sm text-muted-foreground">
                      Tente negociar taxas de juros mais baixas ou melhores condições de pagamento 
                      com seus credores, especialmente se você tem bom histórico de pagamentos.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Evite Novas Dívidas</h3>
                    <p className="text-sm text-muted-foreground">
                      Pare de usar cartões de crédito ou criar novas dívidas enquanto estiver 
                      pagando as existentes. Viver dentro do orçamento é essencial.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Encontre Renda Extra</h3>
                    <p className="text-sm text-muted-foreground">
                      Considere trabalhos temporários ou vender itens não utilizados para 
                      acelerar o pagamento das dívidas com renda adicional.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Calculadora de Empréstimos</CardTitle>
                <CardDescription>
                  Calcule as parcelas e juros de um empréstimo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Valor do Empréstimo (Kz)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="0"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanInterestRate">Taxa de Juros Anual (%)</Label>
                    <Input
                      id="loanInterestRate"
                      type="number"
                      placeholder="0"
                      step="0.01"
                      value={loanInterestRate}
                      onChange={(e) => setLoanInterestRate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanTerm">Prazo (Meses)</Label>
                    <Input
                      id="loanTerm"
                      type="number"
                      placeholder="0"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button onClick={calculateLoan} className="w-full sm:w-auto">
                  Calcular
                </Button>
                
                {monthlyPayment !== null && (
                  <div className="mt-6 space-y-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium text-lg">Resultados</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Pagamento Mensal</p>
                        <p className="text-lg font-bold">{formatCurrency(monthlyPayment)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Juros</p>
                        <p className="text-lg font-bold text-orange-500">{formatCurrency(totalInterest!)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total a Pagar</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(totalPayment!)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Dicas para Evitar Endividamento</CardTitle>
                <CardDescription>
                  Práticas financeiras saudáveis para Angola
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Cuidado com Empréstimos Informais</h3>
                  <p className="text-sm text-muted-foreground">
                    Empréstimos de "kinguilas" e agiotas geralmente têm taxas de juros extremamente altas. 
                    Busque alternativas formais sempre que possível.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Entenda os Termos do Empréstimo</h3>
                  <p className="text-sm text-muted-foreground">
                    Antes de assinar qualquer contrato, certifique-se de entender completamente 
                    a taxa de juros, prazo, valor total a pagar e penalidades por atraso.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Considere a Inflação</h3>
                  <p className="text-sm text-muted-foreground">
                    Em Angola, onde a inflação pode ser alta, considere como isso afetará sua 
                    capacidade de pagamento no futuro antes de assumir dívidas de longo prazo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta dívida? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              Adicione um pagamento para reduzir o saldo da dívida.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment">Valor (Kz)</Label>
              <Input
                id="payment"
                type="number"
                placeholder="0"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddPayment}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Debts;
