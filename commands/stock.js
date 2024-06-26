const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stock')
		.setDescription('Display the service stock.'),

	async execute(interaction) {
		const freeStock = await getStock(`${__dirname}/../free/`);
		const premiumStock = await getStock(`${__dirname}/../premium/`);

		const embed = new MessageEmbed()
			.setColor(config.color.default)
			.setTitle(`${interaction.guild.name} Service Stock`)
			.setDescription(`👋 WHATS UP BITCHES **${interaction.guild.name}**! 🌟 WE ARE HERE TO PROVIDE YOU WITH THE BEST AGED ACCOUNTS. 🚀`)
			.setFooter(config.footer)
			.setImage(config.banner);

		if (freeStock.length > 0) {
			const freeStockInfo = await getServiceInfo(`${__dirname}/../free/`, freeStock);
			embed.addField('Free Services', freeStockInfo, true);
		}

		if (premiumStock.length > 0) {
			const premiumStockInfo = await getServiceInfo(`${__dirname}/../premium/`, premiumStock);
			embed.addField('Premium Services', premiumStockInfo, true);
		}

		embed.addField('USEFUL LINKS', `(${config.website}) [**Discord**](https://discord.gg/ghostaccounts)`);

		interaction.reply({ embeds: [embed] });
	},
};

async function getStock(directory) {
	try {
		const files = await fs.readdir(directory);

		const stock = files.filter(file => file.endsWith('.txt'));
		return stock;
	} catch (err) {
		console.error('Unable to scan directory: ' + err);
		return [];
	}
}

async function getServiceInfo(directory, stock) {
	const info = [];
	for (const service of stock) {
		const serviceContent = await fs.readFile(`${directory}/${service}`, 'utf-8');
		const lines = serviceContent.split(/\r?\n/);
		info.push(`**${service.replace('.txt', '')}:** \`${lines.length}\``);
	}
	return info.join('\n');
}
