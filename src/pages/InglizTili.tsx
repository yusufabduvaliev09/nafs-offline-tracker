import { useState, useEffect } from "react";
import { BookOpen, Plus, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
}

export default function InglizTili() {
  const [currentPosition, setCurrentPosition] = useState("");
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", progress: 0 });

  useEffect(() => {
    const savedPosition = localStorage.getItem("nafs-english-position");
    const savedGoals = localStorage.getItem("nafs-english-goals");
    if (savedPosition) setCurrentPosition(savedPosition);
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem("nafs-english-position", currentPosition);
  }, [currentPosition]);

  useEffect(() => {
    localStorage.setItem("nafs-english-goals", JSON.stringify(goals));
  }, [goals]);

  const addOrUpdateGoal = () => {
    if (!formData.title) {
      toast.error("Iltimos, maqsad nomini kiriting");
      return;
    }

    if (editingId) {
      setGoals(goals.map((goal) => (goal.id === editingId ? { ...goal, ...formData } : goal)));
      toast.success("Maqsad tahrirlandi");
    } else {
      const newGoal: LearningGoal = {
        id: Date.now().toString(),
        ...formData,
      };
      setGoals([...goals, newGoal]);
      toast.success("Maqsad qo'shildi");
    }

    setFormData({ title: "", description: "", progress: 0 });
    setShowForm(false);
    setEditingId(null);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    toast.success("Maqsad o'chirildi");
  };

  const startEdit = (goal: LearningGoal) => {
    setEditingId(goal.id);
    setFormData(goal);
    setShowForm(true);
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, progress } : goal)));
  };

  const averageProgress =
    goals.length > 0 ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 mb-6 shadow-strong">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Ingliz tili</h1>
              <p className="text-primary-foreground/90">O'qish va rivojlanish</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm mb-2">Umumiy progress:</p>
            <Progress value={averageProgress} className="h-2" />
            <p className="text-right text-sm mt-1">{Math.round(averageProgress)}%</p>
          </div>
        </div>

        <Card className="p-4 mb-6 shadow-medium">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Men qaerda to'xtadim?
          </h3>
          <Textarea
            value={currentPosition}
            onChange={(e) => setCurrentPosition(e.target.value)}
            placeholder="Masalan: Unit 5, Grammar section, Present Perfect tense..."
            className="min-h-24"
          />
        </Card>

        <Button onClick={() => setShowForm(!showForm)} className="w-full mb-4 bg-gradient-primary">
          <Plus className="w-5 h-5 mr-2" />
          Yangi maqsad qo'shish
        </Button>

        {showForm && (
          <Card className="p-4 mb-4 shadow-medium">
            <div className="space-y-3">
              <Input
                placeholder="Maqsad nomi"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Tavsif (ixtiyoriy)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Progress: {formData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addOrUpdateGoal} className="flex-1 bg-gradient-primary">
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? "Saqlash" : "Qo'shish"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ title: "", description: "", progress: 0 });
                  }}
                >
                  Bekor qilish
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {goals.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Hali maqsadlar yo'q. Birinchi maqsadingizni qo'shing!
              </p>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} className="p-4 shadow-soft hover:shadow-medium transition-smooth">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(goal)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <Progress value={goal.progress} className="h-2 mb-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
