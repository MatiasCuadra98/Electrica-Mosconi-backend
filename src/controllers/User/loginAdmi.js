const { User } = require('../../db');

const loginAdmi = async (id) => {
    if(!id) throw new Error('Missing ID')
    const admi = await User.findByPk(id);
    if(!admi) {
        throw new Error (`User with Id ${id} not found`);
    } else {
        admi.login = true
        await admi.save();
        return(`Welcome ${admi.name}!`)
    }   
};

module.exports = {loginAdmi};