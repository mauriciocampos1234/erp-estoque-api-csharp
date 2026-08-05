import { useState, type FormEvent } from "react";
import { type Categoria } from "../types";

// O Formulário agora recebe a categoria que queremos editar e a função para cancelar a edição
interface Props {
    categoriaEditando: Categoria | null;
    limparEdicao: () => void;
}

export function CategoriaForm({ categoriaEditando, limparEdicao }: Props) {
    // 1. A MÁGICA: O estado já nasce com o valor da edição (se existir), ou vazio.
    const [nome, setNome] = useState(categoriaEditando ? categoriaEditando.nome : "");
    const [descricao, setDescricao] = useState(categoriaEditando ? categoriaEditando.descricao : "");
    const [carregando, setCarregando] = useState(false);

    // O useEffect problemático foi completamente deletado daqui!

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!nome) { alert("O nome é obrigatório!"); return; }

        setCarregando(true);

        try {
            // SE TEM ALGO EDITANDO = PUT (Atualizar)
            if (categoriaEditando) {
                const resposta = await fetch(`https://localhost:7291/api/Categorias/${categoriaEditando.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: categoriaEditando.id, nome, descricao })
                });

                if (resposta.ok) {
                    alert("Categoria atualizada!");
                    limparEdicao(); // Limpa o estado de edição
                    window.location.reload();
                }
            }
            // SE NÃO TEM NADA EDITANDO = POST (Criar Novo)
            else {
                const resposta = await fetch("https://localhost:7291/api/Categorias", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome, descricao })
                });

                if (resposta.ok) {
                    alert("Categoria criada!");
                    window.location.reload();
                }
            }
        } catch (erro) {
            console.error(erro);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Muda o título dinamicamente */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {categoriaEditando ? "Editar Categoria" : "Nova Categoria"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                        type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                        type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="flex space-x-2 mt-4">
                    <button type="submit" disabled={carregando} className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700">
                        {carregando ? "Salvando..." : (categoriaEditando ? "Atualizar" : "Salvar")}
                    </button>

                    {/* Botão de Cancelar (só aparece se estiver editando algo) */}
                    {categoriaEditando && (
                        <button
                            type="button"
                            onClick={limparEdicao}
                            className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}