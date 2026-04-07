const prisma = require("../utils/prisma");
const { hashPassword } = require("../utils/auth");
const crypto = require("crypto");

class OrganizationService {
  async getOrganizationDetails(orgId) {
    return await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        _count: {
          select: { members: true, products: true },
        },
      },
    });
  }

  async getMembers(orgId) {
    return await prisma.member.findMany({
      where: { organizationId: orgId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async addMember(orgId, { email, role, firstName, lastName }) {
    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });
    let tempPassword = null;

    if (!user) {
      // Create user with temporary password if they don't exist
      tempPassword = crypto.randomBytes(6).toString("hex");
      const hashedPassword = await hashPassword(tempPassword);
      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          passwordHash: hashedPassword,
          tempPasswordExpires: fiveMinutesFromNow,
        },
      });

      console.log(
        `[INVITATION] Sent email to ${email} with temporary password: ${tempPassword}`,
      );
    }

    // Check if already a member
    const existingMember = await prisma.member.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: orgId,
        },
      },
    });

    if (existingMember) {
      throw new Error("User is already a member of this organization");
    }

    const member = await prisma.member.create({
      data: {
        userId: user.id,
        organizationId: orgId,
        role: role || "STAFF",
      },
      include: { user: true },
    });

    return { ...member, tempPassword }; // Only for UI feedback if needed
  }

  async revokeMember(orgId, memberId) {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member || member.organizationId !== orgId) {
      throw new Error("Member not found in this organization");
    }

    // Don't allow revoking the last admin if needed, but for now just revoke
    return await prisma.member.delete({
      where: { id: memberId },
    });
  }
}

module.exports = new OrganizationService();
