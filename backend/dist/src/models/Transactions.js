"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const TransactionSchema = new mongoose_1.Schema({
    employer_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Employer", required: true },
    employee_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Employee" },
    employer_email: { type: String, required: true },
    employee_email: { type: String },
    employer_wallet: { type: String, required: true },
    employee_wallet: { type: String, required: true },
    amount: { type: String, required: true },
    token_symbol: { type: String, default: "USDC" },
    tx_hash: { type: String, unique: true, sparse: true },
    network: { type: String, default: "Flare" },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    payment_type: { type: String, enum: ["batch", "instant"], required: true },
    batch_id: { type: String },
    contract_id: { type: String },
    automation: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("Transaction", TransactionSchema);
