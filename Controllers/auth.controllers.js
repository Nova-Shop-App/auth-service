import { hashPassword, verifyPassword } from "../utils/handlePassword.js";
import User from "../models/users.model.js";
import customResourceResponse from "../utils/constant.js";
import { generateTokens, verifyToken } from "../utils/handleToken.js";

class AuthController {
  /**
   * @desc Register a new user
   * @route POST /api/register
   * @access Public
   */
  static async registerUser(req, res) {
    try {
      const { username, email, phone_number, password, full_name } = req.body;
      const hashedPassword = await hashPassword(password);

      const newUser = await User.create({
        username,
        full_name,
        email,
        phone_number,
        password: hashedPassword,
      });
      const token = generateTokens(newUser);
      res.status(201).json({
        ...customResourceResponse.success,
        user: newUser,
        token: token,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json(customResourceResponse.serverError);
    }
  }

  /**
   * @desc Login a user
   * @route POST /api/login
   * @access Public
   */
  static async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      var user = await User.findOne({ where: { email } });

      if (!user) {
        var token = "No token";
        var user = {};

        return res
          .status(404)
          .json({ ...customResourceResponse.success, token });
      }
      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        var token = "No token";
        var user = {};

        return res
          .status(404)
          .json({ ...customResourceResponse.success, token });
      }

      // Here you would typically generate a JWT token and send it back
      var token = generateTokens(user);

      res.status(201).json({ ...customResourceResponse.success, user, token });
    } catch (error) {
      console.log(error);

      res.status(500).json(customResourceResponse.serverError);
    }
  }

  /**
   * @desc Verify a user
   * @route GET /api/verify
   * @access Public
   */

  static async verifyUser(req, res) {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Here you would typically verify the token
    // For demonstration, we assume the token is valid

    try {
      const decoded = verifyToken(token);

      // تحقق من المستخدم داخل قاعدة البيانات إذا أردت
      const user = await User.findOne({
        where: { username: decoded.username },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid user" });
      }

      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid token", error: err.message });
    }
  }
}

export default AuthController;
