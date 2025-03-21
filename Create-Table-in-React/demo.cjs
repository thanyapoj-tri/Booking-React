const modulePath = require.resolve("./myModule.js"); // หา path ของ module
delete require.cache[modulePath]; // ลบ module ออกจาก require cache
