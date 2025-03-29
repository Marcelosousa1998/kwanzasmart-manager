
import { 
  Home, 
  ShoppingCart, 
  Car, 
  Backpack, 
  Music, 
  Cable, 
  HeartPulse, 
  ShoppingBag, 
  PiggyBank, 
  CircleDollarSign, 
  Send, 
  HelpCircle, 
  Banknote 
} from "lucide-react";
import { TransactionCategory } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
  category: TransactionCategory;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className }) => {
  const iconProps = {
    className: cn("h-5 w-5", className),
  };

  switch (category) {
    case "income":
      return <Banknote {...iconProps} />;
    case "housing":
      return <Home {...iconProps} />;
    case "food":
      return <ShoppingCart {...iconProps} />;
    case "transportation":
      return <Car {...iconProps} />;
    case "education":
      return <Backpack {...iconProps} />;
    case "entertainment":
      return <Music {...iconProps} />;
    case "utilities":
      return <Cable {...iconProps} />;
    case "healthcare":
      return <HeartPulse {...iconProps} />;
    case "shopping":
      return <ShoppingBag {...iconProps} />;
    case "savings":
      return <PiggyBank {...iconProps} />;
    case "debt":
      return <CircleDollarSign {...iconProps} />;
    case "remittances":
      return <Send {...iconProps} />;
    case "other":
    default:
      return <HelpCircle {...iconProps} />;
  }
};

export default CategoryIcon;
