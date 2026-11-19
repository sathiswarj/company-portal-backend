const Company = require('../models/Company');
const Lead = require('../models/Lead');

// 1. List Companies
const getCompanies = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const companies = await Company.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: companies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. View Company Details & Associated Leads
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    // Find associated leads that are not soft-deleted
    const associatedLeads = await Lead.find({
      $or: [{ company: company._id }, { companyName: company.name }],
      isDeleted: false
    });

    return res.status(200).json({
      success: true,
      data: {
        company,
        associatedLeads
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Create Company
const createCompany = async (req, res) => {
  try {
    const { name, industry, location, website, email, phone, description } = req.body;
    if (!name || !industry || !location) {
      return res.status(400).json({ success: false, message: 'Name, industry, and location are required.' });
    }

    const company = await Company.create({
      name,
      industry,
      location,
      website: website || '',
      email: email || '',
      phone: phone || '',
      description: description || ''
    });

    return res.status(201).json({ success: true, data: company });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany
};
