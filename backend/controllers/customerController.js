const Customer = require('../models/Customer');

exports.getCustomers = async (req,res)=>{ try{ res.json(await Customer.find()); } catch(err){ res.status(500).json({ message: err.message }); } };
exports.getCustomerById = async (req,res)=>{ try{ const c = await Customer.findById(req.params.id); if(!c) return res.status(404).json({ message:'Customer not found' }); res.json(c); } catch(err){ res.status(500).json({ message: err.message }); } };
exports.updateCustomer = async (req,res)=>{ try{ res.json(await Customer.findByIdAndUpdate(req.params.id,req.body,{ new:true })); } catch(err){ res.status(500).json({ message: err.message }); } };
exports.deleteCustomer = async (req,res)=>{ try{ await Customer.findByIdAndDelete(req.params.id); res.json({ message:'Customer deleted' }); } catch(err){ res.status(500).json({ message: err.message }); } };