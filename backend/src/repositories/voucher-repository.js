const CrudRepository = require('./crud-repository');
const { Voucher } = require('../models');

class VoucherRepository extends CrudRepository {
    constructor() {
        super(Voucher);
    }

    async findByCode(code, transaction = null) {
        const voucher = await Voucher.findOne({
            where: { code: code }
        }, { transaction });
        return voucher;
    }
}

module.exports = VoucherRepository;