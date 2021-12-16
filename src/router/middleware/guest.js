export default function guest({ next, store }) {
    if (store.getters['globals/accessToken']) {
        return next({
            path: '/table',
        });
    }

    return next();
}