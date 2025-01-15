
const mongoose= require("mongoose")


const FeeTransactionSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    class: { type: String, },
    section: { type: String, },
    month: { type: String, required: true }, // e.g., "January"
    year: { type: Number, required: true }, // e.g., 2024

    // feeType: { type: String, default: "Monthly Fee" },
    // amountDue: { type: Number, required: true },
    amount: { type: Number, required: true },
    // paymentMethod: { type: String, required: true },
    // receiptNumber: { type: String, required: true, unique: true },
    date: { type: Date, },
    status: {type:String, required: true},
    // issuedBy: { type: String, required: true },
    isArchived:{
      type:Boolean,
      default:false
    },
    remarks: { type: String }
  });
  
  module.exports = mongoose.model("FeeTransaction", FeeTransactionSchema);
  