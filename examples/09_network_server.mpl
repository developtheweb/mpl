server ≜ λport: 〔
    socket ← bind(port) ⊕
    ∀request: (
        data ← ↽_socket request
        response ← processRequest(data)
        ⇀_socket response
    ) ‖ handleNext()
    socket ⊖
〕