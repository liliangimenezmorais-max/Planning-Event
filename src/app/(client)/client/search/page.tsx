
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, User, Calendar, MessageSquare, Filter, Loader2 } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function SearchPros() {
  const db = useFirestore();
  
  // Fetch real professionals from Firestore
  const prosQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'professionals');
  }, [db]);
  
  const { data: professionals, isLoading } = useCollection(prosQuery);

  return (
    <Shell role="client">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold text-slate-900 tracking-tight">Trouver un prestataire</h1>
            <p className="text-slate-500 text-lg">Le meilleur de l'événementiel, sélectionné pour vous.</p>
          </div>
          <Button variant="ghost" className="text-primary font-bold">
            <Filter className="h-4 w-4 mr-2" /> Filtres avancés
          </Button>
        </div>

        <Card className="border-none shadow-2xl bg-white p-6 rounded-3xl overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <Label className="text-slate-700 font-bold ml-1">Catégorie</Label>
              <Select>
                <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary">
                  <SelectValue placeholder="Tous les métiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artificier">Artificier</SelectItem>
                  <SelectItem value="dj">DJ</SelectItem>
                  <SelectItem value="photographe">Photographe</SelectItem>
                  <SelectItem value="wedding_planner">Wedding Planner</SelectItem>
                  <SelectItem value="traiteur">Traiteur</SelectItem>
                  <SelectItem value="musicien">Musicien</SelectItem>
                  <SelectItem value="fleuriste">Fleuriste</SelectItem>
                  <SelectItem value="lieu">Lieu de réception</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-slate-700 font-bold ml-1">Où ?</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Ville, Code Postal" className="h-12 pl-11 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-slate-700 font-bold ml-1">Date prévue</Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type="date" className="h-12 pl-11 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary" />
              </div>
            </div>
            <div className="flex items-end">
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl shadow-xl shadow-primary/20 font-bold text-base transition-all transform hover:scale-[1.02]">
                <Search className="h-5 w-5 mr-2" />
                Lancer la recherche
              </Button>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {professionals && professionals.length > 0 ? (
              professionals.map((pro) => (
                <Card key={pro.id} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-[2rem] bg-white">
                  <div className={`relative h-56 w-full flex items-center justify-center bg-slate-100 group-hover:bg-opacity-80 transition-all duration-500`}>
                    {pro.profileImageUrl ? (
                      <img src={pro.profileImageUrl} alt={pro.companyName} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <User className="h-20 w-20 text-slate-400 group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-yellow-600 font-bold text-xs flex items-center gap-1.5 shadow-xl">
                      <Star className="h-3.5 w-3.5 fill-current" /> {pro.rating || "N/A"}
                    </div>
                  </div>
                  <CardContent className="p-7 space-y-4">
                    <div>
                      <h3 className="font-headline font-bold text-2xl text-slate-900 group-hover:text-primary transition-colors truncate">
                        {pro.companyName || `${pro.firstName} ${pro.lastName}`}
                      </h3>
                      <p className="text-sm font-semibold text-slate-400 flex items-center gap-2 mt-1">
                        <User className="h-3.5 w-3.5 text-primary" /> {pro.firstName} {pro.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-4 w-4 text-primary" /> {pro.location}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-7 pt-0 flex gap-3">
                    <Button variant="outline" className="flex-1 h-11 rounded-xl border-slate-200 font-bold hover:bg-slate-50 transition-colors" asChild>
                      <Link href={`/client/professionals/${pro.id}`}>Voir profil</Link>
                    </Button>
                    <Button className="flex-1 h-11 bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/10" asChild>
                      <Link href={`/client/messages?proId=${pro.id}`}>
                        <MessageSquare className="h-4 w-4 mr-2" /> Contacter
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">Aucun prestataire n'est encore inscrit dans votre zone.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}
