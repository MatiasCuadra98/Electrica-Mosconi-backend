const {Router} = require('express');
// const {getBusinessByIdHandler} = require('../handlers/business/getBusinessByIdHandler');
// const {updateBusinessHandler} = require('../handlers/business/updateBusinessHandler');
const {createBusinessHandler} = require('../handlers/Business/createBusinessHandler');

const businessRoute = Router();

// //businessRoute.get('/', getAllBusinessHandler);
// businessRoute.get('/:id', getBusinessByIdHandler);
businessRoute.post('/', createBusinessHandler)
// businessRoute.put('/:id', updateBusinessHandler);
// //businessRoute.delete('/delete/:id', deleteBusinessHandler);

// module.exports= {businessRoute};