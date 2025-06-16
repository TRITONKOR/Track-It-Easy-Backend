import { eq } from "drizzle-orm";
import { db } from "../index";
import { followedParcelsTable, usersTable } from "../schema";

export async function getUsersByFollowedParcel(parcelId: string) {
    const result = await db
        .select({
            id: usersTable.id,
            email: usersTable.email,
            username: usersTable.username,
        })
        .from(followedParcelsTable)
        .innerJoin(usersTable, eq(followedParcelsTable.userId, usersTable.id))
        .where(eq(followedParcelsTable.parcelId, parcelId));
    return result;
}
