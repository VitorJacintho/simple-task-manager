import { useState } from "react";
import axios from "axios";
import { User, Type, LoaderCircle } from "lucide-react";

export default function UserRegister({
  nm_micro,
  onRegistered,
}: {
  nm_micro: string;
  onRegistered: () => void;
}) {
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [loading, setLoading] = useState(false);

  //Salva o Usuario com seu respectivo micro
  async function handleSave() {
    try {
      setLoading(true);
      const nm_user = `${nome.trim()} - ${sigla.trim()}`;
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/users-micro`, {
        nm_micro: nm_micro.toUpperCase(),
        nm_user,
      });
      onRegistered();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar usuário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" /> Cadastro de Usuário
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Computador detectado:
          <span className="ml-2 font-semibold text-gray-800">{nm_micro?.toUpperCase()}</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" /> Nome
              </span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value.toUpperCase())
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 uppercase"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-500" /> Sigla
              </span>
            </label>
            <input
              type="text"
              value={sigla}
              onChange={(e) =>
                setSigla(e.target.value.toUpperCase())
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 uppercase"
              placeholder="Ex.: ADM, SUP, DEV"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || !nome || !sigla}
          className={`mt-6 w-full flex justify-center items-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition-colors
          ${
            loading || !nome || !sigla
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading && (
            <LoaderCircle className="animate-spin w-5 h-5" />
          )}
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
