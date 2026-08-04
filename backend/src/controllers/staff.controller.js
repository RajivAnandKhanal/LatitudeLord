const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Driver = require('../models/Driver.model');
const { getPagination, buildPaginatedResult } = require('../utils/pagination');

// ── Helper ───────────────────────────────────────────────────────────────────────
const assertOwnsStaff = async (staffId, driverId) => {
  const staff = await Driver.findOne({ _id: staffId, role: 'staff', linkedDriver: driverId });
  if (!staff) throw new ApiError(404, 'Staff member not found');
  return staff;
};

// ── POST /api/v1/staff ──────────────────────────────────────────────────────────
// Driver-only — registers a new conductor/staff record linked to this driver.
// Staff members have no login of their own — only drivers sign in — so we
// generate an internal, unusable email/password to satisfy the shared
// Driver schema instead of collecting login credentials from the form.
// Mirrors the "manage bus staff" sidebar screen from the system design.
const createStaff = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const email = `staff-${crypto.randomUUID()}@no-login.internal`;
  const password = crypto.randomBytes(24).toString('hex');

  const staff = await Driver.create({
    name,
    email,
    password,
    phone,
    role: 'staff',
    linkedDriver: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, staff.toPublicJSON(), 'Staff member added'));
});

// ── GET /api/v1/staff ────────────────────────────────────────────────────────────
// Driver-only — list own staff.
const getMyStaff = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const [staff, total] = await Promise.all([
    Driver.find({ role: 'staff', linkedDriver: req.user._id }).skip(skip).limit(limit),
    Driver.countDocuments({ role: 'staff', linkedDriver: req.user._id }),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, buildPaginatedResult(staff, total, { page, limit }), 'Staff fetched')
    );
});

// ── GET /api/v1/staff/:id ─────────────────────────────────────────────────────────
const getStaffById = asyncHandler(async (req, res) => {
  const staff = await assertOwnsStaff(req.params.id, req.user._id);

  return res.status(200).json(new ApiResponse(200, staff.toPublicJSON(), 'Staff fetched'));
});

// ── PATCH /api/v1/staff/:id ───────────────────────────────────────────────────────
// Driver updates staff info (name, phone, photo) if the conductor changes.
const updateStaff = asyncHandler(async (req, res) => {
  const staff = await assertOwnsStaff(req.params.id, req.user._id);

  Object.assign(staff, req.body);
  await staff.save();

  return res.status(200).json(new ApiResponse(200, staff.toPublicJSON(), 'Staff updated'));
});

// ── DELETE /api/v1/staff/:id ────────────────────────────────────────────────────────
// Driver removes a staff member (e.g. conductor left/was replaced).
const removeStaff = asyncHandler(async (req, res) => {
  const staff = await assertOwnsStaff(req.params.id, req.user._id);
  await staff.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Staff removed'));
});

module.exports = { createStaff, getMyStaff, getStaffById, updateStaff, removeStaff };
