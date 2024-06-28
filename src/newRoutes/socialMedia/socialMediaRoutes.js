const {Router} = require('express');
const {socialMediaActiveRoute} = require('./socialMediaActiveRoutes')
// const {getAllSocialMediaHandler} = require('../../handlers/socialMedia/allSocialMedia/getAllSocialMediaHandler');
// const {addSocialMediaHandler} = require('../../handlers/socialMedia/allSocialMedia/addSocialMediaHandler');

const socialMediaRoute = Router();

// socialMediaRoute.get('/', getAllSocialMediaHandler);
// socialMediaRoute.post('/', addSocialMediaHandler);
socialMediaRoute.use('/active', socialMediaActiveRoute);

module.exports = {socialMediaRoute};