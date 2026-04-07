const prisma = require('../utils/prisma');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

class AuthService {
  async signup(data) {
    const { email, password, firstName, lastName, orgName } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create User, Organization and Membership in a transaction
    return await prisma.$transaction(async (tx) => {
      const hashedPassword = await hashPassword(password);
      
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          firstName,
          lastName,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: orgName,
          slug: orgName.toLowerCase().replace(/\s+/g, '-'),
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: 'ADMIN',
        },
      });

      const token = generateToken({
        userId: user.id,
        orgId: organization.id,
        role: member.role,
      });

      return { user, organization, token };
    });
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: { organization: true },
        },
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if temporary password has expired
    if (user.tempPasswordExpires && user.tempPasswordExpires < new Date()) {
      throw new Error('Temporary password has expired. Please contact your admin for a new invitation.');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // For simplicity, we take the first membership. 
    // In a real multi-tenant app, the user might choose which org to log into.
    const activeMembership = user.memberships[0];
    if (!activeMembership) {
      throw new Error('User is not part of any organization');
    }

    const token = generateToken({
      userId: user.id,
      orgId: activeMembership.organizationId,
      role: activeMembership.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      organization: activeMembership.organization,
      token,
    };
  }
}

module.exports = new AuthService();
