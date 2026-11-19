const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Company = require('../models/Company');
const Lead = require('../models/Lead');
const Task = require('../models/Task');

const seedAdmin = async () => {
  try {
    // 1. Seed Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      admin = await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`[Seed] Injected admin: ${adminEmail}`);
    }

    // 2. Seed Initial Companies if empty
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      const companies = await Company.insertMany([
        {
          name: 'Acme Corporation',
          industry: 'Manufacturing',
          location: 'Austin, TX',
          website: 'https://acme.example.com',
          email: 'contact@acme.com',
          phone: '+1 (555) 019-2834',
          description: 'Industrial robotics and automation hardware.'
        },
        {
          name: 'Apex Tech',
          industry: 'IT',
          location: 'Chennai',
          website: 'https://apextech.io',
          email: 'hello@apextech.io',
          phone: '+1 (555) 024-5891',
          description: 'Enterprise cloud infrastructure and DevOps platforms.'
        },
        {
          name: 'ABC Corp',
          industry: 'IT',
          location: 'Chennai',
          website: 'https://abccorp.example.com',
          email: 'support@abccorp.com',
          phone: '+91 44 2839 1234',
          description: 'Software development and enterprise cloud computing.'
        }
      ]);
      console.log('[Seed] Injected default companies.');

      // 3. Seed Initial Leads linked to companies
      const leadCount = await Lead.countDocuments();
      if (leadCount === 0) {
        await Lead.insertMany([
          {
            name: 'Ravi',
            email: 'r@mail.com',
            phone: '+91 98401 23456',
            status: 'New',
            assignedTo: 'admin@gmail.com',
            company: companies[2]._id,
            companyName: 'ABC Corp',
            isDeleted: false
          },
          {
            name: 'Sarah Jenkins',
            email: 'sarah.j@acme.com',
            phone: '+1 555-0192',
            status: 'Qualified',
            assignedTo: 'admin@gmail.com',
            company: companies[0]._id,
            companyName: 'Acme Corporation',
            isDeleted: false
          },
          {
            name: 'Michael Chang',
            email: 'm.chang@apextech.io',
            phone: '+1 555-0245',
            status: 'Contacted',
            assignedTo: 'admin@gmail.com',
            company: companies[1]._id,
            companyName: 'Apex Tech',
            isDeleted: false
          }
        ]);
        console.log('[Seed] Injected default leads.');
      }

      // 4. Seed Initial Tasks
      const taskCount = await Task.countDocuments();
      if (taskCount === 0) {
        await Task.insertMany([
          {
            title: 'Call',
            lead: 'Ravi',
            dueDate: '22 Jan',
            status: 'Pending',
            assignedTo: 'admin@gmail.com'
          },
          {
            title: 'Send Proposal',
            lead: 'Sarah Jenkins',
            dueDate: '25 Jan',
            status: 'Done',
            assignedTo: 'admin@gmail.com'
          },
          {
            title: 'Demo Call',
            lead: 'Michael Chang',
            dueDate: '28 Jan',
            status: 'Pending',
            assignedTo: 'alex@company.com'
          }
        ]);
        console.log('[Seed] Injected default tasks.');
      }
    }
  } catch (error) {
    console.error('[Seed] Error seeding data:', error.message);
  }
};

module.exports = seedAdmin;
