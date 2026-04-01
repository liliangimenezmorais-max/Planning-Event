
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Calendar, Trash2, Edit2, MessageSquare, Save } from "lucide-react";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

export default function ClientProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Local state for profile data (simulated)
  const [profile, setProfile] = React.useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@exemple.com",
    dob: "1990-05-12",
    about: "Organisateur passionné pour mes amis et ma famille."
  });

  const [formData, setFormData] = React.useState({ ...profile });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...formData });
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      variant: "destructive",
      title: "Action requise",
      description: "Veuillez confirmer la suppression de votre compte par email.",
    });
  };

  return (
    <Shell role="client">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Main Profile Info */}
          <div className="flex-1 space-y-6 w-full">
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="h-32 bg-primary" />
              <CardContent className="relative pt-16 pb-8 px-8">
                <div className="absolute -top-16 left-8">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                    <AvatarImage src="https://picsum.photos/seed/client-avatar/200" />
                    <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-headline font-bold text-slate-900">{profile.firstName} {profile.lastName}</h1>
                    <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">Particulier</p>
                  </div>
                  
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4 mr-2" /> Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-headline font-bold">Modifier mon profil</DialogTitle>
                        <DialogDescription>
                          Mettez à jour vos informations personnelles ici.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSaveProfile} className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="font-bold">Prénom</Label>
                            <Input 
                              id="firstName" 
                              value={formData.firstName} 
                              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                              className="bg-slate-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="font-bold">Nom</Label>
                            <Input 
                              id="lastName" 
                              value={formData.lastName} 
                              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                              className="bg-slate-50"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob" className="font-bold">Date de naissance</Label>
                          <Input 
                            id="dob" 
                            type="date" 
                            value={formData.dob} 
                            onChange={(e) => setFormData({...formData, dob: e.target.value})}
                            className="bg-slate-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="about" className="font-bold">À propos (max 50 caract.)</Label>
                          <Textarea 
                            id="about" 
                            maxLength={50}
                            value={formData.about} 
                            onChange={(e) => setFormData({...formData, about: e.target.value})}
                            className="bg-slate-50 min-h-[80px]"
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="w-full bg-primary font-bold shadow-lg">
                            <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="h-4 w-4" /> {profile.email}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="h-4 w-4" /> Né le {new Date(profile.dob).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="pt-6 border-t">
                    <h3 className="font-bold text-sm mb-2">À propos</h3>
                    <p className="text-slate-500 text-sm italic">
                      "{profile.about}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History of Ads */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="font-headline text-lg">Historique de mes annonces</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Mariage au Domaine", date: "15 Juin 2024", status: "Terminé" },
                  { title: "Anniversaire 30 ans", date: "22 Mai 2024", status: "En cours" },
                ].map((ad, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm">{ad.title}</h4>
                      <p className="text-xs text-slate-400">{ad.date}</p>
                    </div>
                    <Badge variant={ad.status === 'Terminé' ? 'secondary' : 'default'} className="text-[10px]">
                      {ad.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-2 border-red-100 bg-red-50/30">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-red-900 font-bold">Zone de danger</h3>
                  <p className="text-red-600/70 text-sm">Supprimer définitivement vos données</p>
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
      </div>
    </Shell>
  );
}
