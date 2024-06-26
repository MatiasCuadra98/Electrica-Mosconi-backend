const {Router} = require('express');
const {getBusinessByIdHandler} = require('../handlers/Business/getBusinessByIdHandler');
const {updateBusinessHandler} = require('../handlers/Business/updateBusinessHandler');
const {createBusinessHandler} = require('../handlers/Business/createBusinessHandler');

const businessRoute = Router();

// //businessRoute.get('/', getAllBusinessHandler);
businessRoute.get('/:id', getBusinessByIdHandler);
businessRoute.post('/create', createBusinessHandler)
businessRoute.put('/update/:id', updateBusinessHandler);
// //businessRoute.delete('/delete/:id', deleteBusinessHandler);

module.exports= businessRoute;