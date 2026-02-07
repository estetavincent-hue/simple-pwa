class TodoApp {
    constructor() {
       
        Object.assign(this, {
            input: document.getElementById("todoinput"),
            btn: document.getElementById("addbtn"),
            list: document.getElementById("todolist"),
            count: document.getElementById("todocount"),
            todos: JSON.parse(localStorage.getItem("todos") || "[]"),
            editId: null
        });
        this.init();
    }

    init() {
        
        if (this.btn) this.btn.onclick = () => this.add();
        
      
        this.input?.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.add();
            }
        });
        this.render();
    }

    add() {
        const text = this.input.value.trim(); 
        if (!text) return alert("Please enter a task.");
        
        this.todos.push({ id: Date.now(), text, completed: false });
        this.save();
        this.input.value = "";
    }

    del(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
    }

    toggle(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
        }
    }

    edit(id) {
        this.editId = id;
        this.render();
       
        setTimeout(() => document.getElementById(`edit-${id}`)?.focus(), 0);
    }

    save() {
       
        localStorage.setItem("todos", JSON.stringify(this.todos));
        this.render();
    }

    saveEdit(id) {
        const ta = document.getElementById(`edit-${id}`);
        const text = ta?.value.trim();
        if (!text) return;
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = text;
            this.editId = null;
            this.save();
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
                        <button class="btn btn-sm btn-success flex-grow-1" onclick="app.saveEdit(${t.id})">Save</button>
                        <button class="btn btn-sm btn-secondary flex-grow-1" onclick="app.editId=null,app.render()">Cancel</button>
                    </div>
                </li>`
                : `<li class="list-group-item d-flex gap-2 align-items-start">
                    <input type="checkbox" class="form-check-input mt-1" ${t.completed ? "checked" : ""} onchange="app.toggle(${t.id})">
                    <span class="flex-grow-1 ${t.completed ? "text-decoration-line-through text-muted" : ""}">${this.escape(t.text)}</span>
                    <button class="btn btn-sm btn-outline-info" onclick="app.edit(${t.id})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.del(${t.id})">×</button>
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
        navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
}