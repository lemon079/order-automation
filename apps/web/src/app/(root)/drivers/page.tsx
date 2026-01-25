'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@repo/ui';
import { Badge } from '@repo/ui';
import { Button } from '@repo/ui';
import { Truck, MapPin, Package, Clock } from 'lucide-react';

// Mock Drivers Data
const mockDrivers = [
    {
        id: 'DRV-001',
        name: 'John Smith',
        phone: '+1 555-0101',
        status: 'active',
        currentLocation: 'Downtown NYC',
        deliveries: 12,
        rating: 4.8,
        vehicle: 'Van - ABC123'
    },
    {
        id: 'DRV-002',
        name: 'Sarah Johnson',
        phone: '+1 555-0102',
        status: 'active',
        currentLocation: 'Upper East Side',
        deliveries: 8,
        rating: 4.9,
        vehicle: 'Truck - DEF456'
    },
    {
        id: 'DRV-003',
        name: 'Mike Wilson',
        phone: '+1 555-0103',
        status: 'offline',
        currentLocation: 'Brooklyn',
        deliveries: 15,
        rating: 4.7,
        vehicle: 'Van - GHI789'
    },
    {
        id: 'DRV-004',
        name: 'Emily Davis',
        phone: '+1 555-0104',
        status: 'busy',
        currentLocation: 'Queens',
        deliveries: 10,
        rating: 5.0,
        vehicle: 'Truck - JKL012'
    },
    {
        id: 'DRV-005',
        name: 'Robert Brown',
        phone: '+1 555-0105',
        status: 'active',
        currentLocation: 'Bronx',
        deliveries: 6,
        rating: 4.6,
        vehicle: 'Van - MNO345'
    },
];

const statusColors = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    busy: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    offline: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export default function DriversPage() {
    const activeCount = mockDrivers.filter(d => d.status === 'active').length;
    const busyCount = mockDrivers.filter(d => d.status === 'busy').length;
    const totalDeliveries = mockDrivers.reduce((sum, d) => sum + d.deliveries, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Drivers</h1>
                    <p className="text-muted-foreground">Manage your delivery fleet</p>
                </div>
                <Button>
                    <Truck className="mr-2 h-4 w-4" />
                    Add Driver
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Drivers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockDrivers.length}</div>
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
                        <CardTitle className="text-sm font-medium text-muted-foreground">On Delivery</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{busyCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Deliveries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDeliveries}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Drivers List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Drivers</CardTitle>
                    <CardDescription>Manage and track driver performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockDrivers.map((driver) => (
                            <div key={driver.id} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-semibold text-primary">
                                                {driver.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <div className="font-semibold text-lg">{driver.name}</div>
                                                <div className="text-sm text-muted-foreground">{driver.id} • {driver.phone}</div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{driver.currentLocation}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Truck className="h-4 w-4" />
                                                    <span>{driver.vehicle}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Badge variant="outline" className={statusColors[driver.status as keyof typeof statusColors]}>
                                            {driver.status}
                                        </Badge>
                                        <div className="text-sm space-y-1">
                                            <div className="flex items-center gap-2 justify-end text-muted-foreground">
                                                <Package className="h-4 w-4" />
                                                <span>{driver.deliveries} deliveries</span>
                                            </div>
                                            <div className="flex items-center gap-1 justify-end">
                                                <span className="text-yellow-500">★</span>
                                                <span className="font-medium">{driver.rating}</span>
                                            </div>
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
