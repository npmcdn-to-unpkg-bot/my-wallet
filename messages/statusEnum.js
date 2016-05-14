/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

module.export = {
    SUCCESS: 200, //OK - Response to a successful GET, PUT, PATCH or DELETE. Can also be used for a POST that doesn't result in a creation.
    CREATED: 201, //201 Created - Response to a POST that results in a creation. Should be combined with a Location header pointing to the location of the new resource
    NO_CONTENT: 204, // No Content - Response to a successful request that won't be returning a body (like a DELETE request)
    NOT_MODIFIED: 304, // Not Modified - Used when HTTP caching headers are in play
    BAD_REQUEST: 400, // Bad Request - The request is malformed, such as if the body does not parse
    UNAUTHORIZED: 401, // Unauthorized - When no or invalid authentication details are provided. Also useful to trigger an auth popup if the API is used from a browser
    FORBIDEN: 403, // Forbidden - When authentication succeeded but authenticated user doesn't have access to the resource
    NOT_FOUND: 404, // Not Found - When a non-existent resource is requested
    METHOD_NOT_ALLOWED: 405, // Method Not Allowed - When an HTTP method is being requested that isn't allowed for the authenticated user
    GONE: 410, // Gone - Indicates that the resource at this end point is no longer available. Useful as a blanket response for old API versions
    UNSUPPORTED_MEDIA_TYPE: 415, // Unsupported Media Type - If incorrect content type was provided as part of the request
    UNPROCESSABLE_ENTITY: 422, // Unprocessable Entity - Used for validation errors
    TOO_MANY_REQUESTS: 429, // Too Many Requests - When a request is rejected due to rate limiting
    ERROR: 500 // General server error
};