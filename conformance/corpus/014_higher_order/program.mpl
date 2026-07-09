twice ≜ λf: λx: f(f(x));
inc ≜ λn: n + 1;
✎ twice(inc)(40);
apply ≜ λf, v: f(v);
✎ apply(λn: n × 3, 5);
