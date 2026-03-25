"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Trash2, Plus } from "lucide-react";

// ✅ SCHEMA
const schema = z.object({
  customerName: z.string().min(2, "Customer name required"),
  deadline: z.string(),
  status: z.enum(["pending", "in_progress", "completed"]),
  paymentStatus: z.enum(["unpaid", "partial", "paid"]),
  items: z.array(
    z.object({
      productTitle: z.string().min(1),
      dimensions: z.string().min(1),
      materialId: z.string().min(1),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
    })
  ),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type OrderFormProps = {
  mode: "create" | "edit";
  initialData?: Partial<FormValues>;
};

export default function OrderForm({
  mode,
  initialData,
}: OrderFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: "",
      deadline: "",
      status: "pending",
      paymentStatus: "unpaid",
      items: [
        {
          productTitle: "",
          dimensions: "",
          materialId: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
      notes: "",
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = useWatch({
    control: form.control,
    name: "items",
  });

  const totalAmount =
    items?.reduce(
      (acc, item) =>
        acc + (Number(item.quantity) * Number(item.unitPrice) || 0),
      0
    ) || 0;

  const onSubmit = async (values: FormValues) => {
    const finalData = {
      ...values,
      totalAmount,
    };

    console.log(mode, finalData);

    if (mode === "create") {
      // POST API
    } else {
      // PUT API
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* TOP */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* CUSTOMER */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* STATUS */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full h-10 border rounded-md px-2">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full h-10 border rounded-md px-2">
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />

            </CardContent>
          </Card>

          {/* DEADLINE */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">
                  Rs. {totalAmount.toLocaleString()}
                </p>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* ITEMS */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Add multiple products</CardDescription>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  productTitle: "",
                  dimensions: "",
                  materialId: "",
                  quantity: 1,
                  unitPrice: 0,
                })
              }
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid md:grid-cols-12 gap-3 p-4 border rounded-lg bg-muted/30"
              >

                <div className="md:col-span-3">
                  <Input {...form.register(`items.${index}.productTitle`)} />
                </div>

                <div className="md:col-span-2">
                  <Input {...form.register(`items.${index}.dimensions`)} />
                </div>

                <div className="md:col-span-2">
                  <Input {...form.register(`items.${index}.materialId`)} />
                </div>

                <div className="md:col-span-2">
                  <Input
                    type="number"
                    {...form.register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    type="number"
                    {...form.register(`items.${index}.unitPrice`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

              </div>
            ))}
          </CardContent>
        </Card>

        {/* NOTES */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              {...form.register("notes")}
              className="w-full min-h-[120px] border rounded-md p-3"
            />
          </CardContent>
        </Card>

        {/* ACTION */}
        <div className="flex justify-end">
          <Button type="submit">
            {mode === "create" ? "Create Order" : "Update Order"}
          </Button>
        </div>

      </form>
    </Form>
  );
}