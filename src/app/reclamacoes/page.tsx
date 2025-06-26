"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Download,
  Filter,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Type definitions
type ComplaintStatus =
  | "SUBMITTED"
  | "IN_ANALYSIS"
  | "WAITING_CONSUMER_RESPONSE"
  | "WAITING_COMPANY_RESPONSE"
  | "IN_MEDIATION"
  | "RESOLVED"
  | "NOT_RESOLVED"
  | "ARCHIVED"
  | "CANCELLED";

type ComplaintCategory =
  | "AIR_TRANSPORT"
  | "INTERNET_PURCHASE"
  | "DELIVERY_DELAY"
  | "COMPLAINT"
  | "BANKING_FINANCE"
  | "TELEPHONY"
  | "CONTRACT_CANCELLATION"
  | "OTHER";

interface Complaint {
  id: string;
  protocolNumber: string;
  consumerName: string;
  companyName: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  value?: number;
  createdAt: Date;
  updatedAt: Date;
  messages: number;
  attachments: number;
}

// Status config with colors
const statusConfig: Record<
  ComplaintStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  SUBMITTED: {
    label: "Enviada",
    color: "bg-caxias-silver-500",
    icon: FileText,
  },
  IN_ANALYSIS: {
    label: "Em Análise",
    color: "bg-caxias-blue-500",
    icon: Clock,
  },
  WAITING_CONSUMER_RESPONSE: {
    label: "Aguardando Consumidor",
    color: "bg-orange-500",
    icon: AlertCircle,
  },
  WAITING_COMPANY_RESPONSE: {
    label: "Aguardando Empresa",
    color: "bg-orange-dark",
    icon: AlertCircle,
  },
  IN_MEDIATION: {
    label: "Em Mediação",
    color: "bg-caxias-purple-500",
    icon: MessageSquare,
  },
  RESOLVED: {
    label: "Resolvida",
    color: "bg-caxias-green-500",
    icon: CheckCircle,
  },
  NOT_RESOLVED: { label: "Não Resolvida", color: "bg-red-500", icon: XCircle },
  ARCHIVED: { label: "Arquivada", color: "bg-gray-500", icon: FileText },
  CANCELLED: { label: "Cancelada", color: "bg-red-dark", icon: XCircle },
};

// Category labels
const categoryLabels: Record<ComplaintCategory, string> = {
  AIR_TRANSPORT: "Transporte Aéreo",
  INTERNET_PURCHASE: "Compra pela Internet",
  DELIVERY_DELAY: "Atraso na Entrega",
  COMPLAINT: "Denúncia",
  BANKING_FINANCE: "Bancos/Financeiras",
  TELEPHONY: "Telefonia",
  CONTRACT_CANCELLATION: "Cancelamento de Contrato",
  OTHER: "Outros",
};

// Priority config
const priorityConfig = {
  LOW: { label: "Baixa", color: "bg-gray-500" },
  NORMAL: { label: "Normal", color: "bg-caxias-blue-500" },
  HIGH: { label: "Alta", color: "bg-orange-500" },
  URGENT: { label: "Urgente", color: "bg-red-500" },
};

// Mock data
const mockData: Complaint[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  protocolNumber: `2024${String(i + 1).padStart(6, "0")}`,
  consumerName: ["João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa"][
    i % 4
  ],
  companyName: ["Magazine Luiza", "Americanas", "Mercado Livre", "Casas Bahia"][
    i % 4
  ],
  category: Object.keys(categoryLabels)[i % 8] as ComplaintCategory,
  status: Object.keys(statusConfig)[i % 9] as ComplaintStatus,
  priority: ["LOW", "NORMAL", "HIGH", "URGENT"][i % 4] as any,
  value: Math.random() * 5000,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  messages: Math.floor(Math.random() * 10),
  attachments: Math.floor(Math.random() * 5),
}));

export default function ReclamacoesPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Calculate stats
  const stats = {
    total: mockData.length,
    pending: mockData.filter((c) =>
      ["SUBMITTED", "IN_ANALYSIS"].includes(c.status),
    ).length,
    resolved: mockData.filter((c) => c.status === "RESOLVED").length,
    urgent: mockData.filter((c) => c.priority === "URGENT").length,
  };

  // Table columns
  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "protocolNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Protocolo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("protocolNumber")}</span>
      ),
    },
    {
      accessorKey: "consumerName",
      header: "Consumidor",
    },
    {
      accessorKey: "companyName",
      header: "Empresa",
    },
    {
      accessorKey: "category",
      header: "Categoria",
      cell: ({ row }) =>
        categoryLabels[row.getValue("category") as ComplaintCategory],
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as ComplaintStatus;
        const config = statusConfig[status];
        const Icon = config.icon;
        return (
          <Badge
            className={`${config.color} flex w-fit items-center gap-1 text-white`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Prioridade",
      cell: ({ row }) => {
        const priority = row.getValue(
          "priority",
        ) as keyof typeof priorityConfig;
        const config = priorityConfig[priority];
        return (
          <Badge className={`${config.color} text-white`}>{config.label}</Badge>
        );
      },
    },
    {
      accessorKey: "value",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue("value") as number;
        return value
          ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
          : "-";
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Abertura
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        format(row.getValue("createdAt"), "dd/MM/yyyy", { locale: ptBR }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <MessageSquare className="h-4 w-4" />
            <span className="ml-1 text-xs">{row.original.messages}</span>
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <FileText className="h-4 w-4" />
            <span className="ml-1 text-xs">{row.original.attachments}</span>
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="mx-auto max-w-full p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-dark dark:text-white">
          Gerenciamento de Reclamações
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Acompanhe e gerencie todas as reclamações do PROCON
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-lg border bg-white p-6 shadow-card hover:shadow-card-2 dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-dark dark:text-white">
                {stats.total}
              </h4>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Reclamações
              </span>
            </div>
            <div className="bg-caxias-green-light-6 flex h-11 w-11 items-center justify-center rounded-full">
              <FileText className="text-caxias-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-card hover:shadow-card-2 dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-dark dark:text-white">
                {stats.pending}
              </h4>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pendentes
              </span>
            </div>
            <div className="bg-orange-light-5 flex h-11 w-11 items-center justify-center rounded-full">
              <Clock className="text-orange-dark" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-card hover:shadow-card-2 dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-dark dark:text-white">
                {stats.resolved}
              </h4>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Resolvidas
              </span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-light-6">
              <CheckCircle className="text-green" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-card hover:shadow-card-2 dark:border-dark-3 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-dark dark:text-white">
                {stats.urgent}
              </h4>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Urgentes
              </span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-light-5">
              <AlertCircle className="text-red" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-white shadow-card dark:border-dark-3 dark:bg-dark-2">
        {/* Table Header with Filters */}
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Buscar por protocolo, consumidor ou empresa..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("status")
                  ?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {Object.entries(statusConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button
              size="sm"
              className="bg-caxias-green hover:bg-caxias-green-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Reclamação
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-3"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhuma reclamação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            até{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{" "}
            de {table.getFilteredRowModel().rows.length} reclamações
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
