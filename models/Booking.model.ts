import mongoose, { Schema, Document, Model } from "mongoose";

export type BookingStatus = "PENDING" | "PAID" | "CANCELLED";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  seats: number;
  status: BookingStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      validate: {
        validator: (v: unknown) => mongoose.Types.ObjectId.isValid(String(v)),
        message: "Invalid user id",
      },
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
      validate: {
        validator: (v: unknown) => mongoose.Types.ObjectId.isValid(String(v)),
        message: "Invalid event id",
      },
    },
    seats: {
      type: Number,
      required: [true, "Seats are required"],
      min: [1, "At least 1 seat must be booked"],
      max: [10, "Too many seats requested"],
      validate: {
        validator: Number.isInteger,
        message: "Seats must be an integer",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "PAID", "CANCELLED"],
        message: "Status must be PENDING, PAID or CANCELLED",
      },
      default: "PENDING",
      required: [true, "Status is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
  },
  {
    timestamps:true,
  }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
