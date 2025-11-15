"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Employer_1 = __importDefault(require("../models/Employer"));
const response_1 = require("../utils/response");
const router = express_1.default.Router();
router.post("/signup", async (req, res) => {
    try {
        const { company_name, email, country, privy_user_id, wallet_address } = req.body;
        if (!company_name || !email || !country) {
            return (0, response_1.failure)(res, "company_name, email and country are required");
        }
        const existing = await Employer_1.default.findOne({ email });
        if (existing) {
            return (0, response_1.failure)(res, "Employer already exists");
        }
        const employer = await Employer_1.default.create({
            company_name,
            email,
            country,
            privy_user_id,
            wallet_address,
        });
        return (0, response_1.success)(res, employer, "Employer registered successfully");
    }
    catch (err) {
        return (0, response_1.failure)(res, err.message, 500);
    }
});
exports.default = router;
