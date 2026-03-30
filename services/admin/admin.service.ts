import {
  employeeRecords,
  estimateRecords,
  invoiceRecords,
  orderRecords,
  purchaseRecords,
  rawMaterialRecords,
  supplierRecords,
  workAssignmentRecords,
} from "@/services/admin/admin.data"
import type {
  AsyncMutationResult,
  EmployeeRecord,
  EstimateRecord,
  InvoiceRecord,
  OrderRecord,
  PurchaseRecord,
  RawMaterialRecord,
  SupplierRecord,
  WorkAssignmentRecord,
} from "@/types/admin"

const MOCK_DELAY_MS = 160

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const delay = async (ms = MOCK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

let employeesStore = clone(employeeRecords)
let ordersStore = clone(orderRecords)
let suppliersStore = clone(supplierRecords)
const invoicesStore = clone(invoiceRecords)
let estimatesStore = clone(estimateRecords)
let rawMaterialsStore = clone(rawMaterialRecords)
let workAssignmentsStore = clone(workAssignmentRecords)
let purchaseRecordsStore = clone(purchaseRecords)

type StoreEntity = "employee" | "order" | "supplier" | "invoice" | "estimate" | "rawMaterial" | "workAssignment" | "purchaseRecord"

type MutationListener = (entity: StoreEntity) => void
const listeners = new Set<MutationListener>()

function emit(entity: StoreEntity) {
  listeners.forEach((listener) => listener(entity))
}

export function subscribeAdminStore(listener: MutationListener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

async function simulateRead<T>(factory: () => T): Promise<T> {
  await delay()

  try {
    return clone(factory())
  } catch (error) {
    throw toError(error, "Could not load data.")
  }
}

async function simulateMutation<T>(entity: StoreEntity, message: string, factory: () => T): Promise<AsyncMutationResult<T>> {
  await delay()

  try {
    const data = clone(factory())
    emit(entity)
    return { data, message }
  } catch (error) {
    throw toError(error, `Could not complete ${entity} request.`)
  }
}

function toError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error
  }

  return new Error(fallback)
}

function resolveOrThrow<T>(record: T | undefined, message: string) {
  if (!record) {
    throw new Error(message)
  }

  return record
}

function nextId(prefix: string, currentIds: string[]) {
  const current = currentIds
    .map((id) => Number(id.replace(`${prefix}-`, "")))
    .filter((value) => !Number.isNaN(value))
  const max = current.length > 0 ? Math.max(...current) : 0
  return `${prefix}-${String(max + 1).padStart(3, "0")}`
}

export async function listEmployees(): Promise<EmployeeRecord[]> {
  return simulateRead(() => employeesStore)
}

export async function getEmployee(id: string): Promise<EmployeeRecord> {
  return simulateRead(() => resolveOrThrow(employeesStore.find((item) => item.id === id), `Employee ${id} was not found.`))
}

export async function createEmployee(payload: Omit<EmployeeRecord, "id"> & { id?: string }): Promise<AsyncMutationResult<EmployeeRecord>> {
  return simulateMutation("employee", "Employee created.", () => {
    const employee: EmployeeRecord = {
      ...payload,
      id: payload.id?.trim() || nextId("EMP", employeesStore.map((item) => item.id)),
    }

    employeesStore = [employee, ...employeesStore]
    return employee
  })
}

export async function updateEmployee(id: string, payload: Partial<EmployeeRecord>): Promise<AsyncMutationResult<EmployeeRecord>> {
  return simulateMutation("employee", "Employee updated.", () => {
    const existing = resolveOrThrow(employeesStore.find((item) => item.id === id), `Employee ${id} was not found.`)
    const updated = { ...existing, ...payload, id: existing.id }
    employeesStore = employeesStore.map((item) => (item.id === id ? updated : item))
    return updated
  })
}

export async function deleteEmployee(id: string): Promise<AsyncMutationResult<{ id: string }>> {
  return simulateMutation("employee", "Employee deleted.", () => {
    const existing = resolveOrThrow(employeesStore.find((item) => item.id === id), `Employee ${id} was not found.`)
    employeesStore = employeesStore.filter((item) => item.id !== id)
    return { id: existing.id }
  })
}

export async function listOrders(): Promise<OrderRecord[]> {
  return simulateRead(() => ordersStore)
}

export async function getOrder(id: string): Promise<OrderRecord> {
  return simulateRead(() => resolveOrThrow(ordersStore.find((item) => item.id === id), `Order ${id} was not found.`))
}

export async function createOrder(payload: Omit<OrderRecord, "id"> & { id?: string }): Promise<AsyncMutationResult<OrderRecord>> {
  return simulateMutation("order", "Order created.", () => {
    const order: OrderRecord = {
      ...payload,
      id: payload.id?.trim() || nextId("ORD", ordersStore.map((item) => item.id)),
    }

    ordersStore = [order, ...ordersStore]
    return order
  })
}

export async function updateOrder(id: string, payload: Partial<OrderRecord>): Promise<AsyncMutationResult<OrderRecord>> {
  return simulateMutation("order", "Order updated.", () => {
    const existing = resolveOrThrow(ordersStore.find((item) => item.id === id), `Order ${id} was not found.`)
    const updated = { ...existing, ...payload, id: existing.id }
    ordersStore = ordersStore.map((item) => (item.id === id ? updated : item))
    return updated
  })
}

export async function deleteOrder(id: string): Promise<AsyncMutationResult<{ id: string }>> {
  return simulateMutation("order", "Order deleted.", () => {
    const existing = resolveOrThrow(ordersStore.find((item) => item.id === id), `Order ${id} was not found.`)
    ordersStore = ordersStore.filter((item) => item.id !== id)
    return { id: existing.id }
  })
}

export async function listSuppliers(): Promise<SupplierRecord[]> {
  return simulateRead(() => suppliersStore)
}

export async function getSupplier(id: string): Promise<SupplierRecord> {
  return simulateRead(() => resolveOrThrow(suppliersStore.find((item) => item.id === id), `Supplier ${id} was not found.`))
}

export async function createSupplier(payload: Omit<SupplierRecord, "id"> & { id?: string }): Promise<AsyncMutationResult<SupplierRecord>> {
  return simulateMutation("supplier", "Supplier created.", () => {
    const supplier: SupplierRecord = {
      ...payload,
      id: payload.id?.trim() || nextId("SUP", suppliersStore.map((item) => item.id)),
    }

    suppliersStore = [supplier, ...suppliersStore]
    return supplier
  })
}

export async function updateSupplier(id: string, payload: Partial<SupplierRecord>): Promise<AsyncMutationResult<SupplierRecord>> {
  return simulateMutation("supplier", "Supplier updated.", () => {
    const existing = resolveOrThrow(suppliersStore.find((item) => item.id === id), `Supplier ${id} was not found.`)
    const updated = { ...existing, ...payload, id: existing.id }
    suppliersStore = suppliersStore.map((item) => (item.id === id ? updated : item))
    return updated
  })
}

export async function deleteSupplier(id: string): Promise<AsyncMutationResult<{ id: string }>> {
  return simulateMutation("supplier", "Supplier deleted.", () => {
    const existing = resolveOrThrow(suppliersStore.find((item) => item.id === id), `Supplier ${id} was not found.`)
    suppliersStore = suppliersStore.filter((item) => item.id !== id)
    return { id: existing.id }
  })
}

export async function listRawMaterials(): Promise<RawMaterialRecord[]> {
  return simulateRead(() => rawMaterialsStore)
}

export async function getRawMaterial(id: string): Promise<RawMaterialRecord> {
  return simulateRead(() => resolveOrThrow(rawMaterialsStore.find((item) => item.id === id), `Material ${id} was not found.`))
}

export async function createRawMaterial(payload: Omit<RawMaterialRecord, "id"> & { id?: string }): Promise<AsyncMutationResult<RawMaterialRecord>> {
  return simulateMutation("rawMaterial", "Material created.", () => {
    const material: RawMaterialRecord = {
      ...payload,
      id: payload.id?.trim() || nextId("MAT", rawMaterialsStore.map((item) => item.id)),
    }

    rawMaterialsStore = [material, ...rawMaterialsStore]
    return material
  })
}

export async function updateRawMaterial(id: string, payload: Partial<RawMaterialRecord>): Promise<AsyncMutationResult<RawMaterialRecord>> {
  return simulateMutation("rawMaterial", "Material updated.", () => {
    const existing = resolveOrThrow(rawMaterialsStore.find((item) => item.id === id), `Material ${id} was not found.`)
    const updated = { ...existing, ...payload, id: existing.id }
    rawMaterialsStore = rawMaterialsStore.map((item) => (item.id === id ? updated : item))
    return updated
  })
}

export async function deleteRawMaterial(id: string): Promise<AsyncMutationResult<{ id: string }>> {
  return simulateMutation("rawMaterial", "Material deleted.", () => {
    const existing = resolveOrThrow(rawMaterialsStore.find((item) => item.id === id), `Material ${id} was not found.`)
    rawMaterialsStore = rawMaterialsStore.filter((item) => item.id !== id)
    return { id: existing.id }
  })
}

export async function listWorkAssignments(): Promise<WorkAssignmentRecord[]> {
  return simulateRead(() => workAssignmentsStore)
}

export async function getWorkAssignment(id: string): Promise<WorkAssignmentRecord> {
  return simulateRead(() => resolveOrThrow(workAssignmentsStore.find((item) => item.id === id), `Work assignment ${id} was not found.`))
}

export async function createWorkAssignment(payload: Omit<WorkAssignmentRecord, "id"> & { id?: string }): Promise<AsyncMutationResult<WorkAssignmentRecord>> {
  return simulateMutation("workAssignment", "Task created.", () => {
    const assignment: WorkAssignmentRecord = {
      ...payload,
      id: payload.id?.trim() || nextId("AW", workAssignmentsStore.map((item) => item.id)),
    }

    workAssignmentsStore = [assignment, ...workAssignmentsStore]
    return assignment
  })
}

export async function updateWorkAssignment(id: string, payload: Partial<WorkAssignmentRecord>): Promise<AsyncMutationResult<WorkAssignmentRecord>> {
  return simulateMutation("workAssignment", "Task updated.", () => {
    const existing = resolveOrThrow(workAssignmentsStore.find((item) => item.id === id), `Work assignment ${id} was not found.`)
    const updated = { ...existing, ...payload, id: existing.id }
    workAssignmentsStore = workAssignmentsStore.map((item) => (item.id === id ? updated : item))
    return updated
  })
}

export async function deleteWorkAssignment(id: string): Promise<AsyncMutationResult<{ id: string }>> {
  return simulateMutation("workAssignment", "Task deleted.", () => {
    const existing = resolveOrThrow(workAssignmentsStore.find((item) => item.id === id), `Task ${id} was not found.`)
    workAssignmentsStore = workAssignmentsStore.filter((item) => item.id !== id)
    return { id: existing.id }
  })
}

export async function listInvoices(): Promise<InvoiceRecord[]> {
  return simulateRead(() => invoicesStore)
}

export async function getInvoice(id: string): Promise<InvoiceRecord> {
  return simulateRead(() => resolveOrThrow(invoicesStore.find((item) => item.id === id), `Invoice ${id} was not found.`))
}

export async function listEstimates(): Promise<EstimateRecord[]> {
  return simulateRead(() => estimatesStore)
}

export async function getEstimate(id: string): Promise<EstimateRecord> {
  return simulateRead(() => resolveOrThrow(estimatesStore.find((item) => item.id === id), `Estimate ${id} was not found.`))
}

export async function createEstimate(payload: Omit<EstimateRecord, "id"> & { id?: string }): Promise<AsyncMutationResult<EstimateRecord>> {
  return simulateMutation("estimate", "Estimate saved.", () => {
    const estimate: EstimateRecord = {
      ...payload,
      id: payload.id?.trim() || nextId("EST", estimatesStore.map((item) => item.id)),
    }

    estimatesStore = [estimate, ...estimatesStore]
    return estimate
  })
}

export async function updateEstimate(id: string, payload: Partial<EstimateRecord>): Promise<AsyncMutationResult<EstimateRecord>> {
  return simulateMutation("estimate", "Estimate updated.", () => {
    const existing = resolveOrThrow(estimatesStore.find((item) => item.id === id), `Estimate ${id} was not found.`)
    const updated = { ...existing, ...payload, id: existing.id }
    estimatesStore = estimatesStore.map((item) => (item.id === id ? updated : item))
    return updated
  })
}

export async function listPurchaseRecords(): Promise<PurchaseRecord[]> {
  return simulateRead(() => purchaseRecordsStore)
}

export async function getPurchaseRecord(id: string): Promise<PurchaseRecord> {
  return simulateRead(() => resolveOrThrow(purchaseRecordsStore.find((item) => item.id === id), `Purchase record ${id} was not found.`))
}

export async function createPurchaseRecord(payload: Omit<PurchaseRecord, "id"> & { id?: string }): Promise<AsyncMutationResult<PurchaseRecord>> {
  return simulateMutation("purchaseRecord", "Purchase record created.", () => {
    const record: PurchaseRecord = {
      ...payload,
      id: payload.id?.trim() || nextId("PR", purchaseRecordsStore.map((item) => item.id)),
    }

    purchaseRecordsStore = [record, ...purchaseRecordsStore]
    return record
  })
}

export async function deleteEntity(entity: StoreEntity, id: string) {
  switch (entity) {
    case "employee":
      return deleteEmployee(id)
    case "order":
      return deleteOrder(id)
    case "supplier":
      return deleteSupplier(id)
    case "rawMaterial":
      return deleteRawMaterial(id)
    case "workAssignment":
      return deleteWorkAssignment(id)
    default:
      throw new Error(`Delete is not available for ${entity}.`)
  }
}

