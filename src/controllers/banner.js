import Banner from '../models/Banner.js';

export const getBanners = async (req, res) => {
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
      isActive: true,
      title: { $regex: search, $options: 'i' },
    };

    const result = await Banner.countDocuments(query);

    const listBanners = await Banner.find(query)
      .sort({ [_sort]: _order === 'asc' ? 1 : -1 })
      .skip((_page - 1) * _limit)
      .limit(_limit);

    return res.success(
      {
        result,
        currPage: _page,
        limit: _limit,
        data: listBanners,
        hasMore: _page * _limit < result,
      },
      'Lấy danh sách banner thành công'
    );
  } catch (error) {
    return res.error(error.message);
  }
};

export const createBanner = async (req, res) => {
  try {
    const { error } = bannerSchema.validate(req.body);
    if (error){
        return res.success(error.details[0].message);
    } 

    const { title, imageUrl, link, isActive } = req.body;

    const newBanner = await Banner.create(req.body);

    return res.success(newBanner, "Tạo banner thành công");
  } catch (error) {
    return res.error(error.message);
  }
};
export const updateBanner = async (req, res) => {
  try {
    const { error } = bannerSchema.validate(req.body);
    if (error){
        return res.success(error.details[0].message);
    } 

    const { id } = req.params;
    const { title, imageUrl, link, isActive } = req.body;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { title, imageUrl, link, isActive },
      { new: true }
    );

    if (!banner){
        return res.success(null,"Banner không tồn tại");
    } 

    return res.success(banner, "Cập nhật banner thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const removeBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!banner){
        return res.success(null,"Không tìm thấy banner");
    } 

    return res.success(banner, "Đã xóa mềm banner thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const restoreBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );

    if (!banner){
        return res.success(null,"Không tìm thấy banner");
    } 

    return res.success(banner, "Khôi phục banner thành công");
  } catch (error) {
    return res.error(error.message);
  }
};


export const getDeletedBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isDeleted: true });

    return res.success(banners, "Lấy danh sách banner đã xóa mềm");
  } catch (error) {
    return res.error(error.message);
  }
};

export const forceDeleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner){
        return res.success(null,"Không tìm thấy banner");
    } 

    return res.success(banner, "Đã xóa vĩnh viễn banner");
  } catch (error) {
    return res.error(error.message);
  }
};
