
export const successResponse = (res, data = null, message = "Thành công", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};


export const errorResponse = (res, error = "Lỗi hệ thống", status = 500) => {
  return res.status(status).json({
    success: false,
    message: error,
  });
};


export const validationError = (res, error, status = 400) => {
  return res.status(status).json({
    success: false,
    message: "Dữ liệu không hợp lệ",
    error,
  });
};
