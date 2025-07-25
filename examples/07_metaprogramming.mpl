-- Metaprogramming with code quotation
generateFunction ≜ λname: ⌜
    λx: x × 2
⌝;

doubler ← ⌞generateFunction("doubler")⌟;
result ← doubler(21);