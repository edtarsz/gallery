import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/header.tsx'
import LandingPage from './pages/landing-page.tsx'
import Login from './pages/login.tsx'
import { supabase } from './supabase-client.ts'
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import Pictures from './pages/pictures.tsx'

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  };

  return (
    <BrowserRouter>
      <div className="w-screen h-screen flex flex-col items-center p-[2vw] overflow-x-hidden no-scrollbar">
        <Header session={session} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login mode="login" />} />
          <Route path="/signup" element={<Login mode="signup" />} />
          <Route path="/pictures" element={<Pictures session={session} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
