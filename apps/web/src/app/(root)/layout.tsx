import { Sidebar, MobileSidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen flex-col md:flex-row">
            <Sidebar />

            <div className="md:hidden flex items-center p-4 border-b bg-card">
                <MobileSidebar />
                <span className="font-bold text-lg ml-2">OrderAuto</span>
            </div>

            <main className="flex-1 overflow-auto p-4 md:p-8 bg-muted/10">
                {children}
            </main>
        </div>
    );
}
