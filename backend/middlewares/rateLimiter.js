// import rateLimit, { ipKeyGenerator } from "express-rate-limit";
// import RedisStore from "rate-limit-redis";
// import redisClient from "../config/redis.js";

// /* 🔐 LOGIN LIMITER */
// export const loginLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 1 * 60 * 1000, // 1 minutes
//   max: 3,
//   keyGenerator: (req) => ipKeyGenerator(req), // ✅ FIX
//   message: {
//     success: false,
//     message: "Too many login attempts. Try again after 1 minutes.",
//   },
// });

// /* 🌍 PUBLIC API LIMITER */
// export const publicApiLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 1 * 60 * 1000,
//   max: 10,
//   keyGenerator: (req) => ipKeyGenerator(req), // ✅ FIX
//   message: {
//     success: false,
//     message: "Too many requests. Slow down.",
//   },
// });

// /* 🔒 USER-BASED LIMITER (JWT) */
// export const userLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 1 * 60 * 1000,
//   max: 10,
//   keyGenerator: (req) => req.user?.id || ipKeyGenerator(req), // ✅ SAFE
//   message: {
//     success: false,
//     message: "User rate limit exceeded.",
//   },
// });
