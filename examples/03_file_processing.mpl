-- File processing with error handling
processFile ≜ λpath: {
    data ← readFile(🖫path);
    result ← transform(data);
    writeFile(result, 🖫"output.txt");
    ⟨"success"|"failed"⟩
} ↴ {↯e ⇒ ⟨⊥|e⟩};