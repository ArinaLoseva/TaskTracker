using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Models
{
    public class User
    {
        [Key]
        public int? UserID { get; set; }

        [Required(ErrorMessage = "���� ����������� ��� ����������")]
        public string Username { get; set; }

        [NotMapped]
        [Required(ErrorMessage = "������ ���������� ��� ����������")]
        [RegularExpression(@"^[A-Za-z\d]{8,}$",
            ErrorMessage = "������ ������ ��������� ������� 8 ��������, ������� ������ ��������� ����� � �����.")]
        public string Password { get; set; }

        public string? PasswordHash { get; set; }

        [NotMapped]
        //[Compare("Password", ErrorMessage = "������ �� ���������")]
        public string? ConfirmPassword { get; set; }

        public string? RefreshToken { get; set; }

        public string? RefreshTokenExpiryTime { get; set; }
    }
}