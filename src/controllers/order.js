import Order from "../models/Order.js";
export const getOrders = async (req, res) => {
  try {
    const {
      _limit = 10,
      _page = 1,
      _sort = "createdAt",
      _order = "desc",
      search = ""
    } = req.query;

    const limit = parseInt(_limit);
    const page = parseInt(_page);
    const sortField = _sort;
    const sortOrder = _order === "asc" ? 1 : -1;

    let userIds = [];
    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: "i" }
      }, "_id");
      userIds = users.map(user => user._id);
    }

    
    const query = {
      $or: [
        { invoice_number: { $regex: search, $options: "i" } },
        { user_id: { $in: userIds } }
      ]
    };

    
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user_id", "name email");

    return res.success({
      total,
      currPage: page,
      limit,
      data: orders,
      hasMore: page * limit < total
    }, "Lấy danh sách đơn hàng thành công");
  } catch (error) {
    return res.error(error.message);
  }
};
