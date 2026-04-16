import { dashboardModel } from '../models/dashboardModel.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardModel.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
