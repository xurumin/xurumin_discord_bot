"use strict";

const { default: axios } = require('axios');
const Discord = require('discord.js');
const Utils = require("./../../../utils/utils")
require('dotenv/config');

module.exports = {
    validate(client, message) {
        return true;
    },
    /**
     * @param  {Discord.Client} client
     * @param  {Discord.Message} message
     * @param  {} args
     */
    run: (client, message, args, LOCALE) => {
        return new Promise(async (resolve, reject) => {
            // const isPremium = await Utils.Profile.isPremium(client, message.author.id)
            // if (!isPremium) {
            //     const notPremiumEmbed = new Discord.MessageEmbed()
            //         .setColor('#9d65c9')
            //         .setTitle(LOCALE.errors.user_is_not_premium.title)
            //         .setDescription(LOCALE.errors.user_is_not_premium.description.interpolate({
            //             prefix: process.env.COMMAND_PREFIX
            //         }))
            //     return resolve(message.channel.send(notPremiumEmbed))
            // }
            if (!message.channel.nsfw) {
                var msg = {
                    title: LOCALE.errors.nsfw_channel.title,
                    description: LOCALE.errors.nsfw_channel.description
                }
                return resolve(message.channel.send(
                    Utils.createSimpleEmbed(msg.title, msg.description)
                ));
            }
            const tagged_user = message.mentions.users.entries().next()
            var user = message.author
            if (tagged_user.value) user = tagged_user.value[1];
            var user_pic = user.avatarURL({
                format: "jpg",
                size: 512
            })
            if (!user_pic) {
                loading_msg = await loading_msg
                var msg = {
                    title: LOCALE.errors.user_do_not_have_pic.title,
                    description: LOCALE.errors.user_do_not_have_pic.description
                }
                globalCooldown.shift()
                return resolve(loading_msg.edit(
                    Utils.createSimpleEmbed(msg.title, msg.description)
                ));
            }
            const embed = new Discord.MessageEmbed()
                .setColor('#9d65c9')
                .setTitle(LOCALE.messages.loading.title)
                .setDescription(LOCALE.messages.loading.description)

            var loading_msg = await message.channel.send(embed)

            Utils.KarinnaAPI.get("/v1/video/animescream", {
                img_url: user_pic
            }).then(async res=>{
                loading_msg.delete()
                return await resolve(message.channel.send(new Discord.MessageAttachment(res.data, 'video.mp4')))
            })
            .catch(async err=>{
                loading_msg.delete()
                console.log(err);
                return resolve(message.channel.send(new Discord.MessageEmbed()
                    .setTitle(LOCALE.errors.cmd_run_error.title)
                    .setDescription(LOCALE.errors.cmd_run_error.description)));
            })
        })

    },
    get command() {
        return {
            name: 'animescream',
            aliases: ["gemidoanime"]
        }
    },
};