const databases = ['artwork', 'certificate', 'identity', 'order', 'payment'];
const credentials = {
    user: 'admin',
    password: 'artwork123'
};

for (let i = 0; i < databases.length; ++i) {
    db = db.getSiblingDB(databases[i]);
    db.createUser(
        {
            user: credentials.user,
            pwd: credentials.password,
            roles: [
                {
                    role: 'readWrite',
                    db: databases[i]
                }
            ]
        }
    );
}