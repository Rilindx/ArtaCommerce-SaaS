import { reportModel } from '../models/reportModel.js';

export const getReports = async (req, res, next) => {
  try {
    const [daily, monthly, debts, profit, workerPayments] = await Promise.all([
      reportModel.getDailyReport(),
      reportModel.getMonthlyReport(),
      reportModel.getDebtReport(),
      reportModel.getProfitReport(),
      reportModel.getWorkerPaymentsReport()
    ]);

    res.json({
      daily,
      monthly,
      debts,
      profit,
      workerPayments
    });
  } catch (error) {
    next(error);
  }
};
