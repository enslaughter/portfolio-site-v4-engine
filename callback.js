/**
 * Stub for the optional y-websocket HTTP callback feature.
 * Set CALLBACK_URL in the environment to enable real callback handling.
 */

export const isCallbackSet = !!process.env.CALLBACK_URL

/**
 * @param {import('./util.js').WSSharedDoc} doc
 */
export const callbackHandler = (_doc) => {}
