import { Router } from 'express';
import { CompaniesController } from './companies.controller.js';

const router = Router();

// Retrieve company profile linked to the logged-in user
router.get('/me', CompaniesController.getMyCompany);

// Provision and link a new company to the logged-in user
router.post('/', CompaniesController.createCompany);

export default router;
