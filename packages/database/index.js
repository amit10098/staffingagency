"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client = require("@prisma/client");
// Re-export everything from @prisma/client
Object.keys(client).forEach((key) => {
  if (key !== "default" && key !== "__esModule") {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return client[key];
      },
    });
  }
});
