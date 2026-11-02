const Order = require("../models/order.model");

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Error getting orders",
            error: error.message
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Error getting order",
            error: error.message
        });
    }
};



const createOrder = async (req, res) => {
    try {
        const order = new Order({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        });
        await order.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order updated successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating order",
            error: error.message
        });
    }
};


const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order deleted successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting order",
            error: error.message
        });
    }
};


module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
};