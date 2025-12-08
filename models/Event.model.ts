import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  tags?: string[];
  category:"concerts"|"workshops" |"conferences"
  createdAt: Date;
  updatedAt: Date;
}
const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: [true, "Title is required"], trim: true, minlength: 3 },
        description: { type: String, trim: true },
        date: { type: Date, required: [true, "Date is required"], validate: { validator: (v: Date) => v > new Date(), message: 'Event date must be in the future' } },
        location: { type: String, required: [true, "Location is required"], trim: true, minlength: 2 },
        organizer: { type: Schema.Types.ObjectId, ref: 'User', required: [true, "Organizer is required"] },
        tags: { type: [String], validate: { validator: (v: string[]) => v.length <= 10, message: 'Maximum 10 tags allowed' } },
        category: { type: String, enum: { values: ['concerts', 'workshops', 'conferences'], message: 'Category must be one of: concerts, workshops, or conferences' } },
    },
    { timestamps: true }
);

const Event: Model<IEvent> =mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export default Event;