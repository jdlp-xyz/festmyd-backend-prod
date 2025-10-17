import { createDirectus, authentication } from '@directus/sdk';
export const getToken = async (email, password) => {
    const directus = createDirectus(process.env.DIRECTUS_URL)
        .with(authentication());
    const login = await directus.login(email, password);
    return login.access_token;
};
