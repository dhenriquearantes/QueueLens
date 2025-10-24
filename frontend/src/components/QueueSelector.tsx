import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useMemo, useState } from "react";
import { Separator } from "./ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateServer, addServer, listServers, testServer, type RabbitServer } from "@/api/servers";

const QueueSelector = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [testMessage, setTestMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data } = useQuery({ queryKey: ["servers"], queryFn: listServers });
  const servers = data?.data ?? [];
  const activeId = data?.activeId ?? null;

  const selectedServer = useMemo(() => servers.find((s) => s.id === activeId) ?? null, [servers, activeId]);

  const activateMutation = useMutation({
    mutationFn: (id: string) => activateServer(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["servers"] });
      setOpen(false);
    },
  });

  const addMutation = useMutation({
    mutationFn: (server: RabbitServer) => addServer(server),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["servers"] });
      // auto-activate newly added server
      await activateMutation.mutateAsync(variables.id);
      setDialogOpen(false);
      setName("");
      setBaseUrl("");
      setUsername("");
      setPassword("");
    },
  });

  const handleSelect = (server: RabbitServer) => {
    activateMutation.mutate(server.id);
  };

  const handleAddServer = () => {
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    addMutation.mutate({ id, name, baseUrl, username, password });
  };

  const handleTestServer = async () => {
    setTestMessage(null);
    try {
      const result = await testServer({ baseUrl, username, password });
      setTestMessage(result.ok ? `OK (${result.count ?? 0} queues)` : `Failed: ${result.message ?? "unknown"}`);
    } catch (e: any) {
      setTestMessage(`Failed: ${e?.message ?? "unknown"}`);
    }
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
      <PopoverContent side="top" className="w-64 p-0">
        <div className="p-2">
          <h3 className="font-medium px-2 pb-2">Servers</h3>
          <Separator />
          <div className="flex flex-col max-h-56 overflow-auto">
            {servers.map((server) => (
              <div key={server.id} className="w-full">
                <div
                  className="flex justify-between items-center w-full px-2 py-1 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => handleSelect(server)}
                >
                  <span className="truncate" title={server.name}>{server.name}</span>
                  {activeId === server.id && (
                    <Check className="h-4 w-4 mr-2 text-white" />
                  )}
                </div>
              </div>
            ))}
            {servers.length === 0 && (
              <div className="text-sm text-muted-foreground px-2 py-3">Nenhum servidor cadastrado</div>
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
                      placeholder="Ex: Production Server"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-url">RabbitMQ Management URL</Label>
                    <Input
                      id="server-url"
                      placeholder="Ex: http://localhost:15672"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-username">Username</Label>
                    <Input
                      id="server-username"
                      placeholder="Ex: admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="server-password">Password</Label>
                    <Input
                      id="server-password"
                      placeholder="Ex: admin"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {testMessage && (
                    <div className="text-xs text-muted-foreground">{testMessage}</div>
                  )}
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
