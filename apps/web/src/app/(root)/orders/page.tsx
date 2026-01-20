'use client';

import Link from 'next/link';
import { Button, Card, CardContent } from '@repo/ui';
import { Plus, Loader2 } from 'lucide-react';
import { useOrders } from '@repo/shared';
import { format } from 'date-fns';

export default function OrdersPage() {
    const { data, isLoading } = useOrders();
    const orders = data?.orders ?? [];

    const getStatusClass = (status: string) => {
        return `status-badge status-${status.replace('_', '-')}`;
    };

    return (
        <div className="page-container">
            <div className="flex justify-between items-center page-header">
                <div>
                    <h1 className="page-title">Orders</h1>
                    <p className="page-description">Manage all delivery orders</p>
                </div>
                <Button asChild>
                    <Link href="/orders/new">
                        <Plus className="size-4 mr-2" />
                        New Order
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <Loader2 className="loading-spinner" />
                </div>
            ) : orders.length === 0 ? (
                <Card>
                    <CardContent className="empty-state">
                        <p className="empty-state-text">No orders yet</p>
                        <Button asChild>
                            <Link href="/orders/new">Create your first order</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="card-interactive">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                                            <span className={getStatusClass(order.status)}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Phone:</span>{' '}
                                                {order.customer_phone}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Items:</span>{' '}
                                                {Array.isArray(order.items) ? order.items.length : 0}
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-muted-foreground">Pickup:</span>{' '}
                                                {order.pickup_address}
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-muted-foreground">Drop-off:</span>{' '}
                                                {order.dropoff_address}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Created:</span>{' '}
                                                {format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}
                                            </div>
                                        </div>
                                    </div>

                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/orders/${order.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
