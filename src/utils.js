const { context } = require('@actions/github');

function getTeamLink(team) {
  return `<https://docs.google.com/spreadsheets/d/1Wt94wehjDO3F0Vr244epvPs3dx_hWN7WjjgC_xSr5jw/edit?usp=sharing|${team}>`;
}

function getAlertSymbol() {
  return ':premier_alert:';
}

function getExclamationSymbol() {
  return ':exclamation:';
}

function getCheckmarkSymbol() {
  return ':checked:';
}

function bold(text) {
  return `*${text}*`;
}

function italic(text) {
  return `_${text}_`;
}

function buildSlackAttachments({ status, color, github, count, success, failed, firstFive, platform }) {
  var msg = '';
  if (firstFive && firstFive.length > 0) {
    msg = [
      `${getAlertSymbol()} ${bold(`Diner ${platform} variants audit found issues`)} ${getAlertSymbol()}\n\n`,
      firstFive
        .map(variant => {
          const explanation = [
            '┌──────────────────────────────────────',
            `${getExclamationSymbol()} ${bold(variant.key)} owned by ${bold(`${getTeamLink(variant.team)}`)}`,
            `     "${italic(variant.name)}"\n`,
            `   •   ${variant.message}`,
            '└──────────────────────────────────────',
          ];
          return explanation.join('\n');
        })
        .join('\n'),
    ].join('\n');
  } else {
    msg = `${getCheckmarkSymbol()} ${bold(
      `Diner ${platform} variants audit is complete and no issues were found. There are ${count} variables total.`
    )}`;
  }

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: msg,
      },
    },
  ];
}

module.exports.buildSlackAttachments = buildSlackAttachments;

function formatChannelName(channel) {
  return channel.replace(/[#@]/g, '');
}

module.exports.formatChannelName = formatChannelName;
