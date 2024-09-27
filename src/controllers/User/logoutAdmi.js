const { User } = require('../../db');

const logoutAdmi = async (id) => {
    if(!id) throw new Error('Missing ID')
    const admi = await User.findByPk(id);
    if(!admi) {
        throw new Error (`User with Id ${id} not found`);
    } else {
        admi.login = false
        await admi.save();
        return(`Goddbye ${admi.name}!, see you later...`)
    }   
};

module.exports = {logoutAdmi};