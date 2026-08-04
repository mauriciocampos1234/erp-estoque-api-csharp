using ErpEstoque.Api.Data;
using ErpEstoque.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErpEstoque.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        // 1. BUSCAR TODAS (GET)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            return await _context.Categorias.ToListAsync();
        }

        // 2. BUSCAR UMA ESPECÍFICA PELO ID (GET)
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound("Categoria não encontrada."); // Retorna Erro 404
            }

            return categoria;
        }

        // 3. CRIAR (POST)
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoria);
        }

        // 4. ATUALIZAR (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            // Validação: O ID passado na URL é o mesmo do objeto JSON?
            if (id != categoria.Id)
            {
                return BadRequest("O ID da URL não bate com o ID do corpo da requisição.");
            }

            // Avisa o Entity Framework que este objeto foi modificado
            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
                {
                    return NotFound("Categoria não encontrada para atualizar.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Retorna 204 (Sucesso, mas sem conteúdo visual para devolver)
        }

        // 5. DELETAR (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            // Lógica: Primeiro achamos a categoria. Depois deletamos.
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound("Categoria não encontrada para deletar.");
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Método auxiliar privado (Lógica interna da classe)
        private bool CategoriaExists(int id)
        {
            return _context.Categorias.Any(e => e.Id == id);
        }
    }
}