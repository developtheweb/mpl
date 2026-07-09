x ← 0;
f ≜ λv: {x ← x + 1; v};
false ∧ f(true);
✎ x;
true ∨ f(true);
✎ x;
true ∧ f(true);
✎ x;
