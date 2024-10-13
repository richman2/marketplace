import express from "express";
import { protect } from "../controller/guard/protect.js";
import { getInvoices } from "../controller/ordering/invoice.js";

export const invoiceRouter = express.Router();

invoiceRouter.use(protect);
invoiceRouter.get("/myInvoice", getInvoices);
