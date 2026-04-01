
"use client";

import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  Plus, 
  FileText, 
  Receipt,
  X,
  Printer,
  Download,
  Loader2,
  Calendar as CalendarIcon,
  Star,
  MessageSquare,
  Save,
  User
} from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/ui/logo";
import { useUser, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

interface QuoteLine {
  type: string;
  description: string;
  quantity: number;
  price: number;
}

const MOCK_CLIENTS = [
  { id: "1", firstName: "Jean", lastName: "Dupont", email: "jean@example.com", phone: "06 12 34 56 78", dob: "12/05/1990", address: "12 rue des Fleurs, Bordeaux", country: "France", city: "Bordeaux" },
];

export default function ClientDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  
  const [mounted, setMounted] = React.useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [validityDays, setValidityDays] = React.useState(30);
  const [eventDate, setEventDate] = React.useState<string>("");
  const [quoteLines, setQuoteLines] = React.useState<QuoteLine[]>([
    { type: "Prestation", description: "Service complet incluant préparation et réalisation.", quantity: 1, price: 500 }
  ]);
  const [note, setNote] = React.useState("");
  const [clientRating, setClientRating] = React.useState(0);

  // UseEffect to handle hydration and initialize dates
  React.useEffect(() => {
    setMounted(true);
    setEventDate(format(new Date(), 'yyyy-MM-dd'));
  }, []);
  
  const proRef = useMemoFirebase(() => user ? doc(db, 'professionalUsers', user.uid) : null, [db, user]);
  const { data: proData, isLoading: isProLoading } = useDoc(proRef);
  
  const clientData = MOCK_CLIENTS.find(c => c.id === params.id) || MOCK_CLIENTS[0];

  const client = {
    name: `${clientData.firstName} ${clientData.lastName}`,
    email: clientData.email,
    phone: clientData.phone,
    dob: clientData.dob,
    address: clientData.address,
    city: clientData.city,
    country: clientData.country
  };

  const totalHT = quoteLines.reduce((acc, line) => acc + (line.quantity * line.price), 0);
  
  // Safe date generation for hydration
  const getQuoteInfo = () => {
    if (!mounted) return { number: "...", date: "..." };
    const creationDate = new Date();
    return {
      number: `D00${format(creationDate, 'ddMMyy')}`,
      date: format(creationDate, 'dd/MM/yyyy')
    };
  };

  const quoteInfo = getQuoteInfo();

  const handleSaveNote = () => {
    toast({ 
      title: "Note enregistrée", 
      description: `L'évaluation (${clientRating}/5) et vos remarques ont été sauvegardées.` 
    });
  };

  return (
    <Shell role="pro">
      <div className="max-w-5xl mx-auto space-y-10">
        <Link 
          href="/pro/clients" 
          className="flex items-center text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold no-print"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour aux clients
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white no-print">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold font-headline text-slate-900">{client.name}</h1>
                    <p className="text-slate-400 font-medium">Particulier depuis 2024</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pt-6 border-t">
                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <span className="text-lg">📧</span> <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <span className="text-lg">📱</span> <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <span className="text-lg">📍</span> <span>{client.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 no-print">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-headline text-slate-900 flex items-center gap-2">
                  <FileText className="h-6 w-6" /> Devis
                </h2>
                <Button 
                  onClick={() => setIsQuoteDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 rounded-2xl h-12 px-6 font-bold shadow-xl shadow-primary/20"
                >
                  <Plus className="h-5 w-5 mr-2" /> Nouveau devis
                </Button>
              </div>

              <div className="space-y-4">
                 <Card className="border-none shadow-sm rounded-[1.5rem] bg-white cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setIsPreviewOpen(true)}>
                    <CardContent className="p-8 flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">Devis {quoteInfo.number}</h3>
                        <p className="text-slate-400 font-medium lowercase">
                          Dernière modification {mounted ? 'aujourd\'hui' : '...'} · {totalHT.toFixed(2)} € HT
                        </p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-600 border-none font-bold px-4 py-1.5 rounded-full text-sm">
                        Brouillon
                      </Badge>
                    </CardContent>
                  </Card>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8 no-print">
            {/* Notes & Reviews Sidebar */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Notes & Avis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-400">Évaluation client</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setClientRating(star)}
                          className="transition-transform active:scale-90"
                        >
                          <Star className={`h-6 w-6 ${clientRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-wider text-slate-400">Vos notes privées</Label>
                    <div className="flex flex-col gap-2">
                      <Textarea
                        placeholder="Préférences du client, historique des échanges..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-[150px] bg-slate-50 border-none focus:ring-primary text-sm rounded-xl"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveNote} className="w-full bg-slate-900 h-10 rounded-lg font-bold text-xs shadow-lg">
                    <Save className="h-3 w-3 mr-2" /> Enregistrer le suivi
                  </Button>
                </div>

                <div className="pt-6 border-t space-y-4">
                  <Label className="font-bold text-xs uppercase tracking-wider text-slate-400">Dernier retour d'expérience</Label>
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">Juin 2024</span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic leading-relaxed">
                      "Client très agréable, paiement rapide après la prestation."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
