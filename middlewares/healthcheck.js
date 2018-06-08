'use strict';

module.exports = async (ctx, next) => {
  if (ctx.path === '/healthcheck') {
    ctx.status = 200;
  } else {
    await next();
  }
}
