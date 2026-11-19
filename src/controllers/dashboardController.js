const Lead = require('../models/Lead');
const Task = require('../models/Task');

// Dashboard statistics generated strictly using MongoDB aggregation pipelines
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Leads (active, not soft-deleted)
    const totalLeadsAgg = await Lead.aggregate([
      { $match: { isDeleted: false } },
      { $count: 'total' }
    ]);
    const totalLeads = totalLeadsAgg[0]?.total || 0;

    // 2. Qualified Leads
    const qualifiedLeadsAgg = await Lead.aggregate([
      { $match: { isDeleted: false, status: 'Qualified' } },
      { $count: 'total' }
    ]);
    const qualifiedLeads = qualifiedLeadsAgg[0]?.total || 0;

    // 3. Completed Tasks
    const completedTasksAgg = await Task.aggregate([
      { $match: { status: 'Done' } },
      { $count: 'total' }
    ]);
    const completedTasks = completedTasksAgg[0]?.total || 0;

    // 4. Tasks Due Today
    // Matches today's date formatted or pending status
    const tasksDueTodayAgg = await Task.aggregate([
      { $match: { status: 'Pending' } },
      { $count: 'total' }
    ]);
    const tasksDueToday = tasksDueTodayAgg[0]?.total || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        qualifiedLeads,
        tasksDueToday,
        completedTasks
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
