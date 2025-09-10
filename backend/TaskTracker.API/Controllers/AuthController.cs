using Microsoft.AspNetCore.Mvc;
using TaskTracker.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;

namespace TaskTracker.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_context.User.Any(u => u.Username == model.Username))
                return BadRequest("Пользователь с таким логином уже существует");

            if (model.Password != model.ConfirmPassword)
                return BadRequest("Пароли не совпадают");

            model.PasswordHash = HashPassword(model.Password);

            var jwtToken = GenerateJwtToken(model);
            var refreshToken = GenerateRefreshToken();

            model.RefreshToken = refreshToken;
            model.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7).ToString(); // 7 дней жизни refresh-токена

            _context.User.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                token = jwtToken,
                refreshToken = refreshToken
            });
        }

        [HttpPost("auth")]
        public IActionResult Auth([FromBody] User model)
        {
            // Находим пользователя по логину
            var user = _context.User.FirstOrDefault(u => u.Username == model.Username);
            if (user == null)
                return BadRequest("Пользователь с таким логином не существует");

            // Проверяем пароль
            if (!VerifyPassword(model.Password, user.PasswordHash))
                return BadRequest("Неверный пароль");

            // Генерируем JWT и refresh-токен
            var jwtToken = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7).ToString();

            _context.User.Update(user);
            _context.SaveChanges();

            return Ok(new
            {
                token = jwtToken,
                refreshToken = refreshToken
            });
        }


        private string HashPassword(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(16);

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 32));

            return $"{Convert.ToBase64String(salt)}:{hashed}";
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("UserID", user.UserID.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }

        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            var parts = storedHash.Split(':');
            if (parts.Length != 2)
                return false;

            var salt = Convert.FromBase64String(parts[0]);
            var hash = parts[1];

            string enteredHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: enteredPassword,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 32));

            return hash == enteredHash;
        }

    }
}
