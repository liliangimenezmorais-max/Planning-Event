
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User,
  Settings,
  MoreVertical,
  Pencil,
  Trash2
} from "lucide-react";
import * as React from "react";
import { fr } from "date-fns/locale";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  startOfToday
} from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  location: string;
  type: string;
  client: string;
  time?: string;
}

export default function ProCalendar() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<CalendarEvent | null>(null);
  const [selectedDateForNew, setSelectedDateForNew] = React.useState<string | null>(null);
  const { toast } = useToast();

  const [events, setEvents] = React.useState<CalendarEvent[]>([]);

  // Logic for generating days in current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: fr });
  const endDate = endOfWeek(monthEnd, { locale: fr });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const handleDayClick = (date: Date) => {
    setSelectedDateForNew(format(date, 'yyyy-MM-dd'));
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDateForNew(null);
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEvents(prev => prev.filter(e => e.id !== id));
    toast({ title: "Événement supprimé", description: "L'événement a été retiré de votre planning." });
  };

  const handleSaveEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const eventData: CalendarEvent = {
      id: editingEvent ? editingEvent.id : Math.random().toString(36).substr(2, 9),
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      type: formData.get("type") as string === "event" ? "Confirmé" : formData.get("type") as string === "option" ? "Option" : "Indisponible",
      location: formData.get("location") as string || "Lieu à préciser",
      client: formData.get("client") as string || (editingEvent ? editingEvent.client : "Client manuel")
    };

    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? eventData : e));
      toast({ title: "Événement modifié", description: "Les modifications ont été enregistrées." });
    } else {
      setEvents(prev => [...prev, eventData]);
      toast({ title: "Événement ajouté", description: "Votre planning a été mis à jour." });
    }
    
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => event.date === format(date, 'yyyy-MM-dd'));
  };

  const weekDays = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];

  return (
    <Shell role="pro">
      <div className="h-full flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-headline font-bold text-slate-900 capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </h1>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-lg h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={goToToday} className="text-xs font-bold px-3 h-8">
                Aujourd'hui
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-lg h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200 text-slate-600 rounded-xl h-11">
              <Settings className="h-4 w-4 mr-2" /> Synchro Google
            </Button>
            <Button onClick={() => { setEditingEvent(null); setSelectedDateForNew(format(new Date(), 'yyyy-MM-dd')); setIsDialogOpen(true); }} className="bg-primary hover:bg-primary/90 rounded-xl h-11 shadow-lg px-6 font-bold">
              <Plus className="h-4 w-4 mr-2" /> Nouvel événement
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="flex-1 border-none shadow-2xl overflow-hidden bg-white rounded-3xl min-h-[700px] flex flex-col">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 border-r border-slate-100 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-slate-100/50 gap-[1px]">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isTodayDate = isToday(day);

              return (
                <div 
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "min-h-[140px] bg-white p-2 transition-colors cursor-pointer group hover:bg-blue-50/30 flex flex-col gap-1",
                    !isCurrentMonth && "bg-slate-50/50 text-slate-300"
                  )}
                >
                  <div className="flex justify-end mb-1">
                    <span className={cn(
                      "text-sm font-bold h-7 w-7 flex items-center justify-center rounded-full transition-all",
                      isTodayDate ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-slate-500",
                      !isCurrentMonth && "text-slate-300"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={(e) => handleOpenEditDialog(event, e)}
                        className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold truncate transition-all flex items-center gap-1.5 shadow-sm border",
                          event.type === 'Confirmé' 
                            ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100" 
                            : event.type === 'Option'
                            ? "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100"
                            : "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {event.time && <span className="opacity-60">{event.time}</span>}
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Event Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-bold text-slate-900">
                {editingEvent ? "Modifier l'événement" : "Ajouter au planning"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEvent} className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entry-type" className="font-bold text-slate-700">Type d'entrée</Label>
                  <Select name="type" defaultValue={editingEvent ? (editingEvent.type === 'Confirmé' ? 'event' : editingEvent.type === 'Option' ? 'option' : 'blockout') : "event"}>
                    <SelectTrigger id="entry-type" className="h-12 bg-slate-50 border-slate-200 rounded-xl">
                      <SelectValue placeholder="Choisir un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Événement client</SelectItem>
                      <SelectItem value="blockout">Indisponibilité / Perso</SelectItem>
                      <SelectItem value="option">Option / Réservation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-title" className="font-bold text-slate-700">Titre de l'événement</Label>
                  <Input name="title" id="event-title" defaultValue={editingEvent?.title} placeholder="Ex: Mariage Julie & Tom" required className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-location" className="font-bold text-slate-700">Lieu</Label>
                  <Input name="location" id="event-location" defaultValue={editingEvent?.location} placeholder="Ex: Bordeaux" className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date" className="font-bold text-slate-700">Date</Label>
                    <Input name="date" id="event-date" type="date" defaultValue={editingEvent?.date || selectedDateForNew || ''} required className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time" className="font-bold text-slate-700">Heure</Label>
                    <Input name="time" id="event-time" type="time" defaultValue={editingEvent?.time} required className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4 flex flex-col gap-3">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-14 font-bold text-lg rounded-2xl shadow-xl shadow-primary/20">
                  {editingEvent ? "Enregistrer les modifications" : "Valider l'événement"}
                </Button>
                {editingEvent && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10 font-bold"
                    onClick={(e) => handleDeleteEvent(editingEvent.id, e)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Supprimer l'événement
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  );
}
