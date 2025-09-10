using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Models
{
    public class TaskItem
    {
        [Key]
        public int? TaskID { get; set; }

        public int? UserID { get; set; }

        [Required(ErrorMessage = "Заголовок обязателен")]
        public string TaskTitle { get; set; }

        public string MainInfo { get; set; }

        public string Theme { get; set; }

        public string Status { get; set; }

        public string DateOfCreation { get; set; }

        public string DateOfCompletion { get; set; }

    }
}
