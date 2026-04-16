import { customerModel } from '../models/customerModel.js';
import { createHttpError } from '../utils/httpError.js';

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await customerModel.getAll();
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await customerModel.getDetails(req.params.id);
    if (!customer) {
      throw createHttpError(404, 'Customer not found.');
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerModel.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const existing = await customerModel.getById(req.params.id);
    if (!existing) {
      throw createHttpError(404, 'Customer not found.');
    }
    const customer = await customerModel.update(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const existing = await customerModel.getById(req.params.id);
    if (!existing) {
      throw createHttpError(404, 'Customer not found.');
    }
    await customerModel.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
