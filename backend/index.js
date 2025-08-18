const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 15000;

const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/todos';

app.use(cors());
app.use(express.json());

// health check
app.get('/', (_req, res) => res.json({ ok: true }));

const Task = mongoose.model('Task', new mongoose.Schema(
  { text: { type: String, required: true, trim: true }, completed: { type: Boolean, default: false } },
  { timestamps: true }
));

// CRUD
app.get('/tasks', async (_req, res, next) => { try { res.json(await Task.find().sort({ createdAt: -1 })); } catch (e) { next(e); } });
app.post('/tasks', async (req, res, next) => { try { res.status(201).json(await Task.create(req.body)); } catch (e) { next(e); } });
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const del = await Task.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Task not found' });
    res.sendStatus(204);
  } catch (e) { next(e); }
});

// error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error', detail: err.message });
});

// connect & start (with retry)
const connectWithRetry = () => {
  console.log('Trying to connect to MongoDB...');
  mongoose.connect(mongoURL)
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
    })
    .catch(err => {
      console.error('MongoDB connection error. Retrying in 5s...', err.message);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();
