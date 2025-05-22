import Brand from '../models/Brand.js';
import { brandValid } from '../validation/brand.js';

export const getBrands = async (req, res) => {
  try {
    let {
      _limit = 10,
      _page = 1,
      _sort = 'createdAt',
      _order = 'desc',
      search = '',
    } = req.query;

    _limit = parseInt(_limit);
    _page = parseInt(_page);

    const query = {
      isDeleted: false,
      name: { $regex: search, $options: 'i' },
    };

    const result = await Brand.countDocuments(query);

    const listBrands = await Brand.find(query)
      .sort({ [_sort]: _order === 'asc' ? 1 : -1 })
      .skip((_page - 1) * _limit)
      .limit(_limit);

    return res.success(
      {
        result,
        currPage: _page,
        limit: _limit,
        data: listBrands,
        hasMore: _page * _limit < result,
      },
      'Lấy danh sách brand thành công'
    );
  } catch (error) {
    return res.error(error.message);
  }
};

export const createBrand = async (req, res) => {
  try {
    const { error, value } = brandValid.validate(req.body);
    if (error){
        return res.validation(error.details[0].message);
    } 

    const existing = await Brand.findOne({ name: value.name });
    if (existing) return res.success(null,'Tên thương hiệu đã tồn tại');

    const newBrand = new Brand(value);
    await newBrand.save();

    return res.success(newBrand, 'Thêm thương hiệu thành công');
  } catch (error) {
    return res.error(error.message);
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = brandValid.validate(req.body);
    if (error) {
      return res.validation(error.details[0].message);
    }

    if (value.name) {
      const existingBrand = await Brand.findOne({
        name: value.name.trim(),
        _id: { $ne: id },
        isDeleted: false,
      });

      if (existingBrand) {
        return res.success(null, 'Tên thương hiệu đã tồn tại');
      }
    }

    const brand = await Brand.findByIdAndUpdate(id, value, { new: true });

    if (!brand) {
      return res.success(null, 'Thương hiệu không tồn tại');
    }

    return res.success(brand, 'Cập nhật thương hiệu thành công');
  } catch (error) {
    return res.error(error.message);
  }
};
export const removeBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!brand){
      return res.success(null, 'Thương hiệu không tồn tại');
    } 

    return res.success(brand, 'Xóa mềm thương hiệu thành công');
  } catch (error) {
    return res.error(error.message);
  }
};
export const getDeletedBrands = async (req, res) => {
  try {
    const deletedBrands = await Brand.find({ isDeleted: true });
    return res.success(deletedBrands, 'Danh sách thương hiệu đã xóa mềm');
  } catch (error) {
    return res.error(error.message);
  }
};
export const restoreBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );

    if (!brand){
      return res.success(null, 'Thương hiệu không tồn tại');
    } 

    return res.success(brand, 'Khôi phục thương hiệu thành công');
  } catch (error) {
    return res.error(error.message);
  }
};
export const forceDeleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand){
      return res.success(null, 'Thương hiệu không tồn tại');
    } 

    return res.success(null, 'Xóa vĩnh viễn thương hiệu thành công');
  } catch (error) {
    return res.error(error.message);
  }
};



