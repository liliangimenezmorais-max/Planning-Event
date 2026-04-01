
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Image as ImageIcon, Paperclip, MoreVertical, Search, CheckCheck, FileIcon, ChevronLeft, MailOpen } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function ProMessages() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [activeChat, setActiveChat] = React.useState(0);
  const [showChatOnMobile, setShowChatOnMobile] = React.useState(false);
  const { toast } = useToast();

  const [conversations, setConversations] = React.useState([
    { id: "1", name: "Marie L.", event: "Mariage 15 Juin", lastMsg: "C'est parfait pour le devis.", time: "10:30", unread: 2, online: true },
    { id: "2", name: "Jean Dupont", event: "Anniversaire", lastMsg: "Pouvez-vous ajouter une option ?", time: "Hier", unread: 0, online: false },
    { id: "3", name: "Thomas G.", event: "Soirée Corporate", lastMsg: "Merci pour votre réactivité.", time: "Lundi", unread: 0, online: true },
  ]);

  React.useEffect(() => {
    if (clientId) {
      const index = conversations.findIndex(c => c.id === clientId);
      if (index !== -1) {
        setActiveChat(index);
        setShowChatOnMobile(true);
        
        // Clear notification if selected via URL
        if (conversations[index].unread > 0) {
          const newConversations = [...conversations];
          newConversations[index].unread = 0;
          setConversations(newConversations);
        }
      }
    } else {
      // Clear notification for default active chat
      if (conversations[activeChat].unread > 0) {
        const newConversations = [...conversations];
        newConversations[activeChat].unread = 0;
        setConversations(newConversations);
      }
    }
  }, [clientId]);

  const handleConversationClick = (index: number) => {
    setActiveChat(index);
    setShowChatOnMobile(true);
    
    // Clear notification
    if (conversations[index].unread > 0) {
      const newConversations = [...conversations];
      newConversations[index].unread = 0;
      setConversations(newConversations);
    }
  };

  const handleMarkAsUnread = (index: number) => {
    const newConversations = [...conversations];
    newConversations[index].unread = 1;
    setConversations(newConversations);
    
    toast({
      title: "Conversation marquée comme non lue",
      description: `Une notification a été ajoutée pour ${conversations[index].name}.`,
    });

    if (showChatOnMobile) {
      setShowChatOnMobile(false);
    }
  };

  return (
    <Shell role="pro">
      <div className="h-[calc(100vh-12rem)] flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Conversations Sidebar */}
        <Card className={cn(
          "w-full md:w-80 flex flex-col shadow-xl border-none overflow-hidden bg-white shrink-0",
          showChatOnMobile ? "hidden md:flex" : "flex"
        )}>
          <div className="p-5 border-b space-y-4">
            <h2 className="font-headline font-bold text-xl px-1">Messagerie</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Rechercher un client..." className="pl-9 bg-slate-50 border-none rounded-xl h-11" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((chat, i) => (
              <div 
                key={chat.id} 
                onClick={() => handleConversationClick(i)}
                className={cn(
                  "p-5 flex items-center gap-4 cursor-pointer transition-all border-l-4 group relative",
                  activeChat === i ? 'border-primary bg-blue-50/50' : 'border-transparent hover:bg-slate-50'
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={`https://picsum.photos/seed/${chat.name}/100`} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.online && <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{chat.name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold">{chat.time}</span>
                  </div>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">{chat.event}</p>
                  <p className="text-xs text-slate-500 truncate group-hover:text-slate-900 transition-colors">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Messaging Area */}
        <Card className={cn(
          "flex-1 flex flex-col shadow-2xl border-none overflow-hidden bg-white",
          !showChatOnMobile ? "hidden md:flex" : "flex"
        )}>
          {/* Header */}
          <div className="p-4 md:p-5 border-b flex items-center justify-between bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-3 md:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden -ml-2" 
                onClick={() => setShowChatOnMobile(false)}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Avatar className="h-10 w-10 md:h-11 md:w-11 border-2 border-slate-100">
                <AvatarImage src={`https://picsum.photos/seed/${conversations[activeChat].name}/100`} />
                <AvatarFallback>{conversations[activeChat].name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-900 leading-tight">{conversations[activeChat].name}</h3>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] md:text-[10px] text-green-600 font-bold uppercase tracking-widest">En ligne</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl border-slate-200" asChild>
                <Link href={`/pro/clients/${conversations[activeChat].id}`}>Voir profil</Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleMarkAsUnread(activeChat)} className="cursor-pointer gap-2">
                    <MailOpen className="h-4 w-4" />
                    <span>Marquer comme non lu</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 bg-slate-50/50">
            <div className="flex justify-center my-4">
              <Badge variant="secondary" className="bg-white/80 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-none">Aujourd'hui</Badge>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[85%] md:max-w-[75%] space-y-2">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Bonjour ! Merci pour votre réponse rapide. J'ai bien reçu vos forfaits. Est-il possible d'avoir une option pour le tirage papier instantané ?
                  </p>
                  <span className="text-[9px] text-slate-400 mt-2 block text-right font-bold">10:32</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[85%] md:max-w-[75%] space-y-2">
                <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-xl shadow-primary/10">
                  <p className="text-sm leading-relaxed">
                    Absolument ! Je viens de mettre à jour le devis avec l'option "Borne Photo Instantanée". Vous pouvez le consulter directement dans votre espace client.
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <span className="text-[9px] text-blue-100 font-bold">10:45</span>
                    <CheckCheck className="h-3 w-3 text-blue-200" />
                  </div>
                </div>
                
                {/* File Attachment UI */}
                <div className="flex justify-end">
                  <div className="bg-blue-600/10 border border-blue-200 p-3 rounded-xl flex items-center gap-3 w-fit">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                      <FileIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-primary truncate max-w-[150px]">Devis_Mariage_V2.pdf</p>
                      <p className="text-[8px] text-slate-400">1.2 MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 md:p-5 border-t bg-white">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-0.5 md:gap-1">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-full transition-colors">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-full transition-colors">
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>
              <Input 
                placeholder="Écrivez votre message..." 
                className="flex-1 border-none bg-slate-50 rounded-2xl h-11 md:h-12 focus-visible:ring-primary shadow-inner text-sm" 
              />
              <Button className="bg-primary hover:bg-primary/90 rounded-2xl h-11 w-11 md:h-12 md:w-12 flex items-center justify-center p-0 shadow-xl shadow-primary/20 shrink-0">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
