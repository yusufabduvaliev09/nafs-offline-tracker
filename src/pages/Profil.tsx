import { useState, useEffect } from "react";
import { User, Target, Calendar, BookOpen, Dumbbell, Moon, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Profil() {
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalWorkouts: 0,
    completedPrayers: 0,
    totalPrayers: 0,
    englishGoals: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const goals = JSON.parse(localStorage.getItem("nafs-goals") || "[]");
      const lessons = JSON.parse(localStorage.getItem("nafs-lessons") || "[]");
      const workouts = JSON.parse(localStorage.getItem("nafs-workouts") || "[]");
      const prayers = JSON.parse(localStorage.getItem("nafs-prayers") || "[]");
      const englishGoals = JSON.parse(localStorage.getItem("nafs-english-goals") || "[]");

      const countCompletedGoals = (goalList: any[]): number => {
        return goalList.reduce((count, goal) => {
          return (
            count +
            (goal.completed ? 1 : 0) +
            countCompletedGoals(goal.children || [])
          );
        }, 0);
      };

      const countTotalGoals = (goalList: any[]): number => {
        return goalList.reduce((count, goal) => {
          return count + 1 + countTotalGoals(goal.children || []);
        }, 0);
      };

      setStats({
        totalGoals: countTotalGoals(goals),
        completedGoals: countCompletedGoals(goals),
        totalLessons: lessons.length,
        completedLessons: lessons.filter((l: any) => l.completed).length,
        totalWorkouts: workouts.length,
        completedPrayers: prayers.filter((p: any) => p.completed).length,
        totalPrayers: prayers.length,
        englishGoals: englishGoals.length,
      });
    };

    calculateStats();
    const interval = setInterval(calculateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearAllData = () => {
    localStorage.removeItem("nafs-goals");
    localStorage.removeItem("nafs-lessons");
    localStorage.removeItem("nafs-workouts");
    localStorage.removeItem("nafs-exercises");
    localStorage.removeItem("nafs-prayers");
    localStorage.removeItem("nafs-english-goals");
    localStorage.removeItem("nafs-english-position");
    localStorage.removeItem("nafs-prayers-last-reset");

    toast.success("Barcha ma'lumotlar o'chirildi");
    setTimeout(() => window.location.reload(), 1000);
  };

  const goalsProgress =
    stats.totalGoals > 0 ? (stats.completedGoals / stats.totalGoals) * 100 : 0;
  const lessonsProgress =
    stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0;
  const prayersProgress =
    stats.totalPrayers > 0 ? (stats.completedPrayers / stats.totalPrayers) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 mb-6 shadow-strong">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Profil</h1>
              <p className="text-primary-foreground/90">Statistika va sozlamalar</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-6 shadow-medium">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Maqsadlar</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bajarilgan</span>
                <span className="font-semibold">
                  {stats.completedGoals} / {stats.totalGoals}
                </span>
              </div>
              <Progress value={goalsProgress} className="h-2" />
              <p className="text-right text-sm text-muted-foreground">
                {Math.round(goalsProgress)}%
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-medium">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Darslar</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bajarilgan</span>
                <span className="font-semibold">
                  {stats.completedLessons} / {stats.totalLessons}
                </span>
              </div>
              <Progress value={lessonsProgress} className="h-2" />
              <p className="text-right text-sm text-muted-foreground">
                {Math.round(lessonsProgress)}%
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-medium">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Ingliz tili</h2>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maqsadlar soni</span>
              <span className="text-2xl font-bold text-primary">{stats.englishGoals}</span>
            </div>
          </Card>

          <Card className="p-6 shadow-medium">
            <div className="flex items-center gap-3 mb-4">
              <Dumbbell className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Sport</h2>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jami mashg'ulotlar</span>
              <span className="text-2xl font-bold text-primary">{stats.totalWorkouts}</span>
            </div>
          </Card>

          <Card className="p-6 shadow-medium">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Namoz</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bugun o'qilgan</span>
                <span className="font-semibold">
                  {stats.completedPrayers} / {stats.totalPrayers}
                </span>
              </div>
              <Progress value={prayersProgress} className="h-2" />
              <p className="text-right text-sm text-muted-foreground">
                {Math.round(prayersProgress)}%
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-medium border-destructive/20">
            <h2 className="text-xl font-bold mb-4 text-destructive flex items-center gap-2">
              <Trash2 className="w-6 h-6" />
              Xavfli zona
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Bu amal barcha ma'lumotlarni butunlay o'chiradi. Bu harakatni qaytarib bo'lmaydi.
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Barcha ma'lumotlarni o'chirish
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu amal barcha maqsadlar, darslar, mashg'ulotlar va boshqa ma'lumotlarni
                    butunlay o'chiradi. Bu harakatni qaytarib bo'lmaydi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Ha, o'chirish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>
      </div>
    </div>
  );
}
