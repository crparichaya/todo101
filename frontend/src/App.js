import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  // โหลด tasks ทั้งหมด
  const loadTasks = async () => {
    const res = await fetch("http://localhost:15000/tasks");
    const data = await res.json();
    setTasks(data);
  };

  // เมื่อ component mount ให้โหลด tasks
  useEffect(() => {
    loadTasks();
  }, []);

  // เพิ่ม task
  const addTask = async () => {
    await fetch("http://localhost:15000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, completed: false }),
    });
    setText("");
    loadTasks();
  };

  // toggle สถานะ task
  const toggleTask = async (task) => {
    await fetch(`http://localhost:15000/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });
    loadTasks();
  };

  // ลบ task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:15000/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>To-Do App</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a new task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task)}
            />
            {task.text}
            <button onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
