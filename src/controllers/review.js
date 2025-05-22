import Review from "../models/Review.js";
import { statusValid } from "../validation/review.js";
export const getReviews = async (req, res) => {
  try {
    let {
      _limit = 10,
      _page = 1,
      _sort = "createdAt",
      _order = "desc",
      product_id,
      user_id,
      status,
      rating,
      search = ""
    } = req.query;

    // Xây dựng query lọc
    const query = {};

    if (product_id) query.product_id = product_id;
    if (user_id) query.user_id = user_id;
    if (status) query.status = status;
    if (rating) query.rating = Number(rating);
    if (search) {
      query.comment = { $regex: search, $options: "i" }; // Tìm trong bình luận
    }

    const total = await Review.countDocuments(query);

    const reviews = await Review.find(query)
      .sort({ [_sort]: _order === "asc" ? 1 : -1 })
      .skip((_page - 1) * _limit)
      .limit(Number(_limit))
      .populate("product_id", "name") 
      .populate("user_id", "fullname "); 

    return res.success({
      total,
      currPage: Number(_page),
      limit: Number(_limit),
      data: reviews,
      hasMore: _page * _limit < total,
    }, "Lấy danh sách đánh giá thành công");

  } catch (error) {
    return res.error(error.message);
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id)
      .populate("product_id", "name")
      .populate("user_id", "fullname ");

    if (!review) {
      return res.success(null, "Không tìm thấy đánh giá");
    }

    return res.success(review, "Lấy đánh giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};

export const updateReview = async (req, res) => {
  try {
    const { error, value } = statusValid.validate(req.body);
    if (error){
        return res.validation(error.details[0].message);
    } 
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review){
        return res.success(null,"Không tìm thấy đánh giá");
    } 
    review.status = value.status;
    await review.save();

    return res.success(review, "Cập nhật trạng thái đánh giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};
export const removeReview = async (req, res) => {
  try {
    const { id } = req.params;

    const existingReview = await Review.findOne({ _id: id, deleted: false });

    if (!existingReview) {
      return res.success(null, "Không tìm thấy đánh giá để xóa");
    }

    const deletedReview = await Review.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    return res.success(deletedReview, "Đã xóa mềm đánh giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const restoreReview = async (req, res) => {
  try {
    const { id } = req.params;

    const existingReview = await Review.findOne({ _id: id, deleted: true });

    if (!existingReview) {
      return res.success(null, "Không tìm thấy đánh giá đã xóa để khôi phục");
    }

    const restoredReview = await Review.findByIdAndUpdate(
      id,
      { deleted: false },
      { new: true }
    );

    return res.success(restoredReview, "Khôi phục đánh giá thành công");
  } catch (error) {
    return res.error(error.message);
  }
};
export const getDeletedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ deleted: true })
      .populate("user_id", "fullname")
      .populate("product_id", "name");

    return res.success(reviews, "Lấy danh sách đánh giá đã xóa");
  } catch (error) {
    return res.error(error.message);
  }
};
