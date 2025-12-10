import mongoose, { Schema, Document, Model } from "mongoose";


export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED";

export interface IPayment extends Document {
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    status: PaymentStatus;
    transactionId: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      default: "PENDING",
      required: [true, "Payment status is required"],
    },

    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
      trim: true,
      minlength: [5, "Transaction ID must be at least 5 characters"],
    },
  },
  {
    timestamps: true,
  }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);