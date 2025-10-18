import { useState, useEffect } from "react";
import { Moon, Plus, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Prayer {
  id: string;
  name: string;
  time: string;
  isDefault: boolean;
  completed: boolean;
}

const defaultPrayers = [
  { name: "Bomdod", time: "05:00" },
  { name: "Peshin", time: "12:30" },
  { name: "Asr", time: "15:30" },
  { name: "Shom", time: "18:00" },
  { name: "Xufton", time: "19:30" },
];

export default function Namoz() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", time: "" });

  useEffect(() => {
    const saved = localStorage.getItem("nafs-prayers");
    if (saved) {
      setPrayers(JSON.parse(saved));
    } else {
      const initialPrayers = defaultPrayers.map((prayer, index) => ({
        id: `default-${index}`,
        ...prayer,
        isDefault: true,
        completed: false,
      }));
      setPrayers(initialPrayers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nafs-prayers", JSON.stringify(prayers));
  }, [prayers]);

  useEffect(() => {
    const checkNewDay = () => {
      const lastReset = localStorage.getItem("nafs-prayers-last-reset");
      const today = new Date().toDateString();

      if (lastReset !== today) {
        setPrayers((current) =>
          current.map((prayer) => ({ ...prayer, completed: false }))
        );
        localStorage.setItem("nafs-prayers-last-reset", today);
      }
    };

    checkNewDay();
    const interval = setInterval(checkNewDay, 60000);
    return () => clearInterval(interval);
  }, []);

  const addOrUpdatePrayer = () => {
    if (!formData.name || !formData.time) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    if (editingId) {
      setPrayers(
        prayers.map((prayer) =>
          prayer.id === editingId
            ? { ...prayer, name: formData.name, time: formData.time }
            : prayer
        )
      );
      toast.success("Namoz tahrirlandi");
    } else {
      const newPrayer: Prayer = {
        id: Date.now().toString(),
        ...formData,
        isDefault: false,
        completed: false,
      };
      setPrayers([...prayers, newPrayer].sort((a, b) => a.time.localeCompare(b.time)));
      toast.success("Namoz qo'shildi");
    }

    setFormData({ name: "", time: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const deletePrayer = (id: string) => {
    setPrayers(prayers.filter((prayer) => prayer.id !== id));
    toast.success("Namoz o'chirildi");
  };

  const toggleComplete = (id: string) => {
    setPrayers(
      prayers.map((prayer) =>
        prayer.id === id ? { ...prayer, completed: !prayer.completed } : prayer
      )
    );
  };

  const startEdit = (prayer: Prayer) => {
    setEditingId(prayer.id);
    setFormData({ name: prayer.name, time: prayer.time });
    setShowForm(true);
  };

  const updateTime = (id: string, time: string) => {
    setPrayers(prayers.map((prayer) => (prayer.id === id ? { ...prayer, time } : prayer)));
  };

  const completedCount = prayers.filter((p) => p.completed).length;
  const totalCount = prayers.length;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 mb-6 shadow-strong">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Namoz</h1>
              <p className="text-primary-foreground/90">Kunlik ibodatlar</p>
            </div>
          </div>
          <div className="bg-primary-foreground/20 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Bugun:</span>
              <span className="text-2xl font-bold">
                {completedCount}/{totalCount}
              </span>
            </div>
          </div>
        </div>

        <Button onClick={() => setShowForm(!showForm)} className="w-full mb-4 bg-gradient-primary">
          <Plus className="w-5 h-5 mr-2" />
          Qo'shimcha namoz/zikr qo'shish
        </Button>

        {showForm && (
          <Card className="p-4 mb-4 shadow-medium">
            <div className="space-y-3">
              <Input
                placeholder="Nomi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={addOrUpdatePrayer} className="flex-1 bg-gradient-primary">
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? "Saqlash" : "Qo'shish"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: "", time: "" });
                  }}
                >
                  Bekor qilish
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {prayers.map((prayer) => (
            <Card
              key={prayer.id}
              className={`p-4 shadow-soft hover:shadow-medium transition-smooth ${
                prayer.completed ? "bg-success/5 border-success/20" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={prayer.completed}
                  onCheckedChange={() => toggleComplete(prayer.id)}
                  className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                />

                <div className="flex-1">
                  <h3
                    className={`font-semibold text-lg ${
                      prayer.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {prayer.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="time"
                      value={prayer.time}
                      onChange={(e) => updateTime(prayer.id, e.target.value)}
                      className="w-32 h-8 text-sm"
                    />
                  </div>
                </div>

                {!prayer.isDefault && (
                  <>
                    <button
                      onClick={() => startEdit(prayer)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePrayer(prayer.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        {prayers.filter((p) => !p.completed).length === 0 && prayers.length > 0 && (
          <Card className="p-6 text-center mt-6 bg-gradient-accent text-accent-foreground shadow-medium">
            <Check className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-xl font-bold">Tabriklaymiz!</h3>
            <p className="mt-2">Bugungi barcha namozlarni o'qidingiz!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
