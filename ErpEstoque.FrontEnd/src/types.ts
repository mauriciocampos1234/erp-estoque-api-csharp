export interface Categoria {
    id: number;
    nome: string;
    descricao: string;
}

// NOVO: Adicionando o Molde do Produto
export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidadeEstoque: number;
    categoriaId: number;
    categoria?: Categoria; // O "?" significa que a categoria pode ou não vir preenchida da API
}