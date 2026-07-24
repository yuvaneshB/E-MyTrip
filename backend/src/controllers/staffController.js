import User from '../models/user.js';

// GET all staff members
export const getStaff = async (req, res, next) => {
  try {
    const staff = await User.find({ role: { $in: ['Manager', 'Finance'] } }).select('-password');
    res.status(200).json({ success: true, staff });
  } catch (error) {
    next(error);
  }
};

// CREATE a staff member
export const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All required fields (name, email, password, role) are required.' });
    }
    if (!['Manager', 'Finance'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid staff role' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Account already exists with this email' });
    }
    
    const staffUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      isEmailVerified: true, // pre-verified
      status: status || 'Active',
      isActive: status !== undefined ? (status === 'Active') : true
    });
    
    const responseUser = staffUser.toObject();
    delete responseUser.password;
    res.status(201).json({ success: true, message: 'Staff account created successfully', staff: responseUser });
  } catch (error) {
    next(error);
  }
};

// UPDATE basic details of a staff member
export const updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }
    if (!['Manager', 'Finance'].includes(user.role)) {
      return res.status(400).json({ success: false, message: 'Not a staff account' });
    }
    if (role && !['Manager', 'Finance'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid staff role' });
    }
    if (email && email.toLowerCase().trim() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email.toLowerCase().trim();
    }
    
    if (name) user.name = name;
    if (role) user.role = role;
    if (status !== undefined && ['Active', 'Inactive'].includes(status)) {
      user.status = status;
      user.isActive = (status === 'Active');
    }
    
    await user.save();
    const responseUser = user.toObject();
    delete responseUser.password;
    res.status(200).json({ success: true, message: 'Staff details updated successfully', staff: responseUser });
  } catch (error) {
    next(error);
  }
};

// UPDATE status of a staff member
export const updateStaffStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, isActive } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }
    if (!['Manager', 'Finance'].includes(user.role)) {
      return res.status(400).json({ success: false, message: 'Not a staff account' });
    }
    
    const targetActive = status !== undefined ? (status === 'Active') : (isActive !== undefined ? isActive : user.isActive);
    const targetStatus = status || (targetActive ? 'Active' : 'Inactive');
    
    user.isActive = targetActive;
    user.status = targetStatus;
    
    await user.save();
    res.status(200).json({ success: true, message: `Staff account ${targetStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, staff: user });
  } catch (error) {
    next(error);
  }
};

// RESET staff credentials (change password)
export const resetStaffPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }
    if (!['Manager', 'Finance'].includes(user.role)) {
      return res.status(400).json({ success: false, message: 'Not a staff account' });
    }
    user.password = password;
    await user.save();
    res.status(200).json({ success: true, message: 'Staff credentials reset successfully' });
  } catch (error) {
    next(error);
  }
};

// DELETE a staff member
export const deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }
    if (!['Manager', 'Finance'].includes(user.role)) {
      return res.status(400).json({ success: false, message: 'Not a staff account' });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Staff account removed successfully' });
  } catch (error) {
    next(error);
  }
};
