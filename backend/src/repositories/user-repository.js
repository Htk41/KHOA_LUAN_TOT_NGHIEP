const CrudRepository = require('./crud-repository');
const { User } = require('../models');

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        return user;
    }
}

module.exports = UserRepository;