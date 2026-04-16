import { productModel } from '../models/productModel.js';
import { createHttpError } from '../utils/httpError.js';

export const getProducts = async (req, res, next) => {
  try {
    const products = await productModel.getAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productModel.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const existing = await productModel.getById(req.params.id);
    if (!existing) {
      throw createHttpError(404, 'Product not found.');
    }
    const product = await productModel.update(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const existing = await productModel.getById(req.params.id);
    if (!existing) {
      throw createHttpError(404, 'Product not found.');
    }
    await productModel.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
