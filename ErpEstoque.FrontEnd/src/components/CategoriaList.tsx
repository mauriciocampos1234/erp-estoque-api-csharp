import { useState, useEffect } from "react";
import { type Categoria } from "../types";

// Avisamos ao TypeScript que a tabela agora recebe um "Poder" (Propriedade) do Pai
interface Props {
    onEditar: (categoria: Categoria) => void;
}

export function CategoriaList({ onEditar }: Props) {
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    useEffect(() => {
        fetch("https://localhost:7291/api/Categorias")
            .then(resposta => resposta.json())
            .then(dados => setCategorias(dados))
            .catch(erro => console.error(erro));
    }, []);

    async function handleExcluir(id: number, nome: string) {
        const confirmacao = window.confirm(`Tem certeza que deseja excluir "${nome}"?`);
        if (!confirmacao) return;

        try {
            const resposta = await fetch(`https://localhost:7291/api/Categorias/${id}`, { method: "DELETE" });
            if (resposta.ok) {
                setCategorias(categorias.filter(cat => cat.id !== id));
            }
        } catch (erro) {
            console.error(erro);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Categorias Cadastradas</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categorias.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.descricao}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">

                                    {/* === O BOTÃO MÁGICO AQUI === */}
                                    <button
                                        onClick={() => onEditar(cat)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold"
                                    >
                                        Editar
                                    </button>

                                    <button onClick={() => handleExcluir(cat.id, cat.nome)} className="text-red-600 hover:text-red-900 font-semibold">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}