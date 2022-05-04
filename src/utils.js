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
  if (!color) {
    color = failed === 0 ? 'good' : 'danger';
  }

  if (!status) {
    status = failed === 0 ? 'SUCCESS' : 'FAILED';
  }

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
// function buildSlackAttachments({ status, color, github, count, success, failed, firstFive }) {
//   const { payload, ref, workflow, eventName } = github.context;
//   const { owner, repo } = context.repo;
//   const event = eventName;
//   const branch = event === 'pull_request' ? payload.pull_request.head.ref : ref.replace('refs/heads/', '');

//   const sha = event === 'pull_request' ? payload.pull_request.head.sha : github.context.sha;

// if (!color) {
//   color = failed === 0 ? 'good' : 'danger';
// }

//   if (!status) {
//     status = failed === 0 ? 'SUCCESS' : 'FAILED';
//   }

//   const referenceLink =
//     event === 'pull_request'
//       ? {
//           title: 'Pull Request',
//           value: `<${payload.pull_request.html_url} | ${payload.pull_request.title}>`,
//           short: true,
//         }
//       : {
//           title: 'Branch',
//           value: `<https://github.com/${owner}/${repo}/commit/${sha} | ${branch}>`,
//           short: true,
//         };

//   let fields = [
//     {
//       title: 'Action',
//       value: `<https://github.com/${owner}/${repo}/commit/${sha}/checks | ${workflow}>`,
//       short: true,
//     },
//     {
//       title: 'Status',
//       value: status,
//       short: true,
//     },
//     referenceLink,
//     {
//       title: 'Event',
//       value: event,
//       short: true,
//     },
//   ];

//   if (count) {
//     fields.push({
//       title: 'Count',
//       value: count,
//       short: true,
//     });
//   }

//   if (success) {
//     fields.push({
//       title: 'Success',
//       value: success,
//       short: true,
//     });
//   }

//   if (failed) {
//     fields.push({
//       title: 'Failed',
//       value: failed,
//       short: true,
//     });
//   }

//   if (firstFive && firstFive.length > 0) {
//     fields.push({
//       title: 'First five failures',
//       value: firstFive.join('\n'),
//       short: true,
//     });
//   }

//   return [
//     {
//       color,
//       fields: fields,
//       footer_icon: 'https://github.githubassets.com/favicon.ico',
//       footer: `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,
//       ts: Math.floor(Date.now() / 1000),
//     },
//   ];
// }

module.exports.buildSlackAttachments = buildSlackAttachments;

function formatChannelName(channel) {
  return channel.replace(/[#@]/g, '');
}

module.exports.formatChannelName = formatChannelName;
