import express, { Request, Response } from "express";
import Employee from "../models/Employee";
import Employer from "../models/Employer";
import { success, failure } from "../utils/response";

const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
  try {
    const { employer_id, full_name, email, wallet_address, salary, currency } = req.body;

    if (!employer_id || !full_name || !email) {
      return failure(res, "employer_id, full_name and email are required");
    }

    const employer = await Employer.findById(employer_id);
    if (!employer) {
      return failure(res, "Employer not found", 404);
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return failure(res, "Employee already exists");
    }

    const employee = await Employee.create({
      employer_id,
      full_name,
      email,
      wallet_address,
      salary,
      currency,
    });

    // Push new employee into employer employees array
    await Employer.findByIdAndUpdate(
      employer_id,
      { $push: { employees: employee._id } },
      { new: true }
    );

    return success(res, employee, "Employee added successfully");
  } catch (err: any) {
    return failure(res, err.message, 500);
  }
});

export default router;
