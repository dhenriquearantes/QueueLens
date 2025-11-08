import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/Sidebar";
import { Server, Plus, Trash2, Edit, Check } from "lucide-react";
import { getServers, createServer, updateServer, deleteServer, activateServer } from "@/api/servers";
import { CreateServerDTO, UpdateServerDTO } from "@/api/types";

const Servers = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<any>(null);

  const [formData, setFormData] = useState<CreateServerDTO>({
    name: "",
    url: "",
    username: "",
    password: ""
  });

  const { data: servers, isLoading } = useQuery({
    queryKey: ['servers'],
    queryFn: getServers,
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: createServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      setIsCreateOpen(false);
      setFormData({ name: "", url: "", username: "", password: "" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateServerDTO }) => updateServer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      setIsEditOpen(false);
      setEditingServer(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    }
  });

  const activateMutation = useMutation({
    mutationFn: activateServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    }
  });

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = (server: any) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      url: server.url,
      username: server.username,
      password: server.password
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (editingServer) {
      updateMutation.mutate({ id: editingServer.id, data: formData });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este servidor?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleActivate = (id: string) => {
    activateMutation.mutate(id);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Servidores RabbitMQ</h1>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Servidor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Servidor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Servidor Local"
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="http://localhost:15672"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="guest"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="guest"
                    />
                  </div>
                  <Button onClick={handleCreate} className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Criando..." : "Criar Servidor"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : servers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhum servidor cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    servers?.map((server) => (
                      <TableRow key={server.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-muted-foreground" />
                            {server.name}
                          </div>
                        </TableCell>
                        <TableCell>{server.url}</TableCell>
                        <TableCell>{server.username}</TableCell>
                        <TableCell>
                          {server.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Inativo
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!server.isActive && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleActivate(server.id)}
                                disabled={activateMutation.isPending}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(server)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(server.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Servidor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-username">Usuário</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-password">Senha</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Deixe em branco para manter a senha atual"
              />
            </div>
            <Button onClick={handleUpdate} className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Atualizando..." : "Atualizar Servidor"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Servers;
