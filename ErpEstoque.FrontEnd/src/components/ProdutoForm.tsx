import { useState, useEffect, type FormEvent } from "react";
import { type Categoria, type Produto } from "../types";

interface Props {
    produtoEditando: Produto | null;
    limparEdicao: () => void;
}

export function ProdutoForm({ produtoEditando, limparEdicao }: Props) {
    // Os estados nascem preenchidos se tiver um produto editando
    const [nome, setNome] = useState(produtoEditando ? produtoEditando.nome : "");
    const [descricao, setDescricao] = useState(produtoEditando ? produtoEditando.descricao : "");
    const [preco, setPreco] = useState(produtoEditando ? produtoEditando.preco.toString() : "");
    const [estoque, setEstoque] = useState(produtoEditando ? produtoEditando.quantidadeEstoque.toString() : "");
    const [categoriaId, setCategoriaId] = useState(produtoEditando ? produtoEditando.categoriaId.toString() : "");

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregando, setCarregando] = useState(false);

    // Busca as categorias para o Dropdown (Select)
    useEffect(() => {
        fetch("https://localhost:7291/api/Categorias")
            .then(resposta => resposta.json())
            .then(dados => setCategorias(dados))
            .catch(erro => console.error(erro));
    }, []);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!nome || !preco || !estoque || !categoriaId) { alert("Preencha os campos obrigatórios!"); return; }

        setCarregando(true);

        // Monta o objeto que vai para a API
        const produtoPayload = {
            nome,
            descricao,
            preco: parseFloat(preco),
            quantidadeEstoque: parseInt(estoque),
            categoriaId: parseInt(categoriaId)
        };

        try {
            if (produtoEditando) {
                // PUT = Atualizar
                const resposta = await fetch(`https://localhost:7291/api/Produtos/${produtoEditando.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    // No PUT precisamos enviar o ID junto
                    body: JSON.stringify({ id: produtoEditando.id, ...produtoPayload })
                });

                if (resposta.ok) {
                    alert("Produto atualizado!");
                    limparEdicao();
                    window.location.reload();
                }
            } else {
                // POST = Criar Novo
                const resposta = await fetch("https://localhost:7291/api/Produtos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(produtoPayload)
                });

                if (resposta.ok) {
                    alert("Produto cadastrado!");
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {produtoEditando ? "Editar Produto" : "Novo Enxoval (Produto)"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                        <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Estoque *</label>
                        <input type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                    <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="">Selecione uma categoria...</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="flex space-x-2 mt-4">
                    <button type="submit" disabled={carregando} className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700">
                        {carregando ? "Salvando..." : (produtoEditando ? "Atualizar" : "Salvar Produto")}
                    </button>

                    {produtoEditando && (
                        <button type="button" onClick={limparEdicao} className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-300">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}