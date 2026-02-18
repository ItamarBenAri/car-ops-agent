import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ChevronLeft, Clock, Zap } from "lucide-react";
import { useTranslations } from "../locales";

interface AgentRun {
  id: string;
  type: "chat" | "upload" | "analysis";
  status: "done" | "failed" | "running";
  duration: string;
  toolCalls: number;
  timestamp: string;
}

interface RunStep {
  id: string;
  step: string;
  status: "done" | "running" | "pending";
  duration?: string;
  toolInput?: string;
  toolOutput?: string;
  error?: string;
}

const runs: AgentRun[] = [
  {
    id: "run_001",
    type: "chat",
    status: "done",
    duration: "2.4s",
    toolCalls: 3,
    timestamp: "2026-02-16 14:30:22",
  },
  {
    id: "run_002",
    type: "upload",
    status: "done",
    duration: "5.1s",
    toolCalls: 5,
    timestamp: "2026-02-16 13:15:10",
  },
  {
    id: "run_003",
    type: "analysis",
    status: "failed",
    duration: "1.2s",
    toolCalls: 1,
    timestamp: "2026-02-16 12:45:33",
  },
  {
    id: "run_004",
    type: "chat",
    status: "done",
    duration: "3.8s",
    toolCalls: 4,
    timestamp: "2026-02-16 11:20:05",
  },
];

const runSteps: RunStep[] = [
  {
    id: "1",
    step: "Parse user query",
    status: "done",
    duration: "0.2s",
  },
  {
    id: "2",
    step: "Search vehicle history",
    status: "done",
    duration: "0.8s",
    toolInput: JSON.stringify({ query: "brake issues", vehicleId: "1" }),
    toolOutput: JSON.stringify({ results: 3, mostRecent: "2026-01-28" }),
  },
  {
    id: "3",
    step: "Retrieve maintenance records",
    status: "done",
    duration: "0.6s",
    toolInput: JSON.stringify({ category: "brakes", limit: 5 }),
    toolOutput: JSON.stringify({ records: 2 }),
  },
  {
    id: "4",
    step: "Generate structured response",
    status: "done",
    duration: "0.8s",
  },
];

export function Observability() {
  const t = useTranslations();
  const [selectedRun, setSelectedRun] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const getTypeLabel = (type: AgentRun["type"]) => {
    switch (type) {
      case "chat":
        return t.observability.types.chatResponse;
      case "upload":
        return t.observability.types.receiptParsing;
      case "analysis":
        return t.observability.types.issueAnalysis;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-right">{t.observability.title}</h1>
        <p className="text-muted-foreground mt-1 text-right text-sm md:text-base">
          {t.observability.subtitle}
        </p>
      </div>

      {!selectedRun ? (
        /* Runs table */
        <Card>
          <CardHeader>
            <CardTitle className="text-right text-sm md:text-base">{t.observability.runsTable.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">{t.observability.runsTable.actions}</TableHead>
                    <TableHead className="text-right">{t.observability.runDetail.duration}</TableHead>
                    <TableHead className="text-right">{t.observability.runsTable.toolCalls}</TableHead>
                    <TableHead className="text-right">{t.observability.runDetail.status}</TableHead>
                    <TableHead className="text-right">{t.observability.runsTable.type}</TableHead>
                    <TableHead className="text-right">{t.observability.runsTable.dateTime}</TableHead>
                    <TableHead className="text-right">{t.observability.runsTable.id}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((run) => (
                    <TableRow
                      key={run.id}
                      className="cursor-pointer hover:bg-secondary/50"
                      onClick={() => setSelectedRun(run.id)}
                    >
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ChevronLeft className="w-3 h-3" />
                          {t.observability.runsTable.viewDetails}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{run.duration}</span>
                          <Clock className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{run.toolCalls}</span>
                          <Zap className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge type="status" value={run.status} />
                      </TableCell>
                      <TableCell className="text-right">{getTypeLabel(run.type)}</TableCell>
                      <TableCell className="text-right font-mono text-xs md:text-sm">
                        {run.timestamp}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs md:text-sm">
                        {run.id}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Run details */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge type="status" value="done" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>2.4s</span>
                <Clock className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>3 כלים</span>
                <Zap className="w-3 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setSelectedRun(null)}>
                {t.observability.runDetail.backToList}
              </Button>
              <h2 className="text-xl font-semibold">פרטי ריצה: {selectedRun}</h2>
            </div>
          </div>

          {/* Timeline of steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">{t.observability.runDetail.timeline}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {runSteps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === "done"
                          ? "bg-green-100 text-green-600"
                          : step.status === "running"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.status === "done" ? "✓" : index + 1}
                    </div>
                    {index < runSteps.length - 1 && (
                      <div className="w-0.5 h-16 bg-border mt-2"></div>
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {step.duration && (
                          <>
                            <span>{step.duration}</span>
                            <Clock className="w-3 h-3" />
                          </>
                        )}
                      </div>
                      <h3 className="font-semibold text-right">{step.step}</h3>
                    </div>

                    {(step.toolInput || step.toolOutput || step.error) && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setExpandedStep(expandedStep === step.id ? null : step.id)
                          }
                          className="mb-3"
                        >
                          {expandedStep === step.id ? "הסתר פרטים" : "הצג פרטים"}
                        </Button>

                        {expandedStep === step.id && (
                          <div className="space-y-3">
                            {step.toolInput && (
                              <div>
                                <p className="text-sm font-medium mb-1 text-right">
                                  Tool Input:
                                </p>
                                <pre className="bg-secondary p-3 rounded-lg text-xs overflow-x-auto">
                                  {JSON.stringify(JSON.parse(step.toolInput), null, 2)}
                                </pre>
                              </div>
                            )}
                            {step.toolOutput && (
                              <div>
                                <p className="text-sm font-medium mb-1 text-right">
                                  Tool Output:
                                </p>
                                <pre className="bg-secondary p-3 rounded-lg text-xs overflow-x-auto">
                                  {JSON.stringify(JSON.parse(step.toolOutput), null, 2)}
                                </pre>
                              </div>
                            )}
                            {step.error && (
                              <div>
                                <p className="text-sm font-medium mb-1 text-right text-destructive">
                                  Error:
                                </p>
                                <pre className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-xs overflow-x-auto">
                                  {step.error}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Token usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">שימוש ב-Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-semibold text-primary">1,240</p>
                  <p className="text-sm text-muted-foreground mt-1">Input Tokens</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-primary">856</p>
                  <p className="text-sm text-muted-foreground mt-1">Output Tokens</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-primary">2,096</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Tokens</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
