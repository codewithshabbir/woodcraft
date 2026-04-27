import type {
  AsyncMutationResult,
  CustomerRecord,
  EmployeeRecord,
  ExpenseRecord,
  InvoiceRecord,
  OrderRecord,
  PaymentRecord,
  RawMaterialRecord,
  SupplierRecord,
  WorkLogRecord,
} from "@/types/entities/admin";

export type AdminResources =
  | "customer"
  | "employee"
  | "order"
  | "supplier"
  | "rawMaterial"
  | "workLog"
  | "invoice"
  | "payment"
  | "expense";

export type ListEmployees = () => Promise<EmployeeRecord[]>;
export type GetEmployee = (id: string) => Promise<EmployeeRecord>;
export type CreateEmployee = (payload: Partial<EmployeeRecord>) => Promise<AsyncMutationResult<EmployeeRecord>>;
export type UpdateEmployee = (id: string, payload: Partial<EmployeeRecord>) => Promise<AsyncMutationResult<EmployeeRecord>>;
export type DeleteEmployee = (id: string) => Promise<AsyncMutationResult<{ id: string }>>;

export type ListCustomers = () => Promise<CustomerRecord[]>;
export type GetCustomer = (id: string) => Promise<CustomerRecord>;
export type CreateCustomer = (payload: Partial<CustomerRecord>) => Promise<AsyncMutationResult<CustomerRecord>>;
export type UpdateCustomer = (id: string, payload: Partial<CustomerRecord>) => Promise<AsyncMutationResult<CustomerRecord>>;
export type DeleteCustomer = (id: string) => Promise<AsyncMutationResult<{ id: string }>>;

export type ListOrders = () => Promise<OrderRecord[]>;
export type GetOrder = (id: string) => Promise<OrderRecord>;
export type CreateOrder = (payload: Partial<OrderRecord>) => Promise<AsyncMutationResult<OrderRecord>>;
export type UpdateOrder = (id: string, payload: Partial<OrderRecord>) => Promise<AsyncMutationResult<OrderRecord>>;
export type DeleteOrder = (id: string) => Promise<AsyncMutationResult<{ id: string }>>;

export type ListSuppliers = () => Promise<SupplierRecord[]>;
export type GetSupplier = (id: string) => Promise<SupplierRecord>;
export type CreateSupplier = (payload: Partial<SupplierRecord>) => Promise<AsyncMutationResult<SupplierRecord>>;
export type UpdateSupplier = (id: string, payload: Partial<SupplierRecord>) => Promise<AsyncMutationResult<SupplierRecord>>;
export type DeleteSupplier = (id: string) => Promise<AsyncMutationResult<{ id: string }>>;

export type ListRawMaterials = () => Promise<RawMaterialRecord[]>;
export type GetRawMaterial = (id: string) => Promise<RawMaterialRecord>;
export type CreateRawMaterial = (payload: Partial<RawMaterialRecord>) => Promise<AsyncMutationResult<RawMaterialRecord>>;
export type UpdateRawMaterial = (id: string, payload: Partial<RawMaterialRecord>) => Promise<AsyncMutationResult<RawMaterialRecord>>;
export type DeleteRawMaterial = (id: string) => Promise<AsyncMutationResult<{ id: string }>>;

export type ListWorkLogs = () => Promise<WorkLogRecord[]>;
export type GetWorkLog = (id: string) => Promise<WorkLogRecord>;
export type CreateWorkLog = (payload: Partial<WorkLogRecord>) => Promise<AsyncMutationResult<WorkLogRecord>>;
export type UpdateWorkLog = (id: string, payload: Partial<WorkLogRecord>) => Promise<AsyncMutationResult<WorkLogRecord>>;
export type DeleteWorkLog = (id: string) => Promise<AsyncMutationResult<{ id: string }>>;

export type ListInvoices = () => Promise<InvoiceRecord[]>;
export type GetInvoice = (id: string) => Promise<InvoiceRecord>;
export type CreateInvoice = (payload: Partial<InvoiceRecord>) => Promise<AsyncMutationResult<InvoiceRecord>>;
export type UpdateInvoice = (id: string, payload: Partial<InvoiceRecord>) => Promise<AsyncMutationResult<InvoiceRecord>>;
export type DeleteInvoice = (id: string) => Promise<AsyncMutationResult<{ id: string }>>;

export type ListPayments = () => Promise<PaymentRecord[]>;
export type GetPayment = (id: string) => Promise<PaymentRecord>;
export type CreatePayment = (payload: Partial<PaymentRecord>) => Promise<AsyncMutationResult<PaymentRecord>>;
export type UpdatePayment = (id: string, payload: Partial<PaymentRecord>) => Promise<AsyncMutationResult<PaymentRecord>>;
export type DeletePayment = (id: string) => Promise<AsyncMutationResult<{ id: string }>>;

export type ListExpenses = () => Promise<ExpenseRecord[]>;
export type GetExpense = (id: string) => Promise<ExpenseRecord>;
export type CreateExpense = (payload: Partial<ExpenseRecord>) => Promise<AsyncMutationResult<ExpenseRecord>>;
export type UpdateExpense = (id: string, payload: Partial<ExpenseRecord>) => Promise<AsyncMutationResult<ExpenseRecord>>;
export type DeleteExpense = (id: string) => Promise<AsyncMutationResult<{ id: string }>>;

export type DeleteEntity = (entity: AdminResources, id: string) => Promise<AsyncMutationResult<{ id: string }>>;
