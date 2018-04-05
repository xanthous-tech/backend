const Promise = require('bluebird');
const debug = require('debug')('server-main:boot:create-admin');

module.exports = function createAdmin(app) {
  const { User, Role, RoleMapping } = app.models;

  User.findOrCreate({
    email: 'admin@x-tech.io',
  }, {
    username: 'admin',
    email: 'admin@x-tech.io',
    password: 'password',
  }).then((adminResult) => {
    const [admin, adminCreated] = adminResult;

    if (adminCreated) {
      debug('default admin created');
    }

    return Promise.all([
      admin,
      Role.findOrCreate({
        where: {
          name: 'admin',
        },
      }, {
        name: 'admin',
      }),
    ]);
  }).spread((admin, roleResult) => {
    const [role] = roleResult;

    return Promise.all([
      admin,
      role,
      role.principals.findOne({
        principalType: RoleMapping.USER,
        principalId: admin.id,
      }),
    ]);
  }).spread((admin, role, principal) => {
    if (!principal) {
      debug('linking new admin account to admin role');
      return role.principals.create({
        principalType: RoleMapping.USER,
        principalId: admin.id,
      });
    }

    return null;
  })
    .catch((err) => {
      debug(err);
    });
};
