using ErpEstoque.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurando o Banco de Dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// === CORS: PERMITINDO NOSSO REACT ACESSAR A API ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // A porta exata do Vite/React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// ===================================================

var app = builder.Configuration.GetConnectionString("DefaultConnection");

var appBuilder = app; // Ignore essa linha se não estiver no seu, é só para manter a estrutura. (Usaremos a variável 'app' gerada pelo WebApplication).

var buildedApp = builder.Build();

if (buildedApp.Environment.IsDevelopment())
{
    buildedApp.UseSwagger();
    buildedApp.UseSwaggerUI();
}

buildedApp.UseHttpsRedirection();

// === CORS: ATIVANDO A REGRA ANTES DA AUTORIZAÇÃO ===
buildedApp.UseCors("PermitirReact");
// ===================================================

buildedApp.UseAuthorization();
buildedApp.MapControllers();
buildedApp.Run();