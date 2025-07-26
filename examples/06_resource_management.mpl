-- Resource management with RAII
databaseQuery ≜ λquery: 〔
    conn ← database ⊕;
    ⌈
        result ← execute(conn, query);
        ✎"Query executed";
        result
    ⌉_db_lock
    {- conn ⊖ happens automatically at end of 〔〕 -}
〕;