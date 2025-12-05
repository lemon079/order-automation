'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Clock, Truck, Sparkles } from 'lucide-react';
import { OrderResolutionModal } from '@/components/orders/order-resolution-modal';

// Mock Orders Data
const mockOrders = [
    {
        id: 'ORD-001',
        customer: 'Acme Corporation',
        items: 5,
        total: 1250.00,
        status: 'pending',
        date: '2025-12-01',
        address: '123 Business Ave, NYC'
    },
    {
        id: 'ORD-002',
        customer: 'TechStart Inc',
        items: 3,
        total: 890.50,
        status: 'processing',
        date: '2025-12-02',
        address: '456 Innovation Dr, SF'
    },
    {
        id: 'ORD-003',
        customer: 'Global Logistics',
        items: 12,
        total: 2100.00,
        status: 'shipped',
        date: '2025-12-02',
        address: '789 Harbor Blvd, LA'
    },
    {
        id: 'ORD-004',
        customer: 'RetailMart',
        items: 8,
        total: 1560.00,
        status: 'delivered',
        date: '2025-12-03',
        address: '321 Commerce St, Chicago'
    },
    {
        id: 'ORD-005',
        customer: 'FastShip Co',
        items: 4,
        total: 675.00,
        status: 'pending',
        date: '2025-12-03',
        address: '555 Express Way, Miami'
    },
];

const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    shipped: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    delivered: 'bg-green-500/10 text-green-600 border-green-500/20',
};

export default function OrdersPage() {
    const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

    const pendingOrders = mockOrders.filter(o => o.status === 'pending');

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="text-muted-foreground">Manage and track all customer orders</p>
                </div>
                <div className="flex gap-3">
                    {pendingOrders.length > 0 && (
                        <Button
                            variant="default"
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            onClick={() => setIsResolutionModalOpen(true)}
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Resolve Pending ({pendingOrders.length})
                        </Button>
                    )}
                    <Button variant="outline">
                        <Package className="mr-2 h-4 w-4" />
                        New Order
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockOrders.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-yellow-500/30 bg-yellow-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {pendingOrders.length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {mockOrders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {mockOrders.filter(o => o.status === 'delivered').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Orders List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>Complete list of customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockOrders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-lg">{order.id}</span>
                                            <Badge variant="outline" className={statusColors[order.status as keyof typeof statusColors]}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Package className="h-4 w-4" />
                                                <span>{order.customer} • {order.items} items</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Truck className="h-4 w-4" />
                                                <span>{order.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{order.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">${order.total.toFixed(2)}</div>
                                        <Button variant="outline" size="sm" className="mt-2">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Order Resolution Modal */}
            <OrderResolutionModal
                open={isResolutionModalOpen}
                onOpenChange={setIsResolutionModalOpen}
                orders={pendingOrders}
            />
        </div>
    );
}
