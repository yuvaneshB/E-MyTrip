import User from '../models/user.js';

export const initializeAdmin = async () => {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const adminName = process.env.DEFAULT_ADMIN_NAME || 'Admin';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return;
    }

    // Normalize email
    const normalizedEmail = adminEmail.toLowerCase().trim();

    const existingAdmin = await User.findOne({ email: normalizedEmail });
    if (!existingAdmin) {
      console.log(`[ADMIN_INIT] Default admin (${normalizedEmail}) not found. Creating...`);
      await User.create({
        name: adminName,
        email: normalizedEmail,
        password: adminPassword,
        role: 'Agent',
        isEmailVerified: true,
        isActive: true
      });
      console.log('[ADMIN_INIT] Default admin created successfully.');
    } else {
      console.log('[ADMIN_INIT] Default admin already exists. Skipping creation.');
    }
  } catch (error) {
    console.error('[ADMIN_INIT] Error initializing default admin:', error.message);
  }
};
