import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function authentication(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    // 👇 تحقق من صحة التوكن عبر auth-service
    const { data: user } = await axios.get(
      `http://${process.env.AUTH_SERVICE}/verify`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    // إذا تم التحقق بنجاح، نحفظ بيانات المستخدم في الطلب
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
}

export default authentication;
