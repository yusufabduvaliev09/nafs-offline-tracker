import { useState, useEffect } from "react";
import { Dumbbell, Plus, Trash2, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Exercise {
  id: string;
  name: string;
}

interface WorkoutSet {
  reps: number;
  weight: number;
}

interface Workout {
  id: string;
  exerciseId: string;
  date: string;
  sets: WorkoutSet[];
}

export default function Sport() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([{ reps: 0, weight: 0 }]);

  useEffect(() => {
    const savedExercises = localStorage.getItem("nafs-exercises");
    const savedWorkouts = localStorage.getItem("nafs-workouts");
    if (savedExercises) setExercises(JSON.parse(savedExercises));
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
  }, []);

  useEffect(() => {
    localStorage.setItem("nafs-exercises", JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem("nafs-workouts", JSON.stringify(workouts));
  }, [workouts]);

  const addExercise = () => {
    if (!newExerciseName.trim()) {
      toast.error("Iltimos, mashq nomini kiriting");
      return;
    }

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName,
    };

    setExercises([...exercises, newExercise]);
    setNewExerciseName("");
    toast.success("Mashq qo'shildi");
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
    setWorkouts(workouts.filter((w) => w.exerciseId !== id));
    toast.success("Mashq o'chirildi");
  };

  const addSet = () => {
    setCurrentSets([...currentSets, { reps: 0, weight: 0 }]);
  };

  const updateSet = (index: number, field: "reps" | "weight", value: number) => {
    const newSets = [...currentSets];
    newSets[index][field] = value;
    setCurrentSets(newSets);
  };

  const removeSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const saveWorkout = () => {
    if (!selectedExercise) {
      toast.error("Iltimos, mashqni tanlang");
      return;
    }

    const workout: Workout = {
      id: Date.now().toString(),
      exerciseId: selectedExercise,
      date: new Date().toISOString(),
      sets: currentSets.filter((set) => set.reps > 0 || set.weight > 0),
    };

    if (workout.sets.length === 0) {
      toast.error("Iltimos, kamida bitta podxod kiriting");
      return;
    }

    setWorkouts([workout, ...workouts]);
    setCurrentSets([{ reps: 0, weight: 0 }]);
    toast.success("Mashg'ulot saqlandi!");
  };

  const getExerciseWorkouts = (exerciseId: string) => {
    return workouts
      .filter((w) => w.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 mb-6 shadow-strong">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Sport</h1>
              <p className="text-primary-foreground/90">Mashqlar va tarix</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="workout">Mashg'ulot</TabsTrigger>
            <TabsTrigger value="exercises">Mashqlar</TabsTrigger>
            <TabsTrigger value="history">Tarix</TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-4">
            <Card className="p-4 shadow-medium">
              <h3 className="font-semibold mb-3">Mashqni tanlang</h3>
              <div className="grid grid-cols-2 gap-2">
                {exercises.map((exercise) => (
                  <Button
                    key={exercise.id}
                    variant={selectedExercise === exercise.id ? "default" : "outline"}
                    onClick={() => setSelectedExercise(exercise.id)}
                    className={
                      selectedExercise === exercise.id ? "bg-gradient-primary" : ""
                    }
                  >
                    {exercise.name}
                  </Button>
                ))}
              </div>
            </Card>

            {selectedExercise && (
              <Card className="p-4 shadow-medium">
                <h3 className="font-semibold mb-3">Podxodlar</h3>
                {currentSets.map((set, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      type="number"
                      placeholder="Takrorlar"
                      value={set.reps || ""}
                      onChange={(e) => updateSet(index, "reps", Number(e.target.value))}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Og'irlik (kg)"
                      value={set.weight || ""}
                      onChange={(e) => updateSet(index, "weight", Number(e.target.value))}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSet(index)}
                      disabled={currentSets.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <Button onClick={addSet} variant="outline" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Podxod qo'shish
                  </Button>
                  <Button onClick={saveWorkout} className="flex-1 bg-gradient-primary">
                    Saqlash
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4">
            <Card className="p-4 shadow-medium">
              <div className="flex gap-2 mb-4">
                <Input
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  placeholder="Yangi mashq nomi"
                  onKeyDown={(e) => e.key === "Enter" && addExercise()}
                />
                <Button onClick={addExercise} className="bg-gradient-primary">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {exercises.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Hali mashqlar yo'q. Birinchi mashqni qo'shing!
                </p>
              ) : (
                <div className="space-y-2">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <span className="font-medium">{exercise.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {getExerciseWorkouts(exercise.id).length} mashg'ulot
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteExercise(exercise.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {exercises.map((exercise) => {
              const exerciseWorkouts = getExerciseWorkouts(exercise.id);
              if (exerciseWorkouts.length === 0) return null;

              return (
                <Card key={exercise.id} className="p-4 shadow-soft">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {exercise.name}
                  </h3>
                  <div className="space-y-2">
                    {exerciseWorkouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="bg-secondary/50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(workout.date)}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          {workout.sets.map((set, index) => (
                            <div key={index} className="bg-card p-2 rounded text-center">
                              <div className="font-semibold">{set.reps} ta</div>
                              <div className="text-muted-foreground">{set.weight} kg</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}

            {workouts.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Hali tarix yo'q. Birinchi mashg'ulotingizni yarating!
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
