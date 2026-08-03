using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErpEstoque.Api.Models
{
    public class Produto
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do produto é obrigatório.")]
        [MaxLength(150)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Preco { get; set; }

        public int QuantidadeEstoque { get; set; } = 0;

        // Chave Estrangeira (O Id da categoria no banco de dados)
        [Required]
        public int CategoriaId { get; set; }

        // Propriedade de Navegação (Para o C# entender o relacionamento na memória)
        [ForeignKey("CategoriaId")]
        public virtual Categoria? Categoria { get; set; }
    }
}