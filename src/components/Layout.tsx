import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  ShirtIcon,
  LogOut,
  Store
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Produtos",
    url: "/produtos",
    icon: Package,
  },
  {
    title: "Cadastrar Produto",
    url: "/cadastrar-produto",
    icon: ShirtIcon,
  },
  {
    title: "Vendas",
    url: "/vendas",
    icon: ShoppingCart,
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logout realizado",
      description: "Até mais!",
    });
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 group-data-[collapsible=icon]:hidden">
              <h2 className="font-semibold text-foreground">Perronifitwear</h2>
              <p className="text-xs text-muted-foreground">Gestão da Loja</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.url) ? "bg-brand-primary/10 text-brand-primary border-r-2 border-brand-primary" : ""}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-border">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="group-data-[collapsible=icon]:hidden">Sair</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger />
          </header>
          
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;