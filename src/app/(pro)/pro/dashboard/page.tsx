
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Euro, 
  Calendar, 
  Clock, 
  Search, 
  ArrowRight,
  MapPin,
  Settings
} from "lucide-react";
import Link from "next/link";
import { useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export default function ProDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  
  const proRef = useMemoFirebase(() => user ? doc(db, 'professionalUsers', user.uid) : null, [db, user]);
  const { data: proData } = useDoc(proRef);

  return (
    <Shell role="pro">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">
              {proData?.companyName || "Mon Studio"} 👋
            </h1>
            <p className="text-muted-foreground">Voici l'activité de votre espace professionnel.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="rounded-xl font-bold border-primary text-primary hover:bg-primary/5" asChild>
              <Link href="/pro/settings">
                <Settings className="mr-2 h-5 w-5" />
                Réglages
              </Link>
            </Button>
            <Button size="lg" className="bg-secondary text-primary font-bold hover:bg-secondary/90 shadow-lg rounded-xl" asChild>
              <Link href="/pro/requests">
                <Search className="mr-2 h-5 w-5" />
                Trouver des clients
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Demandes", value: "12", sub: "3 nouvelles", icon: <Search className="h-5 w-5" />, color: "text-blue-600" },
            { label: "Zone Active", value: proData?.serviceRadius || "50km", sub: `Ville: ${proData?.city || "France"}`, icon: <MapPin className="h-5 w-5" />, color: "text-green-600" },
            { label: "CA Estimé", value: "3 450€", sub: "+15% ce mois", icon: <Euro className="h-5 w-5" />, color: "text-secondary" },
            { label: "Clients", value: "48", sub: "Fidélité 12%", icon: <Users className="h-5 w-5" />, color: "text-primary" },
          ].map((stat, i) => (
            <Card key={i} className="shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`${stat.color} bg-muted p-2 rounded-lg`}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/30 rounded-t-xl px-6 py-5">
              <div>
                <CardTitle className="font-headline font-bold">Annonces ciblées</CardTitle>
                <CardDescription>
                  Basé sur votre zone : {proData?.city || "Ma ville"} + {proData?.serviceRadius || "50km"}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg font-bold" asChild>
                <Link href="/pro/requests">Voir tout</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  { id: "1", name: "Marie L.", event: "Mariage", date: "12 Août 2024", guests: "80", location: "Bordeaux Centre" },
                  { id: "2", name: "Entreprise X", event: "Soirée Corporate", date: "05 Sept 2024", guests: "200", location: "Mérignac" },
                  { id: "3", name: "Thomas G.", event: "Anniversaire", date: "28 Mai 2024", guests: "40", location: "Pessac" },
                ].map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                        {req.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{req.name}</h4>
                          <Badge variant="secondary" className="text-[10px] h-4 font-bold bg-secondary text-primary">{req.event}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 uppercase tracking-tighter">
                            <Calendar className="h-3 w-3" /> {req.date}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 uppercase tracking-tighter">
                            <MapPin className="h-3 w-3" /> {req.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-9 group-hover:text-primary font-bold" asChild>
                       <Link href={`/pro/requests/${req.id}`}>
                          Détails <ArrowRight className="ml-1 h-3 w-3" />
                       </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-primary text-white p-6">
              <CardTitle className="font-headline font-bold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Planning du jour
              </CardTitle>
              <CardDescription className="text-white/80">Aujourd'hui, 24 Avril</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  { time: "09:00", task: "Retouche photos Mariage Julie", type: "Travail" },
                  { time: "14:30", task: "RDV client - Café central", type: "RDV" },
                  { time: "17:00", task: "Envoi devis Entreprise Y", type: "Admin" },
                ].map((task, i) => (
                  <div key={i} className="p-5 flex gap-4 hover:bg-muted/30 transition-colors">
                    <span className="font-bold text-sm text-primary whitespace-nowrap">{task.time}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{task.task}</p>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{task.type}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6">
                <Button className="w-full bg-slate-50 text-primary border border-primary/20 font-bold hover:bg-slate-100 rounded-xl h-11" asChild>
                  <Link href="/pro/calendar">Calendrier complet</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
