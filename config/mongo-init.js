db.createUser(
        {
            user: 'admin',
            pwd: 'artwork123',
            roles: [
                {
                    role: 'readWrite',
                    db: 'artwork'
                }
            ]
        }
);