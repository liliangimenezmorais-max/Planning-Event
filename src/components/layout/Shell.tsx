
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { 
  Calendar, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  PlusCircle,
  UserCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

interface ShellProps {
  children: React.ReactNode;
  role: 'client' | 'pro';
}

const clientNav = [
  { name: 'Accueil', href: '/client/dashboard', icon: LayoutDashboard },
  { name: 'Rechercher', href: '/client/search', icon: Search },
  { name: 'Poster une annonce', href: '/client/requests/new', icon: PlusCircle },
  { name: 'Messagerie', href: '/client/messages', icon: MessageSquare },
  { name: 'Profil', href: '/client/profile', icon: UserCircle },
];

const proNav = [
  { name: 'Accueil', href: '/pro/dashboard', icon: LayoutDashboard },
  { name: 'Annonce', href: '/pro/requests', icon: FileText },
  { name: 'Messagerie', href: '/pro/messages', icon: MessageSquare },
  { name: 'Planning', href: '/pro/calendar', icon: Calendar },
  { name: 'Client', href: '/pro/clients', icon: Users },
  { name: 'Profil', href: '/pro/profile', icon: UserCircle },
  { name: 'Réglage', href: '/pro/settings', icon: Settings },
];

export function Shell({ children, role }: ShellProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();
  const navItems = role === 'client' ? clientNav : proNav;

  // Real-time unread notifications for professionals
  const notifQuery = useMemoFirebase(() => {
    if (!db || role !== 'pro' || !user) return null;
    return query(
      collection(db, 'professionals', user.uid, 'notifications'),
      where('isRead', '==', false)
    );
  }, [db, user, role]);
  const { data: notifications } = useCollection(notifQuery);
  const unreadCount = notifications?.length || 0;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">
        <Sidebar className="border-r border-slate-200 bg-white shadow-none">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <span className="text-lg font-headline font-bold text-primary tracking-tight">Planning Event</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-400 px-4 mb-2 uppercase text-[10px] font-bold tracking-widest">Navigation</SidebarGroupLabel>
              <SidebarMenu className="gap-1">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                      className={`h-11 px-4 rounded-lg transition-all ${
                        (pathname === item.href || pathname.startsWith(item.href + '/'))
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-6 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 mb-4">
              <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'default'}/100`} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">U</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.displayName || 'Utilisateur'}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{role === 'client' ? 'Particulier' : 'Professionnel'}</p>
              </div>
            </div>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 h-10 rounded-lg">
                  <Link href="/">
                    <LogOut className="h-4 w-4" />
                    <span className="text-xs font-semibold">Déconnexion</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-8">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-headline font-bold text-slate-900">
                {navItems.find(item => pathname === item.href || pathname.startsWith(item.href + '/'))?.name || 'Tableau de bord'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400">
                  <Bell className="h-5 w-5" />
                </Button>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <Button size="sm" variant="outline" asChild className="rounded-full border-primary text-primary font-bold">
                <Link href={role === 'client' ? '/pro/dashboard' : '/client/dashboard'}>
                  {role === 'client' ? 'Espace Pro' : 'Espace Client'}
                </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
