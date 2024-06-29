const {Router} = require('express');
const {socialMediaActiveRoute} = require('./socialMediaActiveRoutes')
const {getAllSocialMediaHandler} = require('../../handlers/SocialMedia/AllSocialMedia/getAllSocialMediaHandler');
const {addSocialMediaHandler} = require('../../handlers/SocialMedia/AllSocialMedia/addSocialMediaHander');

const socialMediaRoute = Router();

socialMediaRoute.get('/', getAllSocialMediaHandler);
socialMediaRoute.post('/', addSocialMediaHandler);
socialMediaRoute.use('/active', socialMediaActiveRoute);

module.exports = {socialMediaRoute};