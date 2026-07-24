const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const phoneClean = (phone || '').replace(/\D/g, '');

    const existingUser = await User.findOne({
      $or: [{ email: email ? email.toLowerCase() : 'none' }, { phone: phoneClean }],
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this mobile or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name || 'MamaFarm User',
      email: email || `${phoneClean || Date.now()}@mamafarm.com`,
      phone: phoneClean || phone || '',
      password: hashedPassword,
      role: role || 'admin',
    });

    const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { mobile, phone, email, password } = req.body;
    const inputStr = (phone || mobile || email || '').toString().trim();

    if (!inputStr || !password) {
      return res.status(400).json({ success: false, message: 'Mobile number and password are required' });
    }

    const cleanDigits = inputStr.replace(/\D/g, '');

    // Search DB by phone number or email or name
    let user = await User.findOne({
      $or: [
        { phone: cleanDigits },
        { phone: inputStr },
        { email: inputStr.toLowerCase() },
      ],
    });

    if (!user) {
      // Direct hardcoded fallback for requested single owner credential
      if ((cleanDigits === '8130188878' || inputStr.includes('8130188878')) && password === 'Suraj@7264') {
        const token = jwt.sign({ id: 'user_8130188878', phone: '8130188878', role: 'admin' }, JWT_SECRET, { expiresIn: '30d' });
        return res.json({
          success: true,
          data: {
            id: 'user_8130188878',
            name: 'MamaFarm Owner',
            phone: '8130188878',
            role: 'admin',
            token,
          },
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Fallback check for specified password
      if ((user.phone === '8130188878' || cleanDigits === '8130188878') && password === 'Suraj@7264') {
        const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
        return res.json({
          success: true,
          data: { id: user._id, name: user.name, phone: user.phone, role: user.role, token },
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid mobile number or password' });
    }

    const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    let user;
    if (req.user.id && req.user.id !== 'user_8130188878') {
      user = await User.findById(req.user.id).select('-password');
    }
    if (!user) {
      if (req.user.id === 'user_8130188878' || req.user.phone === '8130188878') {
        return res.json({
          success: true,
          data: { id: 'user_8130188878', name: 'MamaFarm Owner', phone: '8130188878', role: 'admin' },
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
