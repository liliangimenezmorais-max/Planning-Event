
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, MessageSquare, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";

const adRequests = [
  { id: "1", client: "Marie L.", type: "Mariage", date: "12/08/2024", location: "Bordeaux", guests: 80, desc: "Besoin d'un photographe pour cérémonie civile + soirée..." },
  { id: "2", client: "Entreprise X", type: "Corporate", date: "15/09/2024", location: "Mérignac", guests: 200, desc: "Recherche DJ pour soirée annuelle entreprise..." },
  { id: "3", client: "Thomas G.", type: "Anniversaire", date: "28/05/2024", location: "Pessac", guests: 40, desc: "30 ans, ambiance généraliste demandée..." },
];

export default function ProRequests() {
  const router = useRouter();

  return (
    <Shell role="pro">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-slate-900">Demandes Clients</h1>
            <p className="text-slate-500">Consultez les annonces correspondant à votre métier.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filtrer par ville..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {adRequests.map((req) => (
            <Card key={req.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white">
              <CardContent className="p-6 flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {req.client.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{req.client}</h4>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-2 h-5 text-[10px] uppercase font-bold tracking-wider">
                        {req.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 italic line-clamp-2">"{req.desc}"</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {req.date}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {req.location}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                      <Users className="h-3.5 w-3.5 text-primary" /> {req.guests} invités
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 min-w-fit">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-white font-bold h-11 px-6 rounded-xl transition-all" 
                    onClick={() => router.push(`/pro/requests/${req.id}`)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profil Client
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all" 
                    onClick={() => router.push(`/pro/messages?clientId=${req.id}`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Répondre
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
