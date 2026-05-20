import { Router } from 'express';
import { CRMController } from './crm.controller.js';

const router = Router();

// Base path: /api/crm/customers

// List and search customers
router.get('/', CRMController.listCustomers);

// Create new customer
router.post('/', CRMController.createCustomer);

// Get specific customer detail with interaction logs
router.get('/:id', CRMController.getCustomerById);

// Update customer details
router.put('/:id', CRMController.updateCustomer);

// Delete customer
router.delete('/:id', CRMController.deleteCustomer);

// Log an interaction history for a customer
router.post('/:id/interactions', CRMController.logInteraction);

export default router;
