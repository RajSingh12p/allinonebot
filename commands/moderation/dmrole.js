
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'dmrole',
  description: 'Send DM to all members with a specific role',
  execute: async (message, args) => {
    if (!message.content.startsWith('!')) return;
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply('You do not have permission to use this command.');
    }

    const usage = '!dmrole <@role> <message>';
    
    if (args.length < 2) {
      return message.reply(`Usage: ${usage}`);
    }

    const roleMatch = args[0].match(/<@&(\d+)>/);
    if (!roleMatch) {
      return message.reply('Please mention a valid role.');
    }

    const roleId = roleMatch[1];
    const role = message.guild.roles.cache.get(roleId);
    if (!role) {
      return message.reply('Could not find that role.');
    }

    const dmMessage = args.slice(1).join(' ');
    const members = role.members;

    const statusEmbed = new EmbedBuilder()
      .setColor('#3498db')
      .setTitle('DM Role Status')
      .setDescription(`Starting to send DMs to ${members.size} members with the ${role.name} role.`)
      .setTimestamp();

    const statusMsg = await message.reply({ embeds: [statusEmbed] });

    let successful = 0;
    let failed = 0;

    // Send DMs with a 1.5 second delay between each
    for (const [memberId, member] of members) {
      try {
        const embed = new EmbedBuilder()
          .setColor('#3498db')
          .setTitle(`Message from ${message.guild.name}`)
          .setDescription(dmMessage)
          .setTimestamp();

        await member.send({ embeds: [embed] });
        successful++;

        // Update status every 5 members
        if (successful % 5 === 0) {
          statusEmbed.setDescription(`Progress: ${successful + failed}/${members.size}\nSuccessful: ${successful}\nFailed: ${failed}`);
          await statusMsg.edit({ embeds: [statusEmbed] });
        }

        // Wait 1.5 seconds before sending next DM
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        failed++;
        console.error(`Failed to send DM to ${member.user.tag}:`, error);
      }
    }

    // Final status update
    statusEmbed
      .setDescription(`Completed!\nTotal members: ${members.size}\nSuccessful: ${successful}\nFailed: ${failed}`)
      .setColor(failed === 0 ? '#00ff00' : '#ff9900');
    
    await statusMsg.edit({ embeds: [statusEmbed] });
  },
};
