import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./@Menu/AppLayout";
import TaskList from "./Tasks/TaskList";
import Home from "./Home/Home";
import SplashScreen from "./SplashScreen";
import { useState } from "react";
import Assistent from "./Assistent/assistent";

function App() {
  const [splashFinished, setSplashFinished] = useState(false);

  if (!splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Tasks" element={<TaskList />} />
          <Route path="/assistente" element={<Assistent />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
