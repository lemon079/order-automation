import Link from 'next/link';
import { Button } from '@repo/ui';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';
import { LayoutDashboard, Package, Truck, MapPin, BarChart, ArrowRight, CheckCircle2, Zap, Shield } from 'lucide-react';

export default function LandingPage() {
  const roles = [
    {
      title: 'Sales Portal',
      description: 'Create orders, manage customers, and track revenue in real-time.',
      href: '/sales',
      icon: LayoutDashboard,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      title: 'Warehouse Ops',
      description: 'Streamline picking, packing, and inventory management.',
      href: '/warehouse',
      icon: Package,
      color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400',
    },
    {
      title: 'Dispatch Hub',
      description: 'Intelligent driver assignment and route optimization.',
      href: '/dispatch',
      icon: Truck,
      color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    {
      title: 'Driver App',
      description: 'Turn-by-turn navigation and proof of delivery.',
      href: '/driver',
      icon: MapPin,
      color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400',
    },
    {
      title: 'Admin Console',
      description: 'Global system overview, analytics, and user management.',
      href: '/admin',
      icon: BarChart,
      color: 'text-slate-600 bg-slate-100 dark:bg-slate-900/30 dark:text-slate-400',
    },
  ];

  const features = [
    { icon: Zap, title: 'Real-time Sync', desc: 'Instant updates across all dashboards.' },
    { icon: Shield, title: 'Secure Access', desc: 'Role-based security via Supabase Auth.' },
    { icon: CheckCircle2, title: 'End-to-End Tracking', desc: 'Full visibility from order to delivery.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className=" border-b sticky top-0 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
            <span>OrderAuto</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#roles" className="hover:text-primary transition-colors">Portals</Link>
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
          </nav>
          <Button size="sm">Get Started</Button>
        </div>
      </header>


      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-linear-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-primary font-medium">
                Next-Gen Logistics Management
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-linear-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent">
                Streamline Your <br className="hidden sm:inline" />
                Order Workflow
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A comprehensive automation system for modern logistics. Manage sales, warehouse, dispatch, and delivery in one unified platform.
              </p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="h-12 px-8 text-lg bg-linear-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25" asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg hover:bg-primary/5" asChild>
                  <Link href="/sales">View Demo</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Abstract Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px]" />
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-16 bg-muted/30 border-y">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <f.icon className="size-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles Section - Bento Grid */}
        <section id="roles" className="py-20 container mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Portal Access</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Choose your role to access the specialized dashboard built for your workflow.</p>
          </div>


          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 max-w-7xl mx-auto">
            {/* Sales - Large */}
            {(() => {
              const role = roles[0];
              const Icon = role.icon;
              return (
                <Link href={role.href} className="group md:col-span-3 md:row-span-2">
                  <Card className="h-full min-h-[280px] transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] border-muted overflow-hidden relative bg-linear-to-br from-blue-500/5 to-blue-600/10">
                    <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-blue-500 to-blue-600 opacity-70" />
                    <CardHeader className="pb-4">
                      <div className={`mb-4 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform ${role.color}`}>
                        <Icon className="size-10" />
                      </div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">{role.title}</CardTitle>
                      <CardDescription className="text-base">{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                        Enter Dashboard <ArrowRight className="ml-2 size-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })()}

            {/* Warehouse - Medium */}
            {(() => {
              const role = roles[1];
              const Icon = role.icon;
              return (
                <Link href={role.href} className="group md:col-span-3">
                  <Card className="h-full min-h-[135px] transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] border-muted overflow-hidden relative bg-linear-to-br from-cyan-500/5 to-cyan-600/10">
                    <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-cyan-500 to-cyan-600 opacity-70" />
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${role.color}`}>
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{role.title}</CardTitle>
                          <CardDescription className="text-sm">{role.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })()}

            {/* Dispatch - Medium */}
            {(() => {
              const role = roles[2];
              const Icon = role.icon;
              return (
                <Link href={role.href} className="group md:col-span-2">
                  <Card className="h-full min-h-[135px] transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] border-muted overflow-hidden relative bg-linear-to-br from-indigo-500/5 to-indigo-600/10">
                    <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-indigo-500 to-indigo-600 opacity-70" />
                    <CardHeader>
                      <div className={`mb-2 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform ${role.color}`}>
                        <Icon className="size-6" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{role.title}</CardTitle>
                      <CardDescription className="text-sm">{role.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })()}

            {/* Driver - Medium */}
            {(() => {
              const role = roles[3];
              const Icon = role.icon;
              return (
                <Link href={role.href} className="group md:col-span-2">
                  <Card className="h-full min-h-[135px] transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] border-muted overflow-hidden relative bg-linear-to-br from-teal-500/5 to-teal-600/10">
                    <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-teal-500 to-teal-600 opacity-70" />
                    <CardHeader>
                      <div className={`mb-2 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform ${role.color}`}>
                        <Icon className="size-6" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{role.title}</CardTitle>
                      <CardDescription className="text-sm">{role.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })()}

            {/* Admin - Large Horizontal */}
            {(() => {
              const role = roles[4];
              const Icon = role.icon;
              return (
                <Link href={role.href} className="group md:col-span-2">
                  <Card className="h-full min-h-[135px] transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02] border-muted overflow-hidden relative bg-linear-to-br from-slate-500/5 to-slate-600/10">
                    <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-slate-500 to-slate-600 opacity-70" />
                    <CardHeader>
                      <div className={`mb-2 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform ${role.color}`}>
                        <Icon className="size-6" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{role.title}</CardTitle>
                      <CardDescription className="text-sm">{role.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })()}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">OrderAuto System</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Order Automation Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
