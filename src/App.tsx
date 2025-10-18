import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import Maqsadlar from "./pages/Maqsadlar";
import Darslar from "./pages/Darslar";
import InglizTili from "./pages/InglizTili";
import Sport from "./pages/Sport";
import Namoz from "./pages/Namoz";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Maqsadlar />} />
          <Route path="/darslar" element={<Darslar />} />
          <Route path="/ingliz-tili" element={<InglizTili />} />
          <Route path="/sport" element={<Sport />} />
          <Route path="/namoz" element={<Namoz />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
