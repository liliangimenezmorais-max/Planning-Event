
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  FileText, 
  Receipt, 
  MoreVertical,
  Pencil, 
  Trash2,
  X,
  Loader2
} from "lucide-react";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  phone: string;
  company?: string;
  siret?: string;
  address?: string;
  notes?: string;
}

interface QuoteLine {
  description: string;
  quantity: number;
  price: number;
}

export default function ProClients() {
  const { toast } = useToast();
  const db = useFirestore();
  const [clientType, setClientType] = React.useState<"particulier" | "professionnel">("particulier");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  
  // Quote States
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = React.useState(false);
  const [quoteClient, setQuoteClient] = React.useState<Client | null>(null);
  const [quoteLines, setQuoteLines] = React.useState<QuoteLine[]>([{ description: "", quantity: 1, price: 0 }]);
  const [tva, setTva] = React.useState(20);

  // Real-time data from Firestore
  const clientsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'clients');
  }, [db]);
  const { data: clients, isLoading } = useCollection(clientsQuery);

  const totalHT = quoteLines.reduce((acc, line) => acc + (line.quantity * line.price), 0);
  const totalTTC = totalHT * (1 + tva / 100);

  const handleOpenAddDialog = () => {
    setEditingClient(null);
    setClientType("particulier");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (client: Client) => {
    setEditingClient(client);
    setClientType(client.type === "Particulier" ? "particulier" : "professionnel");
    setIsDialogOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'clients', id));
      toast({ title: "Client supprimé", description: "La fiche client a été retirée de votre base." });
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer le client." });
    }
  };

  const handleSaveClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const clientData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      type: clientType === "particulier" ? "Particulier" : "Professionnel",
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("companyName") as string || "",
      siret: formData.get("siret") as string || "",
      address: formData.get("address") as string || "",
      notes: formData.get("notes") as string || "",
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingClient) {
        await updateDoc(doc(db, 'clients', editingClient.id), clientData);
        toast({ title: "Client modifié", description: "Les informations ont été mises à jour." });
      } else {
        await addDoc(collection(db, 'clients'), { ...clientData, createdAt: new Date().toISOString() });
        toast({ title: "Client ajouté", description: "La nouvelle fiche client a été créée." });
      }
      setIsDialogOpen(false);
      setEditingClient(null);
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'enregistrer le client." });
    }
  };

  const handleAddQuoteLine = () => {
    setQuoteLines([...quoteLines, { description: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveQuoteLine = (index: number) => {
    if (quoteLines.length > 1) {
      setQuoteLines(quoteLines.filter((_, i) => i !== index));
    }
  };

  const handleUpdateQuoteLine = (index: number, field: keyof QuoteLine, value: string | number) => {
    const newLines = [...quoteLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setQuoteLines(newLines);
  };

  const handleCreateQuote = () => {
    toast({
      title: "Devis créé !",
      description: `Le devis pour ${quoteClient?.firstName} a été généré avec succès.`,
    });
    setIsQuoteDialogOpen(false);
    setQuoteLines([{ description: "", quantity: 1, price: 0 }]);
  };

  return (
    <Shell role="pro">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-slate-900">Mes Clients</h1>
            <p className="text-slate-500">Gérez votre base de données clients et vos documents commerciaux.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingClient(null);
          }}>
            <Button onClick={handleOpenAddDialog} className="bg-primary hover:bg-primary/90 rounded-xl shadow-lg font-bold px-6">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un client
            </Button>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold">
                  {editingClient ? "Modifier la fiche client" : "Nouveau Client"}
                </DialogTitle>
                <DialogDescription>
                  {editingClient ? "Mettez à jour les informations de votre client." : "Créez une fiche détaillée pour votre nouveau client."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveClient} className="space-y-6 pt-4">
                <div className="space-y-4">
                  <Label className="font-bold">Type de client</Label>
                  <Tabs value={clientType} onValueChange={(v) => setClientType(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="particulier" className="font-bold">Particulier</TabsTrigger>
                      <TabsTrigger value="professionnel" className="font-bold">Professionnel</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-bold">Prénom</Label>
                    <Input name="firstName" id="firstName" required defaultValue={editingClient?.firstName} className="bg-slate-50 border-slate-200" placeholder="Ex: Marc" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-bold">Nom</Label>
                    <Input name="lastName" id="lastName" required defaultValue={editingClient?.lastName} className="bg-slate-50 border-slate-200" placeholder="Ex: Dupont" />
                  </div>
                  
                  {clientType === 'professionnel' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="font-bold">Nom de la société</Label>
                        <Input name="companyName" id="companyName" required defaultValue={editingClient?.company} className="bg-slate-50 border-slate-200" placeholder="Ex: Pulse Music" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="siret" className="font-bold">Numéro SIRET</Label>
                        <Input name="siret" id="siret" required defaultValue={editingClient?.siret} className="bg-slate-50 border-slate-200" placeholder="Ex: 123 456 789 00012" />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold">Téléphone</Label>
                    <Input name="phone" id="phone" type="tel" required defaultValue={editingClient?.phone} className="bg-slate-50 border-slate-200" placeholder="06 00 00 00 00" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="font-bold">Adresse mail</Label>
                    <Input name="email" id="email" type="email" required defaultValue={editingClient?.email} className="bg-slate-50 border-slate-200" placeholder="contact@exemple.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="font-bold">Adresse postale</Label>
                    <Input name="address" id="address" required defaultValue={editingClient?.address} className="bg-slate-50 border-slate-200" placeholder="Ex: 12 rue des Fleurs, 33000 Bordeaux" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes" className="font-bold">Notes privées</Label>
                    <Textarea name="notes" id="notes" defaultValue={editingClient?.notes} placeholder="Préférences, contraintes, historique..." className="bg-slate-50 border-slate-200 min-h-[100px]" />
                  </div>
                </div>
                
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold rounded-xl shadow-lg transition-all">
                    {editingClient ? "Enregistrer les modifications" : "Enregistrer la fiche client"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quote Creation Dialog */}
        <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
          <DialogContent className="max-w-xl max-h-[95vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
            <div className="p-8 space-y-8 bg-white">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold font-headline text-slate-900">Créer un devis</DialogTitle>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-medium text-slate-700">Type d'événement</Label>
                  <Select>
                    <SelectTrigger className="h-12 border-slate-200 rounded-xl bg-slate-50 focus:ring-primary shadow-none">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mariage">Mariage</SelectItem>
                      <SelectItem value="anniversaire">Anniversaire</SelectItem>
                      <SelectItem value="bapteme">Baptême</SelectItem>
                      <SelectItem value="retraite">Départ à la retraite</SelectItem>
                      <SelectItem value="evjf">EVJF / EVJG</SelectItem>
                      <SelectItem value="privee">Soirée privée</SelectItem>
                      <SelectItem value="entreprise">Soirée d'entreprise</SelectItem>
                      <SelectItem value="association">Association</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-medium text-slate-700">Date</Label>
                    <Input type="date" className="h-12 border-slate-200 rounded-xl bg-slate-50 focus:ring-primary shadow-none" defaultValue="2026-03-31" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-medium text-slate-700">Lieu</Label>
                    <Input placeholder="Ville" className="h-12 border-slate-200 rounded-xl bg-slate-50 focus:ring-primary shadow-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-slate-700">Description</Label>
                  <Textarea placeholder="Description" className="min-h-[120px] border-slate-200 rounded-xl bg-slate-50 focus:ring-primary shadow-none resize-none" />
                </div>

                <div className="space-y-4">
                  <Label className="font-medium text-slate-700">Lignes du devis</Label>
                  <div className="space-y-3">
                    {quoteLines.map((line, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Input 
                          placeholder="Description" 
                          className="flex-1 h-12 border-slate-200 rounded-xl bg-slate-50 focus:ring-primary shadow-none"
                          value={line.description}
                          onChange={(e) => handleUpdateQuoteLine(index, "description", e.target.value)}
                        />
                        <Input 
                          type="number" 
                          className="w-20 h-12 border-slate-200 rounded-xl bg-slate-50 focus:ring-primary shadow-none"
                          value={line.quantity}
                          onChange={(e) => handleUpdateQuoteLine(index, "quantity", parseInt(e.target.value) || 0)}
                        />
                        <Input 
                          type="number" 
                          className="w-24 h-12 border-slate-200 rounded-xl bg-slate-50 focus:ring-primary shadow-none"
                          value={line.price}
                          onChange={(e) => handleUpdateQuoteLine(index, "price", parseFloat(e.target.value) || 0)}
                        />
                        {quoteLines.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-12 w-12 text-slate-400 hover:text-red-500"
                            onClick={() => handleRemoveQuoteLine(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="h-10 rounded-xl border-slate-200 font-bold px-4"
                    onClick={handleAddQuoteLine}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Ligne
                  </Button>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-slate-100">
                  <Label className="font-medium text-slate-500">TVA ({tva}%)</Label>
                  <Input 
                    type="number" 
                    className="w-24 h-12 border-slate-200 rounded-xl bg-slate-50 focus:ring-primary shadow-none text-right"
                    value={tva}
                    onChange={(e) => setTva(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="flex justify-between items-center py-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <p className="text-base font-bold text-slate-900">Total HT: {totalHT.toFixed(2)} €</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-base font-bold text-slate-900">Total TTC: {totalTTC.toFixed(2)} €</p>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 text-lg font-bold shadow-xl shadow-primary/20 transition-all transform active:scale-[0.98]"
                  onClick={handleCreateQuote}
                >
                  Créer le devis
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <div className="p-4 border-b bg-slate-50/50 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Rechercher un client..." className="pl-9 bg-white border-slate-200" />
            </div>
          </div>
          <div className="divide-y">
            {isLoading ? (
              <div className="p-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : clients && clients.length > 0 ? (
              clients.map((client) => (
                <div key={client.id} className="p-6 flex flex-col lg:flex-row items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${client.type === 'Particulier' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {client.type === 'Particulier' ? <User className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/pro/clients/${client.id}`} className="hover:text-primary transition-colors">
                          <h3 className="font-bold text-lg text-slate-900">{client.firstName} {client.lastName}</h3>
                        </Link>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${client.type === 'Particulier' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                          {client.type}
                        </span>
                      </div>
                      {client.company && <p className="text-sm font-semibold text-primary">{client.company}</p>}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {client.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary text-primary hover:bg-primary/5 rounded-lg h-10 px-4 font-bold"
                      onClick={() => {
                        setQuoteClient(client);
                        setIsQuoteDialogOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" /> Devis
                    </Button>
                    <Button variant="outline" size="sm" className="border-secondary text-primary hover:bg-secondary rounded-lg h-10 px-4 font-bold">
                      <Receipt className="h-4 w-4 mr-2" /> Facture
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(client)} className="flex items-center gap-2 cursor-pointer">
                          <Pencil className="h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClient(client.id)} className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600">
                          <Trash2 className="h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-slate-400 italic">Aucun client dans votre base de données.</div>
            )}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
