import { apiMutation, apiRequest } from "@/lib/client/api";

import type { AsyncMutationResult } from "@/types/entities/admin";
import type { AwaitedReturn, FirstArg, MutationData, SecondArg } from "@/types/shared/type-utils";
import type {
  AdminResources,
  CreateCustomer,
  CreateEmployee,
  CreateInvoice,
  CreateOrder,
  CreateExpense,
  CreatePayment,
  CreateRawMaterial,
  CreateSupplier,
  CreateWorkLog,
  DeleteCustomer,
  DeleteEmployee,
  DeleteEntity,
  DeleteInvoice,
  DeleteOrder,
  DeleteExpense,
  DeletePayment,
  DeleteRawMaterial,
  DeleteSupplier,
  DeleteWorkLog,
  GetCustomer,
  GetEmployee,
  GetInvoice,
  GetOrder,
  GetExpense,
  GetPayment,
  GetRawMaterial,
  GetSupplier,
  GetWorkLog,
  ListCustomers,
  ListEmployees,
  ListInvoices,
  ListOrders,
  ListExpenses,
  ListPayments,
  ListRawMaterials,
  ListSuppliers,
  ListWorkLogs,
  UpdateCustomer,
  UpdateEmployee,
  UpdateInvoice,
  UpdateOrder,
  UpdateExpense,
  UpdatePayment,
  UpdateRawMaterial,
  UpdateSupplier,
  UpdateWorkLog,
} from "@/types/api/admin";

const resources = {
  customer: "/api/customers",
  employee: "/api/employees",
  order: "/api/orders",
  supplier: "/api/suppliers",
  rawMaterial: "/api/materials",
  workLog: "/api/work-logs",
  invoice: "/api/invoices",
  payment: "/api/payments",
  expense: "/api/expenses",
} as const satisfies Record<AdminResources, string>;

const emptyBody: Record<string, never> = {};

async function listResource<T>(path: string): Promise<T> {
  return apiRequest<T>(path);
}

async function getResource<T>(path: string, id: string): Promise<T> {
  return apiRequest<T>(`${path}/${id}`);
}

async function createResource<T, P>(path: string, payload: P, message: string): Promise<AsyncMutationResult<T>> {
  const data = await apiMutation<T, P>(path, "POST", payload);
  return { data, message };
}

async function updateResource<T, P>(path: string, id: string, payload: P, message: string): Promise<AsyncMutationResult<T>> {
  const data = await apiMutation<T, P>(`${path}/${id}`, "PATCH", payload);
  return { data, message };
}

async function deleteResource<T>(path: string, id: string, message: string): Promise<AsyncMutationResult<T>> {
  const data = await apiMutation<T, Record<string, never>>(`${path}/${id}`, "DELETE", emptyBody);
  return { data, message };
}

export const listEmployees: ListEmployees = () => listResource<AwaitedReturn<ListEmployees>>(resources.employee);
export const getEmployee: GetEmployee = (id) => getResource<AwaitedReturn<GetEmployee>>(resources.employee, id);
export const createEmployee: CreateEmployee = (payload) =>
  createResource<MutationData<CreateEmployee>, FirstArg<CreateEmployee>>(resources.employee, payload, "Employee created.");
export const updateEmployee: UpdateEmployee = (id, payload) =>
  updateResource<MutationData<UpdateEmployee>, SecondArg<UpdateEmployee>>(resources.employee, id, payload, "Employee updated.");
export const deleteEmployee: DeleteEmployee = (id) =>
  deleteResource<MutationData<DeleteEmployee>>(resources.employee, id, "Employee deleted.");

export const listCustomers: ListCustomers = () => listResource<AwaitedReturn<ListCustomers>>(resources.customer);
export const getCustomer: GetCustomer = (id) => getResource<AwaitedReturn<GetCustomer>>(resources.customer, id);
export const createCustomer: CreateCustomer = (payload) =>
  createResource<MutationData<CreateCustomer>, FirstArg<CreateCustomer>>(resources.customer, payload, "Customer created.");
export const updateCustomer: UpdateCustomer = (id, payload) =>
  updateResource<MutationData<UpdateCustomer>, SecondArg<UpdateCustomer>>(resources.customer, id, payload, "Customer updated.");
export const deleteCustomer: DeleteCustomer = (id) =>
  deleteResource<MutationData<DeleteCustomer>>(resources.customer, id, "Customer deleted.");

export const listOrders: ListOrders = () => listResource<AwaitedReturn<ListOrders>>(resources.order);
export const getOrder: GetOrder = (id) => getResource<AwaitedReturn<GetOrder>>(resources.order, id);
export const createOrder: CreateOrder = (payload) =>
  createResource<MutationData<CreateOrder>, FirstArg<CreateOrder>>(resources.order, payload, "Order created.");
export const updateOrder: UpdateOrder = (id, payload) =>
  updateResource<MutationData<UpdateOrder>, SecondArg<UpdateOrder>>(resources.order, id, payload, "Order updated.");
export const deleteOrder: DeleteOrder = (id) =>
  deleteResource<MutationData<DeleteOrder>>(resources.order, id, "Order deleted.");

export const listSuppliers: ListSuppliers = () => listResource<AwaitedReturn<ListSuppliers>>(resources.supplier);
export const getSupplier: GetSupplier = (id) => getResource<AwaitedReturn<GetSupplier>>(resources.supplier, id);
export const createSupplier: CreateSupplier = (payload) =>
  createResource<MutationData<CreateSupplier>, FirstArg<CreateSupplier>>(resources.supplier, payload, "Supplier created.");
export const updateSupplier: UpdateSupplier = (id, payload) =>
  updateResource<MutationData<UpdateSupplier>, SecondArg<UpdateSupplier>>(resources.supplier, id, payload, "Supplier updated.");
export const deleteSupplier: DeleteSupplier = (id) =>
  deleteResource<MutationData<DeleteSupplier>>(resources.supplier, id, "Supplier deleted.");

export const listRawMaterials: ListRawMaterials = () => listResource<AwaitedReturn<ListRawMaterials>>(resources.rawMaterial);
export const getRawMaterial: GetRawMaterial = (id) => getResource<AwaitedReturn<GetRawMaterial>>(resources.rawMaterial, id);
export const createRawMaterial: CreateRawMaterial = (payload) =>
  createResource<MutationData<CreateRawMaterial>, FirstArg<CreateRawMaterial>>(resources.rawMaterial, payload, "Material created.");
export const updateRawMaterial: UpdateRawMaterial = (id, payload) =>
  updateResource<MutationData<UpdateRawMaterial>, SecondArg<UpdateRawMaterial>>(resources.rawMaterial, id, payload, "Material updated.");
export const deleteRawMaterial: DeleteRawMaterial = (id) =>
  deleteResource<MutationData<DeleteRawMaterial>>(resources.rawMaterial, id, "Material deleted.");

export const listWorkLogs: ListWorkLogs = () => listResource<AwaitedReturn<ListWorkLogs>>(resources.workLog);
export const getWorkLog: GetWorkLog = (id) => getResource<AwaitedReturn<GetWorkLog>>(resources.workLog, id);
export const createWorkLog: CreateWorkLog = (payload) =>
  createResource<MutationData<CreateWorkLog>, FirstArg<CreateWorkLog>>(resources.workLog, payload, "Work log recorded.");
export const updateWorkLog: UpdateWorkLog = (id, payload) =>
  updateResource<MutationData<UpdateWorkLog>, SecondArg<UpdateWorkLog>>(resources.workLog, id, payload, "Work log updated.");
export const deleteWorkLog: DeleteWorkLog = (id) =>
  deleteResource<MutationData<DeleteWorkLog>>(resources.workLog, id, "Work log deleted.");

export const listInvoices: ListInvoices = () => listResource<AwaitedReturn<ListInvoices>>(resources.invoice);
export const getInvoice: GetInvoice = (id) => getResource<AwaitedReturn<GetInvoice>>(resources.invoice, id);
export const createInvoice: CreateInvoice = (payload) =>
  createResource<MutationData<CreateInvoice>, FirstArg<CreateInvoice>>(resources.invoice, payload, "Invoice created.");
export const updateInvoice: UpdateInvoice = (id, payload) =>
  updateResource<MutationData<UpdateInvoice>, SecondArg<UpdateInvoice>>(resources.invoice, id, payload, "Invoice updated.");
export const deleteInvoice: DeleteInvoice = (id) =>
  deleteResource<MutationData<DeleteInvoice>>(resources.invoice, id, "Invoice deleted.");

export const listPayments: ListPayments = () => listResource<AwaitedReturn<ListPayments>>(resources.payment);
export const getPayment: GetPayment = (id) => getResource<AwaitedReturn<GetPayment>>(resources.payment, id);
export const createPayment: CreatePayment = (payload) =>
  createResource<MutationData<CreatePayment>, FirstArg<CreatePayment>>(resources.payment, payload, "Payment created.");
export const updatePayment: UpdatePayment = (id, payload) =>
  updateResource<MutationData<UpdatePayment>, SecondArg<UpdatePayment>>(resources.payment, id, payload, "Payment updated.");
export const deletePayment: DeletePayment = (id) =>
  deleteResource<MutationData<DeletePayment>>(resources.payment, id, "Payment deleted.");

export const listExpenses: ListExpenses = () => listResource<AwaitedReturn<ListExpenses>>(resources.expense);
export const getExpense: GetExpense = (id) => getResource<AwaitedReturn<GetExpense>>(resources.expense, id);
export const createExpense: CreateExpense = (payload) =>
  createResource<MutationData<CreateExpense>, FirstArg<CreateExpense>>(resources.expense, payload, "Expense recorded.");
export const updateExpense: UpdateExpense = (id, payload) =>
  updateResource<MutationData<UpdateExpense>, SecondArg<UpdateExpense>>(resources.expense, id, payload, "Expense updated.");
export const deleteExpense: DeleteExpense = (id) =>
  deleteResource<MutationData<DeleteExpense>>(resources.expense, id, "Expense deleted.");

export const deleteEntity: DeleteEntity = (entity, id) => {
  const resource = resources[entity];
  return deleteResource<MutationData<DeleteEntity>>(resource, id, `${entity} deleted.`);
};
