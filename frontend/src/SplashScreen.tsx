import { useEffect, useState } from "react";
import axios from "axios";
import "./SplashScreen.css";
import GembaLogo from "./assets/GembaMill.png";
import UserRegister from "./UserRegister";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const rows = 20;
  const cols = 20;
  const totalSquares = rows * cols;
  const logoUrl = GembaLogo;

  const [revealed, setRevealed] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [hideSplash, setHideSplash] = useState(false);

  const [nmMicro, setNmMicro] = useState<string | null>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);

  useEffect(() => {
    getMicro();
  }, []);

  // Busca pelo Micro
  async function getMicro() {
    try {
      // busca IP
      const { data: { ip } } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/system/my-ip`);
      // busca hostname
      const { data: { hostname } } = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/system/resolve-hostname`, { ip });

      setNmMicro(hostname);

      // verifica se existe cadastro
      const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/users-micro/by-micro`, {
        params: { nm_micro: hostname }
      });

      if (data) {
        // existe → segue para splash
        setUserExists(true);
        startSplash();
      } else {
        // não existe → abre cadastro
        setUserExists(false);
      }
    } catch (err) {
      console.error("Erro ao buscar micro ou verificar usuário:", err);
      setUserExists(false);
    }
  }

  //Inicia a Animacao de abertura
  function startSplash() {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setRevealed((prev) => {
          if (prev >= totalSquares) {
            clearInterval(interval);

            setTimeout(() => {
              setShowTitle(true);
            }, 300);

            setTimeout(() => {
              setHideSplash(true);
              onFinish();
            }, 2500);

            return prev;
          }
          return prev + 20;
        });
      }, 30);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }

  if (hideSplash) return null;

  if (userExists === false && nmMicro) {
    return (
      <UserRegister
        nm_micro={nmMicro}
        onRegistered={() => {
          setUserExists(true);
          startSplash();
        }}
      />
    );
  }

  if (userExists === null) {
    return <div>Carregando dados do sistema...</div>;
  }

  const cells = [];
  for (let i = 0; i < totalSquares; i++) {
    const x = (i % cols) * -10;
    const y = Math.floor(i / cols) * -10;
    const visible = i < revealed;
    cells.push(
      <div
        key={i}
        className={`square ${visible ? "visible" : ""}`}
        style={{
          backgroundImage: `url(${logoUrl})`,
          backgroundPosition: `${x}px ${y}px`,
          backgroundSize: `${cols * 10}px ${rows * 10}px`,
        }}
      ></div>
    );
  }

  return (
    <div className="splash-container">
      <div className={`logo-grid ${showTitle ? "animate" : ""}`}>
        {cells}
      </div>
      {showTitle && (
        <div className="logo-title">Gemba System Manager</div>
      )}
    </div>
  );
}
