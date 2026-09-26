const closed = () => Promise.reject({ data: { error: 'This form is not taking submissions yet. Check back soon.' } });
export const api = { get: () => Promise.reject({ status: 401 }), post: closed };
export const auth = { isSignedIn: () => false, signIn: () => Promise.reject({ code: 'unavailable' }), signOut: async () => {}, getUser: async () => null };
