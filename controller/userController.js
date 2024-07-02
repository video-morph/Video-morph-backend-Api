const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");


//create a transporter
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "yisarasaq2018@gmail.com",
    pass: "ryjs fyrg qlfn xbws",
  },
});

// duration for the jwt token
maxAge = 10 * 60 * 60;

//Signup route
exports.register = async (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "Email has already been registered" });
    }
    const secret = Math.floor(100000 + Math.random() * 900000);

    //create a verification token
    const verificationToken = jwt.sign(
      { firstName, lastName, email, password },
      process.env.JWT_SECRET,
      { expiresIn: "20m" }
    );

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (password.length < 8) {
      return res
        .status(400)
        .json({ mesage: "Password must contain a minimum of 8 characters" });
    } else if (password !== password2) {
      return res.status(401).json({ message: "Passwords do not match" });
    } else {
      //save the user data to the database
      const newUser = new User({
        firstName,
        lastName,
        email,
        secret,
        password: hashedPassword,
        password2: hashedPassword,
        verificationToken,
      });
      await newUser.save();
      // create a verification link
      const verificationLink = `https://video-morph.onrender.com/verify?token=${verificationToken}`;

      //send verification email
      const mailOptions = {
        from: "Techstarta",
        to: email,
        subject: "Email verification",
        text: `verificationLink: ${verificationLink}`,
      };
      await transporter.sendMail(mailOptions);
      return res
        .status(200)
        .json({ message: "Verification email sent.", verificationToken });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Email verification route
exports.accountVerification = async (req, res) => {
  const { verificationToken } = req.body;
  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    //Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Login route
exports.login = async (req, res) => {
  const { email, password, secret } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const newSecret = Math.floor(100000 + Math.random() * 900000);
    await User.findOneAndUpdate({ secret: newSecret });

    //send token to the user's email
    const mailOptions = {
      from: "Techstarta",
      to: email,
      subject: "Two factor authentication token",
      text: `Your two-factor authentication token is: ${newSecret}`,
    };

    //send the mail
    await transporter.sendMail(mailOptions);
    // Generate JWT token
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "10h",
    });
    return res
      .status(200)
      .json({ message: "A token has been sent to you mail", newSecret, token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// two step verification route
exports.verify = async (req, res) => {
  const { secret } = req.body;
  try {
    //check if the secret exist in the database
    const user = await User.findOne({ secret });

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    //Update user verification status
    user.secret = undefined;
    user.twoFactorVerified = true;
    user.twoFactorVerified = undefined;
    await user.save();
    // Generate JWT token
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "10h",
    });
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    //Generate a reset token
    const resetToken = Math.random().toString(36).substring(2, 6);
    user.resetToken = resetToken;
    //Token expiration: 30 minutes
    user.resetTokenExpiration = new Date(Date.now() + 1800000);
    await user.save();

    //reset link
    resetLink = `https://video-morph.onrender.com/reset-password?token=${resetToken}&email=${email}`;

    //send password reset mail
    const mailOptions = {
      from: "Techstarta",
      to: email,
      subject: "Password reset",
      text: `Reset link: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Password reset link sent", resetToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Reset password algorithm
exports.resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (resetToken !== resetToken || new Date() > user.resetTokenExpiration) {
      return res
        .status(401)
        .json({ message: "Invalid or expired reset token" });
    }

    //Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Logout successful" });
};
