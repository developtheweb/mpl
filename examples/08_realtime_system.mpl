scheduler ≜ ⟳(
    tasks ← getPendingTasks()
    ∀task∈tasks: execute(task) ‖ monitor(task)
    , 100ms
)