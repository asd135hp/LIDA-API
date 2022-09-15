"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSignedCookie = exports.setNormalCookie = void 0;
function setNormalCookie(response, cookies, extendedPeriod, path) {
    for (let cookieName in cookies)
        response.cookie(cookieName, cookies[cookieName], {
            maxAge: Date.now() + (extendedPeriod || 0),
            signed: false,
            path
        }).set('Set-Cookie');
}
exports.setNormalCookie = setNormalCookie;
function setSignedCookie(response, cookies, extendedPeriod, path) {
    for (let cookieName in cookies)
        response.cookie(cookieName, cookies[cookieName], {
            maxAge: Date.now() + (extendedPeriod || 0),
            signed: true,
            path
        }).set('Set-Cookie');
}
exports.setSignedCookie = setSignedCookie;
//# sourceMappingURL=setCookie.js.map