require('dotenv').config();

function getEnv(name, fallback) {
  const value = process.env[name] || fallback;
  if (value === undefined) {
    throw new Error(`ENV ${name} wajib diisi`);
  }
  return value;
}

module.exports = {
  port: Number(getEnv('PORT', 3000)),
  jwtSecret: getEnv('JWT_SECRET'),
  superAdminUsername: getEnv('SUPERADMIN_USERNAME', 'superadmin'),
  superAdminPassword: getEnv('SUPERADMIN_PASSWORD', 'superadmin123'),
  superAdminFullName: getEnv('SUPERADMIN_FULL_NAME', 'Super Admin')
};
