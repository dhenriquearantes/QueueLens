import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Separator } from "./ui/separator";

const rabbitServersMock = [
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3" },
];

type RabbitServer = typeof rabbitServersMock[number];

const QueueSelector = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<RabbitServer>(rabbitServersMock[0]);

  const handleSelect = (server: RabbitServer) => {
    setSelectedServer(server);
    setOpen(false);
  };

  const handleAddServer = () => {
  };

  const handleTestServer = () => {
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between items-center px-3 py-4"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="ml-2">
            {selectedServer ? selectedServer.name : "Selecione um servidor RabbitMQ"}
          </span>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-56 p-0">
        <div className="p-2">
          <h3 className="font-medium px-2 pb-2">Servers</h3>
          <Separator />
          <div className="flex flex-col">
            {rabbitServersMock.map((server) => (
              <div key={server.id} className="w-full">
                <div
                  className="flex justify-between items-center w-full px-2 py-1 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => handleSelect(server)}
                >
                  {server.name}
                  {selectedServer.id === server.id && (
                    <Check className="h-4 w-4 mr-2 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  + Add server
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add new server</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="server-name">Server name</Label>
                    <Input
                      id="server-name"
                      placeholder="Ex: Production Server"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-url">URL do Servidor</Label>
                    <Input
                      id="server-url"
                      placeholder="Ex: amqp://localhost:5672"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-port">Port</Label>
                    <Input
                      id="server-port"
                      placeholder="Ex: 5672"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-username">Username</Label>
                    <Input
                      id="server-username"
                      placeholder="Ex: admin"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-password">Password</Label>
                    <Input
                      id="server-password"
                      placeholder="Ex: admin"
                    />
                  </div>
                  
                </div>
                <DialogFooter className="w-full">
                  <div className="flex justify-between items-center w-full">
                    <Button variant="secondary" onClick={handleTestServer}>
                      Test connection
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddServer}>
                        Add
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QueueSelector;
