import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  House
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-card-foreground">
          QueueLens
        </h2>
      </div>

      <nav className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start px-3"
          onClick={() => navigate("/home")}
        >
          <House className="h-4 w-4" />
          <span className="ml-2">Home</span>
        </Button>
        
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start px-3"
            onClick={() => navigate("/queues")}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="ml-2">Filas</span>
          </Button>
        
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
