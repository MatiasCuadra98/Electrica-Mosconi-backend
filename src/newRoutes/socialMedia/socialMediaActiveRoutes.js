const {Router} = require('express');
// const {getAllSocialMediaActiveHandler} = require('../../handlers/socialMedia/socialMediaActive/getAllSocialMediaActiveHandler');
// const {getSocialMediaActiveByIdHandler} = require('../../handlers/socialMedia/socialMediaActive/getSocialMediaActiveByIdHandler');
// const {addSocialMediaActiveHandler} = require('../../handlers/socialMedia/socialMediaActive/addSocialMediaActiveHandler');
// const {updateSocialMediaActiveHandler} = require('../../handlers/socialMedia/socialMediaActive/updateSocialMediaActiveHandler');
// const {deleteSocialMediaActiveHandler} = require('../../handlers/socialMedia/socialMediaActive/deleteSocialMediaActiveHandler');

const socialMediaActiveRoute = Router();

// socialMediaActiveRoute.get('/', getAllSocialMediaActiveHandler);
// socialMediaActiveRoute.get('/:id', getSocialMediaActiveByIdHandler);
// socialMediaActiveRoute.post('/', addSocialMediaActiveHandler);
// socialMediaActiveRoute.put('/:id', updateSocialMediaActiveHandler);
// socialMediaActiveRoute.delete('/delete/:id', deleteSocialMediaActiveHandler);

module.exports = {socialMediaActiveRoute};