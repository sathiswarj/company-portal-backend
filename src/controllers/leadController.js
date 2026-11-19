const Lead = require('../models/Lead');

// 1. List Leads (Pagination, Search, Filtering, Soft-delete exclusion)
const getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '', status = 'All' } = req.query;

    const query = { isDeleted: false }; // Never return soft-deleted leads

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { assignedTo: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('company', 'name industry location');

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)) || 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create Lead
const createLead = async (req, res) => {
  try {
    const { name, email, phone, status, assignedTo, company, companyName } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      status: status || 'New',
      assignedTo: assignedTo || 'admin@gmail.com',
      company: company || null,
      companyName: companyName || '',
      isDeleted: false
    });

    return res.status(201).json({ success: true, data: lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Lead
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: req.body },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found or already deleted.' });
    }

    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Soft Delete Lead (must not appear in normal queries)
const softDeleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    return res.status(200).json({ success: true, message: 'Lead soft-deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  softDeleteLead
};
