using Microsoft.EntityFrameworkCore;
using TaskTracker.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDBContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===== Сервисы =====
builder.Services.AddControllers(); // Контроллеры API
builder.Services.AddEndpointsApiExplorer(); // Для Swagger
builder.Services.AddSwaggerGen(); // Swagger UI

// OpenAPI (если используешь)
builder.Services.AddOpenApi();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) // ключ из appsettings.json
    };
});

var app = builder.Build();

//app.UseHttpsRedirection();

// Подключаем аутентификацию и авторизацию
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ===== Middleware =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

// ===== Маршрутизация =====
app.MapControllers();

app.Run();
