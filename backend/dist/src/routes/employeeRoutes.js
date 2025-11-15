"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Employee_1 = __importDefault(require("../models/Employee"));
const Employer_1 = __importDefault(require("../models/Employer"));
const response_1 = require("../utils/response");
const router = express_1.default.Router();
router.post("/create", async (req, res) => {
    try {
        const { employer_id, full_name, email, privy_user_id, wallet_address, salary, currency } = req.body;
        if (!employer_id || !full_name || !email) {
            return (0, response_1.failure)(res, "employer_id, full_name and email are required");
        }
        const employer = await Employer_1.default.findById(employer_id);
        if (!employer) {
            return (0, response_1.failure)(res, "Employer not found", 404);
        }
        const existing = await Employee_1.default.findOne({ email });
        if (existing) {
            return (0, response_1.failure)(res, "Employee already exists");
        }
        const employee = await Employee_1.default.create({
            employer_id,
            full_name,
            email,
            privy_user_id,
            wallet_address,
            salary,
            currency,
        });
        return (0, response_1.success)(res, employee, "Employee added successfully");
    }
    catch (err) {
        return (0, response_1.failure)(res, err.message, 500);
    }
});
exports.default = router;
