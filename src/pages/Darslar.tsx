import { useState, useEffect } from "react";
import { Plus, Clock, Trash2, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Lesson {
  id: string;
  name: string;
  time: string;
  topic: string;
  completed: boolean;
  days: number[]; // 0 = Воскресенье, 1 = Понедельник, ..., 6 = Суббота
}

export default function Darslar() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", time: "", topic: "", days: [1, 2, 3, 4, 5, 6, 0] });
  const [currentTime, setCurrentTime] = useState(new Date());

  const weekDays = [
    { id: 1, name: "Du", full: "Dushanba" },
    { id: 2, name: "Se", full: "Seshanba" },
    { id: 3, name: "Ch", full: "Chorshanba" },
    { id: 4, name: "Pa", full: "Payshanba" },
    { id: 5, name: "Ju", full: "Juma" },
    { id: 6, name: "Sh", full: "Shanba" },
    { id: 0, name: "Ya", full: "Yakshanba" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("nafs-lessons");
    if (saved) {
      setLessons(JSON.parse(saved));
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("nafs-lessons", JSON.stringify(lessons));
  }, [lessons]);

  const getCurrentLesson = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const currentDay = currentTime.getDay();
    return lessons.find((lesson) => {
      const [hours, minutes] = lesson.time.split(":").map(Number);
      const lessonTime = hours * 60 + minutes;
      const isToday = lesson.days?.includes(currentDay) ?? true;
      return Math.abs(lessonTime - now) < 60 && !lesson.completed && isToday;
    });
  };

  const addOrUpdateLesson = () => {
    if (!formData.name || !formData.time) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    if (formData.days.length === 0) {
      toast.error("Kamida bitta kun tanlang");
      return;
    }

    if (editingId) {
      setLessons(
        lessons.map((lesson) =>
          lesson.id === editingId ? { ...lesson, ...formData } : lesson
        )
      );
      toast.success("Dars tahrirlandi");
    } else {
      const newLesson: Lesson = {
        id: Date.now().toString(),
        ...formData,
        completed: false,
      };
      setLessons([...lessons, newLesson].sort((a, b) => a.time.localeCompare(b.time)));
      toast.success("Dars qo'shildi");
    }

    setFormData({ name: "", time: "", topic: "", days: [1, 2, 3, 4, 5, 6, 0] });
    setShowForm(false);
    setEditingId(null);
  };

  const deleteLesson = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id));
    toast.success("Dars o'chirildi");
  };

  const toggleComplete = (id: string) => {
    setLessons(
      lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
      )
    );
  };

  const startEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setFormData({ 
      name: lesson.name, 
      time: lesson.time, 
      topic: lesson.topic,
      days: lesson.days || [1, 2, 3, 4, 5, 6, 0]
    });
    setShowForm(true);
  };

  const toggleDay = (dayId: number) => {
    if (formData.days.includes(dayId)) {
      setFormData({ ...formData, days: formData.days.filter(d => d !== dayId) });
    } else {
      setFormData({ ...formData, days: [...formData.days, dayId] });
    }
  };

  const currentLesson = getCurrentLesson();

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 mb-6 shadow-strong">
          <h1 className="text-3xl font-bold mb-2">Darslar Jadvali</h1>
          <p className="text-primary-foreground/90">Kunlik darslaringizni rejalashtiring</p>
        </div>

        {currentLesson && (
          <Card className="p-4 mb-6 bg-gradient-accent text-accent-foreground shadow-medium">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Hozir:</h3>
                <p>
                  {currentLesson.time} - {currentLesson.name}
                </p>
                {currentLesson.topic && <p className="text-sm opacity-90">{currentLesson.topic}</p>}
              </div>
            </div>
          </Card>
        )}

        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", time: "", topic: "", days: [1, 2, 3, 4, 5, 6, 0] });
          }}
          className="w-full mb-4 bg-gradient-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yangi dars qo'shish
        </Button>

        {showForm && (
          <Card className="p-4 mb-4 shadow-medium">
            <div className="space-y-3">
              <Input
                placeholder="Dars nomi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
              <Input
                placeholder="Mavzu (ixtiyoriy)"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
              
              <div>
                <label className="text-sm font-medium mb-2 block">Qaysi kunlarda?</label>
                <div className="flex gap-2 flex-wrap">
                  {weekDays.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                        formData.days.includes(day.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      title={day.full}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addOrUpdateLesson} className="flex-1 bg-gradient-primary">
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? "Saqlash" : "Qo'shish"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: "", time: "", topic: "", days: [1, 2, 3, 4, 5, 6, 0] });
                  }}
                >
                  Bekor qilish
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {lessons.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Hali darslar yo'q. Birinchi darsni qo'shing!</p>
            </Card>
          ) : (
            lessons.map((lesson) => (
              <Card key={lesson.id} className="p-4 shadow-soft hover:shadow-medium transition-smooth">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={lesson.completed}
                    onCheckedChange={() => toggleComplete(lesson.id)}
                    className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                  />
                   <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{lesson.time}</span>
                      <span className={lesson.completed ? "line-through text-muted-foreground" : ""}>
                        {lesson.name}
                      </span>
                    </div>
                    {lesson.topic && (
                      <p className="text-sm text-muted-foreground mt-1">{lesson.topic}</p>
                    )}
                    {lesson.days && lesson.days.length < 7 && (
                      <div className="flex gap-1 mt-2">
                        {weekDays
                          .filter(day => lesson.days.includes(day.id))
                          .map(day => (
                            <span 
                              key={day.id} 
                              className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                              title={day.full}
                            >
                              {day.name}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(lesson)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteLesson(lesson.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
