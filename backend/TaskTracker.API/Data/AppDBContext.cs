using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Channels;
using static System.Reflection.Metadata.BlobBuilder;

namespace TaskTracker.Models
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {
        }

        public DbSet<User> User { get; set; }

        public DbSet<TaskItem> TaskItem { get; set; }

    }
}
