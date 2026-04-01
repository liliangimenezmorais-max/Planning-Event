
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Mail, Building2, Trash2, Edit2, Star, Camera } from "lucide-react";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProProfile() {
  const { toast } = useToast();

  const handleDeleteAccount = () => {
    toast({
      variant: "destructive",
      title: "Action irréversible",
      description: "Toutes vos données professionnelles seront supprimées.",
    });
  };

  return (
    <Shell role="pro">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col gap-8">
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="h-40 bg-primary relative">
              <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 bg-white/20 backdrop-blur text-white hover:bg-white/40">
                <Camera className="h-4 w-4 mr-2" /> Changer couverture
              </Button>
            </div>
            <CardContent className="relative pt-16 pb-8 px-8">
              <div className="absolute -top-16 left-8">
                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                  <AvatarImage src="https://picsum.photos/seed/pro-avatar/200" />
                  <AvatarFallback>SF</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-headline font-bold text-slate-900">Studio Flash Photo</h1>
                  <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">Professionnel</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-secondary text-primary border-primary/20">Photographe</Badge>
                    <div className="flex items-center text-yellow-600 font-bold text-sm">
                      <Star className="h-4 w-4 fill-current mr-1" /> 4.9 (12 avis)
                    </div>
                  </div>
                </div>
                <Button variant="outline">
                  <Edit2 className="h-4 w-4 mr-2" /> Modifier le profil
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 border-t pt-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900">Informations Légales</h3>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Building2 className="h-4 w-4 text-primary" /> SIRET : 123 456 789 00012
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Mail className="h-4 w-4 text-primary" /> contact@studioflash.fr
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Briefcase className="h-4 w-4 text-primary" /> Marc DJ (Gérant)
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900">Présentation</h3>
                  <p className="text-slate-500 text-sm italic">
                    "Saisir l'instant magique de votre mariage avec passion."
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Description limitée à 50 caractères</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-100 bg-red-50/30">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-red-900 font-bold">Zone de danger</h3>
                <p className="text-red-600/70 text-sm">La suppression de votre compte pro est définitive.</p>
              </div>
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700 font-bold"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Supprimer ce compte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
