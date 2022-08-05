import { Response } from "express";

interface Cookies { [name:string]:string }

/**
 * 
 * @param response Response from the server
 * @param cookies Basically a key-value dictionary, nothing more
 * @param extendedPeriod Extend the period of cookie from now,
 * meaning the formula is Date.now() + extendedPeriod
 * @param path Path of the cookie, default to "/" 
 */
 export function setNormalCookie(
  response: Response,
  cookies: Cookies,
  extendedPeriod?: number,
  path?: string)
{
  for(let cookieName in cookies)
    response.cookie(cookieName, cookies[cookieName], {
      maxAge: Date.now() + (extendedPeriod || 0),
      signed: false,
      path
    }).set('Set-Cookie')
}

/**
 * 
 * @param response Response from the server
 * @param cookies Basically a key-value dictionary, nothing more
 * @param extendedPeriod Extend the period of cookie from now,
 * meaning the formula is Date.now() + extendedPeriod
 * @param path Path of the cookie, default to "/" 
 */
export function setSignedCookie(
  response: Response,
  cookies: Cookies,
  extendedPeriod?: number,
  path?: string)
{
  for(let cookieName in cookies)
    response.cookie(cookieName, cookies[cookieName], {
      maxAge: Date.now() + (extendedPeriod || 0),
      signed: true,
      path
    }).set('Set-Cookie')
}