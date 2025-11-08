import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServers, getActiveServer, activateServer, createServer } from "@/api/servers";
import { CreateServerDTO } from "@/api/types";

const ServerSelector = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateServerDTO>({
    name: "",
    url: "",
    port: "",
    username: "",
    password: ""
  });

  const { data: servers } = useQuery({
    queryKey: ['servers'],
    queryFn: getServers,
    refetchInterval: 30000,
  });

  const { data: activeServer } = useQuery({
    queryKey: ['activeServer'],
    queryFn: getActiveServer,
    refetchInterval: 30000,
  });

  const activateMutation = useMutation({
    mutationFn: activateServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeServer'] });
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      setOpen(false);
    }
  });

  const createMutation = useMutation({
    mutationFn: createServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      queryClient.invalidateQueries({ queryKey: ['activeServer'] });
      setDialogOpen(false);
      setFormData({ name: "", url: "", port: "", username: "", password: "" });
    }
  });

  const handleSelect = (serverId: string) => {
    activateMutation.mutate(serverId);
  };

  const handleAddServer = () => {
    createMutation.mutate(formData);
  };

  const handleTestServer = () => {
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between items-center px-3 py-4 border"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="ml-2">
            {activeServer ? activeServer.name : "Servidores"}
          </span>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-56 p-0">
        <div className="p-2">
          <h3 className="font-medium px-2 pb-2">Servers</h3>
          <Separator />
          <div className="flex flex-col">
            {servers && servers.length > 0 ? (
              servers.map((server) => (
                <div key={server.id} className="w-full">
                  <div
                    className="flex justify-between items-center w-full px-2 py-1 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => handleSelect(server.id)}
                  >
                    {server.name}
                    {activeServer?.id === server.id && (
                      <Check className="h-4 w-4 mr-2 text-white" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-muted-foreground text-center">
                Nenhum servidor cadastrado
              </div>
            )}
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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Production Server"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-url">URL do Servidor</Label>
                    <Input
                      id="server-url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="Ex: http://localhost"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-port">Port</Label>
                    <Input
                      id="server-port"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      placeholder="Ex: 15672"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-username">Username</Label>
                    <Input
                      id="server-username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Ex: admin"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-password">Password</Label>
                    <Input
                      id="server-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                      <Button onClick={handleAddServer} disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Adding..." : "Add"}
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

export default ServerSelector;
