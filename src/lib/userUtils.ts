export interface StoredUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    referralSource: string;
    receiveProductUpdates: boolean;
    emailVerified: boolean;
    userId?: string;
    id?: string;
    role?: string;
    roles?: string[];
    tenantId?: string;
}

export const getUserFromStorage = (): StoredUser | null => {
    try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) as StoredUser : null;
    } catch {
        return null;
    }
};

export const saveUserToStorage = (user: StoredUser): void => {
    try {
        localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
        // Silently fail
    }
};

export const clearUserFromStorage = (): void => {
    try {
        localStorage.removeItem("user");
    } catch (error) {
        // Silently fail
    }
};

export const getUserInitials = (user: StoredUser | null): string => {
    if (!user) return "U";
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase() || "U";
};

export const getUserFullName = (user: StoredUser | null): string => {
    if (!user) return "User";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
};
