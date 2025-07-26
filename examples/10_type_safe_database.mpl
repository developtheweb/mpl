-- Type-safe database with refinement types
User ≜ {name: String, age: ℕ | age>0, email: String};
query ≜ λtable∈Database: ∀row∈table: validateUser(row) ↴ {
    ↯"Invalid user" ⟹ ⊥
};