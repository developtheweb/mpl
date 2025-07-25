processFile ≜ λpath: 🖫path ↴ {
    data ← readFile(path)
    result ← transform(data)
    writeFile(result, 🖫"output.txt")
    ⟨"success"|"failed"⟩
} ↴ {↯e ⇒ ⟨⊥|e⟩}