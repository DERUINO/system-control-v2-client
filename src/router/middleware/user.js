export default function user({ next, store }) {
    if (!store.getters['globals/accessToken']) {
        return next({
            path: 'login',
        });
    }
    
    return next();
}