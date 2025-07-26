-- Network server with connection handling
server ≜ λport: 〔
    socket ← bind(port) ⊕;
    ∀request∈acceptLoop(socket): (
        data ← ↽_socket request;
        response ← processRequest(data);
        ⇀_socket response
    ) ‖ handleNext()
    {- socket ⊖ happens automatically at end of 〔〕 -}
〕;