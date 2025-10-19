import { useState } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { Message } from "@/api/types";
import { getMessages } from "@/api/getMessages";
import { LimitSelector } from "@/components/LimitSelector";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";

const QueueMessages = () => {
  const { queueId } = useParams<{ queueId: string }>();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [limit, setLimit] = useState(20);

  const { data: messages } = useQuery({
    queryKey: ['messages', queueId, limit],
    queryFn: () => getMessages(queueId || '', limit),
    enabled: !!queueId,
    staleTime: 300000,
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground capitalize">{queueId?.replace("-", " ")}</h1>
            <LimitSelector onChange={setLimit} />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Preview</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages ? (
                    messages.map((message) => (
                      <TableRow
                        key={message.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <TableCell className="font-mono text-sm">{message.id || 'N/A'}</TableCell>
                        <TableCell>{message.timestamp || 'N/A'}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground truncate max-w-md">
                          {JSON.stringify(message.payload || {})}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Nenhuma mensagem encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Mensagem</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="font-mono">{selectedMessage.id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                  <p>{selectedMessage.timestamp || 'N/A'}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Payload JSON</p>
                  <Copy className="w-4 h-4 mb-2 cursor-pointer text-muted-foreground hover:text-white" onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedMessage.payload || {}, null, 2))} />
                </div>
                <Textarea
                  value={JSON.stringify(selectedMessage.payload || {}, null, 2)}
                  className="bg-muted p-4 overflow-auto text-sm w-full"
                  style={{ minHeight: '400px' }}
                  readOnly
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueueMessages;
