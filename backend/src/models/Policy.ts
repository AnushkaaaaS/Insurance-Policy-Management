import { Schema, model, InferSchemaType } from "mongoose";

const policySchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    policyType: {
      type: String,
      enum: [
        "Life",
        "Health",
        "Vehicle",
        "Home",
        "Travel",
      ],
      required: true,
    },

    premium: {
      type: Number,
      required: true,
      min: 5000,
    },

    policyTerm: {
      type: Number,
      enum: [10, 15, 20, 25, 30],
      required: true,
    },

    premiumFrequency: {
      type: String,
      enum: [
        "Monthly",
        "Quarterly",
        "Half-Yearly",
        "Yearly",
      ],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Expired",
        "Cancelled",
      ],
      default: "Active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type PolicyDocument =
  InferSchemaType<typeof policySchema>;

const Policy = model<PolicyDocument>(
  "Policy",
  policySchema
);

export default Policy;