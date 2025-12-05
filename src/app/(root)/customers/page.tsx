'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, Phone, MapPin, Package } from 'lucide-react';

// Mock Customers Data
const mockCustomers = [
    {
        id: 'CUST-001',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1 555-1001',
        address: '123 Business Ave, New York, NY 10001',
        totalOrders: 15,
        totalSpent: 12450.00,
        status: 'active'
    },
    {
        id: 'CUST-002',
        name: 'TechStart Inc',
        email: 'ops@techstart.com',
        phone: '+1 555-1002',
        address: '456 Innovation Dr, San Francisco, CA 94102',
        totalOrders: 8,
        totalSpent: 6780.50,
        status: 'active'
    },
    {
        id: 'CUST-003',
        name: 'Global Logistics',
        email: 'info@globallog.com',
        phone: '+1 555-1003',
        address: '789 Harbor Blvd, Los Angeles, CA 90012',
        totalOrders: 23,
        totalSpent: 18950.00,
        status: 'active'
    },
    {
        id: 'CUST-004',
        name: 'RetailMart',
        email: 'orders@retailmart.com',
        phone: '+1 555-1004',
        address: '321 Commerce St, Chicago, IL 60601',
        totalOrders: 12,
        totalSpent: 9340.00,
        status: 'active'
    },
    {
        id: 'CUST-005',
        name: 'FastShip Co',
        email: 'shipping@fastship.com',
        phone: '+1 555-1005',
        address: '555 Express Way, Miami, FL 33101',
        totalOrders: 5,
        totalSpent: 3200.00,
        status: 'inactive'
    },
];

const statusColors = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    inactive: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export default function CustomersPage() {
    const activeCount = mockCustomers.filter(c => c.status === 'active').length;
    const totalOrders = mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0);
    const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Customers</h1>
                    <p className="text-muted-foreground">Manage your customer database</p>
                </div>
                <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockCustomers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Customers List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>Manage customer information and history</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockCustomers.map((customer) => (
                            <div key={customer.id} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Users className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <div className="font-semibold text-lg">{customer.name}</div>
                                                <div className="text-sm text-muted-foreground">{customer.id}</div>
                                            </div>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    <span>{customer.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{customer.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{customer.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Badge variant="outline" className={statusColors[customer.status as keyof typeof statusColors]}>
                                            {customer.status}
                                        </Badge>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex items-center gap-2 justify-end text-muted-foreground">
                                                <Package className="h-4 w-4" />
                                                <span>{customer.totalOrders} orders</span>
                                            </div>
                                            <div className="text-lg font-bold">
                                                ${customer.totalSpent.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Total spent</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
