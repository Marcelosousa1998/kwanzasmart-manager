
import React, { useState } from "react";
import { Search, Filter, ArrowUpDown, Calendar } from "lucide-react";
import { TransactionCategory } from "@/types/finance";
import { allCategories, getCategoryLabel } from "@/utils/categoryUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactionFilters } from "../hooks/useTransactionFilters";

const TransactionFilters = () => {
  const {
    searchQuery, 
    setSearchQuery,
    selectedCategory, 
    setSelectedCategory,
    filterType, 
    setFilterType,
    sortField, 
    setSortField,
    sortOrder, 
    setSortOrder
  } = useTransactionFilters();

  return (
    <Card>
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-base">Filtros e Busca</CardTitle>
      </CardHeader>
      <CardContent className="p-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
        >
          <SelectTrigger className="h-9">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Categoria" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectLabel>Categorias</SelectLabel>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {getCategoryLabel(category)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value as "all" | "expense" | "income")}
        >
          <SelectTrigger className="h-9">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              <SelectValue placeholder="Tipo" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="expense">Apenas Despesas</SelectItem>
            <SelectItem value="income">Apenas Receitas</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={`${sortField}-${sortOrder}`}
          onValueChange={(value) => {
            const [field, order] = value.split("-");
            setSortField(field as "date" | "amount");
            setSortOrder(order as "asc" | "desc");
          }}
        >
          <SelectTrigger className="h-9">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <SelectValue placeholder="Ordenar por" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Data (mais recente)</SelectItem>
            <SelectItem value="date-asc">Data (mais antiga)</SelectItem>
            <SelectItem value="amount-desc">Valor (maior)</SelectItem>
            <SelectItem value="amount-asc">Valor (menor)</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default TransactionFilters;
