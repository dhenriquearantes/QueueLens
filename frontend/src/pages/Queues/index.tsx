import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { getQueues } from "@/api/getQueues";
import { LimitSelector } from "@/components/LimitSelector";
import { useState, useMemo } from "react";

const Queues = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(20);

  const { data: queues } = useQuery({
    queryKey: ['queues'],
    queryFn: () => getQueues(),
    refetchInterval: 30000,
  });

  const limitedQueues = useMemo(() => {
    if (!queues) return [];
    return queues.slice(0, limit);
  }, [queues, limit]);

  const handleQueueClick = (queueName: string) => {
    navigate(`/queues/${queueName}/messages`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Filas</h1>
            <LimitSelector onChange={setLimit} />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Fila</TableHead>
                      <TableHead className="text-right">Mensagens</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {limitedQueues?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                          Nenhuma fila encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      limitedQueues?.map((queue) => (
                        <TableRow
                          key={queue.name}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleQueueClick(queue.name)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              {queue.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {queue.messages}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Queues;
