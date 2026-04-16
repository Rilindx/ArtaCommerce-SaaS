import { withTransaction } from '../config/db.js';
import { workerModel } from '../models/workerModel.js';
import { createHttpError } from '../utils/httpError.js';

export const getWorkers = async (req, res, next) => {
  try {
    const workers = await workerModel.getAll();
    res.json(workers);
  } catch (error) {
    next(error);
  }
};

export const createWorker = async (req, res, next) => {
  try {
    const worker = await workerModel.create(req.body);
    res.status(201).json(worker);
  } catch (error) {
    next(error);
  }
};

export const updateWorker = async (req, res, next) => {
  try {
    const existing = await workerModel.getById(req.params.id);
    if (!existing) {
      throw createHttpError(404, 'Worker not found.');
    }
    const worker = await workerModel.update(req.params.id, req.body);
    res.json(worker);
  } catch (error) {
    next(error);
  }
};

export const deleteWorker = async (req, res, next) => {
  try {
    const existing = await workerModel.getById(req.params.id);
    if (!existing) {
      throw createHttpError(404, 'Worker not found.');
    }
    await workerModel.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addWorkerPayment = async (req, res, next) => {
  try {
    const worker = await withTransaction(async (connection) => {
      const existing = await workerModel.getById(req.params.id, connection);
      if (!existing) {
        throw createHttpError(404, 'Worker not found.');
      }

      await workerModel.addPayment(
        req.params.id,
        {
          amount: req.body.amount,
          paymentDate: req.body.paymentDate,
          paymentWeekStart: req.body.paymentWeekStart,
          method: req.body.method,
          notes: req.body.notes
        },
        connection
      );
      return workerModel.updateStatus(req.params.id, req.body.status || 'paid', connection);
    });

    res.json(worker);
  } catch (error) {
    next(error);
  }
};

export const getWorkerPayments = async (req, res, next) => {
  try {
    const history = await workerModel.getPaymentHistory(req.params.id);
    res.json(history);
  } catch (error) {
    next(error);
  }
};
