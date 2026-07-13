const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const busRoutes = require('./bus.routes');
const routeRoutes = require('./route.routes');
const locationRoutes = require('./location.routes');

// Mount sub-routers
// Week 1
router.use('/auth', authRoutes);

// Week 2
router.use('/buses', busRoutes);
router.use('/routes', routeRoutes);

// Week 3
router.use('/location', locationRoutes);

// Week 4
// router.use('/chat', chatRoutes);

// Week 5
// router.use('/journeys', journeyRoutes);

// Week 6
// router.use('/feedback', feedbackRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/staff', staffRoutes);

module.exports = router;
