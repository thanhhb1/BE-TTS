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
