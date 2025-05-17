import mongoose from 'mongoose';
import Role from '../src/models/Role.js';
import { DB_URI } from "../src/configs/environments.js";

const roles = [
  { name: 'admin', description: 'Quản trị viên hệ thống' },
  { name: 'staff', description: 'Nhân viên ' },
  { name: 'customer', description: 'Khách hàng ' },
];

async function seedRoles() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    
    await Role.insertMany(roles); 

    console.log(' Đã seed dữ liệu role thành công!');
    process.exit();
  } catch (error) {
    console.error('Lỗi khi seed:', error.message);
    process.exit(1);
  }
}

seedRoles();

