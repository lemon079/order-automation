'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Button,
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
    Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerFooter,
    Input, Label, toast
} from '@repo/ui';
import { OrderDraft, createOrderSchema, CreateOrderInput } from '@repo/shared';
import { approveDraft, rejectDraft } from '@/app/actions/drafts';
import { Trash2, Plus, Loader2, User, MapPin, Package, FileText, MessageSquare } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface ReviewDialogProps {
    draft: OrderDraft;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReviewDialog({ draft, open, onOpenChange }: ReviewDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl! w-full">
                    <DialogHeader>
                        <DialogTitle>Review Order Draft</DialogTitle>
                        <DialogDescription>
                            Review and correct the AI-extracted details.
                        </DialogDescription>
                    </DialogHeader>
                    <ReviewForm draft={draft} onOpenChange={onOpenChange} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Review Order Draft</DrawerTitle>
                    <DrawerDescription>
                        Review and correct the AI-extracted details.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-8 overflow-y-auto max-h-[80vh]">
                    <ReviewForm draft={draft} onOpenChange={onOpenChange} isDrawer />
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function ReviewForm({ draft, onOpenChange, isDrawer = false }: { draft: OrderDraft, onOpenChange: (open: boolean) => void, isDrawer?: boolean }) {
    const [submitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

    const form = useForm<CreateOrderInput>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: {
            customer_name: draft.customer_name || '',
            customer_phone: draft.customer_phone || '',
            customer_email: draft.customer_email || '',
            pickup_address: draft.pickup_address || '',
            dropoff_address: draft.dropoff_address || '',
            items: draft.items?.length ? draft.items : [{ name: '', quantity: 1 }],
            special_instructions: draft.special_instructions || '',
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const onApprove = async (data: CreateOrderInput) => {
        setSubmitting(true);
        try {
            const result = await approveDraft(draft.id, data);
            if (result.success) {
                toast.success('Order created successfully');
                // Invalidate React Query cache for orders
                queryClient.invalidateQueries({ queryKey: ['orders'] });
                // Also refresh the current page data
                router.refresh();
                onOpenChange(false);
            } else {
                toast.error(`Failed to approve: ${result.error}`);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const onReject = async () => {
        if (!confirm('Are you sure you want to reject this draft? It will be archived.')) return;

        setSubmitting(true);
        try {
            const result = await rejectDraft(draft.id);
            if (result.success) {
                toast.success('Draft rejected');
                onOpenChange(false);
            } else {
                toast.error(`Failed to reject: ${result.error}`);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onApprove)} className={isDrawer ? "space-y-6" : "flex flex-col h-full"}>
            <div className={isDrawer ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 gap-8 py-4"}>
                {/* Left Column: Customer & Locations */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                            <User className="h-4 w-4" /> Customer Details
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input {...form.register('customer_name')} placeholder="Ali Khan" />
                                {form.formState.errors.customer_name && (
                                    <p className="text-xs text-destructive">{form.formState.errors.customer_name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input {...form.register('customer_phone')} placeholder="0300..." />
                                {form.formState.errors.customer_phone && (
                                    <p className="text-xs text-destructive">{form.formState.errors.customer_phone.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                            <MapPin className="h-4 w-4" /> Locations
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Pickup</Label>
                                <Input {...form.register('pickup_address')} placeholder="123 Main St..." className="bg-muted/10 border-green-200 focus-visible:ring-green-500" />
                                {form.formState.errors.pickup_address && (
                                    <p className="text-xs text-destructive">{form.formState.errors.pickup_address.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Dropoff</Label>
                                <Input {...form.register('dropoff_address')} placeholder="456 Other St..." className="bg-muted/10 border-red-200 focus-visible:ring-red-500" />
                                {form.formState.errors.dropoff_address && (
                                    <p className="text-xs text-destructive">{form.formState.errors.dropoff_address.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Items & Notes */}
                <div className="space-y-6 flex flex-col">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <Package className="h-4 w-4" /> Items
                            </div>
                            <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={() => append({ name: '', quantity: 1 })}>
                                <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                        </div>

                        <div className="max-h-[220px] overflow-y-auto pr-2 space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start group">
                                    <div className="flex-1">
                                        <Input
                                            {...form.register(`items.${index}.name`)}
                                            placeholder="Item description"
                                            className="h-9"
                                        />
                                        {form.formState.errors.items?.[index]?.name && (
                                            <p className="text-xs text-destructive">{form.formState.errors.items[index]?.name?.message}</p>
                                        )}
                                    </div>
                                    <div className="w-16">
                                        <Input
                                            type="number"
                                            {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                            placeholder="Qty"
                                            className="h-9 text-center"
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-9 w-9 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
                            <FileText className="h-4 w-4" /> Notes & Transcript
                        </div>
                        <Input {...form.register('special_instructions')} placeholder="Special instructions..." />

                        {draft.transcript_text && (
                            <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground mt-2 max-h-24 overflow-y-auto border border-border/50">
                                <div className="flex items-center gap-1.5 mb-1 text-primary/80 font-medium">
                                    <MessageSquare className="h-3 w-3" /> Original Transcript
                                </div>
                                "{draft.transcript_text}"
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={isDrawer ? "mt-4 flex flex-col gap-2" : "mt-4 pt-4 border-t flex gap-2 sm:gap-0"}>
                {isDrawer ? (
                    <>
                        <Button type="submit" disabled={submitting} className="w-full">
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Approve Order
                        </Button>
                        <Button type="button" variant="outline" className="w-full" onClick={() => onOpenChange(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" className="w-full" onClick={onReject} disabled={submitting}>
                            Reject Draft
                        </Button>
                    </>
                ) : (
                    <>
                        <Button type="button" variant="destructive" onClick={onReject} disabled={submitting}>
                            Reject Draft
                        </Button>
                        <div className="flex-1" />
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting} className="px-8 ml-2">
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Approve Order
                        </Button>
                    </>
                )}
            </div>
        </form>
    );
}
