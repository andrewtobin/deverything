'use strict';

function User(options) {
  return $.extend(this, { id: cuid(), name: '', email: '', alias: '' }, options);
}

User.prototype.getGravatar = function() {
    return 'http://www.gravatar.com/avatar/' + md5((this.email || 'no email').trim()) + '?r=pg&d=mm&s=100';
};


