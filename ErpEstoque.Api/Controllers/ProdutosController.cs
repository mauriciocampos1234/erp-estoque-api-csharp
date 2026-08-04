using ErpEstoque.Api.Data;
using ErpEstoque.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpEstoque.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutosController(AppDbContext context)
        {
            _context = context;
        }

        // Porta para BUSCAR todos os produtos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            // O .Include é a mágica que traz os dados da categoria junto com o produto!
            return await _context.Produtos
                                 .Include(p => p.Categoria)
                                 .ToListAsync();
        }

        // Porta para CRIAR um novo produto
        [HttpPost]
        public async Task<ActionResult<Produto>> PostProduto(Produto produto)
        {
            // Validação de Lógica: A categoria enviada existe no banco?
            var categoriaExiste = await _context.Categorias.AnyAsync(c => c.Id == produto.CategoriaId);

            if (!categoriaExiste)
            {
                // Se não existir, barramos a entrada e avisamos o Front-End
                return BadRequest("Erro: A categoria informada não existe no sistema.");
            }

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProdutos), new { id = produto.Id }, produto);
        }
    }
}