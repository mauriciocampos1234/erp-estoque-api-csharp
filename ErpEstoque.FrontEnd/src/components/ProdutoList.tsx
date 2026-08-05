import { useState, useEffect } from "react";
import { type Produto } from "../types";

interface Props {
    onEditar: (produto: Produto) => void;
}

export function ProdutoList({ onEditar }: Props) {
    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        fetch("https://localhost:7291/api/Produtos")
            .then(resposta => resposta.json())
            .then(dados => setProdutos(dados))
            .catch(erro => console.error(erro));
    }, []);

    async function handleExcluir(id: number, nome: string) {
        const confirmacao = window.confirm(`Tem certeza que deseja excluir o produto "${nome}"?`);
        if (!confirmacao) return;

        try {
            const resposta = await fetch(`https://localhost:7291/api/Produtos/${id}`, { method: "DELETE" });
            if (resposta.ok) {
                setProdutos(produtos.filter(prod => prod.id !== id));
            }
        } catch (erro) {
            console.error(erro);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Estoque de Enxovais</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {produtos.map((prod) => (
                            <tr key={prod.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.categoria?.nome || "Sem Categoria"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.preco)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${prod.quantidadeEstoque < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {prod.quantidadeEstoque} un
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">

                                    {/* === O BOTÃO MÁGICO AQUI === */}
                                    <button
                                        onClick={() => onEditar(prod)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold"
                                    >
                                        Editar
                                    </button>

                                    <button onClick={() => handleExcluir(prod.id, prod.nome)} className="text-red-600 hover:text-red-900 font-semibold">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}