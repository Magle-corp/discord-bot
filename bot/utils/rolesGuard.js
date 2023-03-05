export default (allowedRoles, interaction) => {
  return interaction.member.roles.cache.some((role) =>
    allowedRoles.split(", ").some((adminRole) => adminRole === role.name)
  );
};
