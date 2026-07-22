import express from 'express';
import { generateCertificate, getMyCertificates, verifyCertificate, getAllCertificates } from '../controllers/certificateController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate/:courseId', protect, generateCertificate);
router.get('/my-certificates', protect, getMyCertificates);
router.get('/verify/:certId', verifyCertificate);
router.get('/all', protect, authorize('admin'), getAllCertificates);

export default router;
