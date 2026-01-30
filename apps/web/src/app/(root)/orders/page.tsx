'use client';

import Link from 'next/link';
import { Button, Card, CardContent, Badge, Skeleton } from '@repo/ui';
import {
    Plus,
    Calendar,
    Package,
    Phone,
    ChevronRight,
    Clock
} from 'lucide-react';
import { useOrders } from '@repo/shared';
import { format } from 'date-fns';
import { cn } from '@repo/ui/lib/utils';

export default function OrdersPage() {
    const { data, isLoading } = useOrders();
    const orders = data?.orders ?? [];

    const getStatusConfig = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            pending: { label: 'Pending', className: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
            confirmed: { label: 'Confirmed', className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
            assigned: { label: 'Driver Assigned', className: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
            picked_up: { label: 'Picked Up', className: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
            in_transit: { label: 'In Transit', className: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800' },
            delivered: { label: 'Delivered', className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
            cancelled: { label: 'Cancelled', className: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
        };

        return statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
    };

    if (isLoading) {
        return <OrdersSkeleton />;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground mt-1">Manage and track your delivery orders</p>
                </div>
                <Button size="lg" className="shadow-sm hover:shadow-md transition-all" asChild>
                    <Link href="/orders/new">
                        <Plus className="size-5 mr-2" />
                        New Order
                    </Link>
                </Button>
            </div>

            {orders.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => {
                        const status = getStatusConfig(order.status);

                        return (
                            <Link key={order.id} href={`/orders/${order.id}`}>
                                <Card className="group hover:shadow-md transition-all duration-200 border-muted/60 hover:border-primary/20 overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Left Section: Status & Date (Mobile) or Info */}
                                            <div className="p-5 flex-1 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                            <Package className="size-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-lg hover:text-primary transition-colors">
                                                                {order.customer_name}
                                                            </div>
                                                            <div className="flex items-center text-muted-foreground text-sm gap-2">
                                                                <Phone className="size-3" />
                                                                {order.customer_phone}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className={cn("px-3 py-1 font-medium border", status.className)}>
                                                        {status.label}
                                                    </Badge>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-3 pt-2">
                                                    <div className="bg-muted/30 p-3 rounded-lg space-y-1.5 border border-transparent hover:border-border transition-colors">
                                                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
                                                            <div className="size-1.5 rounded-full bg-green-500" />
                                                            Pickup
                                                        </div>
                                                        <div className="text-sm font-medium line-clamp-2 leading-snug">
                                                            {order.pickup_address}
                                                        </div>
                                                    </div>
                                                    <div className="bg-muted/30 p-3 rounded-lg space-y-1.5 border border-transparent hover:border-border transition-colors">
                                                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
                                                            <div className="size-1.5 rounded-full bg-red-500" />
                                                            Dropoff
                                                        </div>
                                                        <div className="text-sm font-medium line-clamp-2 leading-snug">
                                                            {order.dropoff_address}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section: Metadata & Action */}
                                            <div className="bg-muted/15 border-t md:border-t-0 md:border-l p-5 md:w-64 flex flex-row md:flex-col justify-between items-center md:items-start gap-4">
                                                <div className="space-y-3 w-full">
                                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                        <Calendar className="size-4 text-muted-foreground/70" />
                                                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                        <Clock className="size-4 text-muted-foreground/70" />
                                                        {format(new Date(order.created_at), 'h:mm a')}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                        <Package className="size-4 text-muted-foreground/70" />
                                                        {Array.isArray(order.items) ? order.items.length : 0} Items
                                                    </div>
                                                </div>

                                                <div className="hidden md:flex w-full justify-end mt-auto">
                                                    <Button size="sm" variant="ghost" className="text-primary group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent">
                                                        Details
                                                        <ChevronRight className="size-4 ml-1" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function OrdersSkeleton() {
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden border-muted/60">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row h-48 md:h-40">
                                <div className="p-5 flex-1 space-y-4">
                                    <div className="flex justify-between">
                                        <div className="flex gap-3">
                                            <Skeleton className="size-10 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-40" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <Skeleton className="h-16 rounded-lg" />
                                        <Skeleton className="h-16 rounded-lg" />
                                    </div>
                                </div>
                                <div className="md:w-64 bg-muted/15 border-t md:border-t-0 md:border-l p-5">
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <Card className="border-dashed border-2 shadow-sm bg-muted/5">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                    <Package className="size-8 text-primary" />
                </div>
                <div className="space-y-2 max-w-sm">
                    <h3 className="text-xl font-semibold">No orders found</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        You haven't created any orders yet. Start by creating a new delivery order to track it here.
                    </p>
                </div>
                <Button size="lg" className="mt-4" asChild>
                    <Link href="/orders/new">
                        Create your first order
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
