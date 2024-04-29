const { Business } = require("../../db");

const updatedBusiness = async (id, name, phone, email, apiKey, srcName) => {

        const [updatedCount, updatedRows] = await Business.update(
            { name: name, phone: phone, email: email, apiKey: apiKey, srcName:srcName },
            { where: { id } }
        );
        if (updatedCount === 0) {
            throw new Error('The id was not found or it is incorrect');
        }

    return { message: "updated information" };
};

module.exports = updatedBusiness;
