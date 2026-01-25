'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, ListChecks, Truck, Users, Settings, LogOut, User, Menu } from 'lucide-react';
import { Separator, Button, Sheet, SheetContent, SheetTrigger, SheetTitle } from '@repo/ui';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Order Drafts', href: '/drafts', icon: ListChecks },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Drivers', href: '/drivers', icon: Truck },
    { name: 'Customers', href: '/customers', icon: Users },
];

interface SidebarContentProps {
    className?: string;
    onLinkClick?: () => void;
}

function SidebarContent({ className, onLinkClick }: SidebarContentProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className={cn("flex h-full flex-col bg-card text-card-foreground", className)}>
            <div className="flex h-16 items-center justify-between border-b px-6">
                <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground p-1 rounded-md">
                        <Package className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg">OrderAuto</span>
                </div>
                <ThemeToggle />
            </div>

            <div className="flex-1 overflow-auto py-6 px-3">
                <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Menu
                </div>
                <nav className="grid items-start gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onLinkClick}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                                    : "text-muted-foreground hover:bg-accent/50"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <Separator className="my-6" />

                <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    System
                </div>
                <nav className="grid items-start gap-1">
                    <Link
                        href="/settings"
                        onClick={onLinkClick}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </nav>
            </div>

            <div className="border-t p-4">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.email?.split('@')[0] || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || 'No email'}</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full justify-start text-muted-foreground" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </div>
        </div>
    );
}

export function Sidebar() {
    return (
        <div className="hidden md:flex w-64 flex-col border-r h-full">
            <SidebarContent />
        </div>
    );
}



export function MobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SidebarContent onLinkClick={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    );
}
