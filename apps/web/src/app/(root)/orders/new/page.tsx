'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateOrder } from '@repo/shared';
import { createOrderSchema, type CreateOrderInput } from '@repo/shared';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent, toast } from '@repo/ui';
import { Loader2, Plus, Trash2 } from 'lucide-react';

export default function NewOrderPage() {
    const router = useRouter();
    const { mutateAsync: createOrder, isPending } = useCreateOrder();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateOrderInput>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: {
            items: [{ name: '', quantity: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const onSubmit = async (data: CreateOrderInput) => {
        try {
            await createOrder(data);
            toast.success('Order created successfully!');
            router.push('/orders');
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create order');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">New Order</h1>
                <p className="page-description">Enter order details below</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="form-section">
                        <div className="space-y-2">
                            <Label htmlFor="customer_name">Name *</Label>
                            <Input
                                id="customer_name"
                                {...register('customer_name')}
                                placeholder="John Doe"
                            />
                            {errors.customer_name && (
                                <p className="field-error">{errors.customer_name.message}</p>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="space-y-2">
                                <Label htmlFor="customer_phone">Phone *</Label>
                                <Input
                                    id="customer_phone"
                                    {...register('customer_phone')}
                                    placeholder="+1234567890"
                                />
                                {errors.customer_phone && (
                                    <p className="field-error">{errors.customer_phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customer_email">Email</Label>
                                <Input
                                    id="customer_email"
                                    type="email"
                                    {...register('customer_email')}
                                    placeholder="john@example.com"
                                />
                                {errors.customer_email && (
                                    <p className="field-error">{errors.customer_email.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pickup Location */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pickup Location</CardTitle>
                    </CardHeader>
                    <CardContent className="form-section">
                        <div className="space-y-2">
                            <Label htmlFor="pickup_address">Address *</Label>
                            <textarea
                                id="pickup_address"
                                {...register('pickup_address')}
                                className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                                placeholder="123 Main St, City, State ZIP"
                            />
                            {errors.pickup_address && (
                                <p className="field-error">{errors.pickup_address.message}</p>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="space-y-2">
                                <Label htmlFor="pickup_contact_name">Contact Name</Label>
                                <Input
                                    id="pickup_contact_name"
                                    {...register('pickup_contact_name')}
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pickup_contact_phone">Contact Phone</Label>
                                <Input
                                    id="pickup_contact_phone"
                                    {...register('pickup_contact_phone')}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="space-y-2">
                                <Label htmlFor="pickup_time_window_start">Time Window Start</Label>
                                <Input
                                    id="pickup_time_window_start"
                                    type="datetime-local"
                                    {...register('pickup_time_window_start')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pickup_time_window_end">Time Window End</Label>
                                <Input
                                    id="pickup_time_window_end"
                                    type="datetime-local"
                                    {...register('pickup_time_window_end')}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Drop-off Location */}
                <Card>
                    <CardHeader>
                        <CardTitle>Drop-off Location</CardTitle>
                    </CardHeader>
                    <CardContent className="form-section">
                        <div className="space-y-2">
                            <Label htmlFor="dropoff_address">Address *</Label>
                            <textarea
                                id="dropoff_address"
                                {...register('dropoff_address')}
                                className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                                placeholder="456 Oak Ave, City, State ZIP"
                            />
                            {errors.dropoff_address && (
                                <p className="text-sm text-destructive mt-1">{errors.dropoff_address.message}</p>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="space-y-2">
                                <Label htmlFor="dropoff_contact_name">Contact Name</Label>
                                <Input
                                    id="dropoff_contact_name"
                                    {...register('dropoff_contact_name')}
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dropoff_contact_phone">Contact Phone</Label>
                                <Input
                                    id="dropoff_contact_phone"
                                    {...register('dropoff_contact_phone')}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="space-y-2">
                                <Label htmlFor="dropoff_time_window_start">Time Window Start</Label>
                                <Input
                                    id="dropoff_time_window_start"
                                    type="datetime-local"
                                    {...register('dropoff_time_window_start')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dropoff_time_window_end">Time Window End</Label>
                                <Input
                                    id="dropoff_time_window_end"
                                    type="datetime-local"
                                    {...register('dropoff_time_window_end')}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent className="form-section">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-end">
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`items.${index}.name`}>Item Name *</Label>
                                        <Input
                                            {...register(`items.${index}.name`)}
                                            placeholder="Product name"
                                        />
                                        {errors.items?.[index]?.name && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.items[index]?.name?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`items.${index}.quantity`}>Quantity *</Label>
                                        <Input
                                            type="number"
                                            {...register(`items.${index}.quantity`, {
                                                valueAsNumber: true,
                                            })}
                                            placeholder="1"
                                        />
                                        {errors.items?.[index]?.quantity && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.items[index]?.quantity?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`items.${index}.weight`}>Weight (kg)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            {...register(`items.${index}.weight`, {
                                                valueAsNumber: true,
                                            })}
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>

                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="mt-8"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ name: '', quantity: 1 })}
                            className="w-full"
                        >
                            <Plus className="size-4 mr-2" />
                            Add Item
                        </Button>

                        {errors.items && typeof errors.items.message === 'string' && (
                            <p className="text-sm text-destructive">{errors.items.message}</p>
                        )}
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="form-section">
                        <div className="space-y-2">
                            <Label htmlFor="special_instructions">Special Instructions</Label>
                            <textarea
                                id="special_instructions"
                                {...register('special_instructions')}
                                className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                                placeholder="Any special delivery instructions..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="internal_notes">Internal Notes</Label>
                            <textarea
                                id="internal_notes"
                                {...register('internal_notes')}
                                className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                                placeholder="Staff-only notes..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="form-actions">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/orders')}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
                        Create Order
                    </Button>
                </div>
            </form>
        </div>
    );
}
