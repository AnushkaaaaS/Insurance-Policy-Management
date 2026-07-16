import { Schema, model, InferSchemaType } from "mongoose";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 65,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[6-9]\d{9}$/,
        "Invalid Mobile Number",
      ],
    },

    aadhaar: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\d{12}$/,
        "Aadhaar must be 12 digits",
      ],
    },

    pan: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
      match: [
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Invalid PAN",
      ],
    },

    nominee: {
      type: String,
      required: true,
      trim: true,
    },

    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type CustomerDocument =
  InferSchemaType<typeof customerSchema>;

const Customer = model<CustomerDocument>(
  "Customer",
  customerSchema
);

export default Customer;