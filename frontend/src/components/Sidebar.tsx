import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  House,
} from "lucide-react";
import QueueSelector from "./QueueSelector";

const Sidebar = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col justify-between h-screen">
      <div className="flex flex-col flex-1">
        <div className="pt-4 pb-2 px-4">
          <h2 className="text-lg font-semibold text-card-foreground text-center">
            QueueLens
          </h2>
        </div>
        <div className="flex flex-col justify-start flex-1">
          <div className="p-4 space-y-2 w-full">
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
          </div>
        </div>
      </div>
      <div className="p-4">
        <QueueSelector />
      </div>
    </div>
  );
};

export default Sidebar;
