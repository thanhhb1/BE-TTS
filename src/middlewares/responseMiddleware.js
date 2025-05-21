const responseMiddleware = (req, res, next) => {
  
  res.success = (data = null, message = "Thành công", status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  };


  res.error = (error = "Lỗi hệ thống", status = 500) => {
    return res.status(status).json({
      success: false,
      message: error,
    });
  };

  
  res.validation = (error, status = 400) => {
    return res.status(status).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      error,
    });
  };

  next(); 
};

export default responseMiddleware;
