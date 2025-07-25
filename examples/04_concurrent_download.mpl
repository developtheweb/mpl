-- Concurrent download with parallelism
downloadAll ≜ λurls: ∀url∈urls: (
    fetchData(url) ‖ processData(url)
) ⟹ mergeResults();