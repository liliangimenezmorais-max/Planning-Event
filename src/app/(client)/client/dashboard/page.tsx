import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, MessageSquare, ArrowRight, Star, User } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const suggestions = [
    { name: "DJ Kévin", cat: "DJ / Animation", rating: 4.9, color: "bg-blue-100 text-blue-600" },
    { name: "L'atelier Gourmand", cat: "Traiteur", rating: 4.8, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <Shell role="client">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Bonjour Jean ! 👋</h1>
            <p className="text-muted-foreground">Voici l'état d'avancement de vos événements.</p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg" asChild>
            <Link href="/client/requests/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Nouvelle demande
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary text-white shadow-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/80">Demandes actives</CardDescription>
              <CardTitle className="text-4xl font-headline">3</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-white/60">2 nouvelles réponses aujourd'hui</div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Devis à signer</CardDescription>
              <CardTitle className="text-4xl font-headline text-primary">1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Mariage - Photographe</div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Messages non lus</CardDescription>
              <CardTitle className="text-4xl font-headline text-secondary">5</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">De 3 prestataires différents</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold">Demandes en cours</h2>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Voir tout <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              {[
                { title: "Mariage au Domaine", date: "15 Juin 2024", location: "Bordeaux", status: "En attente", color: "bg-yellow-500" },
                { title: "Anniversaire 30 ans", date: "22 Mai 2024", location: "Paris", status: "Confirmé", color: "bg-green-500" },
              ].map((req, i) => (
                <Card key={i} className="hover:border-primary transition-colors cursor-pointer group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl ${req.color} flex items-center justify-center text-white shadow-inner`}>
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{req.title}</h3>
                        <p className="text-xs text-muted-foreground">{req.date} • {req.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted">{req.status}</span>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold">Suggestions pour vous</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((pro, i) => (
                <Card key={i} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className={`h-32 w-full flex items-center justify-center ${pro.color} bg-opacity-30`}>
                    <User className="h-12 w-12" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-sm truncate">{pro.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-yellow-600 font-bold">
                        <Star className="h-3 w-3 fill-current" /> {pro.rating}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{pro.cat}</p>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 border-primary text-primary hover:bg-primary hover:text-white">Voir profil</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
