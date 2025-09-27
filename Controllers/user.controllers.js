import { hashPassword } from "../utils/handlePassword.js";
import User from "../models/users.model.js";
import customResourceResponse from "../utils/constant.js";

class UserController {
  /**
   * @desc Get all users with pagination and filtering
   * @route GET /api/users
   * @access Public
   */
  static async getAllUsers(req, res) {
    const page = parseInt(req.query.page) || 1; // رقم الصفحة
    const limit = parseInt(req.query.limit) || 10; // عدد العناصر في الصفحة
    const offset = (page - 1) * limit;

    const { search, role, status } = req.query;
    let where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    try {
      const users = await User.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const totalPages = Math.ceil(users.count / limit);

      res.status(200).json({
        ...customResourceResponse.success,
        pagination: {
          totalItems: users.count,
          totalPages,
          currentPage: page,
        },
        users: users.rows,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(customResourceResponse.serverError);
    }
  }
  /**
   * @desc Get user by ID
   * @route GET /api/users/:id
   * @access Public
   */
  static async getUserById(req, res) {
    const userId = req.params.id;
    console.log(userId);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }
      res.status(200).json({ ...customResourceResponse.success, data: user });
    } catch (error) {
      res.status(500).json(customResourceResponse.serverError);
    }
  }
  /**
   * @desc Create a new user
   * @route POST /api/users
   * @access Public
   */
  static async createUser(req, res) {
    const { username, email, phone_number, password, full_name, role } =
      req.body;

    const hashedPassword = await hashPassword(password);

    try {
      const newUser = await User.create({
        username,
        email,
        phone_number,
        full_name,
        password: hashedPassword,
        role,
      });
      res
        .status(201)
        .json({ ...customResourceResponse.success, data: newUser });
    } catch (error) {
      console.log(error);

      res.status(500).json(customResourceResponse.serverError);
    }
  }
  /**
   * @desc Update user by ID
   * @route PUT /api/users/:id
   * @access Public
   */
  static async updateUser(req, res) {
    const userId = req.params.id;
    const { username, email, phone_number, full_name, role } = req.body;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }

      user.username = username || user.username;
      user.email = email || user.email;
      user.phone_number = phone_number || user.phone_number;
      user.full_name = full_name || user.full_name;
      user.role = role || user.role;

      await user.save();

      res.status(200).json({ ...customResourceResponse.success, data: user });
    } catch (error) {
      console.log(error);

      res.status(500).json(customResourceResponse.serverError);
    }
  }
  /**
   * @desc Delete user by ID
   * @route DELETE /api/users/:id
   * @access Public
   */
  static async deleteUser(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json(customResourceResponse.recordNotFound);
      }

      await user.destroy();
      res.status(200).json(customResourceResponse.success);
    } catch (error) {
      res.status(500).json(customResourceResponse.serverError);
    }
  }
}

export default UserController;
