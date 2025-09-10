import 'D:/projects/task-tracker/frontend/src/styles/NotesPage.css';
import React, { useEffect, useState } from 'react';

interface TaskItem {
    taskID: number;
    userID: number;
    taskTitle: string;
    mainInfo: string;
    theme: string;
    status: string;
    dateOfCreation: string;
    dateOfCompletion?: string;
}

const NotesPage: React.FC = () => {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [title, setTitle] = useState('');
    const [mainInfo, setMainInfo] = useState('');
    const [status, setStatus] = useState('Necessary');
    const [theme, setTheme] = useState('Personal');
    const [completionDate, setCompletionDate] = useState('');

    const [filterStatus, setFilterStatus] = useState("*");
    const [filterTheme, setFilterTheme] = useState("*");
    const [filterCreationDate, setFilterCreationDate] = useState("");
    const [filterCompletionDate, setFilterCompletionDate] = useState("");

    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [editTask, setEditTask] = useState<Partial<TaskItem>>({});


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/tasks/get", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data);
                } else {
                    console.error("Ошибка загрузки задач");
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, []);

    // создание задачи
    const handleCreate = async () => {
        if (!title.trim()) {
            alert("Заголовок обязателен");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/tasks/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    taskTitle: title,
                    mainInfo: mainInfo,
                    theme: theme,
                    status: status,
                    dateOfCompletion: completionDate
                })
            });

            console.log("Response status:", res.status); // Добавьте для отладки

            if (res.ok) {
                const newTask = await res.json();
                console.log("Created task:", newTask); // Добавьте для отладки
                setTasks([...tasks, newTask]);
                setTitle("");
                setMainInfo("");
                setCompletionDate("");
            } else {
                const err = await res.text();
                console.error("Ошибка при создании:", err);
                alert("Ошибка при создании задачи: " + err);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Сетевая ошибка");
        }
    };

    const handleSave = async (taskId: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/tasks/update/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editTask)
            });

            if (res.ok) {
                const updated = await res.json();
                setTasks(tasks.map(t => (t.taskID === taskId ? updated : t)));
                setSelectedTaskId(null);
            } else {
                alert("Ошибка при обновлении");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (taskId: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/tasks/delete/${taskId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setTasks(tasks.filter(t => t.taskID !== taskId));
                setSelectedTaskId(null);
            } else {
                alert("Ошибка при удалении");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filterStatus === "*" || task.status === filterStatus;
        const matchesTheme = filterTheme === "*" || task.theme === filterTheme;

        const matchesCreationDate =
            !filterCreationDate ||
            task.dateOfCreation.slice(0, 10) === filterCreationDate;

        const matchesCompletionDate =
            !filterCompletionDate ||
            (task.dateOfCompletion && task.dateOfCompletion.slice(0, 10) === filterCompletionDate);

        return matchesStatus && matchesTheme && matchesCreationDate && matchesCompletionDate;
    });

    return (
        <div className="notes-page">
            {/* Левая колонка — фильтры */}
            <div className="filters">
                <h3>Filters</h3>
                <label>Status:</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="*">all</option>
                    <option value="VeryImportant">very important</option>
                    <option value="Important">important</option>
                    <option value="Necessary">necessary</option>
                    <option value="Desirable">desirable</option>
                    <option value="NotImportant">not important</option>
                </select>

                <label>Theme:</label>
                <select value={filterTheme} onChange={e => setFilterTheme(e.target.value)}>
                    <option value="*">all</option>
                    <option value="Home">home</option>
                    <option value="Work">work</option>
                    <option value="Family">family</option>
                    <option value="Pet">pet</option>
                    <option value="Hobby">hobby</option>
                    <option value="Personal">personal</option>
                </select>

                <label>Date of creation:</label>
                <input
                    type="date"
                    value={filterCreationDate}
                    onChange={e => setFilterCreationDate(e.target.value)}
                />

                <label>Completion date:</label>
                <input
                    type="date"
                    value={filterCompletionDate}
                    onChange={e => setFilterCompletionDate(e.target.value)}
                />


                <button>Search</button>
            </div>


            {/* Центр — список задач */}
            <div className="notes-list">
                <h3>Your tasks</h3>
                <div className="notes-container">
                    {filteredTasks.map(task => (
                        <div
                            className="note-card"
                            key={task.taskID}
                            onDoubleClick={() => {
                                setSelectedTaskId(task.taskID);
                                setEditTask(task); // скопировать данные в редактируемую форму
                            }}
                        >
                            {selectedTaskId === task.taskID ? (
                                // Режим редактирования
                                <div className="edit-note-card">
                                    <input
                                        type="text"
                                        value={editTask.taskTitle || ""}
                                        onChange={e => setEditTask({ ...editTask, taskTitle: e.target.value })}
                                    />
                                    <textarea
                                        value={editTask.mainInfo || ""}
                                        onChange={e => setEditTask({ ...editTask, mainInfo: e.target.value })}
                                    />

                                    <div className="edit-selects">
                                        <select
                                            value={editTask.status ?? task.status}
                                            onChange={e => setEditTask({ ...editTask, status: e.target.value })}
                                        >
                                            <option value="VeryImportant">very important</option>
                                            <option value="Important">important</option>
                                            <option value="Necessary">necessary</option>
                                            <option value="Desirable">desirable</option>
                                            <option value="NotImportant">not important</option>
                                        </select>

                                        <select
                                            value={editTask.theme ?? task.theme}
                                            onChange={e => setEditTask({ ...editTask, theme: e.target.value })}
                                        >
                                            <option value="Home">home</option>
                                            <option value="Work">work</option>
                                            <option value="Family">family</option>
                                            <option value="Pet">pet</option>
                                            <option value="Hobby">hobby</option>
                                            <option value="Personal">personal</option>
                                        </select>

                                        <input
                                            type="date"
                                            value={editTask.dateOfCompletion || ""}
                                            onChange={e => setEditTask({ ...editTask, dateOfCompletion: e.target.value })}
                                        />
                                    </div>

                                    <div className="actions-buttons">
                                        <button onClick={() => handleSave(task.taskID!)}>Save</button>
                                        <button onClick={() => handleDelete(task.taskID!)}>Delete</button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTaskId(null);
                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>
                                </div>
                            ) : (
                                // Режим просмотра
                                <>
                                    <div className="tags">
                                        <span className={`tag status-${task.status.toLowerCase()}`}>{task.status}</span>
                                        <span className={`tag theme-${task.theme.toLowerCase()}`}>{task.theme}</span>
                                    </div>
                                    <h4>{task.taskTitle}</h4>
                                    <p>{task.mainInfo}</p>
                                    <div className="dates">
                                        <small>Created: {task.dateOfCreation}</small>
                                        {task.dateOfCompletion && <small>To: {task.dateOfCompletion}</small>}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}


                </div>
            </div>

            {/* Правая колонка — создание задачи */}
            <div className="create-note">
                <h3>Task</h3>
                <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Main info"
                    value={mainInfo}
                    onChange={e => setMainInfo(e.target.value)}
                />
                <label>Completion date:</label>
                <input
                    type="date"
                    value={completionDate}
                    onChange={e => setCompletionDate(e.target.value)}
                />

                <label>Status:</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="VeryImportant">very important</option>
                    <option value="Important">important</option>
                    <option value="Necessary">necessary</option>
                    <option value="Desirable">desirable</option>
                    <option value="NotImportant">not important</option>
                </select>

                <label>Theme:</label>
                <select value={theme} onChange={e => setTheme(e.target.value)}>
                    <option value="Home">home</option>
                    <option value="Work">work</option>
                    <option value="Family">family</option>
                    <option value="Pet">pet</option>
                    <option value="Hobby">hobby</option>
                    <option value="Personal">personal</option>
                </select>

                <button onClick={handleCreate}>Create</button>
            </div>

        </div>
  );
};

export default NotesPage;