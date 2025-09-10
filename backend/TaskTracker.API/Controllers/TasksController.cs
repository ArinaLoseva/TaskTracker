using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskTracker.Models;

namespace TaskTracker.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    [Authorize] // только авторизованные пользователи
    public class TasksController : ControllerBase
    {
        private readonly AppDBContext _context;

        public TasksController(AppDBContext context)
        {
            _context = context;
        }

        // Получение задач пользователя
        [HttpGet("get")]
        public IActionResult GetTasks()
        {
            var userId = int.Parse(User.FindFirstValue("UserID"));
            var tasks = _context.TaskItem.Where(t => t.UserID == userId).ToList();
            return Ok(tasks);
        }


        // Создание задачи
        // Создание задачи
        [HttpPost("create")]
        public IActionResult Create([FromBody] TaskItemCreateDto taskDto) // Используйте DTO
        {
            var userId = int.Parse(User.FindFirstValue("UserID"));

            var task = new TaskItem
            {
                UserID = userId,
                TaskTitle = taskDto.TaskTitle,
                MainInfo = taskDto.MainInfo,
                Theme = taskDto.Theme,
                Status = taskDto.Status,
                DateOfCreation = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                DateOfCompletion = taskDto.DateOfCompletion
            };

            _context.TaskItem.Add(task);
            _context.SaveChanges();

            return Ok(task);
        }

        // Обновление задачи
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] TaskItemCreateDto taskDto)
        {
            var userId = int.Parse(User.FindFirstValue("UserID"));
            var task = _context.TaskItem.FirstOrDefault(t => t.TaskID == id && t.UserID == userId);

            if (task == null)
                return NotFound("Задача не найдена");

            task.TaskTitle = taskDto.TaskTitle;
            task.MainInfo = taskDto.MainInfo;
            task.Theme = taskDto.Theme;
            task.Status = taskDto.Status;
            task.DateOfCompletion = taskDto.DateOfCompletion;

            _context.SaveChanges();
            return Ok(task);
        }

        // Удаление задачи
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            var userId = int.Parse(User.FindFirstValue("UserID"));
            var task = _context.TaskItem.FirstOrDefault(t => t.TaskID == id && t.UserID == userId);

            if (task == null)
                return NotFound("Задача не найдена");

            _context.TaskItem.Remove(task);
            _context.SaveChanges();

            return Ok(new { message = "Задача удалена" });
        }

    }

    // Создайте DTO класс
    public class TaskItemCreateDto
    {
        public string TaskTitle { get; set; }
        public string MainInfo { get; set; }
        public string Theme { get; set; }
        public string Status { get; set; }
        public string DateOfCompletion { get; set; }
    }
}
