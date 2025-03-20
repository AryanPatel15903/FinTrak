const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  category: { type: String, required: true },
  limit: { type: Number, required: true },
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;