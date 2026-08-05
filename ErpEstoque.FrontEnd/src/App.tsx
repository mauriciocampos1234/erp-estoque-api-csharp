import { useState } from "react";
import { CategoriaForm } from "./components/CategoriaForm";
import { CategoriaList } from "./components/CategoriaList";
import { ProdutoForm } from "./components/ProdutoForm";
import { ProdutoList } from "./components/ProdutoList";
import { type Categoria, type Produto } from "./types";
import { Dashboard } from "./components/Dashboard"; // Importamos o Dashboard!

export default function App() {
  const [telaAtiva, setTelaAtiva] = useState("dashboard");

  // NOSSAS PONTES DE EDIÇÃO
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">📦 ERP Enxovais</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Novo Botão de Início (Dashboard) */}
              <button
                onClick={() => setTelaAtiva("dashboard")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${telaAtiva === "dashboard" ? "bg-blue-900 text-white" : "text-blue-100 hover:bg-blue-600"}`}
              >
                Início
              </button>
              {/* Botão de Categorias */}
              <button
                onClick={() => setTelaAtiva("categorias")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${telaAtiva === "categorias" ? "bg-blue-900 text-white" : "text-blue-100 hover:bg-blue-600"}`}
              >
                Categorias
              </button>
              {/* Botão de Produtos */}
              <button
                onClick={() => setTelaAtiva("produtos")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${telaAtiva === "produtos" ? "bg-blue-900 text-white" : "text-blue-100 hover:bg-blue-600"}`}
              >
                Produtos
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">

        {/* === TELA DE DASHBOARD === */}
        {telaAtiva === "dashboard" && <Dashboard />}

        {/* === TELA DE CATEGORIAS === */}
        {telaAtiva === "categorias" && (
          <div>
            <header className="mb-8 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Categorias</h2>
            </header>
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CategoriaForm
                  key={categoriaEditando ? categoriaEditando.id : 'nova'}
                  categoriaEditando={categoriaEditando}
                  limparEdicao={() => setCategoriaEditando(null)}
                />
              </div>
              <div className="lg:col-span-2">
                <CategoriaList onEditar={(cat) => setCategoriaEditando(cat)} />
              </div>
            </main>
          </div>
        )}

        {/* === TELA DE PRODUTOS === */}
        {telaAtiva === "produtos" && (
          <div>
            <header className="mb-8 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Produtos</h2>
            </header>
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProdutoForm
                  key={produtoEditando ? produtoEditando.id : 'novo'}
                  produtoEditando={produtoEditando}
                  limparEdicao={() => setProdutoEditando(null)}
                />
              </div>
              <div className="lg:col-span-2">
                <ProdutoList onEditar={(prod) => setProdutoEditando(prod)} />
              </div>
            </main>
          </div>
        )}

      </div>
    </div>
  );
}