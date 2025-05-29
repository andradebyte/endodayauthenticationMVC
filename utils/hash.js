import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
    try {
        const saltRounds = 10; // You can adjust the number of salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error; // Propagate the error for further handling
    }
}

export async function isPasswordValid(password, hashedPasssword) {
    try {
        const isValid = await bcrypt.compare(password, hashedPasssword);
        return isValid;
    } catch (error) {
        console.error('Error validating password:', error);
        throw error; // Propagate the error for further handling
    }
}
