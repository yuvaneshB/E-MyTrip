import User from '../models/user.js';

export const bootstrapAdmin = async () => {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'agent@test.com';
    const adminName = process.env.DEFAULT_ADMIN_NAME || 'Sarah Agent';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'password123';

    // Normalize email
    const normalizedEmail = adminEmail.toLowerCase().trim();

    const existingAdmin = await User.findOne({ email: normalizedEmail });
    if (!existingAdmin) {
      console.log(`[BOOTSTRAP] Default admin (${normalizedEmail}) not found. Creating...`);
      await User.create({
        name: adminName,
        email: normalizedEmail,
        password: adminPassword,
        role: 'Agent',
        isEmailVerified: true,
        isActive: true
      });
      console.log('[BOOTSTRAP] Default admin created successfully.');
    } else {
      console.log('[BOOTSTRAP] Default admin already exists. Skipping creation.');
    }
  } catch (error) {
    console.error('[BOOTSTRAP] Error seeding default admin:', error.message);
  }
};
