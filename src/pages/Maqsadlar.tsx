import { useState, useEffect } from "react";
import { Plus, ChevronRight, ChevronDown, Check, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  completed: boolean;
  children: Goal[];
  expanded: boolean;
}

export default function Maqsadlar() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nafs-goals");
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nafs-goals", JSON.stringify(goals));
  }, [goals]);

  const [addingSubtaskTo, setAddingSubtaskTo] = useState<string | null>(null);
  const [subtaskText, setSubtaskText] = useState("");

  const addGoal = (parentId?: string) => {
    if (!newGoalTitle.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      completed: false,
      children: [],
      expanded: false,
    };

    if (!parentId) {
      setGoals([...goals, newGoal]);
    } else {
      const addToParent = (items: Goal[]): Goal[] => {
        return items.map((item) => {
          if (item.id === parentId) {
            return { ...item, children: [...item.children, newGoal], expanded: true };
          }
          return { ...item, children: addToParent(item.children) };
        });
      };
      setGoals(addToParent(goals));
    }

    setNewGoalTitle("");
    toast.success("Maqsad qo'shildi!");
  };

  const addSubtask = (parentId: string) => {
    if (!subtaskText.trim()) return;

    const newSubtask: Goal = {
      id: Date.now().toString(),
      title: subtaskText,
      completed: false,
      children: [],
      expanded: false,
    };

    const addToParent = (items: Goal[]): Goal[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          return { ...item, children: [...item.children, newSubtask], expanded: true };
        }
        return { ...item, children: addToParent(item.children) };
      });
    };

    setGoals(addToParent(goals));
    setSubtaskText("");
    setAddingSubtaskTo(null);
    toast.success("Podзадача qo'shildi!");
  };

  const toggleGoal = (id: string) => {
    const toggle = (items: Goal[]): Goal[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        return { ...item, children: toggle(item.children) };
      });
    };
    setGoals(toggle(goals));
  };

  const toggleExpand = (id: string) => {
    const toggle = (items: Goal[]): Goal[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded };
        }
        return { ...item, children: toggle(item.children) };
      });
    };
    setGoals(toggle(goals));
  };

  const deleteGoal = (id: string) => {
    const remove = (items: Goal[]): Goal[] => {
      return items.filter((item) => item.id !== id).map((item) => ({
        ...item,
        children: remove(item.children),
      }));
    };
    setGoals(remove(goals));
    toast.success("Maqsad o'chirildi");
  };

  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditText(title);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;

    const edit = (items: Goal[]): Goal[] => {
      return items.map((item) => {
        if (item.id === editingId) {
          return { ...item, title: editText };
        }
        return { ...item, children: edit(item.children) };
      });
    };
    setGoals(edit(goals));
    setEditingId(null);
    setEditText("");
    toast.success("Maqsad tahrirlandi");
  };

  const renderGoal = (goal: Goal, level: number = 0) => {
    return (
      <div key={goal.id} className={`${level > 0 ? "ml-6 mt-2" : "mt-3"}`}>
        <Card className="p-3 shadow-soft hover:shadow-medium transition-smooth">
          <div className="flex items-center gap-2">
            {goal.children.length > 0 && (
              <button
                onClick={() => toggleExpand(goal.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                {goal.expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}

            <Checkbox
              checked={goal.completed}
              onCheckedChange={() => toggleGoal(goal.id)}
              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
            />

            {editingId === goal.id ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  className="flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={saveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 ${
                    goal.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {goal.title}
                </span>
                <button
                  onClick={() => startEdit(goal.id, goal.title)}
                  className="text-muted-foreground hover:text-primary"
                  title="Tahrirlash"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-muted-foreground hover:text-destructive"
                  title="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAddingSubtaskTo(goal.id)}
                  className="text-muted-foreground hover:text-primary"
                  title="Podzadacha qo'shish"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </Card>

        {addingSubtaskTo === goal.id && (
          <Card className="ml-6 mt-2 p-3 shadow-soft">
            <div className="flex gap-2">
              <Input
                value={subtaskText}
                onChange={(e) => setSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addSubtask(goal.id);
                  if (e.key === "Escape") {
                    setAddingSubtaskTo(null);
                    setSubtaskText("");
                  }
                }}
                placeholder="Podzadacha kiriting..."
                className="flex-1"
                autoFocus
              />
              <Button size="sm" onClick={() => addSubtask(goal.id)}>
                <Check className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setAddingSubtaskTo(null);
                  setSubtaskText("");
                }}
              >
                ×
              </Button>
            </div>
          </Card>
        )}

        {goal.expanded && goal.children.map((child) => renderGoal(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 mb-6 shadow-strong">
          <h1 className="text-3xl font-bold mb-2">Maqsadlar</h1>
          <p className="text-primary-foreground/90">
            Katta maqsadlarni kichik qadamlarga bo'ling
          </p>
        </div>

        <Card className="p-4 mb-4 shadow-medium">
          <div className="flex gap-2">
            <Input
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGoal()}
              placeholder="Yangi maqsad kiriting..."
              className="flex-1"
            />
            <Button onClick={() => addGoal()} className="bg-gradient-primary">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        <div className="space-y-2">
          {goals.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Hali maqsadlar yo'q. Birinchi maqsadingizni qo'shing!
              </p>
            </Card>
          ) : (
            goals.map((goal) => renderGoal(goal))
          )}
        </div>
      </div>
    </div>
  );
}
