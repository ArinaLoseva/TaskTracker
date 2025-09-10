using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Models
{
    public class User
    {
        [Key]
        public int? UserID { get; set; }

        [Required(ErrorMessage = "Поле обязательно для заполнения")]
        public string Username { get; set; }

        [NotMapped]
        [Required(ErrorMessage = "Пароль обязателен для заполнения")]
        [RegularExpression(@"^[A-Za-z\d]{8,}$",
            ErrorMessage = "Пароль должен содержать минимум 8 символов, включая только латинские буквы и цифры.")]
        public string Password { get; set; }

        public string? PasswordHash { get; set; }

        [NotMapped]
        //[Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string? ConfirmPassword { get; set; }

        public string? RefreshToken { get; set; }

        public string? RefreshTokenExpiryTime { get; set; }
    }
}