const Order = require('../models/Order');
const Artisan = require('../models/Artisan');

// ---------------- Create Order ----------------
exports.createOrder = async (req, res) => {
  try {
    console.log("Incoming order request body:", req.body); // 🔍 log body
    const { artisanId, customerId, serviceId, scheduledDate } = req.body;

    // find artisan and service
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) return res.status(404).json({ message: 'Artisan not found' });

    const service = artisan.services.find(s => s._id === serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found for this artisan' });

    // create order with snapshot of service
    const order = await Order.create({
      artisan: artisanId,
      customer: customerId,
      service: {
        _id: service._id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration
      },
      scheduledDate,
      price: service.price
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Get All Orders ----------------
exports.getOrders = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "customer") filter.customer = req.user._id;
    if (req.user.role === "artisan") filter.artisan = req.user._id;

    const orders = await Order.find(filter)
       .populate('artisan', 'name email phone address location') // ✅ include address & location
      .populate('service', 'name description price duration');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- Get Order by ID ----------------
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('artisan', 'name email phone')
      .populate('customer', 'name email phone')
      .populate('service', 'name description price duration'); // ✅ consistent

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Update Order ----------------
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('artisan', 'name email phone')
      .populate('customer', 'name email phone')
      .populate('service', 'name description price duration'); // ✅ return populated order after update

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Delete Order ----------------
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Get Orders for a Specific Artisan ----------------
exports.getArtisanOrders = async (req, res) => {
  try {
    const orders = await Order.find({ artisan: req.params.artisanId })
      .populate('customer', 'name email phone')
      .populate('service', 'name description price duration'); // ✅ full service details

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};