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

        // 1. BUSCAR TODOS (GET)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            return await _context.Produtos
                                 .Include(p => p.Categoria)
                                 .ToListAsync();
        }

        // 2. BUSCAR UM ESPECÍFICO (GET)
        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetProduto(int id)
        {
            // Note que aqui também usamos o Include para trazer a Categoria junto!
            var produto = await _context.Produtos
                                        .Include(p => p.Categoria)
                                        .FirstOrDefaultAsync(p => p.Id == id);

            if (produto == null)
            {
                return NotFound("Produto não encontrado.");
            }

            return produto;
        }

        // 3. CRIAR (POST)
        [HttpPost]
        public async Task<ActionResult<Produto>> PostProduto(Produto produto)
        {
            var categoriaExiste = await _context.Categorias.AnyAsync(c => c.Id == produto.CategoriaId);
            if (!categoriaExiste)
            {
                return BadRequest("Erro: A categoria informada não existe no sistema.");
            }

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, produto);
        }

        // 4. ATUALIZAR (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduto(int id, Produto produto)
        {
            if (id != produto.Id)
            {
                return BadRequest("O ID da URL não bate com o ID do corpo da requisição.");
            }

            // Validar se o usuário não tentou trocar para uma categoria que não existe
            var categoriaExiste = await _context.Categorias.AnyAsync(c => c.Id == produto.CategoriaId);
            if (!categoriaExiste)
            {
                return BadRequest("Erro: A nova categoria informada não existe no sistema.");
            }

            _context.Entry(produto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProdutoExists(id))
                {
                    return NotFound("Produto não encontrado para atualizar.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // 5. DELETAR (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null)
            {
                return NotFound("Produto não encontrado para deletar.");
            }

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProdutoExists(int id)
        {
            return _context.Produtos.Any(e => e.Id == id);
        }
    }
}