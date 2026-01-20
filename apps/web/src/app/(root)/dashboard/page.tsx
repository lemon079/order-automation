'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@repo/ui';
import { Badge } from '@repo/ui';
import { Package, DollarSign, Truck, Users } from 'lucide-react';

// Mock Data
const mockOrders = [
    { id: 'ORD-001', customer: 'Acme Corp', status: 'pending', total: 1250.00, date: '2025-12-01' },
    { id: 'ORD-002', customer: 'TechStart Inc', status: 'processing', total: 890.50, date: '2025-12-02' },
    { id: 'ORD-003', customer: 'Global Logistics', status: 'delivered', total: 2100.00, date: '2025-12-03' },
];

const mockDrivers = [
    { id: 'DRV-001', name: 'John Smith', status: 'active', deliveries: 12 },
    { id: 'DRV-002', name: 'Sarah Johnson', status: 'active', deliveries: 8 },
    { id: 'DRV-003', name: 'Mike Wilson', status: 'offline', deliveries: 15 },
];

const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    delivered: 'bg-green-500/10 text-green-600 border-green-500/20',
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    offline: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export default function DashboardPage() {
    const { user } = useAuth();

    const totalSales = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const activeDrivers = mockDrivers.filter(d => d.status === 'active').length;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.email}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Orders
                        </CardTitle>
                        <Package className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockOrders.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">+2 from yesterday</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Sales
                        </CardTitle>
                        <DollarSign className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">+15% from last week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Drivers
                        </CardTitle>
                        <Truck className="h-5 w-5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeDrivers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Out of {mockDrivers.length} total</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Customers
                        </CardTitle>
                        <Users className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground mt-1">+3 new this month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from your customers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{order.id}</span>
                                        <Badge variant="outline" className={statusColors[order.status as keyof typeof statusColors]}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{order.customer}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">${order.total.toFixed(2)}</div>
                                    <p className="text-xs text-muted-foreground">{order.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Drivers Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Drivers</CardTitle>
                    <CardDescription>Manage your delivery drivers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockDrivers.map((driver) => (
                            <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                        <span className="font-medium text-sm">{driver.name.split(' ').map(n => n[0]).join('')}</span>
                                    </div>
                                    <div>
                                        <div className="font-medium">{driver.name}</div>
                                        <p className="text-sm text-muted-foreground">{driver.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{driver.deliveries} deliveries</div>
                                        <p className="text-xs text-muted-foreground">This month</p>
                                    </div>
                                    <Badge variant="outline" className={statusColors[driver.status as keyof typeof statusColors]}>
                                        {driver.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
