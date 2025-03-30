
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionCategory } from "@/types/finance";

// Funções para transações
export const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from('finance_records')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data.map((record: any): Transaction => ({
    id: record.id,
    amount: record.amount,
    description: record.description,
    category: record.category as TransactionCategory,
    date: record.date,
    isExpense: record.type === 'expense',
  }));
};

export const createTransaction = async (transaction: Omit<Transaction, "id">, userId: string) => {
  // Make sure the user ID is included in the request
  if (!userId) {
    throw new Error("User ID is required to create a transaction");
  }

  const { data, error } = await supabase
    .from('finance_records')
    .insert([{
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
      type: transaction.isExpense ? 'expense' : 'income',
      created_by: userId,
    }])
    .select('*')
    .single();
  
  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }
  
  return {
    id: data.id,
    amount: data.amount,
    description: data.description,
    category: data.category as TransactionCategory,
    date: data.date,
    isExpense: data.type === 'expense',
  };
};

export const updateTransaction = async (transaction: Transaction) => {
  const { error } = await supabase
    .from('finance_records')
    .update({
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
      type: transaction.isExpense ? 'expense' : 'income',
    })
    .eq('id', transaction.id);
  
  if (error) {
    throw error;
  }
  
  return transaction;
};

export const deleteTransaction = async (id: string) => {
  const { error } = await supabase
    .from('finance_records')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw error;
  }
  
  return id;
};

// Outros services para orçamentos, metas e dívidas podem ser adicionados aqui
// conforme a estrutura da base de dados
