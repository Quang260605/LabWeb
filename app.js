// ===== DATA =====
let todos = JSON.parse(localStorage.getItem('todos') || 'null') || [
  { id: 1, name: 'Đi chợ',       done: true  },
  { id: 2, name: 'Chơi thể thao', done: false },
  { id: 3, name: 'Chơi game',    done: false  },
  { id: 4, name: 'Học bài',      done: true  },
];

let nextId = Math.max(...todos.map(t => t.id), 0) + 1;
let pendingDeleteId = null;

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// ===== NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if (pageId === 'page-list') renderList();
  if (pageId === 'page-add')  initAddForm();
}

// ===== RENDER LIST =====
function renderList() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const filter = document.getElementById('filter-status').value;

  let filtered = todos.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search);
    const matchFilter =
      filter === 'all' ||
      (filter === 'done' && t.done) ||
      (filter === 'todo' && !t.done);
    return matchSearch && matchFilter;
  });

  const tbody    = document.getElementById('todo-tbody');
  const emptyMsg = document.getElementById('empty-msg');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyMsg.classList.remove('hidden');
    return;
  }

  emptyMsg.classList.add('hidden');
  tbody.innerHTML = filtered.map(t => `
    <tr>
      <td>${t.id}</td>
      <td>${escapeHtml(t.name)}</td>
      <td>
        ${t.done
          ? '<span class="badge-done">✔ Đã hoàn thành</span>'
          : '<span class="badge-todo">✘ Chưa hoàn thành</span>'}
      </td>
      <td class="action-cell">
        <button class="link-btn" onclick="goEdit(${t.id})">Sửa</button>
        <span class="sep">|</span>
        <button class="link-btn" onclick="goDetail(${t.id})">Chi tiết</button>
        <span class="sep">|</span>
        <button class="link-btn" style="color:#dc2626" onclick="confirmDelete(${t.id})">Xoá</button>
      </td>
    </tr>
  `).join('');
}

// ===== ADD =====
function initAddForm() {
  document.getElementById('add-id').value   = nextId;
  document.getElementById('add-name').value = '';
  document.getElementById('add-done').checked = false;
}

function addTodo() {
  const name = document.getElementById('add-name').value.trim();
  if (!name) { showToast('Vui lòng nhập tên công việc!'); return; }
  const done = document.getElementById('add-done').checked;
  todos.push({ id: nextId, name, done });
  nextId++;
  save();
  showToast('Đã thêm công việc!');
  showPage('page-list');
}

// ===== EDIT =====
function goEdit(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  document.getElementById('edit-id').value     = todo.id;
  document.getElementById('edit-name').value   = todo.name;
  document.getElementById('edit-done').checked = todo.done;
  showPage('page-edit');
}

function saveTodo() {
  const id   = parseInt(document.getElementById('edit-id').value);
  const name = document.getElementById('edit-name').value.trim();
  if (!name) { showToast('Vui lòng nhập tên công việc!'); return; }
  const done = document.getElementById('edit-done').checked;
  const idx  = todos.findIndex(t => t.id === id);
  if (idx !== -1) {
    todos[idx] = { id, name, done };
    save();
    showToast('Đã lưu thay đổi!');
    showPage('page-list');
  }
}

// ===== DETAIL =====
function goDetail(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  document.getElementById('detail-id').textContent   = todo.id;
  document.getElementById('detail-name').textContent = todo.name;
  document.getElementById('detail-done').innerHTML   = todo.done
    ? '<span class="badge-done">✔ Đã hoàn thành</span>'
    : '<span class="badge-todo">✘ Chưa hoàn thành</span>';
  document.getElementById('detail-edit-btn').onclick = () => goEdit(todo.id);
  showPage('page-detail');
}

// ===== DELETE =====
function confirmDelete(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  pendingDeleteId = id;
  document.getElementById('modal-task-name').textContent = `"${todo.name}"`;
  document.getElementById('delete-modal').classList.remove('hidden');
  document.getElementById('confirm-delete-btn').onclick = deleteTodo;
}

function deleteTodo() {
  todos = todos.filter(t => t.id !== pendingDeleteId);
  save();
  closeModal();
  renderList();
  showToast('Đã xoá công việc!');
}

function closeModal() {
  document.getElementById('delete-modal').classList.add('hidden');
  pendingDeleteId = null;
}

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

// ===== UTILS =====
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Đóng modal khi click ngoài
document.getElementById('delete-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Enter để submit
document.getElementById('add-name').addEventListener('keydown',  e => { if (e.key === 'Enter') addTodo(); });
document.getElementById('edit-name').addEventListener('keydown', e => { if (e.key === 'Enter') saveTodo(); });

// ===== INIT =====
renderList();
