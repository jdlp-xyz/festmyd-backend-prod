import { getToken } from './getAdminToken.js';
export const getFrontendToken = async () => {
    const email = process.env.DIRECTUS_EMAIL;
    const password = process.env.DIRECTUS_PASSWORD;
    return getToken(email, password);
};
