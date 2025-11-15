"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failure = exports.success = void 0;
const success = (res, data, message = "Success") => {
    return res.status(200).json({ success: true, message, data });
};
exports.success = success;
const failure = (res, message = "Something went wrong", code = 400) => {
    return res.status(code).json({ success: false, message });
};
exports.failure = failure;
