"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setSignedCookie(response, cookies, extendedPeriod, path) {
    for (let cookieName in cookies)
        response.cookie(cookieName, cookies[cookieName], {
            maxAge: Date.now() + (extendedPeriod || 0),
            signed: true,
            path
        }).set('Set-Cookie');
}
exports.default = setSignedCookie;
//# sourceMappingURL=setSignedCookie.js.map