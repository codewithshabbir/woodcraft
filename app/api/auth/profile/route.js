import bcrypt from "bcryptjs";

import { auth } from "@/lib/auth";
import { apiError, apiSuccess, parseJsonBody } from "@/lib/api/response";
import { withApiContext } from "@/lib/api/observability";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

async function getProfile() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return apiError("Unauthorized.", 401);
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return apiError("User not found.", 404);
    }

    return apiSuccess({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Profile could not be loaded.", 500);
  }
}

async function patchProfile(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return apiError("Unauthorized.", 401);
    }

    const body = await parseJsonBody(request);
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return apiError("User not found.", 404);
    }

    const nextName = String(body?.name || "").trim();
    const nextEmail = String(body?.email || "").trim().toLowerCase();
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");
    const confirmPassword = String(body?.confirmPassword || "");

    if (!nextName || !nextEmail) {
      return apiError("Name and email are required.", 400);
    }

    if (nextEmail !== user.email) {
      const emailTaken = await User.findOne({ email: nextEmail, _id: { $ne: user._id } }).lean();
      if (emailTaken) {
        return apiError("Another user already uses this email.", 409);
      }
    }

    user.name = nextName;
    user.email = nextEmail;

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        return apiError("Current password is required to change password.", 400);
      }

      const matches = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!matches) {
        return apiError("Current password is incorrect.", 400);
      }

      if (newPassword.length < 8) {
        return apiError("New password must be at least 8 characters.", 400);
      }

      if (newPassword !== confirmPassword) {
        return apiError("New password and confirm password do not match.", 400);
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return apiSuccess(
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Profile updated successfully.",
    );
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Profile could not be updated.", 500);
  }
}

export const GET = withApiContext(getProfile);
export const PATCH = withApiContext(patchProfile);
