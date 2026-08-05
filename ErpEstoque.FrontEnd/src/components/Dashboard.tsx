import { useState, useEffect } from "react";
import { type Produto } from "../types";

export function Dashboard() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        fetch("https://localhost:7291/api/Produtos")
            .then(resposta => resposta.json())
            .then(dados => {
                setProdutos(dados);
                setCarregando(false);
            })
            .catch(erro => console.error(erro));
    }, []);

    // =========================================================================
    // MATEMÁTICA DO NEGÓCIO (Calculado em tempo real com base nos produtos)
    // =========================================================================

    // 1. Total de Produtos Cadastrados
    const totalProdutos = produtos.length;

    // 2. Valor Total do Estoque (Multiplica o preço de cada item pela quantidade e soma tudo)
    const valorTotalEstoque = produtos.reduce((acumulador, produto) => {
        return acumulador + (produto.preco * produto.quantidadeEstoque);
    }, 0);

    // 3. Filtrar produtos com estoque baixo (menor que 10)
    const produtosAlerta = produtos.filter(produto => produto.quantidadeEstoque < 10);

    if (carregando) {
        return <div className="text-center p-8 text-gray-500">Carregando inteligência do negócio...</div>;
    }

    return (
        <div className="space-y-6">
            <header className="mb-8 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Visão Geral do Negócio</h2>
                <p className="text-gray-500 mt-2">Acompanhe a saúde do estoque das suas lojas de enxovais.</p>
            </header>

            {/* Grid de Cards (Indicadores de Performance - KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Quantidade de Produtos */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Variedade no Estoque</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{totalProdutos} itens</p>
                </div>

                {/* Card 2: Valor Financeiro Total */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Patrimônio em Estoque</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalEstoque)}
                    </p>
                </div>

                {/* Card 3: Alertas de Estoque */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-red-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Itens Acabando</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">{produtosAlerta.length} avisos</p>
                </div>

            </div>

            {/* Sessão de Alerta Detalhado (Só aparece se tiver algum produto acabando) */}
            {produtosAlerta.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-red-200">
                    <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                        ⚠️ Atenção: Produtos precisando de reposição!
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {produtosAlerta.map(prod => (
                            <div key={prod.id} className="flex justify-between items-center p-3 bg-red-50 rounded-md border border-red-100">
                                <span className="font-medium text-gray-800">{prod.nome}</span>
                                <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-sm font-bold">
                                    {prod.quantidadeEstoque} restantes
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}