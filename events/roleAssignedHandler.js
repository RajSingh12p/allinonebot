
const { EmbedBuilder } = require('discord.js');

module.exports = async (member, role) => {
  try {
    // You can add database check here to see if this role has a DM message
    
    const embed = new EmbedBuilder()
      .setColor('#3498db')
      .setTitle('New Role Received')
      .setDescription(`You have been given the ${role.name} role in ${member.guild.name}!`)
      .setTimestamp();

    await member.send({ embeds: [embed] }).catch(() => {
      // User might have DMs disabled
    });
  } catch (error) {
    console.error('Error in roleAssignedHandler:', error);
  }
};

