import { Router } from 'express';
import auth from '../middleware/auth.js';
import Ride from '../models/Ride.js';

const router = Router();

// Create a ride
router.post('/', auth, async (req, res) => {
  try {
    const { source, destination, date, time, seats, cost, vehicleModel, vehicleColor, preferences } = req.body;
    if (!source || !destination || !date || !time || !seats || cost === undefined)
      return res.status(400).json({ error: 'Missing required fields' });

    const ride = await Ride.create({
      driver: req.userId,
      source, destination, date, time,
      seats: Number(seats),
      cost: Number(cost),
      vehicleModel: vehicleModel || '',
      vehicleColor: vehicleColor || '',
      preferences: preferences || {},
    });

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search rides
router.get('/', async (req, res) => {
  try {
    const filter = { status: 'active' };
    if (req.query.source) filter.source = { $regex: req.query.source, $options: 'i' };
    if (req.query.destination) filter.destination = { $regex: req.query.destination, $options: 'i' };
    if (req.query.date) filter.date = req.query.date;

    const rides = await Ride.find(filter)
      .populate('driver', 'name driverRating totalRides vehicleModel vehicleColor')
      .sort({ date: 1, time: 1 });

    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ride details
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name email phone driverRating totalRides vehicleModel vehicleColor licensePlate')
      .populate('passengers', 'name');

    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Book a seat
router.post('/:id/book', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.driver.toString() === req.userId)
      return res.status(400).json({ error: 'Cannot book your own ride' });
    if (ride.passengers.includes(req.userId))
      return res.status(400).json({ error: 'Already booked' });
    if (ride.passengers.length >= ride.seats) {
      ride.status = 'full';
      await ride.save();
      return res.status(400).json({ error: 'No seats available' });
    }

    ride.passengers.push(req.userId);
    if (ride.passengers.length >= ride.seats) ride.status = 'full';
    await ride.save();

    const populated = await ride.populate('passengers', 'name');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
