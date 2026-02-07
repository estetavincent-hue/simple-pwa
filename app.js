class TodoApp {
    constructor() {
        Object.assign(this, {
            input: document.getElementById("todoInput"),
            btn: document.getElementById("addBtn"),
            list: document.getElementById("todoList"),
            count: document.getElementById("todoCount"),
            todos: [],
            editId: null,
        });
        this.init();
        this.loadTodos();
    }

    async loadTodos() {
        try {
           
            this.todos = await api.getTodos();
            this.render();
        } catch (error) {
            console.error("Failed to load todos:", error);
        }
    }

    init() {
        this.btn.onclick = () => this.add();
        this.input.addEventListener("keypress", e => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.add();
            }
        });
    }

    async add() {
        const text = this.input.value.trim();
        if (!text) return;
        
        try {
            const newTodo = await api.addTodo(text);
            this.todos.unshift(newTodo);
            this.input.value = "";
            this.render();
        } catch (error) {
            alert("Failed to add todo");
        }
    }

    async del(id) {
        try {
            await api.deleteTodo(id);
            this.todos = this.todos.filter(t => t.id !== id);
            this.render();
        } catch (error) {
            alert("Failed to delete");
        }
    }

    async toggle(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        try {
            await api.toggleTodo(id, !todo.completed);
            todo.completed = !todo.completed;
            this.render();
        } catch (error) {
            alert("Update failed");
        }
    }

    edit(id) {
        this.editId = id;
        this.render();
        
        setTimeout(() => document.getElementById(`edit-${id}`)?.focus(), 0);
    }

    async saveEdit(id) {
        const ta = document.getElementById(`edit-${id}`);
        const text = ta?.value.trim();
        if (!text) return;
        
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            try {
                await api.editTodo(id, text);
                todo.text = text;
                this.editId = null;
                this.render();
            } catch (error) {
                alert("Save failed");
            }
        }
    }

    escape(s) {
        const d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
    }

    render() {
        this.list.innerHTML = this.todos.map(t => 
            this.editId === t.id 
                ? `<li class="list-group-item">
                    <textarea id="edit-${t.id}" class="form-control mb-2" rows="2">${this.escape(t.text)}</textarea>
                    <div class="btn-group w-100">
                        <button class="btn btn-sm btn-success" onclick="app.saveEdit(${t.id})">Save</button>
                        <button class="btn btn-sm btn-secondary" onclick="app.editId=null,app.render()">Cancel</button>
                    </div>
                </li>`
                : `<li class="list-group-item d-flex gap-2 align-items-start">
                    <input type="checkbox" class="form-check-input mt-1" ${t.completed ? "checked" : ""} onchange="app.toggle(${t.id})">
                    <span class="flex-grow-1 ${t.completed ? "text-decoration-line-through text-muted" : ""}">${this.escape(t.text)}</span>
                    <button class="btn btn-sm btn-outline-info" onclick="app.edit(${t.id})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.del(${t.id})">Delete</button>
                </li>`
        ).join("") || '<li class="list-group-item text-center text-muted">No tasks yet</li>';
        
        if (this.count) this.count.textContent = this.todos.length;
    }
}


let app;
document.addEventListener("DOMContentLoaded", () => {
    app = new TodoApp();
});


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js")
            .then(reg => console.log("SW registered"))
            .catch(err => console.log("SW registration failed", err));
    });
}