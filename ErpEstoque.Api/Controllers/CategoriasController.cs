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
        // Variável privada que vai guardar a nossa conexão com o banco
        private readonly AppDbContext _context;

        // Construtor
        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        // Porta para BUSCAR todas as categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            return await _context.Categorias.ToListAsync();
        }

        // Porta para CRIAR uma nova categoria
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategorias), new { id = categoria.Id }, categoria);
        }
    }
}