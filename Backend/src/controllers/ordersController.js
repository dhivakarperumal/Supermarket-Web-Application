const getAllOrders = async (req, res) => {
    try {
        // Return dummy empty orders array for now to prevent 404
        res.status(200).json([]);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllOrders };
