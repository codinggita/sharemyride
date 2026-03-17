import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  driver:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source:      { type: String, required: true },
  destination: { type: String, required: true },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  seats:       { type: Number, required: true, min: 1, max: 8 },
  cost:        { type: Number, required: true, min: 0 },
  vehicleModel: { type: String, default: '' },
  vehicleColor: { type: String, default: '' },
  preferences: {
    smoking: { type: Boolean, default: false },
    music:   { type: Boolean, default: true },
    pets:    { type: Boolean, default: false },
  },
  passengers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status:      { type: String, enum: ['active', 'full', 'completed', 'cancelled'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Ride', rideSchema);
