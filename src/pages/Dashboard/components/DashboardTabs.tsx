
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentTransactions from "./RecentTransactions";
import CategorySpending from "./CategorySpending";

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="recent" className="col-span-2 lg:col-span-1">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="recent">Transações Recentes</TabsTrigger>
        <TabsTrigger value="categories">Despesas por Categoria</TabsTrigger>
      </TabsList>
      <TabsContent value="recent" className="space-y-4">
        <RecentTransactions />
      </TabsContent>
      <TabsContent value="categories">
        <CategorySpending />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
