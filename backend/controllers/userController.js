const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id, user.role);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        sellerStatus: user.sellerStatus,
        isSellerApproved: user.isSellerApproved,
        isSellerActive: user.isSellerActive,
        subscriptionPlan: user.subscriptionPlan,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
    });

    if (user) {
      generateToken(res, user._id, user.role);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new seller
// @route   POST /api/users/seller-register
// @access  Public
const registerSeller = async (req, res, next) => {
  try {
    const { 
      name, email, password, 
      storeName, ownerName, phone, 
      gstNumber, address, storeLogo, storeBanner 
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'seller',
      sellerProfile: {
        storeName,
        ownerName,
        phone,
        gstNumber,
        address,
        storeLogo,
        storeBanner
      },
      sellerStatus: 'pending'
    });

    if (user) {
      generateToken(res, user._id, user.role);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sellerStatus: user.sellerStatus
      });
    } else {
      res.status(400);
      throw new Error('Invalid seller data');
    }
  } catch (error) {
    next(error);
  }
};
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        sellerStatus: user.sellerStatus,
        isSellerApproved: user.isSellerApproved,
        isSellerActive: user.isSellerActive,
        subscriptionPlan: user.subscriptionPlan,
        planExpiry: user.planExpiry,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin user');
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new delivery partner
// @route   POST /api/users/delivery-register
// @access  Public
const registerDelivery = async (req, res, next) => {
  try {
    const { 
      name, email, password, 
      phone, address, vehicleType, vehicleNumber, drivingLicense 
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'delivery',
      deliveryProfile: {
        phone,
        address,
        vehicleType,
        vehicleNumber,
        drivingLicense
      },
      deliveryStatus: 'pending'
    });

    if (user) {
      generateToken(res, user._id, user.role);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        deliveryStatus: user.deliveryStatus
      });
    } else {
      res.status(400);
      throw new Error('Invalid delivery partner data');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
  registerUser,
  registerSeller,
  registerDelivery,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
};
