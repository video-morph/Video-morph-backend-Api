# Video-Morph Backend API

### OVERVIEW

The Video-Morph Backend API is a Node.js application designed for efficient video management. It allows users to upload videos, transcode them using Cloudinary, and manage video details stored in a MongoDB database. The API also supports authentication through Google OAuth 2.0 and a local authentication, ensuring secure access and user management.

This backend service is built with Express.js, providing a scalable and efficient way to handle video files and related operations.

Key functionalities of the Video-Morph Backend API include:

Video Upload: Users can upload video files to the server.
Transcoding: Uploaded videos are transcoded using Cloudinary to ensure compatibility and optimal delivery.
Data Management: Video details, including name, URL, Cloudinary ID, and description, are stored in MongoDB.
Authentication: Secure user authentication is handled via Google OAuth 2.0 and a local authentication.
Error Handling: The API includes comprehensive error handling to manage various error scenarios effectively.
This project is ideal for applications that require reliable video upload, transcoding, and management capabilities, such as video sharing platforms, educational content providers, and media management systems.


### Features

The Video-Morph Backend API boasts a range of features designed to streamline video management and ensure a seamless user experience:

1. **Video Upload**:
   - Users can upload video files in various formats (e.g., mp4, avi, mkv, mov) to the server.
   - Uploads are handled using Express File Upload, ensuring efficient file handling.

2. **Video Transcoding**:
   - Uploaded videos are automatically transcoded using Cloudinary to ensure they are in a compatible format and optimized for web delivery.
   - Transcoding parameters can be customized for specific needs.

3. **Cloudinary Integration**:
   - Direct integration with Cloudinary for storing and managing videos.
   - Access to Cloudinary’s powerful media management features.

4. **MongoDB Integration**:
   - Video details (name, URL, Cloudinary ID, and description) are stored in a MongoDB database for easy retrieval and management.
   - Mongoose is used for schema-based data validation and interaction with MongoDB.

5. **Google OAuth 2.0 Authentication**:
   - Secure authentication and authorization using Google OAuth 2.0.
   - User sessions are managed with express-session and passport.js, ensuring secure and persistent user sessions.

6. **Error Handling**:
   - Comprehensive error handling mechanisms ensure that users receive meaningful error messages and status codes.
   - Graceful handling of common issues, such as invalid file types, upload failures, and database errors.

7. **Scalability**:
   - Built with Express.js, allowing the application to handle a not mpore than 100mb video of requests efficiently.
   - Designed to be easily scalable for growing user bases and increasing video upload demands.

8. **Middleware**:
   - Utilizes middleware for logging (morgan), parsing (express.json, express.urlencoded), and session management (express-session).
   - Custom middleware can be easily added for additional functionality.

9. **Security**:
   - Sessions are secured with a secret key, and sensitive information is handled securely.
   - Cookies are parsed and managed securely with cookie-parser.

10. **Deployment Ready**:
    - The application is designed to be easily deployed on platforms like Render, with environment variables for configuration.
    - Detailed setup instructions ensure smooth deployment and configuration.

These features make the Video-Morph Backend API a powerful solution for applications that require robust video upload, transcoding, and management capabilities.

### Tech Stack

The Video-Morph Backend API leverages a powerful and modern tech stack to provide efficient, scalable, and secure video management services. Here’s a breakdown of the technologies used:

1. **Node.js**:
   - JavaScript runtime built on Chrome's V8 JavaScript engine.
   - Used for building fast and scalable server-side applications.

2. **Express.js**:
   - Minimal and flexible Node.js web application framework.
   - Provides a robust set of features for web and mobile applications.
   - Handles routing, middleware, and HTTP utilities.

3. **MongoDB**:
   - NoSQL database for storing video metadata.
   - Provides high performance, high availability, and easy scalability.

4. **Mongoose**:
   - Elegant MongoDB object modeling for Node.js.
   - Manages relationships between data and provides schema validation.

5. **Cloudinary**:
   - Cloud-based media management service.
   - Handles video transcoding, storage, and delivery.
   - Provides powerful media transformation and optimization features.

6. **Passport.js**:
   - Middleware for authentication in Node.js.
   - Provides various authentication strategies, including Google OAuth 2.0.
   - Used for securing user authentication and managing sessions.

7. **Express File Upload**:
   - Middleware for handling file uploads.
   - Simplifies the process of handling multipart/form-data.

8. **Morgan**:
   - HTTP request logger middleware for Node.js.
   - Used for logging requests in the application for monitoring and debugging.

9. **Express-Session**:
   - Middleware for managing user sessions.
   - Stores session data on the server, allowing for session persistence across requests.

10. **Cookie-Parser**:
    - Middleware for parsing cookies attached to client requests.
    - Provides an easy way to access cookies in the application.

11. **dotenv**:
    - Module for loading environment variables from a `.env` file into `process.env`.
    - Used for managing configuration settings and sensitive information securely.

This tech stack ensures that the Video-Morph Backend API is robust, scalable, and easy to maintain. The combination of these technologies provides a solid foundation for building a high-performance video management system.

### Enviroment Variables

 NODE_ENV = development

MONGO_URL = mongodb+srv://project:user1234@tutorial.vyzvfiu.mongodb.net/NODE-APII?retryWrites=true&w=majority

PORT = 6000

JWT_SECRET = thisisthesecretcodeforthejwttoken

CLIENT_ID =  50181597024-90r6qj7va8kqnrlc5chmu887vkegtpu7.apps.googleusercontent.com

CLIENT_SECRET =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

SESSION_SECRET = ywsrwysowdontfuvkwithme

CLIENT_URL = https://video-morph.onrender.com

RESET_PASSWORD_KEY = accountactivatetoken1234

MAILGUN_API_KEY = 6bbe1a8863f1524e0e0810053442bce2-ed54d65c-0634b21f

MAILGUN_DOMAIN = sandbox81ed41d3e6fc4703b0efc6b48b3ce047.mailgun.org

LOGIN_PASS_KEY = thisisnotajokesodontwhineme

JWT_ACCESS_SECRET = thisistheecretfortheaccesstoken

JWT_REFRESH_SECRET = thiisthesecretforthejwtrefreshtoken

CLOUD_NAME = dzwgpcuz7

CLOUD_KEY = 592965116821974

CLOUD_SECRET = VZvKH_zx8msSI0yDAutBbaxqiFo


### EndPoints

-Signup Route
https://video-morph.onrender.com/user/signup

- Verify Account
https://video-morph.onrender.com/user/verify

- Login 
https://video-morph.onrender.com/user.login

-Two Set Authentication
https://video-morph.onrender.com/user/verify-token

-Forgot Password
https://video-morph.onrender.com/user/forgot-password

-Reset Password
https://video-morph.onrender.com/user/reset-password

-Upload Video
https://video-morph.onrender.com/video/upload

